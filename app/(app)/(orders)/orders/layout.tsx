import Footer from '@/components/Footer'
import OrderTrackNavbar from '@/modules/order/ui/component/Header/OrderTrackNavbar'
import { createTRPCContext } from '@/trpc/init'
import { HydrateClient, prefetch, trpc } from '@/trpc/server'
import { redirect } from 'next/navigation'
import React from 'react'

const OrderLayout = async ({ children }: { children: React.ReactNode }) => {
  const { user } = await createTRPCContext()
  if (!user) {
    redirect('/sign-in')
  }

  try {
    prefetch(
      trpc.order.getOrders.infiniteQueryOptions(
        { filter: 'recent' },
        {
          getNextPageParam: (lastPage) => lastPage.nextCursor,
        }
      )
    )
  } catch (error) {
    console.log('Orders Prefetch Failed', error)
  }

  return (
    <HydrateClient>
      <section className="flex flex-col w-full min-h-screen">
        <OrderTrackNavbar />
        <main className="flex-1 flex">{children}</main>
        <Footer />
      </section>
    </HydrateClient>
  )
}
export default OrderLayout
