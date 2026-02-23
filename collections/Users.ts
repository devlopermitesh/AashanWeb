import type { CollectionConfig } from 'payload'
import { tenantsArrayField } from '@payloadcms/plugin-multi-tenant/fields'
import { isSuperAdmin } from './lib/access/isSuperAdmin'
import { isForbidden } from './lib/access/isForbidden'
import { isAdminEnabledRoles } from './lib/access/isAdminEnabledRoles'
import { ClerkStrategy } from './lib/auth/clerk-strategy'

export const defaultTennantArrayField = tenantsArrayField({
  tenantsArrayFieldName: 'shops',
  tenantsCollectionSlug: 'shops',
  tenantsArrayTenantFieldName: 'shop',
  arrayFieldAccess: {
    read: () => true,
    create: isSuperAdmin,
    update: isSuperAdmin,
  },

  tenantFieldAccess: {
    read: () => true,
    create: isSuperAdmin,
    update: isSuperAdmin,
  },
})
const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    disableLocalStrategy: true,
    strategies: [ClerkStrategy],
  },
  access: {
    read: () => true,
    create: isForbidden,
    update: isForbidden,
    delete: isForbidden,
    admin: isAdminEnabledRoles,
    unlock: isForbidden,
    readVersions: isForbidden,
  },
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'clerkUserId',
      label: 'Clerk userId',
      type: 'text',
      unique: true,
      required: true,
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
      name: 'roles',
      type: 'select',
      options: ['org:shop_owner', 'super-admin', 'user'],
      hasMany: true,
      defaultValue: 'user',
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
