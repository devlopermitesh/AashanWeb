import { createrouter, publicProcedure } from '@/server/trpc'
import { TRPCError } from '@trpc/server'
import z from 'zod'

export const ShopTemplateRouter = createrouter({
  getShop: publicProcedure
    .input(
      z.object({
        shopId: z.string().min(1, 'ShopId is not valid!'),
      })
    )
    .query(async ({ ctx, input }) => {
      const shopTemplate = await ctx.db.find({
        collection: 'shop-templates',
        where: {
          shop: {
            equals: input.shopId,
          },
        },
        limit: 1,
        depth: 4,
      })

      if (!shopTemplate.docs.length) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Shop template not found for this shop.',
        })
      }
      return shopTemplate.docs[0]
    }),
})
