import { SECTIONS_FONTS, SECTIONS_THEMES } from '@/config/theme/available'
import type { ShopTemplate, User } from '@/payload-types'
import type { CollectionConfig } from 'payload'

const getRelationId = (value: unknown): string | null => {
  if (typeof value === 'string') return value

  if (
    value &&
    typeof value === 'object' &&
    'id' in value &&
    typeof (value as { id?: unknown }).id === 'string'
  ) {
    return (value as { id: string }).id
  }

  return null
}

const getUserShopIds = (user: User | null | undefined): string[] => {
  if (!Array.isArray(user?.shops)) return []

  return user.shops
    .map((relation) => getRelationId(relation?.shop))
    .filter((shopId): shopId is string => Boolean(shopId))
}

const isSuperAdmin = (user: User | null | undefined): boolean =>
  Boolean(user?.roles?.includes('super-admin'))

const canAccessTemplateForShop = (user: User | null | undefined, shopValue: unknown): boolean => {
  if (!user) return false
  if (isSuperAdmin(user)) return true

  const shopId = getRelationId(shopValue)
  if (!shopId) return false

  return getUserShopIds(user).includes(shopId)
}

export const ShopTemplates: CollectionConfig = {
  slug: 'shop-templates',
  access: {
    read: ({ req }) => {
      const user = req.user as User | null | undefined
      if (!user) return false
      if (isSuperAdmin(user)) return true

      const shopIds = getUserShopIds(user)
      if (!shopIds.length) return false

      return {
        shop: {
          in: shopIds,
        },
      }
    },
    create: ({ req, data }) => {
      const user = req.user as User | null | undefined
      return canAccessTemplateForShop(user, data?.shop)
    },
    update: ({ req }) => {
      const user = req.user as User | null | undefined
      if (!user) return false
      if (isSuperAdmin(user)) return true

      const shopIds = getUserShopIds(user)
      if (!shopIds.length) return false

      return {
        shop: {
          in: shopIds,
        },
      }
    },
    delete: ({ req }) => {
      const user = req.user as User | null | undefined
      if (!user) return false
      if (isSuperAdmin(user)) return true

      const shopIds = getUserShopIds(user)
      if (!shopIds.length) return false

      return {
        shop: {
          in: shopIds,
        },
      }
    },
  },
  fields: [
    {
      name: 'shop',
      type: 'relationship',
      relationTo: 'shops',
      required: true,
      unique: true,
    },
    {
      name: 'baseTemplate',
      type: 'relationship',
      relationTo: 'templates',
      required: true,
    },
    {
      name: 'themeOverride',
      type: 'select',
      options: SECTIONS_THEMES,
      admin: {
        description: 'Optional: Override theme from base template',
      },
    },
    {
      name: 'fontOverride',
      type: 'select',
      options: SECTIONS_FONTS,
      admin: {
        description: 'Optional: Override font from base template',
      },
    },
    {
      name: 'sectionOverrides',
      type: 'array',
      fields: [
        {
          name: 'sectionId',
          type: 'text',
          required: true,
          validate: (value: string | string[] | null | undefined) => {
            if (typeof value !== 'string' || !value.trim()) {
              return 'Section ID is required'
            }
            return true
          },
        },
        {
          name: 'settings',
          type: 'json',
          admin: {
            description: 'Settings to override for this section',
          },
        },
        {
          name: 'disabled',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
      hooks: {
        beforeValidate: [
          async ({ value, siblingData, req }) => {
            if (!Array.isArray(value) || value.length === 0) return value

            const baseTemplateId = getRelationId(siblingData?.baseTemplate)
            if (!baseTemplateId) return value

            // Validate overrides against base template
            const baseTemplate = await req.payload.findByID({
              collection: 'templates',
              id: baseTemplateId,
              depth: 0,
            })

            const validSectionIds =
              baseTemplate.sections?.map(
                (section, index) => section.id ?? `${section.blockType}-${index}`
              ) || []

            for (const override of value as NonNullable<ShopTemplate['sectionOverrides']>) {
              if (typeof override?.sectionId !== 'string') continue

              if (!validSectionIds.includes(override.sectionId)) {
                throw new Error(`Section ID "${override.sectionId}" not in base template`)
              }
            }

            return value
          },
        ],
      },
    },
  ],
}
