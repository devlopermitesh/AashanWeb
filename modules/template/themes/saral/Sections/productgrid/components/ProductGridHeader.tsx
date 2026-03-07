import { SortBy } from '@/blocks/productGrid/product-layout'
import type { ProductGridSettings } from '../types'
import type { ProductGridSortBy } from '../types'

interface ProductGridHeaderProps {
  data: ProductGridSettings
  sortBy: ProductGridSortBy
  onSortChange: (next: ProductGridSortBy) => void
}

const SORT_OPTIONS: Array<{ label: string; value: ProductGridSortBy }> = [
  { label: 'Manual Order', value: SortBy.MANUAL },
  { label: 'Newest', value: SortBy.NEWEST },
  { label: 'Best Sellers', value: SortBy.BESTSELLER },
  { label: 'Price: Low to High', value: SortBy.PRICE_LOW },
  { label: 'Price: High to Low', value: SortBy.PRICE_HIGH },
  { label: 'Top Rated', value: SortBy.RATING },
]

export function ProductGridHeader({ data, sortBy, onSortChange }: ProductGridHeaderProps) {
  const { content } = data

  const showHeader = content.showTitle || (content.showDescription && Boolean(content.description))
  if (!showHeader && !data.data.sortAllowCustomer) {
    return null
  }

  return (
    <header className="mb-10 flex flex-col gap-6 border-4 border-black bg-[#ffe66b] p-6 shadow-[6px_6px_0_0_#000]">
      <div>
        {content.showTitle && (
          <h2 className="text-3xl font-black uppercase tracking-tight md:text-4xl">
            {content.title}
          </h2>
        )}
        {content.showDescription && content.description && (
          <p className="mt-3 max-w-3xl text-base font-medium text-zinc-800 md:text-lg">
            {content.description}
          </p>
        )}
      </div>

      {data.data.sortAllowCustomer && (
        <div className="flex flex-col gap-2 md:max-w-xs">
          <label htmlFor="product-grid-sort" className="text-sm font-black uppercase tracking-wide">
            Sort products
          </label>
          <select
            id="product-grid-sort"
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value as ProductGridSortBy)}
            className="h-11 border-4 border-black bg-white px-3 text-sm font-semibold outline-none transition hover:-translate-y-0.5 focus:-translate-y-0.5 focus:shadow-[4px_4px_0_0_#000]"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </header>
  )
}
