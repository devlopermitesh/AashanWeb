'use client'

import { useEffect, useMemo, useState } from 'react'
import { SortBy } from '@/blocks/productGrid/product-layout'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ProductGridProduct } from './types'
import type { ProductGridBlockProps } from './types'
import type { ProductGridSettings } from './types'
import type { ProductGridSortBy } from './types'
import { ProductGridHeader } from './components/ProductGridHeader'
import { GridLayout } from './layouts/GridLayout'
import { CarouselLayout } from './layouts/CarouselLayout'
import { MasonryLayout } from './layouts/MasonryLayout'

function getNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function getDateTimestamp(value: ProductGridProduct['createdAt']): number {
  if (!value) {
    return 0
  }
  const time = new Date(value).getTime()
  return Number.isFinite(time) ? time : 0
}

function sortProducts(products: ProductGridProduct[], sortBy: ProductGridSortBy) {
  const sorted = [...products]

  switch (sortBy) {
    case SortBy.NEWEST:
      return sorted.sort((a, b) => getDateTimestamp(b.createdAt) - getDateTimestamp(a.createdAt))
    case SortBy.BESTSELLER:
      return sorted.sort((a, b) => getNumber(b.sales, 0) - getNumber(a.sales, 0))
    case SortBy.PRICE_LOW:
      return sorted.sort((a, b) => getNumber(a.price, 0) - getNumber(b.price, 0))
    case SortBy.PRICE_HIGH:
      return sorted.sort((a, b) => getNumber(b.price, 0) - getNumber(a.price, 0))
    case SortBy.RATING:
      return sorted.sort((a, b) => getNumber(b.rating, 0) - getNumber(a.rating, 0))
    case SortBy.MANUAL:
    default:
      return sorted
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

function isProductGridProduct(value: unknown): value is ProductGridProduct {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.id === 'string' ||
    typeof value.id === 'number' ||
    typeof value._id === 'string' ||
    typeof value.slug === 'string' ||
    typeof value.name === 'string' ||
    typeof value.title === 'string'
  )
}

function ProductLayoutSwitch({
  data,
  products,
}: {
  data: ProductGridSettings
  products: ProductGridProduct[]
}) {
  switch (data.layout.type) {
    case 'carousel':
      return <CarouselLayout data={data} products={products} />
    case 'masonry':
      return <MasonryLayout data={data} products={products} />
    case 'grid':
    default:
      return <GridLayout data={data} products={products} />
  }
}

export function ProductGridBlock(props: ProductGridBlockProps) {
  const { isPreview = false, disabled = false, blockId, ...data } = props
  const incomingProducts: ProductGridProduct[] = Array.isArray(props.products)
    ? props.products.filter(isProductGridProduct)
    : []

  const [sortBy, setSortBy] = useState<ProductGridSortBy>(data.data.sortBy || SortBy.MANUAL)
  const [currentPage, setCurrentPage] = useState(1)

  const products = useMemo<ProductGridProduct[]>(() => {
    if (incomingProducts.length > 0) {
      return incomingProducts
    }

    if (!Array.isArray(data.content.products)) {
      return []
    }

    return data.content.products.filter(isProductGridProduct)
  }, [incomingProducts, data.content.products])

  const itemsPerPage = Math.max(1, getNumber(data.pagination.itemsPerPage, 12))

  const sortedProducts = useMemo(() => {
    let nextProducts = products

    if (data.content.featured) {
      nextProducts = products.filter((product) => Boolean(product.featured))
    }

    return sortProducts(nextProducts, sortBy)
  }, [data.content.featured, products, sortBy])

  const limitedProducts = useMemo(
    () => sortedProducts.slice(0, Math.max(1, getNumber(data.content.limit, 12))),
    [sortedProducts, data.content.limit]
  )

  const totalPages = useMemo(() => {
    if (data.pagination.type !== 'pagination' && data.pagination.type !== 'load-more') {
      return 1
    }
    return Math.max(1, Math.ceil(limitedProducts.length / itemsPerPage))
  }, [data.pagination.type, itemsPerPage, limitedProducts.length])

  const visibleProducts = useMemo(() => {
    if (data.pagination.type === 'pagination') {
      const start = (currentPage - 1) * itemsPerPage
      return limitedProducts.slice(start, start + itemsPerPage)
    }

    if (data.pagination.type === 'load-more') {
      return limitedProducts.slice(0, currentPage * itemsPerPage)
    }

    return limitedProducts
  }, [currentPage, data.pagination.type, itemsPerPage, limitedProducts])

  useEffect(() => {
    setSortBy(data.data.sortBy)
  }, [data.data.sortBy])

  useEffect(() => {
    setCurrentPage(1)
  }, [sortBy, data.pagination.type, itemsPerPage, data.content.limit])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  if (disabled) {
    return null
  }

  return (
    <section
      className={cn(
        'w-full border-4 border-black bg-[#f7f4ea] px-5 py-10 shadow-[10px_10px_0_0_#000] md:px-8 md:py-12',
        isPreview && 'ring-4 ring-sky-500'
      )}
      data-block-id={blockId}
      data-tracking-id={data.analytics?.trackingId}
    >
      <div className="mx-auto w-full max-w-7xl">
        <ProductGridHeader
          data={data}
          sortBy={sortBy}
          onSortChange={(nextSort) => {
            setSortBy(nextSort)
            setCurrentPage(1)
          }}
        />

        {visibleProducts.length > 0 ? (
          <ProductLayoutSwitch data={data} products={visibleProducts} />
        ) : (
          <div className="border-4 border-dashed border-black bg-white p-8 text-center shadow-[4px_4px_0_0_#000]">
            <p className="text-lg font-black uppercase tracking-wide">No products found</p>
            <p className="mt-2 text-sm font-medium text-zinc-700">
              Try changing filters or add products to this section.
            </p>
          </div>
        )}

        {data.pagination.type === 'pagination' && totalPages > 1 && (
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1
              return (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setCurrentPage(pageNumber)}
                  className={cn(
                    'min-w-10 border-2 border-black px-3 py-2 text-sm font-black transition hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#000]',
                    currentPage === pageNumber ? 'bg-black text-white' : 'bg-white text-black'
                  )}
                >
                  {pageNumber}
                </button>
              )
            })}
          </div>
        )}

        {data.pagination.type === 'load-more' && currentPage < totalPages && (
          <div className="mt-10 flex justify-center">
            <Button
              type="button"
              onClick={() => setCurrentPage((page) => page + 1)}
              className="border-2 border-black bg-black px-7 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#000]"
            >
              {data.pagination.loadMoreText || 'Load More'}
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductGridBlock
