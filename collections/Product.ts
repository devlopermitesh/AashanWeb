import { CollectionConfig } from 'payload'

export const Product: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      admin: {
        description: 'In Ruppes',
      },
      min: 0,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,

      hasMany: false,
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
    {
      name: 'medias',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'popularity',
      type: 'number',
      defaultValue: 0,
      index: true,
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
