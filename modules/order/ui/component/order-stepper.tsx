import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import type { OrderStatus } from './order-status-pill'

const STEPS = [
  { key: 'placed', label: 'Order placed', hint: 'We received your order' },
  { key: 'accepted', label: 'Accepted', hint: 'Seller confirmed it' },
  { key: 'in-transit', label: 'In transit', hint: 'On the way to you' },
  { key: 'delivered', label: 'Delivered', hint: 'Delivered successfully' },
] as const

const STATUS_INDEX: Record<OrderStatus, number> = {
  pending: 0,
  accepted: 1,
  'in-transit': 2,
  delivered: 3,
  cancelled: 0,
}

export const OrderStepper = ({
  status,
  className,
}: {
  status: OrderStatus
  className?: string
}) => {
  const activeIndex = STATUS_INDEX[status]
  const isCancelled = status === 'cancelled'

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {isCancelled ? (
        <div className="rounded-base border-2 border-border bg-chart-2 px-4 py-3 text-sm font-heading text-foreground shadow-shadow">
          Order cancelled
        </div>
      ) : null}

      <div className="flex items-center">
        {STEPS.map((step, index) => {
          const isDone = index < activeIndex
          const isActive = index === activeIndex
          const circleClass = cn(
            'size-10 shrink-0 rounded-full border-2 border-border shadow-shadow grid place-items-center font-heading',
            isDone && 'bg-chart-4',
            isActive && 'bg-chart-3',
            !isDone && !isActive && 'bg-secondary-background'
          )

          const lineClass = cn(
            'h-2 flex-1 border-y-2 border-border bg-secondary-background',
            index < activeIndex && 'bg-chart-4'
          )

          return (
            <div key={step.key} className="flex items-center flex-1">
              <div className={circleClass} aria-current={isActive ? 'step' : undefined}>
                {isDone ? <Check className="h-5 w-5" /> : index + 1}
              </div>
              {index < STEPS.length - 1 ? <div className={lineClass} /> : null}
            </div>
          )
        })}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, index) => {
          const isDone = index < activeIndex
          const isActive = index === activeIndex
          return (
            <div
              key={step.key}
              className={cn(
                'rounded-base border-2 border-border bg-secondary-background p-3 shadow-shadow',
                (isDone || isActive) && 'bg-background'
              )}
            >
              <p className="text-sm font-heading text-foreground">{step.label}</p>
              <p className="text-xs text-foreground/70">{step.hint}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
