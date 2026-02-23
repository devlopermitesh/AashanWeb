import { checkRole } from '@/utils/roles'

export const isForbidden = () => {
  return checkRole([])
}
