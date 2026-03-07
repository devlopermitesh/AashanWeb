import type { AppRouter } from '@/server/routers/_app'
import type { inferRouterOutputs } from '@trpc/server'

type RouterOutput = inferRouterOutputs<AppRouter>
type ProductGetOneOutput = RouterOutput['product']['getOne']

export type ProductDetailsData = NonNullable<ProductGetOneOutput>

export interface ProductDetailImage {
  id: string
  src: string
  alt: string
}

export interface ProductDetailColorOption {
  id: string
  name: string
  code: string
  imageId?: string
}
