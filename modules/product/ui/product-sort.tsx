'use client'

import { Badge } from '@/components/ui/badge'
import { sorted } from '@/components/Share/constant'
import { cn } from '@/lib/utils'
import { useProductFilter } from '../hooks/use-product'

const ProductSort = () => {
  const [filters, setfilters] = useProductFilter()
  const activesort = filters.sort || 'trending'
  const onChange = (sortItem: string) => {
    setfilters((prev) => ({
      ...prev,
      sort: sortItem as 'trending' | 'latest' | 'price-desc' | 'price-asc',
    }))
  }
  return (
    <div className="flex flex-wrap gap-2">
      {sorted.map((sortItem) => {
        const isActive = activesort === sortItem

        return (
          <Badge
            key={sortItem}
            onClick={() => onChange?.(sortItem)}
            className={cn(
              'cursor-pointer capitalize px-4 py-1 rounded-full transition-colors text-sm md:text-md',
              isActive
                ? 'bg-violet-300 text-black hover:bg-violet-200'
                : 'bg-violet-100 text-black hover:bg-violet-200'
            )}
          >
            {sortItem}
          </Badge>
        )
      })}
    </div>
  )
}

export default ProductSort
