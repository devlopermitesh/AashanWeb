import type { BasePayload } from 'payload'

const isGeneratingTypes = process.argv.includes('generate:types')

export const getAuthenticatedUser = async ({ payload }: { payload: BasePayload }) => {
  if (isGeneratingTypes) {
    return null
  }

  const { auth } = await import('@clerk/nextjs/server')
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  const existing = await payload.find({
    collection: 'users',
    where: {
      clerkUserId: {
        equals: userId,
      },
    },
    limit: 1,
  })

  return existing.docs[0] ?? null
}
