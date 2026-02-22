import type { CollectionConfig } from 'payload'
import { tenantsArrayField } from '@payloadcms/plugin-multi-tenant/fields'

export const defaultTennantArrayField = tenantsArrayField({
  tenantsArrayFieldName: 'shops',
  tenantsCollectionSlug: 'shops',
  tenantsArrayTenantFieldName: 'shop',
  arrayFieldAccess: {
    read: () => true,
    create: () => true,
    update: () => true,
  },
  tenantFieldAccess: {
    read: () => true,
    create: () => true,
    update: () => true,
  },
})
const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'clerkId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'firstName',
      type: 'text',
    },
    {
      name: 'lastName',
      type: 'text',
    },
    {
      name: 'profileImage',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      options: ['admin', 'super-admin'],
      defaultValue: 'admin',
      hasMany: true,
    },
    {
      ...defaultTennantArrayField,
      admin: {
        ...(defaultTennantArrayField?.admin || {}),
        position: 'sidebar',
      },
    },
  ],
}
export default Users
