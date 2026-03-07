import { CollectionConfig } from 'payload'
import { isSuperAdmin } from './lib/access/isSuperAdmin'
import { SECTIONS_FONTS, SECTIONS_THEMES } from '@/config/theme/available'
import { isAdminEnabledRoles } from './lib/access/isAdminEnabledRoles'
import { NavbarBlock } from '@/blocks/navbar/navbar.block'
import { HeroBlock } from '@/blocks/Hero/hero-block'
import { ProductGridBlock } from '@/blocks/productGrid/product-block'

export const Templates: CollectionConfig = {
  slug: 'templates',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'plan'],
  },
  access: {
    read: () => true,
    create: isSuperAdmin,
    update: isSuperAdmin,
    delete: isSuperAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    //plan reference
    {
      name: 'plan',
      type: 'relationship',
      relationTo: 'plans',
      required: true,
      access: {
        update: isSuperAdmin,
      },
    },
    //Defaults theme
    {
      name: 'themePreset',
      type: 'select',
      hasMany: false,
      required: true,
      options: SECTIONS_THEMES,
    },

    //Defaults fonts
    {
      name: 'fontPreset',
      type: 'select',
      hasMany: false,
      required: true,
      options: SECTIONS_FONTS,
    },
    //Limits
    {
      name: 'isDefault',
      type: 'checkbox',
      defaultValue: false,
    },
    // 🧱  Sections
    {
      name: 'sections',
      type: 'blocks',
      required: true,
      minRows: 1,
      blocks: [NavbarBlock, HeroBlock, ProductGridBlock],
      admin: {
        description: 'Template sections. Add one or more blocks (currently navbar).',
      },
      access: {
        update: isSuperAdmin,
      },
    },
  ],
}
