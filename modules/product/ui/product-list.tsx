'use client'

import { useTRPC } from '@/components/providers/TrcpProvider'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useProductFilter } from '../hooks/use-product'
import { Loader2 } from 'lucide-react'
import ProductCard, { NoproductFound, ProductSkeleton } from './product-card.'
import { DEFAULT_QUERY_PRODUCT_LIMIT } from '@/components/Share/constant'

export const ProductList = ({ category }: { category?: string }) => {
  const trpc = useTRPC()
  const [filters] = useProductFilter()

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery(
    trpc.product.getMany.infiniteQueryOptions(
      { category, ...filters },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    )
  )
  if (isLoading) return <ProductListSkeleton />

  return (
    <div className="flex flex-col gap-8">
      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {data?.pages.flatMap((page) =>
          page.docs.length > 0 ? (
            page.docs.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                imageUrl={product.medias?.[0]?.url ?? '/placeholder.jpg'}
                authorUsername="Mitesh"
                authroImageUrl="/man.png"
                style={{
                  backgroundColor:
                    `color-mix(in srgb, ${product.category.color} 70%, white)` || '#e0e0e0',
                }}
                price={product.price}
                className={`bg-[#${product.category.color}]`}
                reviewCount={4}
                reviewrating={2}
                trending
              />
            ))
          ) : (
            <NoproductFound className="col-span-2 sm:col-span-3 lg:col-span-4 xl:col-span-5 min-h-50 " />
          )
        )}
      </div>

      {/* Load More */}
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mx-auto flex items-center gap-2 rounded-full border px-6 py-2 text-sm font-medium hover:bg-muted transition disabled:opacity-50"
        >
          {isFetchingNextPage ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            'Load more'
          )}
        </button>
      )}
    </div>
  )
}

export const ProductListSkeleton = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: DEFAULT_QUERY_PRODUCT_LIMIT }).map((_product, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  )
}
