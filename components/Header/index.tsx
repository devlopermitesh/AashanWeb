'use client'

import { useState } from 'react'
import { LayoutDashboard, Menu, X } from 'lucide-react'
import Logo from './Logo'
import { routes } from './routes'
import LinkItem from './LinkItem'
import MobileNavMenu from './MobileNavMenu'
import { SignedOut, useAuth, UserButton } from '@clerk/nextjs'
import Link from 'next/link'

const Header = () => {
  const [open, setOpen] = useState(false)
  const { userId, orgId, orgRole } = useAuth()
  console.log('organizationrole', orgRole)
  return (
    <header className="w-full bg-white border-b">
      <div className="flex items-center justify-between h-16 ps-4 px-1 sm:max-w-7xl lg:max-w-full mx-auto">
        {/* Logo */}
        <Logo size="md" />

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 h-full">
          {routes.map((route) => (
            <LinkItem key={route.link} {...route} />
          ))}
          <SignedOut>
            <Link href={'/sign-in'}>
              <button className="h-full px-6 flex items-center font-medium border-l border-r">
                Login
              </button>
            </Link>
          </SignedOut>

          {userId && orgId && orgRole ? (
            <>
              <UserButton showName>
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="Dashboard"
                    labelIcon={<LayoutDashboard />}
                    href="/admin"
                  />
                </UserButton.MenuItems>
              </UserButton>
            </>
          ) : (
            <Link
              href={'/organizations/'}
              className="h-full  px-6 flex items-center bg-black text-white"
            >
              <button>Start Selling Online</button>
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && <MobileNavMenu close={() => setOpen(false)} isOpen={open} />}
    </header>
  )
}

export default Header
