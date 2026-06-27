import { Badge } from '@/components/ui/badge'

export type OrderStatus = 'pending' | 'accepted' | 'in-transit' | 'delivered' | 'cancelled'

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: 'bg-chart-3 text-foreground',
  accepted: 'bg-chart-1 text-foreground',
  'in-transit': 'bg-chart-5 text-foreground',
  delivered: 'bg-chart-4 text-foreground',
  cancelled: 'bg-chart-2 text-foreground',
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  'in-transit': 'In transit',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export const OrderStatusPill = ({
  status,
  className,
}: {
  status: OrderStatus
  className?: string
}) => {
  return (
    <Badge className={`${STATUS_STYLES[status]} ${className ?? ''}`}>{STATUS_LABELS[status]}</Badge>
  )
}
