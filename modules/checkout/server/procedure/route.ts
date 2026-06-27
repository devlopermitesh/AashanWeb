import { stripe } from '@/lib/stripe'
import {
  CHECKOUT_FREE_SHIPPING_THRESHOLD,
  CHECKOUT_SHIPPING_PRICE,
  checkoutInputSchema,
} from '@/modules/checkout/lib/checkout'
import type { Product, Shop } from '@/payload-types'
import { createrouter, protectedProcedure } from '@/server/trpc'
import { TRPCError } from '@trpc/server'
import type Stripe from 'stripe'

const DEFAULT_CURRENCY = 'inr'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value == 'object' && value !== null && !Array.isArray(value)
const clampMetadataValue = (value: string, maxLength = 500) => value.slice(0, maxLength)

const sanitizeMetadataValue = (value: string | number | null | undefined, fallback = '') =>
  clampMetadataValue(String(value ?? fallback))

const sanitizeStripeText = (value: unknown, maxLength: number) => {
  if (typeof value !== 'string') {
    return undefined
  }

  const nextValue = value.trim()
  if (!nextValue) {
    return undefined
  }

  return nextValue.slice(0, maxLength)
}

const formatErrorForLogs = (error: unknown) => {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause:
        error.cause instanceof Error
          ? {
              name: error.cause.name,
              message: error.cause.message,
              stack: error.cause.stack,
            }
          : error.cause,
    }
  }

  return { error }
}

const getShopIdFromProduct = (product: Product) => {
  const tenant = product.tenant

  if (!tenant) {
    return null
  }

  return typeof tenant === 'string' ? tenant : tenant.id
}

const getMediaUrl = (product: Product) => {
  const firstMedia = product.medias?.[0]

  if (!firstMedia || typeof firstMedia === 'string') {
    return undefined
  }

  const cloudinary = isRecord(firstMedia.cloudinary) ? firstMedia.cloudinary : null
  if (cloudinary && typeof cloudinary.secure_url === 'string' && cloudinary.secure_url.length > 0) {
    return cloudinary.secure_url
  }

  return undefined
}

const getBaseUrl = (headers: Headers) => {
  const origin = headers.get('origin')
  if (origin) {
    return origin
  }

  const host = headers.get('x-forwarded-host') || headers.get('host')
  const protocol = headers.get('x-forwarded-proto') || 'http'
  console.log('Host url:', `${protocol}://${host}`)
  if (host) {
    return `${protocol}://${host}`
  }

  return process.env.HOST_URL || 'http://localhost:3000'
}

const distributeShippingAcrossOrders = (subtotals: number[], shippingFee: number) => {
  if (shippingFee <= 0 || subtotals.length === 0) {
    return subtotals.map(() => 0)
  }

  const subtotalSum = subtotals.reduce((sum, value) => sum + value, 0)
  if (subtotalSum <= 0) {
    return subtotals.map((_value, index) => (index === 0 ? shippingFee : 0))
  }

  let allocated = 0
  // on one or last product case apply shippingfee
  return subtotals.map((subtotal, index) => {
    if (index === subtotals.length - 1) {
      return shippingFee - allocated
    }
    // Maximum Subtotal will get measure portion for shippingfee

    const share = Math.floor((shippingFee * subtotal) / subtotalSum)
    allocated += share
    return share
  })
}

