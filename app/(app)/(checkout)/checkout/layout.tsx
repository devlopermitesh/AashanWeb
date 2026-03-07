import Footer from '@/components/Footer'
import CheckoutNavbar from '@/modules/checkout/ui/components/Header/CheckoutNavbar'
import React from 'react'

const CheckoutLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="flex flex-col w-full min-h-screen ">
      <CheckoutNavbar />

      <main className="flex-1 flex">{children}</main>
      <Footer />
    </section>
  )
}
export default CheckoutLayout
