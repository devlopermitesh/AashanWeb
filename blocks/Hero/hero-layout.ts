export interface HeroWrapperProps {
  type: 'imageRight' | 'imageLeft' | 'centered' | 'imageOnly' | 'textOnly'
  heading: string
  subheading?: string
  image?: {
    url: string
    alt: string
  }
  fallbackImage?: string
  cta: {
    primary: {
      label: string
      href: string
      target: '_self' | '_blank'
    }
    secondary?: {
      label: string
      href: string
      target: '_self' | '_blank'
    }
  }
  styling: {
    bgColor: string
    headingColor: string
    subheadingColor: string
    headingFont: 'inter' | 'playfair' | 'bebas' | 'jetbrains'
    borderColor: string
    borderWidth: number
    shadowColor: string
    shadowOffset: number
    paddingMobile: number
    paddingDesktop: number
  }
  highlighted?: {
    type: 'product' | 'category'
    data: unknown
  }
}
export interface HeroSetting extends HeroWrapperProps {}

const toStringOrUndefined = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : undefined

const toNumberOrDefault = (value: unknown, fallback: number): number =>
  typeof value === 'number' ? value : fallback

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

export const normalizeHeroSettings = (value: Record<string, unknown>): HeroSetting => {
  const cta = isRecord(value.cta) ? value.cta : {}
  const primary = isRecord(cta.primary) ? cta.primary : {}
  const secondary = isRecord(cta.secondary) ? cta.secondary : undefined
  const styling = isRecord(value.styling) ? value.styling : {}
  const image = isRecord(value.image) ? value.image : undefined
  const highlighted = isRecord(value.highlightedContent) ? value.highlightedContent : undefined

  const layoutType = value.type
  const normalizedType: HeroSetting['type'] =
    layoutType === 'imageLeft' ||
    layoutType === 'centered' ||
    layoutType === 'imageOnly' ||
    layoutType === 'textOnly'
      ? layoutType
      : 'imageRight'

  return {
    type: normalizedType,
    heading: toStringOrUndefined(value.heading) ?? '',
    subheading: toStringOrUndefined(value.subheading),
    image:
      image && typeof image.url === 'string'
        ? {
            url: image.url,
            alt: toStringOrUndefined(image.alt) ?? '',
          }
        : undefined,
    fallbackImage: toStringOrUndefined(value.fallbackImage),
    cta: {
      primary: {
        label: toStringOrUndefined(primary.label) ?? 'Shop Now',
        href: toStringOrUndefined(primary.href) ?? '#',
        target: primary.target === '_blank' ? '_blank' : '_self',
      },
      secondary:
        secondary &&
        typeof secondary.label === 'string' &&
        typeof secondary.href === 'string' &&
        (secondary.target === '_self' || secondary.target === '_blank')
          ? {
              label: secondary.label,
              href: secondary.href,
              target: secondary.target,
            }
          : undefined,
    },
    styling: {
      bgColor: toStringOrUndefined(styling.bgColor) ?? '#FCD34D',
      headingColor: toStringOrUndefined(styling.headingColor) ?? '#000000',
      subheadingColor: toStringOrUndefined(styling.subheadingColor) ?? '#1F2937',
      headingFont:
        styling.headingFont === 'playfair' ||
        styling.headingFont === 'bebas' ||
        styling.headingFont === 'jetbrains'
          ? styling.headingFont
          : 'inter',
      borderColor: toStringOrUndefined(styling.borderColor) ?? '#000000',
      borderWidth: toNumberOrDefault(styling.borderWidth, 4),
      shadowColor: toStringOrUndefined(styling.shadowColor) ?? '#000000',
      shadowOffset: toNumberOrDefault(styling.shadowOffset, 8),
      paddingMobile: toNumberOrDefault(styling.paddingMobile, 32),
      paddingDesktop: toNumberOrDefault(styling.paddingDesktop, 80),
    },
    highlighted:
      highlighted && (highlighted.type === 'product' || highlighted.type === 'category')
        ? {
            type: highlighted.type,
            data: highlighted.product ?? highlighted.category ?? null,
          }
        : undefined,
  }
}
