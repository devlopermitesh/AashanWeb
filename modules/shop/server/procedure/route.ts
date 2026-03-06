import { createrouter, publicProcedure } from '@/server/trpc'
import { TRPCError } from '@trpc/server'
import z from 'zod'
export const ShopRouter = createrouter({
  getShop: publicProcedure
    .input(z.string().min(1, 'Slug required hai !'))
    .query(async ({ ctx, input }) => {
      //check if slug shop exit or active
      const ActiveShop = await ctx.db.find({
        collection: 'shops',
        where: {
          slug: {
            equals: input,
          },
        },
        limit: 1,
        depth: 2,
      })
      if (!ActiveShop.docs.length) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Shop might be inActive or Never Created,',
        })
      }
      return ActiveShop.docs[0]
    }),
})
