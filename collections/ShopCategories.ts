import { CollectionConfig } from 'payload'
import { isAdminEnabledRoles } from './lib/access/isAdminEnabledRoles'
import { isSuperAdmin } from './lib/access/isSuperAdmin'

export const ShopCategories: CollectionConfig = {
  slug: 'shopcategories',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    create: isAdminEnabledRoles,
    update: isAdminEnabledRoles,
    delete: isAdminEnabledRoles,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'showonexplore',
      type: 'checkbox',
      defaultValue: true,
      access: {
        update: isSuperAdmin,
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      required: true,
      index: true,
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
  ],
}
