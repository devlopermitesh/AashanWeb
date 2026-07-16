import { CollectionConfig } from 'payload'

export const OrderCounter: CollectionConfig = {
  slug: 'order-counter',

  admin: {
    hidden: true, // admin UI me completely hide
  },

  access: {
    read: () => false,
    create: () => false,
    update: () => false,
    delete: () => false,
  },

  fields: [
    {
      name: 'value',
      type: 'number',
      required: true,
    },
  ],
}
