import { Category } from '@/payload-types'
import { createrouter, publicProcedure } from '@/server/trpc'
import { Where } from 'payload'
import z from 'zod'
export const ProductRouter = createrouter({
  getMany: publicProcedure
    .input(
      z.object({
        category: z.string().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {}

      const min = input.minPrice ? Number(input.minPrice) : undefined
      const max = input.maxPrice ? Number(input.maxPrice) : undefined

      if (min !== undefined || max !== undefined) {
        where.price = {}

        if (min !== undefined) {
          where.price.greater_than_equal = min
        }

        if (max !== undefined) {
          where.price.less_than_equal = max
        }
      }

      if (input.category) {
        const categoryRes = await ctx.db.find({
          collection: 'categories',
          limit: 1,
          depth: 1,
          where: {
            slug: {
              equals: input.category,
            },
          },
        })

        const category = categoryRes.docs[0]

        if (category) {
          if (category.parent) {
            // ✅ SUBCATEGORY
            where.category = {
              equals: category.id,
            }
          } else {
            // ✅ PARENT CATEGORY
            const subcategoryIds =
              (category.subcategories?.docs as Category[] | [])?.map((c) => c.id) ?? []

            where.category = {
              in: [category.id, ...subcategoryIds],
            }
          }
        }
      }
      return ctx.db.find({
        collection: 'products',
        depth: 1,
        where,
      })
    }),
})
