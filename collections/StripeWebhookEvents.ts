import type { CollectionConfig } from 'payload'

const StripeWebhookEvents: CollectionConfig = {
  slug: 'stripeWebhookEvents',
  admin: {
    useAsTitle: 'eventId',
    defaultColumns: ['eventId', 'type', 'livemode', 'processedAt'],
  },
  access: {
    read: () => false,
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'eventId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'type',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'stripeObjectId',
      type: 'text',
      index: true,
    },
    {
      name: 'livemode',
      type: 'checkbox',
      defaultValue: false,
      index: true,
    },
    {
      name: 'processedAt',
      type: 'date',
      required: true,
      index: true,
    },
  ],
}

export default StripeWebhookEvents
