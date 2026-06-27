'use client'

import Link from 'next/link'
import { useTRPC } from '@/components/providers/TrcpProvider'
import { useQuery } from '@tanstack/react-query'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ReceiptText } from 'lucide-react'
import { currencyFormatter } from '@/utils/currencyFormat'
import { OrderStatusPill, type OrderStatus } from '../component/order-status-pill'
import { OrderStepper } from '../component/order-stepper'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const getProductName = (value: unknown): string | null => {
  if (!isRecord(value)) return null
  return typeof value.name === 'string' && value.name ? value.name : null
}

const formatDeliveryLocation = (value: unknown): string => {
  if (typeof value === 'string') return value
  if (!isRecord(value)) return ''
  return typeof value.address === 'string' ? value.address : ''
}

const formatOrderDateTime = (value: unknown): string => {
  const date = value instanceof Date ? value : new Date(String(value ?? ''))
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export const OrderDetailsView = ({ orderId }: { orderId: string }) => {
  const trpc = useTRPC()

  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useQuery(trpc.order.getOne.queryOptions({ id: orderId }))

  if (isLoading) {
    return (
      <section className="w-full flex-1 bg-background">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8">
          <div className="rounded-base border-2 border-border bg-secondary-background p-6 shadow-shadow">
            Loading…
          </div>
        </div>
      </section>
    )
  }

  if (error || !order) {
    return (
      <section className="w-full flex-1 bg-background">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 flex flex-col gap-4">
          <div className="rounded-base border-2 border-border bg-secondary-background p-6 shadow-shadow">
            <p className="text-sm font-heading text-foreground">Couldn’t load this order.</p>
            <p className="mt-1 text-xs text-foreground/70">{error?.message ?? 'Order not found'}</p>
            <div className="mt-4 flex gap-3">
              <Button onClick={() => refetch()}>Retry</Button>
              <Button asChild variant="neutral">
                <Link href="/orders">Back to orders</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const status = (order.orderStatus ?? 'pending') as OrderStatus
  const totalINR = currencyFormatter.format(order.totalAmount ?? 0)
  const items = order.items ?? []
  const deliveryLocation = formatDeliveryLocation(order.deliveryLocation)

  return (
    <section className="w-full flex-1 bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 flex flex-col gap-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Button asChild variant="neutral" size="icon">
              <Link href="/orders" aria-label="Back to orders">
                <ArrowLeft />
              </Link>
            </Button>
            <div>
              <Badge className="mb-2">Order details</Badge>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                  #{order.orderNumber ?? order.id.slice(0, 8)}
                </h1>
                <OrderStatusPill status={status} />
              </div>
              <p className="text-sm text-foreground/70">
                Placed on {formatOrderDateTime(order.createdAt)}
              </p>
            </div>
          </div>

          <Button variant="neutral" className="w-full sm:w-auto" disabled>
            <ReceiptText className="h-4 w-4" />
            Invoice (soon)
          </Button>
        </header>

        <div className="rounded-base border-2 border-border bg-secondary-background p-5 shadow-shadow">
          <OrderStepper status={status} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="rounded-base border-2 border-border bg-secondary-background p-5 shadow-shadow">
              <h2 className="text-lg font-heading text-foreground">Delivery</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-base border-2 border-border bg-background p-4 shadow-shadow">
                  <p className="text-xs font-base text-foreground/70">Name</p>
                  <p className="text-sm font-heading text-foreground">
                    {order.customerName ?? '—'}
                  </p>
                </div>
                <div className="rounded-base border-2 border-border bg-background p-4 shadow-shadow">
                  <p className="text-xs font-base text-foreground/70">Phone</p>
                  <p className="text-sm font-heading text-foreground">
                    {order.customerPhone ?? '—'}
                  </p>
                </div>
                <div className="sm:col-span-2 rounded-base border-2 border-border bg-background p-4 shadow-shadow">
                  <p className="text-xs font-base text-foreground/70">Address</p>
                  <p className="text-sm font-heading text-foreground">{deliveryLocation || '—'}</p>
                </div>
                <div className="sm:col-span-2 rounded-base border-2 border-border bg-background p-4 shadow-shadow">
                  <p className="text-xs font-base text-foreground/70">Instructions</p>
                  <p className="text-sm font-heading text-foreground">
                    {order.instructions ?? '—'}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-base border-2 border-border bg-secondary-background p-5 shadow-shadow">
              <h2 className="text-lg font-heading text-foreground">Payment</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-base border-2 border-border bg-background p-4 shadow-shadow">
                  <p className="text-xs font-base text-foreground/70">Total</p>
                  <p className="text-sm font-heading text-foreground">{totalINR}</p>
                </div>
                <div className="rounded-base border-2 border-border bg-background p-4 shadow-shadow">
                  <p className="text-xs font-base text-foreground/70">Payment status</p>
                  <p className="text-sm font-heading text-foreground">
                    {order.paymentStatus ?? '—'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-base border-2 border-border bg-secondary-background p-5 shadow-shadow">
              <h2 className="text-lg font-heading text-foreground">Items</h2>
              <div className="mt-4 flex flex-col gap-3">
                {items.length === 0 ? (
                  <div className="rounded-base border-2 border-border bg-background p-4 shadow-shadow text-sm text-foreground/70">
                    No items found.
                  </div>
                ) : (
                  items.map((item) => {
                    const productName = getProductName(item.product) ?? 'Product'
                    const itemAmount = currencyFormatter.format((item.amount ?? 0) as number)
                    return (
                      <div
                        key={item.id ?? `${productName}-${item.variantId ?? 'default'}`}
                        className="rounded-base border-2 border-border bg-background p-4 shadow-shadow"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-heading text-foreground">
                              {productName}
                            </p>
                            <p className="text-xs text-foreground/70">
                              Qty: {item.quantity}{' '}
                              {item.variantId ? `• Variant: ${item.variantId}` : ''}
                            </p>
                          </div>
                          <p className="text-sm font-heading text-foreground">{itemAmount}</p>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
