import Image from 'next/image'
import Link from 'next/link'
import { Eye, Heart, Share2, ShoppingCart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { shadowConfig } from '@/blocks/productGrid/product-layout'
import { cn } from '@/lib/utils'
import type { ProductGridProduct, ProductGridSettings } from '../types'
import { currencyFormatter } from '@/utils/currencyFormat'

interface ProductCardProps {
  data: ProductGridSettings
  product: ProductGridProduct
}

const IMAGE_HOVER_CLASSES: Record<ProductGridSettings['card']['imageHover'], string> = {
  zoom: 'group-hover:scale-110',
  fade: 'group-hover:opacity-75',
  slide: 'group-hover:translate-x-2',
  none: '',
}

export function getProductKey(product: ProductGridProduct, index: number): string {
  if (typeof product._id === 'string' && product._id.length > 0) {
    return product._id
  }
  if (typeof product.id === 'string' && product.id.length > 0) {
    return product.id
  }
  if (typeof product.id === 'number') {
    return String(product.id)
  }
  if (typeof product.slug === 'string' && product.slug.length > 0) {
    return product.slug
  }

  return `product-${index}`
}

function getNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function getCategoryName(category: ProductGridProduct['category']): string {
  if (typeof category === 'string') {
    return category
  }
  if (category?.name) {
    return category.name
  }
  return ''
}

function getAspectRatio(aspect: ProductGridSettings['card']['imageAspect']): string {
  switch (aspect) {
    case '16:9':
      return '16 / 9'
    case '9:16':
      return '9 / 16'
    case 'square':
    case 'cover':
    case 'contain':
    default:
      return '1 / 1'
  }
}

function getPositionClass(position: ProductGridSettings['display']['badge']['position']): string {
  switch (position) {
    case 'top-left':
      return 'top-3 left-3'
    case 'top-right':
      return 'top-3 right-3'
    case 'bottom-left':
      return 'bottom-3 left-3'
    case 'bottom-right':
      return 'bottom-3 right-3'
    default:
      return 'top-3 right-3'
  }
}

function PriceView({
  format,
  price,
  originalPrice,
}: {
  format: ProductGridSettings['display']['price']['format']
  price: number
  originalPrice: number
}) {
  if (format === 'with-discount' && originalPrice > price) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xl font-black">{currencyFormatter.format(price)}</span>
        <span className="text-sm font-semibold text-zinc-500 line-through">
          {currencyFormatter.format(originalPrice)}
        </span>
      </div>
    )
  }

  if (format === 'range') {
    return (
      <p className="text-lg font-black">
        {currencyFormatter.format(price)} - {currencyFormatter.format(price * 1.5)}
      </p>
    )
  }

  return <p className="text-xl font-black">{currencyFormatter.format(price)}</p>
}

function RatingView({
  rating,
  reviewCount,
  style,
  showCount,
}: {
  rating: number
  reviewCount: number
  style: ProductGridSettings['display']['rating']['style']
  showCount: boolean
}) {
  if (style === 'number') {
    return (
      <span className="text-sm font-bold">{rating > 0 ? `${rating.toFixed(1)} ⭐` : 'N/A'}</span>
    )
  }

  return (
    <>
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={14}
            className={cn(
              'stroke-[2.5]',
              index < Math.round(rating)
                ? 'fill-yellow-300 text-black'
                : 'fill-transparent text-black'
            )}
          />
        ))}
      </div>
      {showCount && <span className="text-sm font-semibold text-zinc-600">({reviewCount})</span>}
    </>
  )
}

function Badge({
  onSale,
  isNewProduct,
  style,
  position,
}: {
  onSale: boolean
  isNewProduct: boolean
  style: ProductGridSettings['display']['badge']['style']
  position: ProductGridSettings['display']['badge']['position']
}) {
  if (!onSale && !isNewProduct) {
    return null
  }

  return (
    <div className={cn('absolute z-10 flex flex-col gap-2', getPositionClass(position))}>
      {style !== 'new' && onSale && (
        <span className="inline-flex border-2 border-black bg-[#ff5b5b] px-3 py-1 text-xs font-black uppercase text-black">
          Sale
        </span>
      )}
      {style !== 'sale' && isNewProduct && (
        <span className="inline-flex border-2 border-black bg-[#59f7a2] px-3 py-1 text-xs font-black uppercase text-black">
          New
        </span>
      )}
    </div>
  )
}

function AddToCartButton({
  text,
  style,
  fullWidth,
}: {
  text: string
  style: ProductGridSettings['actions']['addToCart']['style']
  fullWidth: boolean
}) {
  const baseButtonClass =
    'border-2 border-black bg-black text-white font-black uppercase tracking-wide transition hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#000]'

  if (style === 'icon') {
    return (
      <button
        type="button"
        className={cn(
          'h-10 min-w-10 border-2 border-black bg-black text-white transition hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#000]',
          fullWidth ? 'w-full' : 'px-3'
        )}
        aria-label="Add to cart"
      >
        <ShoppingCart size={16} className="mx-auto" />
      </button>
    )
  }

  if (style === 'button-icon') {
    return (
      <Button
        type="button"
        className={cn(baseButtonClass, 'gap-2', fullWidth ? 'w-full' : 'flex-1')}
      >
        <ShoppingCart size={16} />
        {text}
      </Button>
    )
  }

  return (
    <Button type="button" className={cn(baseButtonClass, fullWidth ? 'w-full' : 'flex-1')}>
      {text}
    </Button>
  )
}

