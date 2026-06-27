import Link from 'next/link'
import { cn } from '@/lib/utils'
import { currencyFormatter } from '@/utils/currencyFormat'
import { Button } from '@/components/ui/button'
import { ArrowRight, ChevronRight, Package, RotateCcw } from 'lucide-react'
import type { OrderListItem } from '../order-types'
import { OrderStatusPill, type OrderStatus } from './order-status-pill'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

type OrderProduct = Record<string, unknown>

const getFirstItemProduct = (order: OrderListItem): OrderProduct | null => {
  const firstItem = order.items?.[0]
  if (!firstItem) return null
  const product = firstItem.product
  if (!isRecord(product)) return null
  return product
}

const getFirstProductImageUrl = (product: OrderProduct | null): string | null => {
  const medias = product?.medias
  if (!Array.isArray(medias) || medias.length === 0) return null
  const first = medias[0]
  if (!isRecord(first)) return null
  return typeof first.url === 'string' && first.url ? first.url : null
}

const formatOrderDate = (value: unknown): string => {
  const date = value instanceof Date ? value : new Date(String(value ?? ''))
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export const OrderCard = ({ order, className }: { order: OrderListItem; className?: string }) => {
  const product = getFirstItemProduct(order)
  const productName = typeof product?.name === 'string' ? product.name : null
  const imageUrl = getFirstProductImageUrl(product)
  const itemsCount = order.items?.reduce((acc, item) => acc + (item?.quantity ?? 0), 0) ?? 0
  const status = (order.orderStatus ?? 'pending') as OrderStatus
  const totalINR = currencyFormatter.format(order.totalAmount ?? 0)

  return (
    <article
      className={cn(
        'rounded-base border-2 border-border bg-secondary-background shadow-shadow',
        className
      )}
    >
      <div className="p-4 sm:p-5 flex flex-col gap-4">
        <header className="flex items-start justify-between gap-3 border-b-2 border-border pb-4">
          <div className="min-w-0">
            <p className="text-xs font-base text-foreground/70">Order</p>
            <p className="truncate text-base sm:text-lg font-heading tracking-tight text-foreground">
              #{order.orderNumber ?? order.id.slice(0, 8)}
            </p>
            <p className="text-xs text-foreground/70">
              Placed on {formatOrderDate(order.createdAt)}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <OrderStatusPill status={status} />
            <p className="text-sm font-bold sm:text-md md:text-lg">Arrived at :Monday</p>
          </div>
        </header>

        <div className="flex gap-4 items-center">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-base border-2 border-border bg-background shadow-shadow flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={productName ?? 'Product'}
                className="h-full w-full object-cover"
              />
            ) : (
              <Package className="h-6 w-6 text-foreground/60" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-heading text-foreground">
              {productName ?? 'Your items'}
            </p>
            <p className="text-xs text-foreground/70">
              {itemsCount} item{itemsCount === 1 ? '' : 's'} • {totalINR}
            </p>
            {typeof order.deliveryLocation === 'string' && order.deliveryLocation ? (
              <p className="mt-1 line-clamp-1 text-xs text-foreground/70">
                {order.deliveryLocation}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <Button asChild size="sm" className="px-3">
              <Link href={`/orders/${order.id}`}>
                <span className="hidden sm:inline">Track Order</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <div className=" flex-col gap-1 text-sm text-gray-700 hidden sm:flex">
              <button className="flex items-center justify-between gap-2 cursor-pointer">
                <span>View Invoice</span>
                <ChevronRight className="h-4 w-4" />
              </button>

              {order.orderStatus === 'delivered' && (
                <button className="flex items-center justify-between gap-2 cursor-pointer">
                  <span>Return Item</span>
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
