'use client'

import Logo from '@/components/Header/Logo'
import { ShieldCheck } from 'lucide-react'
import CartButton from '../../../../../components/Share/CartButton'

const CheckoutNavbar = () => {
  return (
    <header className="w-full border-b-2 border-black bg-[#f7f7f4] px-3 py-3 sm:px-6">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-2 sm:gap-4">
        <div className="shrink-0 rounded-2xl border-2 border-black bg-white px-3 py-2 shadow-[4px_4px_0_#111] sm:px-4">
          <Logo variant="icon" size="sm" className="sm:hidden" />
          <Logo variant="full" size="md" className="hidden sm:flex" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mx-auto flex w-fit max-w-full items-center gap-2 rounded-2xl border-2 border-black bg-white px-3 py-2 shadow-[4px_4px_0_#111] sm:px-4">
            <ShieldCheck size={18} className="shrink-0" />
            <h1 className="truncate text-xs font-black uppercase tracking-[0.06em] sm:text-sm md:text-base">
              <span className="sm:hidden">Checkout</span>
              <span className="hidden sm:inline">Secure Checkout</span>
            </h1>
          </div>
        </div>

        <CartButton className="shrink-0" />
      </div>
    </header>
  )
}

export default CheckoutNavbar
