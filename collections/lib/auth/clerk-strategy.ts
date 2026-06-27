import type { AuthStrategy, AuthStrategyFunctionArgs, AuthStrategyResult } from 'payload'
import { getAuthenticatedUser } from './get-authenticated-user'

const authenticate = async ({ payload }: AuthStrategyFunctionArgs): Promise<AuthStrategyResult> => {
  const user = await getAuthenticatedUser({ payload })

  if (!user) {
    return { user: null }
  }

  return {
    user,
  }
}

export const ClerkStrategy: AuthStrategy = {
  name: 'clerk-auth',
  authenticate,
}
