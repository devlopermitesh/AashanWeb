import { CollectionConfig } from 'payload'

const Shops: CollectionConfig = {
  slug: 'shops',

  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,

    create: () => false,
    update: ({ req: { user } }) => {
      return !!user &&
        (user.roles?.includes('org:shop_owner') || user.roles?.includes('super-admin'))
        ? true
        : false
    },
    delete: ({ req: { user } }) => {
      return !!user &&
        (user.roles?.includes('org:shop_owner') || user.roles?.includes('super-admin'))
        ? true
        : false
    },
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

    {
      name: 'organizationId',
      type: 'text',
      required: true,
      unique: true,
    },
    /* =========
       BRANDING
    ========= */
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
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
