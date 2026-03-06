import { SECTION_OPTIONS } from '@/config'
import { SECTIONS_FONTS, SECTIONS_THEMES } from '@/config/theme/available'
import { CollectionConfig } from 'payload'
import { isSuperAdmin } from './lib/access/isSuperAdmin'

export const Plans: CollectionConfig = {
  slug: 'plans',
  admin: {
    useAsTitle: 'name',
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
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Free', value: 'free' },
        { label: 'Paid', value: 'paid' },
      ],
    },

    //Features
    //select  sections
    {
      name: 'allowedSections',
      type: 'select',
      hasMany: true,
      options: SECTION_OPTIONS,
      required: true,
    },
    {
      name: 'allowedThemes',
      type: 'select',
      hasMany: true,
      options: SECTIONS_THEMES,
      required: true,
    },
    {
      name: 'allowedFonts',
      type: 'select',
      hasMany: true,
      options: SECTIONS_FONTS,
      required: true,
    },
    //Limits
    {
      name: 'maxproducts',
      type: 'number',
      defaultValue: 50,
    },
    {
      name: 'navlinksactivate',
      type: 'checkbox',
      defaultValue: false,
    },
    //Limits
    {
      name: 'isDefault',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
