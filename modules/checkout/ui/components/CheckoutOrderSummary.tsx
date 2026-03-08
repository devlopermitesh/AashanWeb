'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, LoaderCircle, ShieldCheck, Store, Trash2, Truck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { currencyFormatter } from '@/utils/currencyFormat'

import {
  checkoutActionClass,
  checkoutCardClass,
  checkoutPanelClass,
  checkoutPillClass,
} from './checkout-styles'

export type CheckoutSummaryProduct = {
  id: string
  slug?: string | null
  name?: string | null
  price?: number | null
  medias?: Array<{ url?: string | null }> | null
  mediaVariants?: Array<{ id?: string | null; colorName?: string | null }> | null
  tenant?: { name?: string | null } | null
}

export type CheckoutSummaryItem = {
  productId: string
  variantId?: string
  quantity: number
  isLoading: boolean
  isError: boolean
  product: CheckoutSummaryProduct | null
  variantLabel: string | null
}

export type CheckoutSummarySection = {
  shopId: string
  shopName: string
  items: CheckoutSummaryItem[]
}

type CheckoutOrderSummaryProps = {
  shopSections: CheckoutSummarySection[]
  totalItems: number
  subtotal: number
  shippingFee: number
  grandTotal: number
  hasPendingProducts: boolean
  onRemoveItem: (shopId: string, productId: string, variantId?: string) => void
  isSubmitting: boolean
}

