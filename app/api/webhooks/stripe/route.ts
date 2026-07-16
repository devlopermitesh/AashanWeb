import { stripe } from '@/lib/stripe'
import { getPayloadClient } from '@/collections/lib/payload'
import { buildCustomerOrderEmail, buildShopOwnerOrderEmail } from '@/modules/email/server/templates'
import Stripe from 'stripe'
import type { Order } from '@/payload-types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type CheckoutSession = Stripe.Checkout.Session
type WebhookError = Error & { statusCode?: number }
type PayloadClient = Awaited<ReturnType<typeof getPayloadClient>>

const WEBHOOK_EVENTS = new Set<string>([
  'checkout.session.async_payment_failed',
  'checkout.session.async_payment_succeeded',
  'checkout.session.completed',
  'checkout.session.expired',
])

const getStripeEvent = async (req: Request): Promise<Stripe.Event> => {
  const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET
  if (!STRIPE_WEBHOOK_SECRET) {
    throw new Error('Missing STRIPE_WEBHOOK_SECRET')
  }

  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    const error = new Error('Missing stripe-signature header') as Error & {
      statusCode?: number
    }
    error.statusCode = 400
    throw error
  }

  // Important: `constructEvent` must receive the raw request body
  const rawBody = await req.text()

  return stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET)
}

const getPaymentIntentId = (session: CheckoutSession): string | undefined => {
  const paymentIntent = session.payment_intent
  if (!paymentIntent) return undefined
  return typeof paymentIntent === 'string' ? paymentIntent : paymentIntent.id
}

const getCustomerEmail = (session: CheckoutSession): string | undefined => {
  return (
    session.customer_details?.email ||
    session.customer_email ||
    (typeof session.metadata?.customerEmail === 'string'
      ? session.metadata.customerEmail
      : undefined) ||
    undefined
  )
}

const hasStatusCode = (error: unknown): error is WebhookError => {
  return error instanceof Error && 'statusCode' in error && typeof error.statusCode === 'number'
}

const getStripeObjectId = (event: Stripe.Event): string | undefined => {
  const stripeObject = event.data.object as { id?: unknown }
  return typeof stripeObject.id === 'string' ? stripeObject.id : undefined
}

const isDuplicateKeyError = (error: unknown): boolean => {
  const message = error instanceof Error ? error.message : ''
  return message.includes('duplicate') || message.includes('E11000')
}

const hasProcessedStripeEvent = async (
  payload: PayloadClient,
  eventId: string
): Promise<boolean> => {
  const result = await payload.find({
    collection: 'stripeWebhookEvents',
    overrideAccess: true,
    limit: 1,
    where: { eventId: { equals: eventId } },
  })

  return result.docs.length > 0
}

const markStripeEventProcessed = async (payload: PayloadClient, event: Stripe.Event) => {
  try {
    await payload.create({
      collection: 'stripeWebhookEvents',
      overrideAccess: true,
      data: {
        eventId: event.id,
        type: event.type,
        stripeObjectId: getStripeObjectId(event),
        livemode: Boolean(event.livemode),
        processedAt: new Date().toISOString(),
      },
    })
  } catch (error: unknown) {
    if (isDuplicateKeyError(error)) return
    throw error
  }
}

const findOrdersByStripeSession = async (
  payload: PayloadClient,
  sessionId: string
): Promise<Order[]> => {
  const orders: Order[] = []
  let page = 1
  let totalPages = 1

  do {
    const result = await payload.find({
      collection: 'orders',
      overrideAccess: true,
      depth: 2,
      limit: 100,
      page,
      where: { stripeSessionId: { equals: sessionId } },
    })

    orders.push(...(result.docs || []))
    totalPages = result.totalPages || 1
    page += 1
  } while (page <= totalPages)

  return orders
}

const getReceiptUrl = async (paymentIntentId?: string): Promise<string | undefined> => {
  if (!paymentIntentId) return undefined

  try {
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ['latest_charge'],
    })
    const latestCharge = intent.latest_charge
    if (!latestCharge) return undefined
    if (typeof latestCharge === 'string') return undefined
    return typeof latestCharge.receipt_url === 'string' ? latestCharge.receipt_url : undefined
  } catch {
    return undefined
  }
}

const resolveShopOwnerEmails = async (
  payload: Awaited<ReturnType<typeof getPayloadClient>>,
  shopId: string
) => {
  const owners = await payload.find({
    collection: 'users',
    limit: 50,
    overrideAccess: true,
    where: {
      and: [{ roles: { contains: 'org:shop_owner' } }, { 'shops.shop': { equals: shopId } }],
    },
  })

  return [...new Set(owners.docs.map((u) => u.email).filter(Boolean))]
}

const cancelOrders = async (
  payload: Awaited<ReturnType<typeof getPayloadClient>>,
  orders: Order[],
  reason: string
) => {
  const now = new Date().toISOString()

  await Promise.allSettled(
    orders.map((order) =>
      payload.update({
        collection: 'orders',
        id: order.id,
        overrideAccess: true,
        data: {
          paymentStatus: 'failed',
          orderStatus: 'cancelled',
          fulfillmentStatus: 'cancelled',
          cancellation: {
            reason,
            required: false,
            cancelledAt: now,
          },
        },
      })
    )
  )
}

