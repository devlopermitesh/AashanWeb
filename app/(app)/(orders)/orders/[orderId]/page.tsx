import { OrderDetailsView } from '@/modules/order/ui/view/order-details-view'

const Page = async ({ params }: { params: Promise<{ orderId: string }> }) => {
  const { orderId } = await params
  return <OrderDetailsView orderId={orderId} />
}

export default Page
