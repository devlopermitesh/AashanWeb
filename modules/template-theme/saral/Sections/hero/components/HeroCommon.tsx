import type { CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { HeroWrapperProps } from '../types'

type HeroStyling = HeroWrapperProps['styling']

const getHeadingClass = (font: HeroStyling['headingFont']) => {
  switch (font) {
    case 'playfair':
      return 'font-serif'
    case 'jetbrains':
      return 'font-mono'
    case 'bebas':
      return 'font-sans uppercase tracking-wide'
    case 'inter':
    default:
      return 'font-sans'
  }
}

const getFrameStyle = (styling: HeroStyling): CSSProperties => ({
  border: `${styling.borderWidth}px solid ${styling.borderColor}`,
  boxShadow: `${styling.shadowOffset}px ${styling.shadowOffset}px 0 ${styling.shadowColor}`,
})

export const getSectionStyle = (styling: HeroStyling): CSSProperties => ({
  backgroundColor: styling.bgColor,
})

export const getContentPaddingStyle = (styling: HeroStyling): CSSProperties => ({
  ['--hero-pad-mobile' as string]: `${styling.paddingMobile}px`,
  ['--hero-pad-desktop' as string]: `${styling.paddingDesktop}px`,
})

export function HeroHeading({
  text,
  styling,
  className,
}: {
  text: string
  styling: HeroStyling
  className?: string
}) {
  return (
    <h1
      className={`text-4xl leading-tight md:text-6xl ${getHeadingClass(styling.headingFont)} ${className ?? ''}`}
      style={{ color: styling.headingColor }}
    >
      {text}
    </h1>
  )
}

export function HeroSubheading({
  text,
  styling,
  className,
}: {
  text?: string
  styling: HeroStyling
  className?: string
}) {
  if (!text) {
    return null
  }

  return (
    <p
      className={`text-lg md:text-xl ${className ?? ''}`}
      style={{ color: styling.subheadingColor }}
    >
      {text}
    </p>
  )
}

export function HeroActions({ cta }: Pick<HeroWrapperProps, 'cta'>) {
  return (
    <div className="flex flex-wrap gap-4">
      <Button asChild size="lg">
        <Link href={cta.primary.href} target={cta.primary.target}>
          {cta.primary.label}
        </Link>
      </Button>

      {cta.secondary ? (
        <Button asChild size="lg" variant="neutral">
          <Link href={cta.secondary.href} target={cta.secondary.target}>
            {cta.secondary.label}
          </Link>
        </Button>
      ) : null}
    </div>
  )
}

export function HeroHighlight({ highlighted }: Pick<HeroWrapperProps, 'highlighted'>) {
  if (!highlighted) {
    return null
  }

  return (
    <div className="inline-flex w-fit items-center rounded-base border-2 border-border bg-secondary-background px-3 py-1 text-xs font-medium uppercase tracking-wide text-foreground">
      Featured {highlighted.type}
    </div>
  )
}

export function HeroMedia({
  image,
  fallbackImage,
  heading,
  styling,
  className,
  priority = true,
}: Pick<HeroWrapperProps, 'image' | 'fallbackImage' | 'heading' | 'styling'> & {
  className?: string
  priority?: boolean
}) {
  const imageUrl = image?.url || fallbackImage

  if (!imageUrl) {
    return null
  }

  return (
    <div
      className={`relative w-full overflow-hidden rounded-base ${className ?? ''}`}
      style={getFrameStyle(styling)}
    >
      <Image
        src={imageUrl}
        alt={image?.alt || heading}
        fill
        className="object-cover"
        priority={priority}
      />
    </div>
  )
}
