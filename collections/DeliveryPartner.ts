import { CollectionConfig } from 'payload'
import { isSuperAdmin } from './lib/access/isSuperAdmin'

export const DeliveryPartner: CollectionConfig = {
  slug: 'delivery-partners',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phoneNumber', 'branch', 'vehicleType', 'isVerified'],
  },
  access: {
    read: isSuperAdmin,
    create: isSuperAdmin,
    delete: isSuperAdmin,
    update: isSuperAdmin,
  },
  fields: [
    // ===== Basic Info =====
    {
      name: 'firstName',
      type: 'text',
      required: true,
      admin: { description: "Delivery partner's first name" },
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
      admin: { description: "Delivery partner's last name" },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'Full name (auto-generated or manual)' },
    },
    {
      name: 'phoneNumber',
      type: 'text',
      required: true,
      admin: { description: 'Contact number of the delivery partner' },
      validate: (value: unknown) => {
        if (typeof value !== 'string' || !/^\+?[0-9]{7,15}$/.test(value)) {
          return 'Enter a valid phone number'
        }
        return true
      },
    },

    // ===== Branch & Vehicle Info =====
    {
      name: 'branch',
      type: 'relationship',
      relationTo: 'branch',
      admin: {
        description: 'Branch under which this delivery partner operates',
      },
    },
    {
      name: 'vehicleType',
      type: 'select',
      options: [
        { label: 'Car', value: 'car' },
        { label: 'Bike', value: 'bike' },
        { label: 'Scooter', value: 'scooter' },
      ],
      required: true,
      admin: { description: 'Primary vehicle used for deliveries' },
    },

    // ===== Location Info =====
    {
      name: 'location',
      type: 'group',
      admin: { description: 'Current or default location of the delivery partner' },
      fields: [
        {
          name: 'type',
          type: 'text',
          defaultValue: 'Point',
          required: true,
          admin: { description: 'GeoJSON type, always Point' },
        },
        {
          name: 'coordinates',
          type: 'array',
          required: true,
          minRows: 2,
          maxRows: 2,
          fields: [
            {
              name: 'value',
              type: 'number',
            },
          ],
          admin: { description: '[longitude, latitude]' },
          validate: (values: unknown) => {
            if (!Array.isArray(values) || values.length !== 2) {
              return 'Coordinates must be an array of [longitude, latitude]'
            }
            const coords = values.map((entry) => {
              if (typeof entry === 'number') return entry
              if (entry && typeof entry === 'object' && 'value' in entry) {
                return (entry as { value?: unknown }).value
              }
              return undefined
            })
            if (!coords.every((v) => typeof v === 'number' && Number.isFinite(v))) {
              return 'Both coordinates must be numbers'
            }
            return true
          },
        },
      ],
    },

    // ===== Verification & Status =====
    {
      name: 'isVerified',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Has this delivery partner been verified for delivery acceptance?',
      },
    },
    {
      name: 'address',
      type: 'textarea',
      admin: { description: 'Full address of the delivery partner' },
    },

    // ===== Stripe Payment Info =====
    {
      name: 'stripeStatus',
      type: 'select',
      options: [
        { label: 'Not Connected', value: 'not-connected' },
        { label: 'Connected', value: 'connected' },
      ],
      defaultValue: 'not-connected',
      admin: { description: 'Stripe connection status for payment acceptance' },
    },
    {
      name: 'stripeId',
      type: 'text',
      admin: {
        description: 'Stripe account ID for payments',
        condition: (_data, siblingData) => siblingData?.stripeStatus === 'connected',
      },
    },
  ],
}
