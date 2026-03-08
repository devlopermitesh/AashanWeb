'use client'

import { Handbag } from 'lucide-react'

import { cn } from '@/lib/utils'

import { Button } from '../ui/button'
import useCart from '@/modules/checkout/store/use-cart'
import useCartStyle from '@/modules/checkout/store/use-cartstyle'

type CartButtonProps = {
  count?: number
  className?: string
}

const CartButton = ({ count = 0, className }: CartButtonProps) => {
  const { toggle } = useCartStyle()
  const { getItemCount } = useCart()
  const cartCount = getItemCount()
  const itemCount = Math.max(0, count || cartCount)

  return (
    <Button
      type="button"
      variant="noShadow"
      className={cn(
        'relative flex h-11 items-center gap-2 rounded-2xl border-2 border-black bg-white px-3 text-sm font-black uppercase tracking-[0.04em] text-black shadow-[4px_4px_0_#111] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none sm:px-4',
        className
      )}
      onClick={toggle}
      aria-label="Open cart"
    >
      <Handbag size={18} />
      <span className="hidden sm:inline">Bag</span>
      <span className="inline-flex min-w-5 items-center justify-center rounded-full border-2 border-black bg-[#f6f6f6] px-1 text-[11px] leading-4">
        {itemCount}
      </span>
    </Button>
  )
}

export default CartButton
