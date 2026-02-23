'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Library, MoveLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-100 via-white to-amber-200 px-6 py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(251,146,60,0.25),transparent_40%),radial-gradient(circle_at_85%_25%,rgba(245,158,11,0.2),transparent_45%),radial-gradient(circle_at_50%_80%,rgba(252,211,77,0.2),transparent_50%)]" />

      <section className="relative mx-auto flex max-w-2xl flex-col rounded-3xl border border-orange-200/60 bg-white/85 p-8 shadow-2xl backdrop-blur md:p-10">
        <div className="mb-6 flex items-center gap-3 text-orange-700">
          <AlertTriangle className="size-6" />
          <p className="text-sm font-semibold tracking-[0.08em] uppercase">Access Restricted</p>
        </div>

        <h1 className="text-balance text-3xl leading-tight font-bold text-zinc-900 md:text-4xl">
          You are not authorized because no Shop is linked to your account yet.
        </h1>

        <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-700">
          Create your Shop to continue, or go back to the previous page.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="sm:min-w-48">
            <Link href="/organizations">
              <Library className="size-4" />
              Create Library
            </Link>
          </Button>

          <Button size="lg" variant="neutral" onClick={() => router.back()} className="sm:min-w-40">
            <MoveLeft className="size-4" />
            Go Back
          </Button>
        </div>
      </section>
    </main>
  )
}
