import type {
  AuthStrategy,
  AuthStrategyFunctionArgs,
  AuthStrategyResult,
  BasePayload,
} from 'payload'

// Only import Clerk when not generating types
const isGeneratingTypes = process.argv.includes('generate:types')

const getUser = async ({ payload }: { payload: BasePayload }) => {
  if (isGeneratingTypes) {
    return null
  }

  // Dynamic import to avoid issues during type generation
  const { auth } = await import('@clerk/nextjs/server')
  const { userId } = await auth()

  if (!userId) return null

  const existing = await payload.find({
    collection: 'users',
    where: {
      clerkUserId: {
        equals: userId,
      },
    },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    return existing.docs[0]
  }

  return null
}

const authenticate = async ({ payload }: AuthStrategyFunctionArgs): Promise<AuthStrategyResult> => {
  const user = await getUser({ payload })

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
