import { stripe } from '@/lib/stripe'
import { getPayloadClient } from '@/collections/lib/payload'
import { buildCustomerOrderEmail, buildShopOwnerOrderEmail } from '@/modules/email/server/templates'
import Stripe from 'stripe'
import type { Order } from '@/payload-types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type CheckoutSession = Stripe.Checkout.Session
type WebhookError = Error & { statusCode?: number }

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

  await Promise.allSettled(
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

  // Idempotency: store the Stripe event id so retries don't re-send emails.
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
    // Duplicate key means we've already processed this event successfully.
    const message = error instanceof Error ? error.message : ''
    if (message.includes('duplicate') || message.includes('E11000')) {
      return new Response('Already processed', { status: 200 })
    }
    console.error('stripe webhook idempotency write failed', { message })
    // Proceed anyway; safer to finalize orders than to drop the event entirely.
  }

  const session = event.data.object as CheckoutSession
  if (!session?.id) {
    return new Response('Invalid session payload', { status: 400 })
  }

  const sessionId = session.id
  const paymentIntentId = getPaymentIntentId(session)

  const ordersResult = await payload.find({
    collection: 'orders',
    overrideAccess: true,
    depth: 2,
    limit: 50,
    where: { stripeSessionId: { equals: sessionId } },
  })
  const orders: Order[] = ordersResult.docs || []

  if (orders.length === 0) {
    console.warn('stripe webhook: no orders found for session', {
      sessionId,
      eventType: event.type,
    })
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
      return new Response('Session not paid', { status: 200 })
    }

    const ordersToUpdate = pendingOrFailedOrders.filter((order) => order.paymentStatus !== 'paid')
    if (ordersToUpdate.length > 0) {
      await markOrdersPaid(payload, ordersToUpdate, paymentIntentId)
    }

    // Only send emails if this webhook transitioned orders to `paid`.
    if (ordersToUpdate.length > 0) {
      const customerEmail = getCustomerEmail(session)
      const receiptUrl = await getReceiptUrl(paymentIntentId)
      const serverUrl = process.env.HOST_URL || undefined

      if (customerEmail) {
        const { subject, html, text } = buildCustomerOrderEmail({
          orders,
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
      for (const order of orders) {
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

    return new Response('Processed', { status: 200 })
  }

  if (event.type === 'checkout.session.async_payment_failed') {
    const cancellable = orders.filter((order) => order.paymentStatus !== 'paid')
    if (cancellable.length > 0) {
      await cancelOrders(payload, cancellable, 'Stripe async payment failed')
    }
    return new Response('Processed', { status: 200 })
  }

  if (event.type === 'checkout.session.expired') {
    const cancellable = orders.filter((order) => order.paymentStatus !== 'paid')
    if (cancellable.length > 0) {
      await cancelOrders(payload, cancellable, 'Stripe checkout session expired')
    }
    return new Response('Processed', { status: 200 })
  }

  return new Response('Processed', { status: 200 })
}
