'use client'

import { useEffect, useMemo, useState } from 'react'
import { ProductDetailsGallery } from '../product-details-gallery'
import { ProductDetailsPurchase } from '../product-details-purchase'
import { ProductDetailsSpecs } from '../product-details-specs'
import type {
  ProductDetailColorOption,
  ProductDetailImage,
  ProductDetailsData,
} from '../product-detail-types'

const REFUND_POLICY_LABEL: Record<string, string> = {
  '30-days': '30 days return policy',
  '15-days': '15 days return policy',
  '10-days': '10 days return policy',
  '5-days': '5 days return policy',
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const getMediaUrl = (value: unknown): string | null => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value
  }
  if (!isRecord(value)) {
    return null
  }

  if (typeof value.url === 'string' && value.url.length > 0) {
    return value.url
  }

  const cloudinary = isRecord(value.cloudinary) ? value.cloudinary : null
  if (cloudinary && typeof cloudinary.secure_url === 'string' && cloudinary.secure_url.length > 0) {
    return cloudinary.secure_url
  }

  return null
}

const getTagNames = (tags: unknown): string[] => {
  if (!Array.isArray(tags)) {
    return []
  }

  return tags
    .map((tag) => {
      if (typeof tag === 'string') {
        return tag
      }
      if (isRecord(tag) && typeof tag.name === 'string') {
        return tag.name
      }
      return ''
    })
    .filter((tag): tag is string => Boolean(tag.trim()))
}

const getCategoryLabel = (category: unknown): string => {
  if (typeof category === 'string' && category.trim().length > 0) {
    return category
  }
  if (isRecord(category) && typeof category.name === 'string') {
    return category.name
  }
  return 'General'
}

const getVariantColors = (product: ProductDetailsData) => {
  if (!Array.isArray(product.mediaVariants)) {
    return []
  }

  return product.mediaVariants
    .map((variant, index) => {
      const colorName = variant?.colorName?.trim()
      const colorCode = variant?.colorCode?.trim()
      if (!colorName || !colorCode) {
        return null
      }

      return {
        id: variant?.id || `variant-${index}`,
        name: colorName,
        code: colorCode,
        imageSrc: getMediaUrl(variant.image),
      }
    })
    .filter(
      (variant): variant is { id: string; name: string; code: string; imageSrc: string | null } =>
        Boolean(variant)
    )
}

interface ProductDetailsProps {
  product: ProductDetailsData
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const productName = product.name?.trim() || 'Untitled product'
  const rating = Math.max(0, Math.min(5, toNumber(product.rating, 0)))
  const reviewCount = Math.max(0, Math.round(toNumber(product.reviewCount, 0)))
  const price = Math.max(0, toNumber(product.price, 0))
  const originalPrice = Math.max(price, toNumber(product.originalPrice, price))
  const stockCount = Math.max(0, Math.round(toNumber(product.availableStockCount, 0)))
  const inStock = Boolean(product.inStock ?? stockCount > 0)
  const categoryLabel = getCategoryLabel(product.category)
  const refundPolicy =
    REFUND_POLICY_LABEL[product.refundpolicy ?? ''] || REFUND_POLICY_LABEL['30-days']
  const description = product.description?.trim() || ''
  const tags = getTagNames(product.tags)

  const variantColors = useMemo(() => getVariantColors(product), [product])

  const galleryImages = useMemo<ProductDetailImage[]>(() => {
    const seenSources = new Set<string>()
    const images: ProductDetailImage[] = []
    // indexing array loop
    for (const [index, variant] of variantColors.entries()) {
      // keep seenSrouce value unique and valuable onlly
      if (!variant.imageSrc || seenSources.has(variant.imageSrc)) {
        continue
      }
      seenSources.add(variant.imageSrc)
      images.push({
        id: `variant-image-${index}`,
        src: variant.imageSrc,
        alt: `${productName} - ${variant.name}`,
      })
    }

    for (const [index, media] of (product.medias ?? []).entries()) {
      const source = getMediaUrl(media)
      if (!source || seenSources.has(source)) {
        continue
      }
      seenSources.add(source)
      images.push({
        id: `media-image-${index}`,
        src: source,
        alt: productName,
      })
    }

    if (images.length === 0) {
      images.push({
        id: 'fallback-image',
        src: '/placeholder.jpg',
        alt: productName,
      })
    }

    return images
  }, [product.medias, productName, variantColors])

