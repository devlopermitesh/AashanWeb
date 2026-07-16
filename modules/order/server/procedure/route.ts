import { DEFAULT_QUERY_ORDER_LIMIT, orderFilters } from '@/modules/order/constants'
import { createrouter, protectedProcedure } from '@/server/trpc'
import { TRPCError } from '@trpc/server'
import type { Where } from 'payload'
import z from 'zod'

export const OrderRouter = createrouter({
  getOrders: protectedProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        limit: z.number().default(DEFAULT_QUERY_ORDER_LIMIT),
        filter: z.enum(orderFilters).default('recent'),
        query: z.string().trim().min(1).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.user?.id || !ctx.user?.clerkUserId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      const where: Where = {
        and: [
          {
            customer: {
              equals: ctx.user.id,
            },
            paymentStatus: {
              equals: 'paid',
            },
          },
        ],
      }

      const and = where.and as Where[]

      if (input.filter === 'accepted') {
        and.push({ orderStatus: { equals: 'accepted' } })
      } else if (input.filter === 'cancelled') {
        and.push({ orderStatus: { equals: 'cancelled' } })
      } else if (input.filter === 'recent') {
        and.push({ orderStatus: { not_equals: 'cancelled' } })
      }

      if (input.query) {
        const q = input.query
        const qAsNumber = Number(q)
        const or: Where[] = [
          { id: { equals: q } },
          { customerName: { like: q } },
          { customerPhone: { like: q } },
          { deliveryLocation: { like: q } },
        ]

        if (Number.isFinite(qAsNumber) && qAsNumber > 0) {
          or.unshift({ orderNumber: { equals: qAsNumber } })
        }

        and.push({ or })
      }

      try {
        const data = await ctx.db.find({
          collection: 'orders',
          depth: 2,
          where,
          sort: '-createdAt',
          page: input.cursor ?? 1,
          limit: input.limit,
        })
        return {
          docs: data.docs,
          hasNextPage: data.hasNextPage,
          totalDocs: data.totalDocs,
          nextCursor: data.nextPage ?? null,
        }
      } catch (cause) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch orders',
          cause,
        })
      }
    }),
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string().trim().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.user?.id || !ctx.user?.clerkUserId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      try {
        const data = await ctx.db.find({
          collection: 'orders',
          depth: 3,
          limit: 1,
          where: {
            id: {
              equals: input.id,
            },
          },
        })

        const doc = data.docs[0]
        if (!doc) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Order not found' })
        }

        const customer = doc.customer
        const customerId = typeof customer === 'string' ? customer : customer?.id

        if (!customerId || customerId !== ctx.user.id) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have access to this order',
          })
        }

        return doc
      } catch (cause) {
        if (cause instanceof TRPCError) throw cause
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch order',
          cause,
        })
      }
    }),
})
