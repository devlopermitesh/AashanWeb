import { CollectionConfig } from 'payload'

const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
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
  ],
}
export default Categories
