'use client'

import { type ReactNode, useState } from 'react'
import { NavbarLink } from '@/blocks/navbar/navbar-layout'
import Navlinks from '../components/Navlinks'
import { Menu, X } from 'lucide-react'

interface NavbarWrapperProps {
  logo: ReactNode
  links?: NavbarLink[]
  ctaNode?: ReactNode
  children: ReactNode
}

export default function NavbarWrapper({ logo, links = [], ctaNode, children }: NavbarWrapperProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="max-w-7xl mx-auto px-6 py-4">
      <div className="flex items-center justify-between md:hidden">
        <div>{logo}</div>
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="rounded-md border px-3 py-1 text-sm font-medium"
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:block">{children}</div>

      {/* Mobile Menu */}
      {isMobileMenuOpen ? (
        <div className="mt-3 border-t pt-3 md:hidden">
          <Navlinks links={links} containerClassName="flex-col gap-3 items-start" />
          {ctaNode ? <div className="mt-3">{ctaNode}</div> : null}
        </div>
      ) : null}
    </div>
  )
}