export const CheckoutRouter = createrouter({
  checkout: protectedProcedure.input(checkoutInputSchema).mutation(async ({ ctx, input }) => {
    const productIds = [
      ...new Set(input.orders.flatMap((order) => order.items.map((item) => item.productId))),
    ]
    const shopIds = [...new Set(input.orders.map((order) => order.shopId))]

    const [productsResult, shopsResult] = await Promise.all([
      ctx.db.find({
        collection: 'products',
        depth: 2,
        pagination: false,
        where: {
          id: {
            in: productIds,
          },
        },
      }),
      ctx.db.find({
        collection: 'shops',
        depth: 0,
        pagination: false,
        where: {
          id: {
            in: shopIds,
          },
        },
      }),
    ])

    if (productsResult.docs.length !== productIds.length) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Some products in your cart are no longer available.',
      })
    }

    if (shopsResult.docs.length !== shopIds.length) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'One or more shops from your cart could not be found.',
      })
    }

    const shopsById = new Map<string, Shop>(shopsResult.docs.map((shop) => [shop.id, shop as Shop]))
    const productsById = new Map<string, Product>(
      productsResult.docs.map((product) => [product.id, product as Product])
    )

    for (const shopId of shopIds) {
      const shop = shopsById.get(shopId)
      if (!shop?.isActive) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'One of the shops in your cart is not accepting checkout right now.',
        })
      }
    }

    const requestedQuantityByProductId = new Map<string, number>()

    for (const order of input.orders) {
      for (const item of order.items) {
        requestedQuantityByProductId.set(
          item.productId,
          (requestedQuantityByProductId.get(item.productId) || 0) + item.quantity
        )
      }
    }

    for (const [productId, requestedQuantity] of requestedQuantityByProductId.entries()) {
      const product = productsById.get(productId)

      if (!product) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'A product in your cart could not be loaded.',
        })
      }

      if (!product.inStock || (product.availableStockCount ?? 0) < requestedQuantity) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `${product.name} does not have enough stock for the requested quantity.`,
        })
      }
    }

    const orderPayloads = input.orders.map((order) => {
      const shop = shopsById.get(order.shopId)
      if (!shop) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Shop data is missing for checkout.',
        })
      }

      const items = order.items.map((item) => {
        const product = productsById.get(item.productId)

        if (!product) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'A product in your cart could not be loaded.',
          })
        }

        if (getShopIdFromProduct(product) !== order.shopId) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `${product.name} is no longer attached to the selected shop.`,
          })
        }

        const hasValidVariant =
          !item.variantId ||
          product.mediaVariants?.some((variant) => variant.id === item.variantId) ||
          false

        if (!hasValidVariant) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `${product.name} has an invalid variant selection.`,
          })
        }

        return {
          item,
          product,
          unitPrice: product.price,
          lineTotal: product.price * item.quantity,
        }
      })

      return {
        shop,
        items,
        subtotal: items.reduce((sum, entry) => sum + entry.lineTotal, 0),
      }
    })

    const subtotal = orderPayloads.reduce((sum, order) => sum + order.subtotal, 0)
    const shippingFee =
      subtotal > 0 && subtotal < CHECKOUT_FREE_SHIPPING_THRESHOLD ? CHECKOUT_SHIPPING_PRICE : 0
    const shippingAllocations = distributeShippingAcrossOrders(
      orderPayloads.map((order) => order.subtotal),
      shippingFee
    )
    const deliveryLocationAddress = input.userInfo.deliverySameAsCustomer
      ? input.userInfo.customerAddress
      : input.userInfo.deliveryAddress
    const createdOrders: Array<{ id: string }> = []
    const baseUrl = getBaseUrl(ctx.headers)
    let stage:
      | 'create_orders'
      | 'build_line_items'
      | 'create_stripe_session'
      | 'persist_stripe_session'
      | 'cleanup_orders' = 'create_orders'

    try {
      for (const [index, payload] of orderPayloads.entries()) {
        const createdOrder = await ctx.db.create({
          collection: 'orders',
          data: {
            tenant: payload.shop.id,
            customer: ctx.user.id,
            customerName: `${input.userInfo.firstName} ${input.userInfo.lastName}`.trim(),
            customerPhone: input.userInfo.mobileNumber,
            billingAddress: input.userInfo.customerAddress,
            deliveryLocation: {
              address: deliveryLocationAddress,
              coordinates: [
                { value: input.userInfo.longitude },
                { value: input.userInfo.latitude },
              ],
            },
            instructions: input.userInfo.instructions,
            items: payload.items.map(({ item, product, lineTotal }) => ({
              product: product.id,
              quantity: item.quantity,
              variantId: item.variantId,
              amount: lineTotal,
            })),
            totalAmount: payload.subtotal + shippingAllocations[index],
            paymentStatus: 'pending',
            orderStatus: 'pending',
            fulfillmentStatus: 'pending',
            payoutStatus: 'pending',
          },
        })

        createdOrders.push({ id: createdOrder.id })
      }

      stage = 'build_line_items'
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = orderPayloads.flatMap(
        (payload, orderIndex) =>
          payload.items.map(({ item, product, unitPrice }) => {
            const imageUrl = getMediaUrl(product)

            return {
              quantity: item.quantity,
              price_data: {
                currency: DEFAULT_CURRENCY,
                unit_amount: Math.round(unitPrice * 100),
                product_data: {
                  name: sanitizeStripeText(product.name, 120) ?? 'Item',
                  description: sanitizeStripeText(product.description, 5000),
                  images: imageUrl ? [imageUrl] : undefined,
                  metadata: {
                    orderId: sanitizeMetadataValue(createdOrders[orderIndex]?.id),
                    productId: sanitizeMetadataValue(product.id),
                    shopId: sanitizeMetadataValue(payload.shop.id),
                    variantId: sanitizeMetadataValue(item.variantId, 'default'),
                    quantity: sanitizeMetadataValue(item.quantity),
                  },
                },
              },
            }
          })
      )

      if (shippingFee > 0) {
        lineItems.push({
          quantity: 1,
          price_data: {
            currency: DEFAULT_CURRENCY,
            unit_amount: Math.round(shippingFee * 100),
            product_data: {
              name: 'Shipping',
              metadata: {
                type: 'shipping',
              },
            },
          },
        })
      }

      stage = 'create_stripe_session'
      const successUrl = `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`
      const cancelUrl = `${baseUrl}/checkout?checkout=cancelled`

      console.log('successUrl:', successUrl)
      console.log('cancelUrl:', cancelUrl)
      console.log(JSON.stringify(lineItems, null, 2))
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        customer_email: ctx.user.email || undefined,
        client_reference_id: ctx.user.id,
        metadata: {
          customerId: sanitizeMetadataValue(ctx.user.id),
          orderIds: sanitizeMetadataValue(createdOrders.map((order) => order.id).join(',')),
          shopIds: sanitizeMetadataValue(shopIds.join(',')),
          itemCount: sanitizeMetadataValue(
            input.orders.reduce(
              (sum, order) => sum + order.items.reduce((count, item) => count + item.quantity, 0),
              0
            )
          ),
          customerPhone: sanitizeMetadataValue(input.userInfo.mobileNumber),
        },
        line_items: lineItems,
      })

      if (!session.url) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Stripe did not return a checkout URL.',
        })
      }

      stage = 'persist_stripe_session'
      await Promise.all(
        createdOrders.map((order) =>
          ctx.db.update({
            collection: 'orders',
            id: order.id,
            data: {
              stripeSessionId: session.id,
            },
          })
        )
      )

      return {
        checkoutUrl: session.url,
        sessionId: session.id,
        orderIds: createdOrders.map((order) => order.id),
        totalAmount: subtotal + shippingFee,
      }
    } catch (error) {
      console.log(baseUrl)
      console.error('STRIPE CHECKOUT ERROR:', { stage, ...formatErrorForLogs(error) })
      stage = 'cleanup_orders'
      await Promise.allSettled(
        createdOrders.map((order) =>
          ctx.db.delete({
            collection: 'orders',
            id: order.id,
          })
        )
      )

      if (error instanceof TRPCError) {
        throw error
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Unable to prepare Stripe checkout right now.',
      })
    }
  }),
})
