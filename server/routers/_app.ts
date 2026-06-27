import { categoryRouter } from '@/modules/category/server/procedure/route'
import { createrouter } from '../trpc'
import { ProductRouter } from '@/modules/product/server/procedure/route'
import { tagRouter } from '@/modules/tags/server/procedure/route'
import { ShopRouter } from '@/modules/shop/server/procedure/route'
import { templateRouter } from '@/modules/template/server/Template/procedure/route'
import { ShopTemplateRouter } from '@/modules/template/server/ShopTemplate/procedure/route'
import { CheckoutRouter } from '@/modules/checkout/server/procedure/route'
import { OrderRouter } from '@/modules/order/server/procedure/route'

export const appRouter = createrouter({
  category: categoryRouter,
  checkout: CheckoutRouter,
  product: ProductRouter,
  tag: tagRouter,
  shop: ShopRouter,
  shopTemplate: ShopTemplateRouter,
  template: templateRouter,
  order: OrderRouter,
})

export type AppRouter = typeof appRouter
