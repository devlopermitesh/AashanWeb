import { checkRole } from '@/utils/roles'

export const isSuperAdmin = async () => {
  const isRole = await checkRole(['super-admin'])
  return isRole
}
