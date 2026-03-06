export type NavbarLayout = 'left' | 'center' | 'split'

export interface NavbarLink {
  label: string
  href: string
  external?: boolean
}

export interface NavbarButton {
  label: string
  href: string
  variant?: 'primary' | 'secondary'
}

export interface NavbarSettings {
  layout: NavbarLayout
  logo?: {
    type: 'text' | 'image'
    value: string
  }
  links: NavbarLink[]
  categorieslink: NavbarLink[]
  showCTA?: boolean
  cta?: NavbarButton
  sticky?: boolean
}

const isNavbarLayout = (value: unknown): value is NavbarLayout =>
  value === 'left' || value === 'center' || value === 'split'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const toBoolean = (value: unknown): boolean | undefined =>
  typeof value === 'boolean' ? value : undefined

const toStringOrUndefined = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : undefined

const resolveCategoryPath = (category: Record<string, unknown>): string | undefined => {
  const categorySlug = toStringOrUndefined(category.slug)
  if (!categorySlug) {
    return undefined
  }

  const parent = category.parent
  if (!isRecord(parent)) {
    return categorySlug
  }

  const parentSlug = toStringOrUndefined(parent.slug)
  const grandparent = parent.parent
  const grandparentSlug = isRecord(grandparent) ? toStringOrUndefined(grandparent.slug) : undefined

  if (grandparentSlug && parentSlug) {
    return `${grandparentSlug}/${parentSlug}/${categorySlug}`
  }

  if (parentSlug) {
    return `${parentSlug}/${categorySlug}`
  }

  return categorySlug
}

const normalizeLogo = (value: unknown): NavbarSettings['logo'] | undefined => {
  if (!isRecord(value)) {
    return undefined
  }

  const type = value.type
  if (type !== 'text' && type !== 'image') {
    return undefined
  }

  if (type === 'text') {
    const text = toStringOrUndefined(value.text)
    return text ? { type: 'text', value: text } : undefined
  }

  const image = value['logo_image']

  if (!isRecord(image)) {
    return undefined
  }

  const cloudinary = isRecord(image.cloudinary) ? image.cloudinary : undefined
  const imageUrl =
    toStringOrUndefined(cloudinary?.secure_url) ||
    toStringOrUndefined(cloudinary?.url) ||
    toStringOrUndefined(image.url)

  return imageUrl ? { type: 'image', value: imageUrl } : undefined
}

const normalizeManualLinks = (value: unknown): NavbarSettings['links'] => {
  if (!isRecord(value)) {
    return []
  }

  const href = isRecord(value.href) ? value.href : undefined
  const rawLinks = href?.links
  if (!Array.isArray(rawLinks)) {
    return []
  }

  return rawLinks
    .filter((link): link is Record<string, unknown> => isRecord(link))
    .map((link) => ({
      label: toStringOrUndefined(link.label) ?? '',
      href: toStringOrUndefined(link.href) ?? '#',
      external: toBoolean(link.external),
    }))
    .filter((link) => link.label && link.href)
}

const normalizeCategoriesLinks = (value: unknown): NavbarSettings['categorieslink'] => {
  if (!isRecord(value)) {
    return []
  }

  const href = isRecord(value.href) ? value.href : undefined
  const rawCategories = href?.categorieslink

  if (!Array.isArray(rawCategories)) {
    return []
  }

  return rawCategories
    .filter((category): category is Record<string, unknown> => isRecord(category))
    .map((category) => {
      const label = toStringOrUndefined(category.name) ?? ''
      const path = resolveCategoryPath(category) ?? ''
      // Todo: update latter instead of explore Should move to perfect shopp categories colleciton page
      return {
        label,
        href: path ? `/explore/${path}` : '#',
      }
    })
    .filter((link) => link.label)
}

export const normalizeNavbarSettings = (value: Record<string, unknown>): NavbarSettings => ({
  layout: isNavbarLayout(value.layout) ? value.layout : 'left',
  links: normalizeManualLinks(value),
  categorieslink: normalizeCategoriesLinks(value),
  logo: normalizeLogo(value.logo),
  showCTA: toBoolean(value.showCTA),
  cta: isRecord(value.cta)
    ? {
        label: toStringOrUndefined(value.cta.label) ?? '',
        href: toStringOrUndefined(value.cta.href) ?? '',
        variant:
          value.cta.variant === 'primary' || value.cta.variant === 'secondary'
            ? value.cta.variant
            : undefined,
      }
    : undefined,
  sticky: toBoolean(value.sticky),
})
