import { GridPreset } from '@/blocks/productGrid/product-layout'
import { cn } from '@/lib/utils'
import { ProductCard, getProductKey } from '../components/ProductCard'
import type { ProductGridLayoutProps } from '../types'

const GRID_COLUMN_CLASSES: Record<GridPreset, string> = {
  [GridPreset.PRESET_1]: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  [GridPreset.PRESET_2]: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  [GridPreset.PRESET_3]: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  [GridPreset.AUTO]: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
}

function getGap(gap: string): number {
  const value = Number.parseInt(gap, 10)
  return Number.isFinite(value) ? value : 24
}

export function GridLayout({ data, products }: ProductGridLayoutProps) {
  if (data.layout.type !== 'grid') {
    return null
  }

  const gap = getGap(data.layout.gap)
  const gridColumns = GRID_COLUMN_CLASSES[data.layout.gridColumns]

  return (
    <div className={cn('grid', gridColumns)} style={{ gap: `${gap}px` }}>
      {products.map((product, index) => (
        <ProductCard key={getProductKey(product, index)} product={product} data={data} />
      ))}
    </div>
  )
}
