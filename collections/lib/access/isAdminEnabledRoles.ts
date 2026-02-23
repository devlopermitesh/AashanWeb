import { checkRole } from '@/utils/roles'

export const isAdminEnabledRoles = async () => {
  const isRole = await checkRole(['super-admin', 'org:shop_owner'])
  return isRole
}
