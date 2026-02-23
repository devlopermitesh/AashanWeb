import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
type Roles = 'org:shop_owner' | 'user' | 'super-admin'

const isAdminProtectedRoute = createRouteMatcher(['/admin(.*)'])
export default clerkMiddleware(async (auth, req) => {
  if (!isAdminProtectedRoute(req)) return

  const { userId, orgId, orgRole, sessionClaims } = await auth()
  if (!userId) {
    const signURL = new URL('/sign-in', req.url)
    return NextResponse.redirect(signURL)
  }

  // If user has an active organization and is author in it, allow /admin.
  if (orgId && orgRole === 'org:shop_owner') return
  // Otherwise fall back to global role check.
  const roles = (sessionClaims?.['metadata'] as { roles?: Roles[] } | undefined)?.roles
  const isSuperAdmin = hasRole(roles, 'super-admin')

  if (!isSuperAdmin) {
    const unauthorizedURL = new URL('/unauthorized', req.url)
    return NextResponse.redirect(unauthorizedURL)
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
function hasRole(roles: Roles[] | undefined, role: Roles) {
  return roles?.includes(role) ?? false
}
