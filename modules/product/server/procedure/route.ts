import { DEFAULT_QUERY_PRODUCT_LIMIT, sorted, SortType } from '@/components/Share/constant'
import { Category, Media } from '@/payload-types'
import { createrouter, publicProcedure } from '@/server/trpc'
import { Where } from 'payload'
import z from 'zod'

export const SORT_MAP = {
  trending: '-popularity',
  latest: '-createdAt',
  'price-desc': '-price',
  'price-asc': 'price',
} satisfies Record<SortType, string>

export const ProductRouter = createrouter({
  getMany: publicProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        limit: z.number().default(DEFAULT_QUERY_PRODUCT_LIMIT),
        sort: z.enum(sorted).optional().default('trending'),
        category: z.string().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
        tags: z.array(z.string()).optional(),
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

      //Tags apply filter
      if (input.tags && input.tags.length > 0) {
        where['tags.name'] = {
          in: [...input.tags],
        }
      }

      let sort = 'latest'
      //apply sort
      if (input.sort) {
        sort = SORT_MAP[input.sort ?? 'latest']
      }
      const data = await ctx.db.find({
        collection: 'products',
        depth: 2,
        where,
        sort,
        page: input.cursor ?? 1, // 👈 add page
        limit: input.limit, // 👈 add limit
      })

      return {
        docs: data.docs.map((doc) => ({
          ...doc,
          medias: (doc.medias as Media[]) || [],
          category: doc.category as Category,
        })),
        hasNextPage: data.hasNextPage,
        totalDocs: data.totalDocs,
        nextCursor: data.nextPage ?? null, // 👈 this is the key part
      }
    }),
})
