'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CSSProperties } from 'react'

interface Props {
  id: string
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
  return (
    <Link href={`/product/${id}`}>
      <Card
        style={style}
        className={cn(
          'relative border-2 border-black bg-yellow-300 overflow-hidden',
          'shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]',
          'hover:translate-x-[-2px] hover:translate-y-[-2px]',
          'hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]',
          'transition-all duration-150',
          className
        )}
      >
        {/* Image */}
        <div className="relative h-44 w-full border-b-2 border-black bg-white overflow-hidden">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 300px"
          />

          {/* Trending badge — overlaid on image */}
          {trending && (
            <Badge className="absolute top-2 left-2 z-10 border-2 border-black bg-red-500 text-white font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              🔥 Trending
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <h3 className="font-black text-lg leading-tight">{name}</h3>

          {/* Author */}
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6 rounded-full border-2 border-black overflow-hidden flex-shrink-0">
              <Image
                src={authroImageUrl}
                alt={authorUsername}
                fill
                className="object-cover"
                sizes="24px"
              />
            </div>
            <span className="text-sm font-bold">@{authorUsername}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 text-sm font-bold">
            <Star size={14} fill="black" />
            {reviewrating} ({reviewCount})
          </div>

          {/* Price */}
          <div className="flex justify-between items-center pt-2">
            <span className="text-xl font-black">₹{price}</span>
            <span className="border-2 border-black px-3 py-1 text-xs font-bold bg-white">
              BUY →
            </span>
          </div>
        </div>
      </Card>
    </Link>
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
