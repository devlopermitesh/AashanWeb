'use client'

import { Package } from 'lucide-react'

import { cn } from '@/lib/utils'

import Link from 'next/link'
type ButtonProps = {
  className?: string
}

const OrderLink = ({ className }: ButtonProps) => {
  return (
    <Link
      href={'/orders'}
      className={cn(
        'relative flex h-11 items-center gap-2 rounded-2xl border-2 border-black bg-white px-3 text-sm font-black uppercase tracking-[0.04em] text-black shadow-[4px_4px_0_#111] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none sm:px-4',
        className
      )}
    >
      <Package size={18} />
      <span className="hidden sm:inline">Orders</span>
    </Link>
  )
}

export default OrderLink
