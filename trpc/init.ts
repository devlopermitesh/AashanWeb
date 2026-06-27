// trpc/init.ts
import { getAuthenticatedUser } from '@/collections/lib/auth/get-authenticated-user'
import { getPayloadClient } from '@/collections/lib/payload'
import { cookies, headers } from 'next/headers'
import 'server-only'

export const createTRPCContext = async () => {
  const headersList = await headers()
  const cookieStore = await cookies()
  const payload = await getPayloadClient()
  const user = await getAuthenticatedUser({ payload })

  return {
    db: payload,
    headers: headersList,
    cookies: cookieStore,
    user,
  }
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>
