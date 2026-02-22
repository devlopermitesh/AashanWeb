import { CollectionConfig } from 'payload'

const Shops: CollectionConfig = {
  slug: 'shops',

  admin: {
    useAsTitle: 'name',
  },
  fields: [
    /* =========
       CORE
    ========= */
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
      admin: {
        description: 'Used for subdomain (eg: [slug].aashan.com)',
      },
    },

    /* =========
       BRANDING
    ========= */
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },

    /* =========
       BILLING
    ========= */
    {
      name: 'stripeAccountId',
      type: 'text',
      unique: true,
      admin: {
        description: 'Stripe connected account ID',
      },
    },
    {
      name: 'paymentsActivated',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Stripe payments activation status',
      },
    },

    /* =========
       OPTIONAL FLAGS
    ========= */
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Disable shop without deleting it',
      },
    },
  ],
}

export default Shops
