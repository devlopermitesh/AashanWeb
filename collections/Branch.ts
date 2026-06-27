import { CollectionConfig } from 'payload'
import { isSuperAdmin } from './lib/access/isSuperAdmin'
export const Branch: CollectionConfig = {
  slug: 'branch',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'isActive', 'address'],
  },
  access: {
    read: isSuperAdmin,
    create: isSuperAdmin,
    update: isSuperAdmin,
    delete: isSuperAdmin,
  },
  fields: [
    // ===== Basic Info =====
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'Branch name' },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Whether this branch is active' },
    },
    {
      name: 'address',
      type: 'textarea',
      required: true,
      admin: { description: 'Full address of the branch' },
    },

    // ===== Delivery Partners =====
    {
      name: 'deliveryPartners',
      type: 'relationship',
      relationTo: 'delivery-partners',
      hasMany: true,
      admin: {
        description: 'Delivery partners associated with this branch',
      },
    },

    // ===== Location =====
    {
      name: 'location',
      type: 'group',
      admin: { description: 'Geo location of the branch' },
      fields: [
        {
          name: 'type',
          type: 'text',
          defaultValue: 'Point',
          required: true,
          access: {
            update: () => false,
          },
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
          admin: {
            description: '[longitude, latitude]',
            components: {
              Field: '@/modules/admin/ui/AddressPicker/AddressField#AddressField',
            },
            custom: {
              addressPath: 'address',
            },
          },
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
  ],
}
