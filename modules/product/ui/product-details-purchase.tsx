'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { currencyFormatter } from '@/utils/currencyFormat'
import type { ProductDetailColorOption } from './product-detail-types'

interface ProductDetailsPurchaseProps {
  name: string
  categoryLabel: string
  rating: number
  reviewCount: number
  price: number
  originalPrice: number
  onSale: boolean
  inStock: boolean
  stockCount: number
  quantity: number
  onQuantityChange: (nextValue: number) => void
  colors: ProductDetailColorOption[]
  selectedColorId: string | null
  onSelectColor: (colorId: string) => void
}

const clampQuantity = (value: number, stockCount: number): number =>
  Math.min(Math.max(value, 1), Math.max(stockCount, 1))

export const ProductDetailsPurchase = ({
  name,
  categoryLabel,
  rating,
  reviewCount,
  price,
  originalPrice,
  onSale,
  inStock,
  stockCount,
  quantity,
  onQuantityChange,
  colors,
  selectedColorId,
  onSelectColor,
}: ProductDetailsPurchaseProps) => {
  const roundedRating = Math.min(5, Math.max(0, Math.round(rating)))
  const discountPercent =
    originalPrice > price
      ? Math.max(0, Math.round(((originalPrice - price) / originalPrice) * 100))
      : 0

  return (
    <section className="border-2 border-black bg-white p-5 shadow-[6px_6px_0_0_#000] lg:sticky lg:top-24">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="border-2 border-black bg-[#d7ecff] px-2 py-0.5 text-xs font-bold uppercase tracking-wide">
          {categoryLabel || 'Product'}
        </p>
        <div className="flex items-center gap-1 text-sm font-bold">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              size={14}
              className={cn(
                'stroke-[2.5]',
                index < roundedRating ? 'fill-yellow-300 text-black' : 'fill-transparent text-black'
              )}
            />
          ))}
          <span>({reviewCount})</span>
        </div>
      </div>

      <h1 className="text-2xl font-black leading-tight">{name}</h1>

      <div className="mt-4 flex flex-wrap items-baseline gap-2 border-y-2 border-black py-3">
        <p className="text-2xl font-black">{currencyFormatter.format(price)}</p>
        {originalPrice > price && (
          <>
            <p className="text-base font-semibold text-zinc-500 line-through">
              {currencyFormatter.format(originalPrice)}
            </p>
            <span className="border-2 border-black bg-[#ff5b5b] px-2 py-0.5 text-xs font-black uppercase">
              {discountPercent}% off
            </span>
          </>
        )}
      </div>

      {colors.length > 0 && (
        <div className="mt-5 space-y-2">
          <p className="text-sm font-black uppercase tracking-wide">Colors</p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color.id}
                type="button"
                onClick={() => onSelectColor(color.id)}
                className={cn(
                  'h-8 w-8 border-2 border-black transition hover:-translate-y-0.5',
                  selectedColorId === color.id && 'shadow-[3px_3px_0_0_#000]'
                )}
                style={{ backgroundColor: color.code }}
                aria-label={`Select ${color.name}`}
                aria-pressed={selectedColorId === color.id}
                title={color.name}
              />
            ))}
          </div>
          {selectedColorId && (
            <p className="text-xs font-semibold text-zinc-600">
              {colors.find((color) => color.id === selectedColorId)?.name}
            </p>
          )}
        </div>
      )}

      <div className="mt-5 flex items-center gap-3">
        <div className="inline-flex items-center overflow-hidden border-2 border-black">
          <button
            type="button"
            onClick={() => onQuantityChange(clampQuantity(quantity - 1, stockCount))}
            className="h-10 w-10 border-r-2 border-black bg-white text-lg font-black"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="inline-flex min-w-10 justify-center px-3 text-sm font-black">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => onQuantityChange(clampQuantity(quantity + 1, stockCount))}
            className="h-10 w-10 border-l-2 border-black bg-white text-lg font-black"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button
          type="button"
          disabled={!inStock}
          className={cn(
            'h-10 flex-1 border-2 border-black px-4 text-sm font-black uppercase tracking-wide transition',
            inStock
              ? 'bg-black text-white hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#000]'
              : 'cursor-not-allowed bg-zinc-300 text-zinc-600'
          )}
        >
          {inStock ? 'Add to bag' : 'Out of stock'}
        </button>
      </div>

      <div className="mt-4 text-xs font-semibold text-zinc-600">
        {inStock
          ? `${stockCount > 0 ? stockCount : 'Limited'} units available`
          : 'This item is currently unavailable'}
      </div>

      {onSale && (
        <p className="mt-2 text-xs font-bold uppercase text-[#d7263d]">Limited-time offer</p>
      )}
    </section>
  )
}
