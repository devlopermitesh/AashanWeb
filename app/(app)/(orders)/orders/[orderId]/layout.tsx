import { prefetch, trpc } from '@/trpc/server'

const SingleOrderLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ orderId: string }>
}) => {
  const { orderId } = await params
  try {
    prefetch(trpc.order.getOne.queryOptions({ id: orderId }))
  } catch (error) {
    console.log('Single Order Prefetch Failed', error)
  }

  return <>{children}</>
}
export default SingleOrderLayout
