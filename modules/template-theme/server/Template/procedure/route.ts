import { createrouter, publicProcedure } from '@/server/trpc'
import { TRPCError } from '@trpc/server'
import z from 'zod'

export const templateRouter = createrouter({
  getTemplate: publicProcedure
    .input(
      z.object({
        shopId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      //get template with slug
      const Templateinfo = await ctx.db.find({
        collection: 'templates',
        where: {
          slug: {
            equals: input.shopId,
          },
        },
        limit: 1,
      })
      if (!Templateinfo) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Unable to found Template',
        })
      }

      return Templateinfo.docs[0]
    }),
})
