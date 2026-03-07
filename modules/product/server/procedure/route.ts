import { DEFAULT_QUERY_PRODUCT_LIMIT, sorted, SortType } from '@/components/Share/constant'
import { Category, Media, Shop, Shopcategory, Tag } from '@/payload-types'
import { createrouter, publicProcedure } from '@/server/trpc'
import { Where } from 'payload'
import z from 'zod'

export const SORT_MAP = {
  trending: '-popularity',
  latest: '-createdAt',
  'price-desc': '-price',
  'price-asc': 'price',
} satisfies Record<SortType, string>

const toProductResponse = <T extends object>(doc: T) => {
  const source = doc as T & {
    medias?: Media[] | null
    category?: unknown
    tenant?: unknown
    tags?: Tag[] | null
  }

  return {
    ...doc,
    medias: (source.medias ?? []) as Media[],
    category: source.category as Shopcategory & { parent?: Category },
    tenant: source.tenant as Shop & { name: string; logo: Media | null },
    tags: (source.tags ?? []) as Tag[],
  }
}

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
        const shopCategoryIds = new Set<string>()

        // 1) Exact shop category slug (e.g. /explore/.../tshirts)
        const exactShopCategory = await ctx.db.find({
          collection: 'shopcategories',
          limit: 1,
          depth: 0,
          where: {
            slug: {
              equals: input.category,
            },
          },
        })

        const directShopCategory = exactShopCategory.docs[0]
        if (directShopCategory) {
          shopCategoryIds.add(directShopCategory.id)
        }

        // 2) Category/subcategory slug (e.g. /explore/clothes or /explore/clothes/men)
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

        const category = categoryRes.docs[0] as Category | undefined

        if (category) {
          const categoryIds = [category.id]
          const subcategoryIds =
            (category.subcategories?.docs as Category[] | [])?.map((sub) => sub.id) ?? []
          categoryIds.push(...subcategoryIds)

          const relatedShopCategories = await ctx.db.find({
            collection: 'shopcategories',
            pagination: false,
            depth: 0,
            where: {
              parent: {
                in: categoryIds,
              },
            },
          })

          for (const shopCat of relatedShopCategories.docs) {
            shopCategoryIds.add(shopCat.id)
          }
        }

        if (shopCategoryIds.size > 0) {
          const ids = [...shopCategoryIds]
          where.category = ids.length === 1 ? { equals: ids[0] } : { in: ids }
        } else {
          // Unknown category slug: return empty product list instead of unfiltered results.
          where.id = {
            equals: '__no_matching_products__',
          }
        }
      }

      //Tags apply filter
      if (input.tags && input.tags.length > 0) {
        where['tags.name'] = {
          in: [...input.tags],
        }
      }

      let sort = SORT_MAP['latest']
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
        docs: data.docs.map((doc) => toProductResponse(doc)),
        hasNextPage: data.hasNextPage,
        totalDocs: data.totalDocs,
        nextCursor: data.nextPage ?? null, // 👈 this is the key part
      }
    }),
  getOne: publicProcedure
    .input(
      z.object({
        slug: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const slug = input.slug.trim()
      if (!slug) {
        return null
      }

      const findProduct = async (where: Where) =>
        ctx.db.find({
          collection: 'products',
          depth: 2,
          limit: 1,
          where,
        })

      const bySlug = await findProduct({
        slug: {
          equals: slug,
        },
      })

      const slugDoc = bySlug.docs[0]
      if (slugDoc) {
        return toProductResponse(slugDoc)
      }

      const byId = await findProduct({
        id: {
          equals: slug,
        },
      })

      const idDoc = byId.docs[0]
      if (!idDoc) {
        return null
      }

      return toProductResponse(idDoc)
    }),
})
