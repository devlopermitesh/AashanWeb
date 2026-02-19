'use client'

import { cn } from '@/lib/utils'
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'
import PriceFilter from './price-filter'
import { useProductFilter } from '../hooks/use-product'
import { useDebounce } from '../hooks/use-debounce'

export const ProductFilter = ({
  children,
  title,
  className,
}: {
  children: React.ReactNode
  className?: string
  title: string
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon
  return (
    <div className={cn('border-b flex flex-col gap-2 p-4', className)}>
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <p className="font-medium">{title}</p>
        <Icon size={8} className="w-8 h-8 hover:border-gray-500/20 hover:border" />
      </div>

      {isOpen && children}
    </div>
  )
}
const ProductSearchFilter = () => {
  const [maxPrice, setMaxPrice] = useState('')
  const [minPrice, setMinPrice] = useState('')

  const mindebouncedQuery = useDebounce(minPrice, 500)
  const maxdebouncedQuery = useDebounce(maxPrice, 500)
  const [filters, setFilters] = useProductFilter()
  //Reuseable function to handle filter changes
  const onChange = useCallback(
    (key: keyof typeof filters, value: unknown) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }))
    },
    [setFilters]
  )

  //Clear filters and reset local state
  const handleClear = () => {
    setMaxPrice('')
    setMinPrice('')

    setFilters({
      minPrice: null,
      maxPrice: null,
    })
  }
  //Sync debounced values with URL query states
  useEffect(() => {
    if (mindebouncedQuery !== filters.minPrice && mindebouncedQuery !== '') {
      onChange('minPrice', mindebouncedQuery)
    }

    if (maxdebouncedQuery !== filters.maxPrice && maxdebouncedQuery !== '') {
      onChange('maxPrice', maxdebouncedQuery)
    }
  }, [mindebouncedQuery, maxdebouncedQuery, filters.minPrice, filters.maxPrice, onChange])

  return (
    <div className="border rounded-md bg-white ">
      <div className="p-4 border-b flex items-center justify-between">
        <p className="font-medium">Filters</p>
        {(filters.minPrice || filters.maxPrice) && (
          <button className="cursor-pointer" onClick={handleClear}>
            clear
          </button>
        )}
      </div>
      <ProductFilter title="Price">
        <PriceFilter
          maxPrice={filters.maxPrice}
          minPrice={filters.minPrice}
          onMaxPriceChange={(value) => onChange('maxPrice', value)}
          onMinPriceChange={(value) => onChange('minPrice', value)}
        />
      </ProductFilter>
    </div>
  )
}
export default ProductSearchFilter
