import { DEFAULT_QUERY_TAGS_LIMIT } from '@/components/Share/constant'
import { createrouter, publicProcedure } from '@/server/trpc'
import z from 'zod'

export const tagRouter = createrouter({
  getMany: publicProcedure
    .input(
      z.object({
        cursor: z.number().optional(), // page number
        limit: z.number().default(DEFAULT_QUERY_TAGS_LIMIT),
      })
    )
    .query(async ({ ctx, input }) => {
      const page = input.cursor ?? 1
      console.log('input', input)

      const res = await ctx.db.find({
        collection: 'tags',
        page,
        limit: input.limit,
      })

      return {
        items: res.docs,
        nextCursor: res.hasNextPage ? page + 1 : null,
      }
    }),
})
