'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { currencyFormatter } from '@/utils/currencyFormat'
import { Check, ShoppingCart, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CSSProperties, KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import useCart from '@/modules/checkout/store/use-cart'

interface Props {
  id: string
  slug?: string
  shopId?: string
  name: string
  imageUrl: string
  authorUsername: string
  authroImageUrl: string
  reviewrating: number
  reviewCount: number
  price: number
  trending: boolean
  className?: string
  style?: CSSProperties
}

const ProductCard = ({
  id,
  slug,
  shopId,
  name,
  imageUrl,
  authorUsername,
  authroImageUrl,
  reviewrating,
  reviewCount,
  price,
  trending,
  className,
  style,
}: Props) => {
  const router = useRouter()
  const href = `/product/${slug || id}`
  const { addProduct, hasProduct } = useCart()
  const isInCart = Boolean(shopId && hasProduct(shopId, id))

  const handleNavigate = () => {
    router.push(href)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    // Make the entire card accessible like a link
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleNavigate()
    }
  }

  return (
    <Card
      style={style}
      role="link"
      tabIndex={0}
      aria-label={`View ${name}`}
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
      className={cn(
        'group relative cursor-pointer overflow-hidden border-2 border-black bg-yellow-300',
        'shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]',
        'hover:translate-x-[-2px] hover:translate-y-[-2px]',
        'hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]',
        'transition-all duration-150 outline-none focus-visible:ring-4 focus-visible:ring-black/20',
        className
      )}
    >
      {/* Image */}
      <div className="relative h-44 w-full overflow-hidden border-b-2 border-black bg-white">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 300px"
        />

        {/* Trending badge — overlaid on image */}
        {trending && (
          <Badge className="absolute left-2 top-2 z-10 border-2 border-black bg-red-500 text-white font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            Trending
          </Badge>
        )}

        {/* Friendly hint */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/45 via-black/0 to-transparent p-3 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          <span className="inline-flex border-2 border-black bg-white px-2 py-1 text-xs font-black uppercase tracking-wide text-black shadow-[2px_2px_0_0_#000]">
            Tap to view
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2 p-4">
        <h3 className="text-lg font-black leading-tight">
          <Link
            href={href}
            onClick={(e) => e.stopPropagation()}
            className="underline-offset-2 hover:underline"
          >
            {name}
          </Link>
        </h3>

        {/* Author */}
        <div className="flex items-center gap-2">
          <div className="relative h-6 w-6 flex-shrink-0 overflow-hidden rounded-full border-2 border-black">
            <Image
              src={authroImageUrl}
              alt={authorUsername}
              fill
              className="object-cover"
              sizes="24px"
            />
          </div>
          <span className="truncate text-sm font-bold">@{authorUsername}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 text-sm font-bold">
          <Star size={14} fill="black" />
          {reviewrating} ({reviewCount})
        </div>

        {/* Price + actions */}
        <div className="flex items-center justify-between gap-2 pt-2">
          <span className="text-xl font-black">{currencyFormatter.format(price)}</span>

          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="neutral"
              size="sm"
              className="h-9 rounded-none border-2 border-black bg-white px-3 text-xs font-black uppercase tracking-wide text-black hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#000]"
            >
              <Link href={href} onClick={(e) => e.stopPropagation()}>
                Details
              </Link>
            </Button>

            <Button
              type="button"
              disabled={!shopId}
              onClick={(e) => {
                e.stopPropagation()
                if (!shopId) return
                addProduct(shopId, id, { quantity: 1 })
              }}
              className={cn(
                'h-9 rounded-none border-2 border-black bg-black px-3 text-xs font-black uppercase tracking-wide text-white',
                'hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#000]',
                !shopId && 'cursor-not-allowed opacity-70'
              )}
              aria-label={
                shopId ? (isInCart ? 'In cart' : 'Add to cart') : 'Add to cart unavailable'
              }
              title={shopId ? '' : 'Shop info missing for this product'}
            >
              {isInCart ? <Check size={16} /> : <ShoppingCart size={16} />}
              <span className="ml-2">{isInCart ? 'In Bag' : 'Add'}</span>
            </Button>
          </div>
        </div>

        {!shopId && (
          <p className="text-xs font-semibold text-black/70">Tip: open details to add this item.</p>
        )}
      </div>
    </Card>
  )
}

export default ProductCard

/* ─────────────────────────────────────────
   Skeleton
───────────────────────────────────────── */
export const ProductSkeleton = ({
  className,
  style,
}: {
  className?: string
  style?: CSSProperties
}) => {
  return (
    <div
      style={style}
      className={cn(
        'relative border-2 border-black bg-yellow-300/30 overflow-hidden rounded-lg',
        'shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]',
        className
      )}
    >
      {/* Image skeleton */}
      <div className="h-44 w-full border-b-2 border-black bg-white overflow-hidden">
        <div className="h-full w-full animate-pulse bg-gray-200" />
      </div>

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-5 w-3/4 animate-pulse rounded bg-black/10" />

        {/* Author */}
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 flex-shrink-0 animate-pulse rounded-full bg-black/10 border-2 border-black/20" />
          <div className="h-4 w-24 animate-pulse rounded bg-black/10" />
        </div>

        {/* Rating */}
        <div className="h-4 w-20 animate-pulse rounded bg-black/10" />

        {/* Price row */}
        <div className="flex justify-between items-center pt-2">
          <div className="h-7 w-16 animate-pulse rounded bg-black/10" />
          <div className="h-8 w-16 animate-pulse rounded border-2 border-black/20 bg-black/10" />
        </div>
      </div>
    </div>
  )
}
export const NoproductFound = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'relative border-2 border-black bg-white overflow-hidden rounded-lg flex flex-col justify-center items-center py-5',
        'shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]',
        className
      )}
    >
      <Image
        src={'/404Puppy.png'}
        alt="Image No found!"
        height={200}
        width={200}
        className="w-30 h-40 object-contain"
      />
      <h3 className="font-medium text-xl text-gray-500 ">No Product Found</h3>
    </div>
  )
}