  const colors = useMemo<ProductDetailColorOption[]>(
    () =>
      variantColors.map((variant) => ({
        id: variant.id,
        name: variant.name,
        code: variant.code,
        imageId: variant.imageSrc
          ? galleryImages.find((image) => image.src === variant.imageSrc)?.id
          : undefined,
      })),
    [galleryImages, variantColors]
  )

  const [selectedColorId, setSelectedColorId] = useState<string | null>(colors[0]?.id ?? null)
  const [selectedImageId, setSelectedImageId] = useState<string | null>(
    colors[0]?.imageId ?? galleryImages[0]?.id ?? null
  )
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    setSelectedColorId((current) => {
      if (current && colors.some((color) => color.id === current)) {
        return current
      }
      return colors[0]?.id ?? null
    })
  }, [colors])

  useEffect(() => {
    setSelectedImageId((current) => {
      if (current && galleryImages.some((image) => image.id === current)) {
        return current
      }
      return colors[0]?.imageId ?? galleryImages[0]?.id ?? null
    })
  }, [colors, galleryImages])

  useEffect(() => {
    const maxAllowed = stockCount > 0 ? stockCount : 1
    setQuantity((current) => Math.min(current, maxAllowed))
  }, [stockCount])

  const handleColorSelect = (colorId: string) => {
    setSelectedColorId(colorId)
    const matchedColor = colors.find((color) => color.id === colorId)
    if (matchedColor?.imageId) {
      setSelectedImageId(matchedColor.imageId)
    }
  }

  const handleQuantityChange = (nextValue: number) => {
    const maxAllowed = stockCount > 0 ? stockCount : 1
    setQuantity(Math.min(Math.max(1, nextValue), maxAllowed))
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 lg:py-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <ProductDetailsGallery
          images={galleryImages}
          selectedImageId={selectedImageId}
          onSelectImage={setSelectedImageId}
        />
        <ProductDetailsPurchase
          name={productName}
          categoryLabel={categoryLabel}
          rating={rating}
          reviewCount={reviewCount}
          price={price}
          originalPrice={originalPrice}
          onSale={Boolean(product.onSale)}
          inStock={inStock}
          stockCount={stockCount}
          quantity={quantity}
          onQuantityChange={handleQuantityChange}
          colors={colors}
          selectedColorId={selectedColorId}
          onSelectColor={handleColorSelect}
        />
      </div>

      <ProductDetailsSpecs
        description={description}
        productId={product.id}
        categoryLabel={categoryLabel}
        refundPolicy={refundPolicy}
        inStock={inStock}
        stockCount={stockCount}
        tags={tags}
      />
    </div>
  )
}

export default ProductDetails

export const ProductDetailsSkeleton = () => {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 lg:py-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="border-2 border-black bg-white p-3 shadow-[6px_6px_0_0_#000]">
          <div className="h-[420px] w-full animate-pulse bg-zinc-200" />
          <div className="mt-3 flex gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-20 w-20 animate-pulse bg-zinc-200" />
            ))}
          </div>
        </div>
        <div className="border-2 border-black bg-white p-5 shadow-[6px_6px_0_0_#000]">
          <div className="h-6 w-2/3 animate-pulse bg-zinc-200" />
          <div className="mt-3 h-8 w-1/2 animate-pulse bg-zinc-200" />
          <div className="mt-6 h-10 w-full animate-pulse bg-zinc-200" />
          <div className="mt-3 h-10 w-full animate-pulse bg-zinc-200" />
        </div>
      </div>
      <div className="mt-10 border-2 border-black bg-white p-5 shadow-[6px_6px_0_0_#000]">
        <div className="h-6 w-28 animate-pulse bg-zinc-200" />
        <div className="mt-4 h-20 w-full animate-pulse bg-zinc-200" />
      </div>
    </div>
  )
}
