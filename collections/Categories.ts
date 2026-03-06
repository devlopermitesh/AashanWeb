import { CollectionConfig } from 'payload'
import { isSuperAdmin } from './lib/access/isSuperAdmin'

const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
  },
  access: {
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
      unique: true,
      required: true,
      index: true,
    },
    {
      name: 'color',
      type: 'text',
      defaultValue: '#ffffff',
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
    },
    {
      name: 'subcategories',
      type: 'join',
      collection: 'categories',
      on: 'parent',
    },
    {
      name: 'shopSubcategories',
      type: 'join',
      collection: 'shopcategories',
      on: 'parent',
    },
  ],
}
export default Categories
