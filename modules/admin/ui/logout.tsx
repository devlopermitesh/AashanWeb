'use client'
import { useClerk } from '@clerk/nextjs'
import Link from 'next/link'

interface logoutProps {
  className?: string
}
export const LogoutBtn = ({ className }: logoutProps) => {
  const { signOut } = useClerk()
  return (
    <Link
      href={'/'}
      className={className}
      onClick={async () => await signOut({ redirectUrl: '/' })}
    >
      Logout
    </Link>
  )
}