const CheckoutOrderSummary = ({
  shopSections,
  totalItems,
  subtotal,
  shippingFee,
  grandTotal,
  hasPendingProducts,
  onRemoveItem,
  isSubmitting,
}: CheckoutOrderSummaryProps) => {
  return (
    <aside className="lg:sticky lg:top-24 lg:h-fit">
      <div className={cn(checkoutCardClass, 'overflow-hidden bg-[#fff8e7]')}>
        <div className="border-b-2 border-black bg-[#ffe58f] p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.1em] text-[#4b5563]">
                Order summary
              </p>
              <h2 className="mt-2 text-2xl font-black text-black">Ready to review</h2>
              <p className="mt-2 text-sm font-bold leading-6 text-[#4b5563]">
                Cart items stay visible while you finish shipping details.
              </p>
            </div>

            <div
              className={cn(
                checkoutPanelClass,
                'flex h-12 w-12 shrink-0 items-center justify-center bg-[#dff2ff]'
              )}
            >
              <ShieldCheck size={18} className="text-black" />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <div className={cn(checkoutPillClass, 'bg-white text-black')}>
              <Store size={14} />
              {shopSections.length} {shopSections.length === 1 ? 'shop' : 'shops'}
            </div>
            <div className={cn(checkoutPillClass, 'bg-[#e9f7db] text-black')}>
              <Truck size={14} />
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </div>
          </div>
        </div>

        <div className="space-y-4 p-5">
          {totalItems === 0 ? (
            <div className={cn(checkoutPanelClass, 'bg-white p-5 text-center')}>
              <p className="text-lg font-black text-black">Your cart is empty</p>
              <p className="mt-2 text-sm font-bold leading-6 text-[#4b5563]">
                Add products before moving to payment.
              </p>
              <Button
                asChild
                variant="noShadow"
                className={cn(
                  checkoutActionClass,
                  'mt-4 h-12 rounded-[18px] border-2 border-black bg-[#dff2ff] px-5 font-black uppercase tracking-[0.08em] text-black shadow-[5px_5px_0_#111]'
                )}
              >
                <Link href="/explore/all">
                  Continue shopping
                  <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {shopSections.map((section) => (
                  <section key={section.shopId} className={cn(checkoutPanelClass, 'bg-white p-4')}>
                    <div className="flex items-center justify-between gap-3 border-b-2 border-dashed border-black/20 pb-3">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.08em] text-[#4b5563]">
                          Shop
                        </p>
                        <h3 className="text-base font-black text-black">{section.shopName}</h3>
                      </div>
                      <span className="rounded-full border-2 border-black bg-[#fff4d6] px-3 py-1 text-xs font-black uppercase tracking-[0.08em] text-black">
                        {section.items.reduce((sum, item) => sum + item.quantity, 0)} units
                      </span>
                    </div>

                    <div className="mt-4 space-y-3">
                      {section.items.map((item) => {
                        const itemKey = `${item.productId}-${item.variantId ?? 'default'}`

                        if (item.isLoading) {
                          return (
                            <div
                              key={itemKey}
                              className="grid grid-cols-[72px_1fr] gap-3 rounded-[18px] border-2 border-black bg-[#f8fafc] p-3"
                            >
                              <div className="h-[72px] animate-pulse rounded-[14px] bg-[#dff2ff]" />
                              <div className="space-y-2">
                                <div className="h-4 w-2/3 animate-pulse rounded-full bg-[#ffe58f]" />
                                <div className="h-3 w-1/3 animate-pulse rounded-full bg-[#ffd9d9]" />
                                <div className="h-3 w-1/2 animate-pulse rounded-full bg-[#e9f7db]" />
                              </div>
                            </div>
                          )
                        }

                        if (item.isError || !item.product) {
                          return (
                            <div
                              key={itemKey}
                              className="rounded-[18px] border-2 border-black bg-[#fff0f0] p-3"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-sm font-black text-black">
                                    Product unavailable
                                  </p>
                                  <p className="mt-1 text-xs font-bold leading-5 text-[#4b5563]">
                                    Remove this line item to continue.
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    onRemoveItem(section.shopId, item.productId, item.variantId)
                                  }
                                  className={cn(
                                    checkoutActionClass,
                                    'inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-[#ffd9d9] text-black shadow-[4px_4px_0_#111]'
                                  )}
                                  aria-label="Remove unavailable product"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          )
                        }

                        const productHref = `/product/${item.product.slug || item.product.id}`

                        return (
                          <div
                            key={itemKey}
                            className="grid grid-cols-[72px_1fr_auto] gap-3 rounded-[18px] border-2 border-black bg-[#fffdf7] p-3"
                          >
                            <Link
                              href={productHref}
                              className="relative block h-[72px] overflow-hidden rounded-[14px] border-2 border-black bg-[#dff2ff]"
                            >
                              <Image
                                src={item.product.medias?.[0]?.url ?? '/placeholder.jpg'}
                                alt={item.product.name || 'Product image'}
                                fill
                                sizes="72px"
                                className="object-cover"
                              />
                            </Link>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-black text-black">
                                {item.product.name || 'Untitled product'}
                              </p>
                              <p className="mt-1 text-xs font-bold uppercase tracking-[0.08em] text-[#4b5563]">
                                {item.product.tenant?.name || section.shopName}
                              </p>
                              <div className="mt-2 flex flex-wrap gap-2">
                                <span className="rounded-full border-2 border-black bg-[#ffe58f] px-2.5 py-1 text-xs font-black text-black">
                                  {currencyFormatter.format(item.product.price ?? 0)}
                                </span>
                                <span className="rounded-full border-2 border-black bg-[#e9f7db] px-2.5 py-1 text-xs font-black uppercase tracking-[0.08em] text-black">
                                  Qty {item.quantity}
                                </span>
                                {item.variantLabel ? (
                                  <span className="rounded-full border-2 border-black bg-[#dff2ff] px-2.5 py-1 text-xs font-black uppercase tracking-[0.08em] text-black">
                                    {item.variantLabel}
                                  </span>
                                ) : null}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                onRemoveItem(section.shopId, item.productId, item.variantId)
                              }
                              className={cn(
                                checkoutActionClass,
                                'inline-flex h-10 w-10 items-center justify-center self-start rounded-full border-2 border-black bg-[#ffd9d9] text-black shadow-[4px_4px_0_#111]'
                              )}
                              aria-label={`Remove ${item.product.name || 'product'} from cart`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </section>
                ))}
              </div>

              <div className={cn(checkoutPanelClass, 'space-y-3 bg-[#fffdf7] p-4')}>
                <div className="flex items-center justify-between gap-3 text-sm font-black text-black">
                  <span>Subtotal</span>
                  <span>{currencyFormatter.format(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between gap-3 text-sm font-black text-black">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? 'Free' : currencyFormatter.format(shippingFee)}</span>
                </div>
                <div className="border-t-2 border-dashed border-black/20 pt-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-black uppercase tracking-[0.08em] text-[#4b5563]">
                      Total
                    </span>
                    <span className="text-2xl font-black text-black">
                      {currencyFormatter.format(grandTotal)}
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-bold leading-5 text-[#4b5563]">
                    Shipping is free above {currencyFormatter.format(1499)}.
                  </p>
                </div>
              </div>
            </>
          )}

          <Button
            type="submit"
            disabled={totalItems === 0 || hasPendingProducts || isSubmitting}
            variant="noShadow"
            className={cn(
              checkoutActionClass,
              'h-14 w-full rounded-[22px] border-2 border-black bg-[#111] text-base font-black uppercase tracking-[0.08em] text-white shadow-[6px_6px_0_#111]',
              (totalItems === 0 || hasPendingProducts || isSubmitting) &&
                'cursor-not-allowed opacity-70'
            )}
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="animate-spin" />
                Preparing
              </>
            ) : hasPendingProducts ? (
              <>
                <LoaderCircle className="animate-spin" />
                Loading cart
              </>
            ) : (
              <>
                Pay now
                <ArrowRight size={16} />
              </>
            )}
          </Button>

          <p className="text-center text-xs font-bold leading-5 text-[#4b5563]">
            Final payment handoff is still pending backend integration. This screen currently
            validates and prepares checkout details only.
          </p>
        </div>
      </div>
    </aside>
  )
}

export default CheckoutOrderSummary