const markOrdersPaid = async (
  payload: Awaited<ReturnType<typeof getPayloadClient>>,
  orders: Order[],
  paymentIntentId?: string
) => {
  const now = new Date().toISOString()

  await Promise.all(
    orders.map((order) =>
      payload.update({
        collection: 'orders',
        id: order.id,
        overrideAccess: true,
        data: {
          paymentStatus: 'paid',
          paidAt: now,
          ...(paymentIntentId ? { stripePaymentIntentId: paymentIntentId } : {}),
        },
      })
    )
  )
}

export async function POST(req: Request) {
  let event: Stripe.Event

  try {
    event = await getStripeEvent(req)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Webhook verification failed'
    const status = hasStatusCode(error) ? error.statusCode : 400
    console.error('stripe webhook verification failed', { message })
    return new Response(message, { status })
  }

  if (!WEBHOOK_EVENTS.has(event.type)) {
    return new Response('Ignored event type', { status: 200 })
  }

  const payload = await getPayloadClient()
  if (await hasProcessedStripeEvent(payload, event.id)) {
    return new Response('Already processed', { status: 200 })
  }

  const session = event.data.object as CheckoutSession
  if (!session?.id) {
    return new Response('Invalid session payload', { status: 400 })
  }

  const sessionId = session.id
  const paymentIntentId = getPaymentIntentId(session)

  const orders = await findOrdersByStripeSession(payload, sessionId)

  if (orders.length === 0) {
    console.warn('stripe webhook: no orders found for session', {
      sessionId,
      eventType: event.type,
    })
    await markStripeEventProcessed(payload, event)
    return new Response('No orders found', { status: 200 })
  }

  const pendingOrFailedOrders = orders.filter((order) => order.paymentStatus !== 'paid')

  if (
    event.type === 'checkout.session.completed' ||
    event.type === 'checkout.session.async_payment_succeeded'
  ) {
    const isPaid =
      session.payment_status === 'paid' || event.type === 'checkout.session.async_payment_succeeded'
    if (!isPaid) {
      await markStripeEventProcessed(payload, event)
      return new Response('Session not paid', { status: 200 })
    }

    const ordersToUpdate = pendingOrFailedOrders.filter((order) => order.paymentStatus !== 'paid')
    if (ordersToUpdate.length > 0) {
      try {
        await markOrdersPaid(payload, ordersToUpdate, paymentIntentId)
      } catch (error: unknown) {
        console.error('stripe webhook: failed to mark orders paid', {
          sessionId,
          orderIds: ordersToUpdate.map((order) => order.id),
          error,
        })

        return new Response('Failed to update orders', { status: 500 })
      }
    }

    // Only send emails if this webhook transitioned orders to `paid`.
    if (ordersToUpdate.length > 0) {
      const customerEmail = getCustomerEmail(session)
      const receiptUrl = await getReceiptUrl(paymentIntentId)
      const serverUrl = process.env.HOST_URL || undefined

      if (customerEmail) {
        const { subject, html, text } = buildCustomerOrderEmail({
          orders: ordersToUpdate,
          customerEmail,
          receiptUrl,
          serverUrl,
        })
        await payload.email.sendEmail({
          from: `"${payload.email.defaultFromName}" <${payload.email.defaultFromAddress}>`,
          to: customerEmail,
          subject,
          html,
          text,
        })
      } else {
        console.warn('stripe webhook: missing customer email', { sessionId })
      }

      // Notify each shop owner about their order only.
      const ordersByShop = new Map<string, Order[]>()
      for (const order of ordersToUpdate) {
        const tenant = order?.tenant
        const shopId = typeof tenant === 'string' ? tenant : tenant?.id
        if (!shopId) continue
        const bucket = ordersByShop.get(shopId) || []
        bucket.push(order)
        ordersByShop.set(shopId, bucket)
      }

      await Promise.allSettled(
        [...ordersByShop.entries()].map(async ([shopId, shopOrders]) => {
          const recipients = await resolveShopOwnerEmails(payload, shopId)
          if (recipients.length === 0) return

          // One email per order for clarity (and easier operational follow-up)
          await Promise.allSettled(
            shopOrders.map(async (order) => {
              const { subject, html, text } = buildShopOwnerOrderEmail({ order })
              await payload.email.sendEmail({
                from: `"${payload.email.defaultFromName}" <${payload.email.defaultFromAddress}>`,
                to: recipients,
                subject,
                html,
                text,
              })
            })
          )
        })
      )
    }

    await markStripeEventProcessed(payload, event)
    return new Response('Processed', { status: 200 })
  }

  if (event.type === 'checkout.session.async_payment_failed') {
    const cancellable = orders.filter((order) => order.paymentStatus !== 'paid')
    if (cancellable.length > 0) {
      await cancelOrders(payload, cancellable, 'Stripe async payment failed')
    }
    await markStripeEventProcessed(payload, event)
    return new Response('Processed', { status: 200 })
  }

  if (event.type === 'checkout.session.expired') {
    const cancellable = orders.filter((order) => order.paymentStatus !== 'paid')
    if (cancellable.length > 0) {
      await cancelOrders(payload, cancellable, 'Stripe checkout session expired')
    }
    await markStripeEventProcessed(payload, event)
    return new Response('Processed', { status: 200 })
  }

  await markStripeEventProcessed(payload, event)
  return new Response('Processed', { status: 200 })
}
