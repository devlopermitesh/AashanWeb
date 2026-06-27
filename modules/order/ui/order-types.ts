import type { AppRouter } from '@/server/routers/_app'
import type { inferRouterOutputs } from '@trpc/server'

type RouterOutput = inferRouterOutputs<AppRouter>

export type OrderListOutput = RouterOutput['order']['getOrders']
export type OrderListItem = OrderListOutput['docs'][number]

export type OrderDetailsOutput = RouterOutput['order']['getOne']
