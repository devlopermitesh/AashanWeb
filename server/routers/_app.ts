import { categoryRouter } from '@/modules/category/server/procedure/route'
import { createrouter } from '../trpc'
import { ProductRouter } from '@/modules/product/server/procedure/route'
import { tagRouter } from '@/modules/tags/server/procedure/route'
import { ShopRouter } from '@/modules/shop/server/procedure/route'
import { templateRouter } from '@/modules/template-theme/server/Template/procedure/route'
import { ShopTemplateRouter } from '@/modules/template-theme/server/ShopTemplate/procedure/route'

export const appRouter = createrouter({
  category: categoryRouter,
  product: ProductRouter,
  tag: tagRouter,
  shop: ShopRouter,
  shopTemplate: ShopTemplateRouter,
  template: templateRouter,
})

export type AppRouter = typeof appRouter
