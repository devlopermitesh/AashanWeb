import type { Product } from '@/payload-types'
import type { ProductGridBlock as ProductGridLayoutBlock } from '@/blocks/productGrid/product-layout'

export interface ProductCategory {
  name?: string | null
}

export interface ProductGridProduct extends Omit<Partial<Product>, 'id' | 'category'> {
  _id?: string | null
  id?: string | number | null
  title?: string | null
  image?: string | null
  category?: Product['category'] | ProductCategory | null
}

export type ProductGridContentProduct = ProductGridProduct | string | null

type ProductGridContentSettings = Omit<ProductGridLayoutBlock['content'], 'products'> & {
  products?: ProductGridContentProduct[] | null
}

export type ProductGridSettings = Omit<
  ProductGridLayoutBlock,
  '_id' | 'shopId' | 'templateId' | 'disabled' | 'createdAt' | 'updatedAt' | 'content'
> & {
  content: ProductGridContentSettings
}
export type ProductGridSortBy = ProductGridSettings['data']['sortBy']

export interface ProductGridBlockProps extends ProductGridSettings {
  products?: ProductGridProduct[] | null
  isPreview?: boolean
  disabled?: boolean | null
  blockId?: string | null
}

export interface ProductGridLayoutProps {
  data: ProductGridSettings
  products: ProductGridProduct[]
}
