'use client'

import Logo from '@/components/Header/Logo'
import { Badge } from '@/components/ui/badge'
import { usePathname } from 'next/navigation'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const isOrganizationsRoute = pathname?.startsWith('/organizations')

  if (isOrganizationsRoute) {
    return <>{children}</>
  }

  const isSignUp = pathname?.includes('/sign-up')

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#fef08a_0%,#f9a8d4_45%,#93c5fd_100%)] px-4 py-8 sm:px-6 md:py-12">
      <div className="pointer-events-none absolute -left-12 top-12 h-28 w-28 rotate-6 border-2 border-black z-0 bg-cyan-300 shadow-[6px_6px_0_0_#000]" />
      <div className="pointer-events-none absolute -right-10 bottom-16 h-24 w-24 -rotate-12 border-2 border-black bg-lime-300 shadow-[6px_6px_0_0_#000]" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-8 md:grid-cols-[1.1fr_1fr] md:items-center">
        <div className="border-2 border-black bg-white p-6 shadow-[8px_8px_0_0_#000] md:p-10">
          <div className="mb-5 inline-flex h-12 w-12 items-center justify-center border-2 border-black bg-yellow-300 shadow-[3px_3px_0_0_#000] z-10">
            <Logo size="lg" className="z-10" />
          </div>
          <Badge className="mb-3 border-2 border-black bg-black px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white">
            Aashan Auth
          </Badge>
          <h1 className="text-3xl font-black uppercase leading-tight tracking-wide text-black md:text-4xl">
            {isSignUp ? 'Build your account' : 'Welcome back'}
          </h1>
          <p className="mt-3 text-sm font-medium text-black/75 md:text-base">
            Fast sign in for your workspace with a bold, focused onboarding flow.
          </p>
        </div>

        <div className="mx-auto w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}

export default AuthLayout
