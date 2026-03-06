import { CollectionConfig } from 'payload'
import type { CollectionBeforeChangeHook } from 'payload'

const assignDefaultTemplate: CollectionBeforeChangeHook = async ({ data, req, operation }) => {
  // sirf create pe
  if (operation !== 'create') return data

  // agar already diya hai (super-admin case)
  if (data?.template) return data

  // default FREE plan uthao
  const defaultFreePlan = await req.payload.find({
    collection: 'plans',
    where: {
      isDefault: { equals: true },
      category: { equals: 'free' },
    },
    limit: 1,
    depth: 0,
  })

  if (!defaultFreePlan.docs.length) {
    throw new Error('No default free plan found')
  }

  // us plan ka koi template uthao
  const defaultTemplate = await req.payload.find({
    collection: 'templates',
    where: {
      plan: { equals: defaultFreePlan.docs[0].id },
    },
    limit: 1,
    depth: 0,
  })

  if (!defaultTemplate.docs.length) {
    throw new Error('No template found for default free plan')
  }

  return {
    ...(data || {}),
    template: defaultTemplate.docs[0].id,
  }
}
const Shops: CollectionConfig = {
  slug: 'shops',
  hooks: {
    beforeChange: [assignDefaultTemplate],
  },
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
    //active templates
    {
      name: 'template',
      type: 'relationship',
      relationTo: 'templates',
    },
  ],
}

export default Shops
