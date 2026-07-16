'use client'

import { useMemo, useState } from 'react'
import { useTRPC } from '@/components/providers/TrcpProvider'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, SlidersHorizontal } from 'lucide-react'
import { OrderCard } from '../component/order-card'
import { OrderListSkeleton } from '../component/order-list-skeleton'
import type { OrderFilter } from '@/modules/order/constants'
import { orderFilters } from '@/modules/order/constants'
import { useDebounce } from '@/modules/order/hooks/use-debounce'

const FILTER_LABELS: Record<OrderFilter, string> = {
  recent: 'Recent',
  accepted: 'Accepted',
  cancelled: 'Cancelled',
  all: 'All',
}

export const OrderView = () => {
  const trpc = useTRPC()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<OrderFilter>('recent')
  const debouncedQuery = useDebounce(query, 300)

  const input = useMemo(
    () => ({
      filter,
      query: debouncedQuery.trim() || undefined,
    }),
    [debouncedQuery, filter]
  )

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage, error, refetch } =
    useInfiniteQuery(
      trpc.order.getOrders.infiniteQueryOptions(input, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      })
    )

  const orders = data?.pages.flatMap((page) => page.docs) ?? []

  return (
    <section className="w-full flex-1 bg-background">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-8 flex flex-col gap-6">
        <header className="flex items-end justify-between gap-4">
          <div>
            <Badge className="mb-2">Orders</Badge>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Your Orders
            </h1>
            <p className="text-sm text-foreground/70">Search, filter, and track your purchases.</p>
          </div>
        </header>

        <div className="rounded-base border-2 border-border bg-secondary-background p-4 shadow-shadow">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/60" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by order # or product…"
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/60 sm:hidden" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as OrderFilter)}
                  className="h-10 rounded-base border-2 border-border bg-secondary-background pl-10 sm:pl-3 pr-10 text-sm font-base text-foreground shadow-shadow outline-none appearance-none hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition"
                >
                  {orderFilters.map((value) => (
                    <option key={value} value={value}>
                      {FILTER_LABELS[value]}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60">
                  ▾
                </span>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <OrderListSkeleton />
        ) : error ? (
          <div className="rounded-base border-2 border-border bg-secondary-background p-6 shadow-shadow">
            <p className="text-sm font-heading text-foreground">Couldn’t load orders.</p>
            <p className="mt-1 text-xs text-foreground/70">{error.message}</p>
            <Button onClick={() => refetch()} className="mt-4">
              Retry
            </Button>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-base border-2 border-border bg-secondary-background p-10 text-center shadow-shadow">
            <p className="text-base font-heading text-foreground">No orders found</p>
            <p className="mt-1 text-sm text-foreground/70">
              Try changing filters or clearing the search.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}

            {hasNextPage && (
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="mx-auto"
              >
                {isFetchingNextPage ? 'Loading…' : 'Load more'}
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