export function ProductCard({ data, product }: ProductCardProps) {
  const { card, display, actions } = data
  const cardStyle = card.style
  const padding = getNumber(card.padding, 16)
  const price = getNumber(product.price, 0)
  const originalPrice = getNumber(product.originalPrice, 0)
  const rating = getNumber(product.rating, 0)
  const reviewCount = Math.max(0, Math.round(getNumber(product.reviewCount, 0)))
  const category = getCategoryName(product.category)

  const fallbackTitle = (product.title || product.name || 'Untitled product').trim()
  const slug = product.slug || '#'
  const imageSource =
    product.image ||
    (typeof product.medias?.[0] === 'object' ? product.medias[0]?.url : null) ||
    '/placeholder.png'
  const imageHoverClass = IMAGE_HOVER_CLASSES[card.imageHover]
  const shadowClass = shadowConfig[cardStyle.shadow]
  const defaultBorderWidth = cardStyle.showBorder ? getNumber(cardStyle.borderWidth, 1) : 3
  const borderColor = cardStyle.showBorder ? cardStyle.borderColor || '#111111' : '#111111'

  return (
    <article
      className={cn(
        'group relative overflow-hidden border-black bg-[#fffdf5] transition duration-200 hover:-translate-y-1',
        shadowClass,
        cardStyle.shadow !== 'none' && 'shadow-[6px_6px_0_0_#000] hover:shadow-[10px_10px_0_0_#000]'
      )}
      style={{
        backgroundColor: cardStyle.backgroundColor,
        borderRadius: `${getNumber(cardStyle.borderRadius, 12)}px`,
        borderWidth: `${defaultBorderWidth}px`,
        borderColor,
        padding: `${padding}px`,
      }}
    >
      {display.image && (
        <div
          className="relative mb-4 overflow-hidden border-2 border-black"
          style={{ aspectRatio: getAspectRatio(card.imageAspect) }}
        >
          <Badge
            onSale={Boolean(product.onSale)}
            isNewProduct={Boolean(product.isNewProduct)}
            style={display.badge.style}
            position={display.badge.position}
          />
          <Image
            src={imageSource}
            alt={fallbackTitle}
            fill
            className={cn('object-cover transition duration-300', imageHoverClass)}
          />
        </div>
      )}

      <div>
        {display.title && (
          <h3 className="mb-2 text-lg font-black leading-tight line-clamp-2">
            <Link href={`/product/${slug}`} className="underline-offset-2 hover:underline">
              {fallbackTitle}
            </Link>
          </h3>
        )}

        {display.category && category && (
          <p className="mb-2 inline-flex border-2 border-black bg-[#d7ecff] px-2 py-0.5 text-xs font-bold uppercase tracking-wide">
            {category}
          </p>
        )}

        {display.description && product.description && (
          <p className="mb-3 text-sm font-medium text-zinc-700 line-clamp-2">
            {product.description}
          </p>
        )}

        {display.rating.show && (
          <div className="mb-3 flex items-center gap-2">
            <RatingView
              rating={rating}
              reviewCount={reviewCount}
              style={display.rating.style}
              showCount={display.rating.showCount}
            />
          </div>
        )}

        {display.stock && (
          <p
            className={cn(
              'mb-3 inline-flex border-2 border-black px-2 py-0.5 text-xs font-black uppercase',
              product.inStock ? 'bg-[#9eff9e] text-black' : 'bg-[#ff9e9e] text-black'
            )}
          >
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </p>
        )}

        {display.price.show && (
          <div className="mb-4 border-y-2 border-black py-2">
            <PriceView format={display.price.format} price={price} originalPrice={originalPrice} />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {actions.addToCart.show && (
            <AddToCartButton
              text={actions.addToCart.text}
              style={actions.addToCart.style}
              fullWidth={actions.addToCart.fullWidth}
            />
          )}

          {actions.quickView.show && (
            <button
              type="button"
              className="h-10 w-10 border-2 border-black bg-white transition hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#000]"
              aria-label="Quick view"
            >
              <Eye size={16} className="mx-auto" />
            </button>
          )}

          {actions.wishlist.show && (
            <button
              type="button"
              className="h-10 w-10 border-2 border-black bg-white transition hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#000]"
              aria-label="Add to wishlist"
            >
              <Heart size={16} className="mx-auto" />
            </button>
          )}

          {actions.share && (
            <button
              type="button"
              className="h-10 w-10 border-2 border-black bg-white transition hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#000]"
              aria-label="Share product"
            >
              <Share2 size={16} className="mx-auto" />
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
