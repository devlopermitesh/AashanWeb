import { Roles } from '@/types/global'

export const checkRole = async (roles: Roles[] | [] = []) => {
  const { auth } = await import('@clerk/nextjs/server')

  const { sessionClaims } = await auth()
  if (sessionClaims?.metadata.roles) {
    if (
      roles.some((checkrole) => {
        return sessionClaims.metadata.roles?.some((SessionRole) => {
          return SessionRole === checkrole
        })
      })
    ) {
      return true
    }
  }
  return false
}
