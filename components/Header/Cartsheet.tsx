'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useQueries } from '@tanstack/react-query'
import { ArrowRight, PackageSearch, Sparkles, Store, Trash2, X } from 'lucide-react'

import { useTRPC } from '@/components/providers/TrcpProvider'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet'
import { cn } from '@/lib/utils'
import useCart from '@/modules/checkout/store/use-cart'
import useCartStyle from '@/modules/checkout/store/use-cartstyle'
import { currencyFormatter } from '@/utils/currencyFormat'

const brutalCardClass = 'rounded-[28px] border-2 border-black bg-[#fffdf7] shadow-[7px_7px_0_#111]'

const brutalPanelClass = 'rounded-[22px] border-2 border-black bg-white shadow-[4px_4px_0_#111]'

const brutalPillClass =
  'inline-flex items-center gap-2 rounded-full border-2 border-black px-4 py-2 text-xs font-black uppercase tracking-[0.08em] shadow-[3px_3px_0_#111]'

const brutalActionClass =
  'transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none'

const getShopFallbackLabel = (shopId: string, index: number) => {
  const compactId = shopId.trim().slice(0, 8)

  return compactId ? `Shop ${compactId}` : `Shop ${index + 1}`
}

const CartSheet = () => {
  const trpc = useTRPC()
  const { cardVisibity, close } = useCartStyle()
  const { shopCart, removeProduct, clearCart, clearAllCart, getItemCount } = useCart()
  // Map cart shops and item in array format [{shopId:string,items:productType[]}]
  const cartEntries = shopCart.flatMap((shop) =>
    shop.items.map((item) => ({
      shopId: shop.shopId,
      item,
    }))
  )
  // call multiples queries at once in parallel ,return arry products result
  const productQueries = useQueries({
    queries: cartEntries.map(({ item }) =>
      trpc.product.getOne.queryOptions({ slug: item.productId })
    ),
  })
  // why?
  let queryIndex = 0
  const shopSections = shopCart.map((shop, sectionIndex) => {
    const items = shop.items.map((cartItem) => {
      const query = productQueries[queryIndex++]
      const product = query?.data ?? null
      const selectedVariant =
        cartItem.variantId && Array.isArray(product?.mediaVariants)
          ? product.mediaVariants.find((variant) => variant?.id === cartItem.variantId)
          : null

      return {
        ...cartItem,
        isLoading: query?.isLoading ?? false,
        isError: query?.isError ?? false,
        product,
        variantLabel: selectedVariant?.colorName?.trim() || null,
      }
    })
    // get shop name from shop product shop name
    const resolvedShopName =
      items.find((item) => item.product?.tenant?.name)?.product?.tenant?.name ??
      getShopFallbackLabel(shop.shopId, sectionIndex)

    return {
      shopId: shop.shopId,
      shopName: resolvedShopName,
      items,
    }
  })

  const totalItems = getItemCount()
  const subtotal = shopSections.reduce(
    (sum, section) =>
      sum +
      section.items.reduce(
        (sectionSum, item) => sectionSum + (item.product?.price ?? 0) * item.quantity,
        0
      ),
    0
  )

  const hasPendingProducts = productQueries.some((query) => query.isLoading)

  return (
    <Sheet
      open={cardVisibity === 'open'}
      onOpenChange={(open) => {
        if (!open) {
          close()
        }
      }}
    >
      <SheetTrigger className="h-0 w-0" />
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full max-w-full border-l-2 border-black bg-[#fff7e8] p-0 text-black sm:max-w-xl"
      >
        <div className="flex h-full flex-col bg-[linear-gradient(180deg,_#fff7e8_0%,_#fffdf7_38%,_#fef3c7_100%)]">
          <SheetHeader className="border-b-2 border-black px-5 pb-4 pt-5 sm:px-6">
            <div className="flex items-start justify-between gap-3">
              <div
                className={cn(brutalCardClass, 'flex flex-1 items-start gap-3 bg-[#fff4d6] p-4')}
              >
                <div
                  className={cn(
                    brutalPanelClass,
                    'flex h-12 w-12 shrink-0 items-center justify-center bg-[#dff2ff]'
                  )}
                >
                  <Sparkles size={20} className="text-black" />
                </div>
                <div className="min-w-0">
                  <SheetTitle className="text-left font-black tracking-[0.03em] text-black sm:text-xl">
                    Your cart
                  </SheetTitle>
                  <SheetDescription className="mt-1 text-sm font-bold text-[#4b5563]">
                    Grouped by shop, loud enough to scan fast, light enough to fit the page.
                  </SheetDescription>
                </div>
              </div>

              <button
                type="button"
                onClick={close}
                aria-label="Close cart"
                className={cn(
                  brutalPanelClass,
                  brutalActionClass,
                  'flex h-12 w-12 shrink-0 items-center justify-center rounded-[20px] bg-[#ffd9d9] text-black'
                )}
              >
                <X size={18} />
              </button>
            </div>

            {totalItems > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className={cn(brutalPillClass, 'bg-[#dff2ff] text-black')}>
                  <Store size={14} />
                  {shopSections.length} {shopSections.length === 1 ? 'shop' : 'shops'}
                </div>
                <div className={cn(brutalPillClass, 'bg-[#e9f7db] text-black')}>
                  <PackageSearch size={14} />
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </div>
                <button
                  type="button"
                  onClick={clearAllCart}
                  className={cn(
                    brutalPillClass,
                    brutalActionClass,
                    'ml-auto bg-[#ffd9d9] text-black'
                  )}
                >
                  <Trash2 size={14} />
                  Clear all
                </button>
              </div>
            )}
          </SheetHeader>

          {totalItems === 0 ? (
            <div className="flex flex-1 items-center justify-center px-5 py-8 sm:px-6">
              <div className={cn(brutalCardClass, 'w-full bg-[#fffdf7] p-6 text-center')}>
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] border-2 border-black bg-[#dff2ff] shadow-[5px_5px_0_#111]">
                  <PackageSearch size={30} className="text-black" />
                </div>
                <h3 className="mt-5 text-2xl font-black text-black">Cart feels empty</h3>
                <p className="mt-2 text-sm font-bold text-[#4b5563]">
                  Add a few products and this panel will turn into a stacked shopping board.
                </p>
                <Button
                  asChild
                  variant="noShadow"
                  className={cn(
                    brutalActionClass,
                    'mt-6 h-12 rounded-2xl border-2 border-black bg-[#ffe58f] px-5 font-black uppercase tracking-[0.08em] text-black shadow-[5px_5px_0_#111]'
                  )}
                >
                  <Link href="/explore/all" onClick={close}>
                    Continue shopping
                    <ArrowRight size={16} />
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
                <div className="flex flex-wrap gap-3">
                  {shopSections.map((section) => (
                    <button
                      key={section.shopId}
                      type="button"
                      className={cn(brutalPillClass, 'bg-white text-sm text-black')}
                    >
                      <Store size={14} />
                      <span className="max-w-40 truncate">{section.shopName}</span>
                    </button>
                  ))}
                </div>

                {shopSections.map((section) => (
                  <section
                    key={section.shopId}
                    className={cn(brutalCardClass, 'bg-[#fffaf0] p-4 sm:p-5')}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.08em] text-[#4b5563]">
                          Shop
                        </p>
                        <h3 className="mt-1 text-lg font-black text-black">{section.shopName}</h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => clearCart(section.shopId)}
                        className={cn(
                          brutalPillClass,
                          brutalActionClass,
                          'bg-[#ffd9d9] text-black'
                        )}
                      >
                        <Trash2 size={14} />
                        Clear shop
                      </button>
                    </div>

                    <div className="mt-4 space-y-3">
                      {section.items.map((item) => {
                        if (item.isLoading) {
                          return (
                            <div
                              key={`${item.productId}-${item.variantId ?? 'default'}`}
                              className={cn(
                                brutalPanelClass,
                                'grid grid-cols-[80px_1fr_auto] items-center gap-3 bg-white p-3'
                              )}
                            >
                              <div className="h-20 rounded-[18px] border-2 border-black bg-[#dff2ff] animate-pulse" />
                              <div className="space-y-2">
                                <div className="h-4 w-2/3 rounded-full bg-[#ffe58f] animate-pulse" />
                                <div className="h-3 w-1/3 rounded-full bg-[#ffd9d9] animate-pulse" />
                              </div>
                              <div className="h-9 w-9 rounded-full border-2 border-black bg-[#e9f7db] animate-pulse" />
                            </div>
                          )
                        }

                        if (item.isError || !item.product) {
                          return (
                            <div
                              key={`${item.productId}-${item.variantId ?? 'default'}`}
                              className={cn(
                                brutalPanelClass,
                                'flex items-center justify-between gap-3 bg-[#fff0f0] p-4'
                              )}
                            >
                              <div>
                                <p className="text-sm font-black text-black">Product unavailable</p>
                                <p className="text-xs font-bold text-[#4b5563]">
                                  This item could not be loaded.
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  removeProduct(section.shopId, item.productId, item.variantId)
                                }
                                className={cn(
                                  brutalActionClass,
                                  'inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-[#ffd9d9] text-black shadow-[4px_4px_0_#111]'
                                )}
                                aria-label="Remove unavailable product"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )
                        }

                        return (
                          <div
                            key={`${item.productId}-${item.variantId ?? 'default'}`}
                            className={cn(
                              brutalPanelClass,
                              'grid grid-cols-[84px_1fr_auto] items-center gap-3 bg-white p-3'
                            )}
                          >
                            <Link
                              href={`/product/${item.product.slug || item.product.id}`}
                              onClick={close}
                              className="relative block h-21 overflow-hidden rounded-[18px] border-2 border-black bg-[#dff2ff]"
                            >
                              <Image
                                src={item.product.medias?.[0]?.url ?? '/placeholder.jpg'}
                                alt={item.product.name || 'Product image'}
                                fill
                                className="object-cover"
                                sizes="84px"
                              />
                            </Link>

                            <div className="min-w-0">
                              <p className="text-xs font-black uppercase tracking-[0.08em] text-[#4b5563]">
                                {item.product.tenant?.name || section.shopName}
                              </p>
                              <Link
                                href={`/product/${item.product.slug || item.product.id}`}
                                onClick={close}
                                className="mt-1 block truncate text-base font-black text-black"
                              >
                                {item.product.name || 'Untitled product'}
                              </Link>
                              <div className="mt-2 flex flex-wrap items-center gap-2">
                                <p className="inline-flex rounded-full border-2 border-black bg-[#ffe58f] px-3 py-1 text-sm font-black text-black">
                                  {currencyFormatter.format(item.product.price ?? 0)}
                                </p>
                                {item.quantity > 1 && (
                                  <span className="rounded-full border-2 border-black bg-[#e9f7db] px-3 py-1 text-xs font-black uppercase tracking-[0.08em] text-black">
                                    Qty {item.quantity}
                                  </span>
                                )}
                                {item.variantLabel && (
                                  <span className="rounded-full border-2 border-black bg-[#dff2ff] px-3 py-1 text-xs font-black uppercase tracking-[0.08em] text-black">
                                    {item.variantLabel}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  removeProduct(section.shopId, item.productId, item.variantId)
                                }
                                className={cn(
                                  brutalActionClass,
                                  'inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-[#ffd9d9] text-black shadow-[4px_4px_0_#111]'
                                )}
                                aria-label={`Remove ${item.product.name || 'product'} from cart`}
                              >
                                <Trash2 size={16} />
                              </button>
                              <Link
                                href={`/product/${item.product.slug || item.product.id}`}
                                onClick={close}
                                className="rounded-full border-2 border-black bg-[#dff2ff] px-3 py-1 text-xs font-black uppercase tracking-[0.08em] text-black shadow-[3px_3px_0_#111]"
                              >
                                View
                              </Link>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </section>
                ))}
              </div>

              <div className="border-t-2 border-black bg-[#fff4d6] px-5 pb-5 pt-4 sm:px-6">
                <div className={cn(brutalCardClass, 'bg-[#fffdf7] p-4 sm:p-5')}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.08em] text-[#4b5563]">
                        Subtotal
                      </p>
                      <p className="mt-1 text-2xl font-black text-black">
                        {currencyFormatter.format(subtotal)}
                      </p>
                    </div>
                    <div className={cn(brutalPanelClass, 'bg-[#e9f7db] px-4 py-3 text-right')}>
                      <p className="text-xs font-black uppercase tracking-[0.08em] text-[#4b5563]">
                        Basket
                      </p>
                      <p className="mt-1 text-sm font-black text-black">
                        {totalItems} {totalItems === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <Button
                      asChild
                      variant="noShadow"
                      className={cn(
                        brutalActionClass,
                        'h-12 flex-1 rounded-[22px] border-2 border-black bg-white px-5 font-black uppercase tracking-[0.08em] text-black shadow-[5px_5px_0_#111]'
                      )}
                    >
                      <Link href="/explore/all" onClick={close}>
                        Keep browsing
                      </Link>
                    </Button>

                    <Button
                      asChild
                      variant="noShadow"
                      className={cn(
                        brutalActionClass,
                        'h-12 flex-1 rounded-[22px] border-2 border-black bg-[#dff2ff] px-5 font-black uppercase tracking-[0.08em] text-black shadow-[5px_5px_0_#111]',
                        hasPendingProducts && 'opacity-80'
                      )}
                    >
                      <Link href="/checkout" onClick={close}>
                        Buy now
                        <ArrowRight size={16} />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default CartSheet
