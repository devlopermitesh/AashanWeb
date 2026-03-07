import { ProductCard, getProductKey } from '../components/ProductCard'
import type { ProductGridLayoutProps } from '../types'

function getGap(gap: string): number {
  const value = Number.parseInt(gap, 10)
  return Number.isFinite(value) ? value : 24
}

function getItemsPerView(value?: string): number {
  const parsed = Number.parseInt(value || '3', 10)
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 3
  }
  return parsed
}

export function CarouselLayout({ data, products }: ProductGridLayoutProps) {
  if (data.layout.type !== 'carousel') {
    return null
  }

  const itemsPerView = getItemsPerView(data.layout.carouselItems)
  const gap = getGap(data.layout.gap)

  return (
    <div className="overflow-x-auto pb-4 [scrollbar-width:thin]">
      <div
        className="flex snap-x snap-mandatory"
        style={{
          gap: `${gap}px`,
        }}
      >
        {products.map((product, index) => (
          <div
            key={getProductKey(product, index)}
            className="snap-start"
            style={{
              minWidth: `calc((100% - ${(itemsPerView - 1) * gap}px) / ${itemsPerView})`,
            }}
          >
            <ProductCard product={product} data={data} />
          </div>
        ))}
      </div>
    </div>
  )
}
