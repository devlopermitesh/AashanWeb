import { ProductCard, getProductKey } from '../components/ProductCard'
import type { ProductGridLayoutProps } from '../types'

function getGap(gap: string): number {
  const value = Number.parseInt(gap, 10)
  return Number.isFinite(value) ? value : 24
}

export function MasonryLayout({ data, products }: ProductGridLayoutProps) {
  if (data.layout.type !== 'masonry') {
    return null
  }

  const gap = getGap(data.layout.gap)

  return (
    <div className="columns-1 md:columns-2 xl:columns-3" style={{ columnGap: `${gap}px` }}>
      {products.map((product, index) => (
        <div key={getProductKey(product, index)} className="mb-6 break-inside-avoid">
          <ProductCard product={product} data={data} />
        </div>
      ))}
    </div>
  )
}
