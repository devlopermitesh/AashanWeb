import type {
  CollectionBeforeValidateHook,
  CollectionBeforeChangeHook,
  CollectionConfig,
} from 'payload'

const toSafeNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
  }

  return undefined
}

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const normalizeProductData: CollectionBeforeValidateHook = ({ data }) => {
  if (!data || typeof data !== 'object') {
    return data
  }

  const nextData = { ...(data as Record<string, unknown>) }

  const name = typeof nextData.name === 'string' ? nextData.name.trim() : ''
  const legacyTitle = typeof nextData.title === 'string' ? nextData.title.trim() : ''

  if (!name && legacyTitle) {
    nextData.name = legacyTitle
  } else if (name) {
    nextData.name = name
  }

  const slugSource =
    typeof nextData.slug === 'string' && nextData.slug.trim()
      ? nextData.slug
      : (nextData.name as string | undefined) || legacyTitle

  if (typeof slugSource === 'string' && slugSource.trim()) {
    nextData.slug = slugify(slugSource)
  }

  const price = toSafeNumber(nextData.price)
  const originalPrice = toSafeNumber(nextData.originalPrice)
  const legacyOriginalPrice = toSafeNumber(nextData.orginalprice)
  const availableStockCount = toSafeNumber(nextData.availableStockCount)

  if (originalPrice === undefined && legacyOriginalPrice !== undefined) {
    nextData.originalPrice = legacyOriginalPrice
  }

  if (toSafeNumber(nextData.originalPrice) === undefined && price !== undefined) {
    nextData.originalPrice = price
  }

  const resolvedOriginalPrice = toSafeNumber(nextData.originalPrice)
  if (price !== undefined && resolvedOriginalPrice !== undefined) {
    nextData.onSale = resolvedOriginalPrice > price
  }

  if (availableStockCount !== undefined) {
    nextData.inStock = availableStockCount > 0
  }

  return nextData
}

const syncPopularityFromSales: CollectionBeforeChangeHook = ({ data }) => {
  if (!data || typeof data !== 'object') {
    return data
  }

  const nextData = { ...(data as Record<string, unknown>) }
  const sales = toSafeNumber(nextData.sales)
  const reviewCount = toSafeNumber(nextData.reviewCount)

  if (sales !== undefined || reviewCount !== undefined) {
    nextData.popularity = (sales || 0) + Math.round((reviewCount || 0) * 0.2)
  }

  return nextData
}

export const Product: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'category', 'inStock', 'featured', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeValidate: [normalizeProductData],
    beforeChange: [syncPopularityFromSales],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      required: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Auto-generated from name when empty.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'medias',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      admin: {
        description: 'Default gallery media for this product.',
      },
    },
    {
      name: 'hasManyColors',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Enable if product media changes by color.',
      },
    },
    {
      name: 'mediaVariants',
      type: 'array',
      admin: {
        condition: (_, siblingData) =>
          Boolean((siblingData as { hasManyColors?: boolean } | undefined)?.hasManyColors),
        description: 'Use when each color has a dedicated image.',
      },
      fields: [
        {
          name: 'colorName',
          type: 'text',
          required: true,
        },
        {
          name: 'colorCode',
          type: 'text',
          required: true,
          validate: (value: unknown) => {
            if (typeof value !== 'string') return 'Color code is required'
            return /^#([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/.test(value)
              ? true
              : 'Use a valid hex color (e.g. #111111)'
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Current selling price in rupees.',
      },
    },
    {
      name: 'originalPrice',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'MRP in rupees. Used to compute sale badges.',
      },
      validate: (value: unknown, { siblingData }: { siblingData?: Record<string, unknown> }) => {
        const nextOriginalPrice = toSafeNumber(value)
        const nextPrice = toSafeNumber((siblingData as Record<string, unknown>)?.price)
        // if any one field is empty skip validation for tempory
        if (nextOriginalPrice === undefined || nextPrice === undefined) {
          return true
        }

        return nextOriginalPrice >= nextPrice
          ? true
          : 'Original price must be greater than or equal to price.'
      },
    },
    {
      name: 'rating',
      type: 'number',
      min: 0,
      max: 5,
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'reviewCount',
      type: 'number',
      min: 0,
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'availableStockCount',
      type: 'number',
      min: 0,
      defaultValue: 0,
      admin: {
        description: 'If 0, product is automatically marked out of stock.',
      },
    },
    {
      name: 'inStock',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'onSale',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'isNewProduct',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sales',
      type: 'number',
      min: 0,
      defaultValue: 0,
      admin: {
        description: 'Total units sold.',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'shopcategories',
      required: true,
      hasMany: false,
      index: true,
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
    {
      name: 'popularity',
      type: 'number',
      defaultValue: 0,
      min: 0,
      index: true,
      admin: {
        readOnly: true,
        description: 'Derived from sales and review volume.',
      },
    },
    {
      name: 'refundpolicy',
      type: 'select',
      defaultValue: '30-days',
      options: [
        { label: '30 Days', value: '30-days' },
        { label: '15 Days', value: '15-days' },
        { label: '10 Days', value: '10-days' },
        { label: '5 Days', value: '5-days' },
      ],
    },
  ],
}
