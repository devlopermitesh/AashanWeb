'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { ProductDetailImage } from './product-detail-types'

interface ProductDetailsGalleryProps {
  images: ProductDetailImage[]
  selectedImageId: string | null
  onSelectImage: (imageId: string) => void
}

export const ProductDetailsGallery = ({
  images,
  selectedImageId,
  onSelectImage,
}: ProductDetailsGalleryProps) => {
  const activeImage = images.find((image) => image.id === selectedImageId) ??
    images[0] ?? {
      id: 'fallback',
      src: '/placeholder.jpg',
      alt: 'Product image',
    }

  return (
    <section className="space-y-4">
      <div className="relative overflow-hidden border-2 border-black bg-white shadow-[6px_6px_0_0_#000]">
        <div className="relative aspect-[4/5] w-full">
          <Image
            src={activeImage.src}
            alt={activeImage.alt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority
          />
        </div>
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((image) => (
            <button
              key={image.id}
              type="button"
              onClick={() => onSelectImage(image.id)}
              className={cn(
                'relative h-20 w-20 flex-none overflow-hidden border-2 border-black bg-white transition hover:-translate-y-0.5',
                image.id === activeImage.id
                  ? 'shadow-[3px_3px_0_0_#000]'
                  : 'opacity-80 hover:opacity-100'
              )}
              aria-label={`Select ${image.alt}`}
              aria-pressed={image.id === activeImage.id}
            >
              <Image src={image.src} alt={image.alt} fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
