import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { checkoutCardClass, checkoutPanelClass } from './checkout-styles'

type CheckoutSectionCardProps = {
  eyebrow: string
  title: string
  description: string
  icon: ReactNode
  iconToneClassName: string
  children: ReactNode
  className?: string
}

const CheckoutSectionCard = ({
  eyebrow,
  title,
  description,
  icon,
  iconToneClassName,
  children,
  className,
}: CheckoutSectionCardProps) => {
  return (
    <section className={cn(checkoutCardClass, 'p-5 sm:p-6', className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.1em] text-[#4b5563]">{eyebrow}</p>
          <h2 className="mt-2 text-2xl font-black leading-tight text-black">{title}</h2>
          <p className="mt-2 text-sm font-bold leading-6 text-[#4b5563]">{description}</p>
        </div>

        <div
          className={cn(
            checkoutPanelClass,
            'flex h-14 w-14 shrink-0 items-center justify-center',
            iconToneClassName
          )}
        >
          {icon}
        </div>
      </div>

      <div className="mt-6">{children}</div>
    </section>
  )
}

export default CheckoutSectionCard
