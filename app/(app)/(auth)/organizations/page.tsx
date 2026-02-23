'use client'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const Page = () => {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoaded) return
    router.replace(user ? '/organizations/create-organization' : '/organizations/sign-up')
  }, [isLoaded, router, user])

  if (!isLoaded) {
    return null
  }

  return null
}
export default Page
