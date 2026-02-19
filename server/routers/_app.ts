import { categoryRouter } from '@/modules/category/server/procedure/route'
import { createrouter } from '../trpc'
import { ProductRouter } from '@/modules/product/server/procedure/route'

export const appRouter = createrouter({
  category: categoryRouter,
  product: ProductRouter,
})

export type AppRouter = typeof appRouter
