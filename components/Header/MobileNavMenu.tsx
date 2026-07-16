'use client'
import { SignedOut, useAuth, UserButton } from '@clerk/nextjs'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import LinkItem from './LinkItem'
import { routes } from './routes'
import Link from 'next/link'
import { LayoutDashboard, Store } from 'lucide-react'

const MobileNavMenu = ({ isOpen, close }: { isOpen: boolean; close: () => void }) => {
  const { userId, orgId, orgRole, orgSlug } = useAuth()
  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        !open ? close() : ''
      }}
    >
      <SheetTrigger className="w-0 h-0"></SheetTrigger>
      <SheetContent side="right" className="bg-white">
        <SheetHeader>
          <SheetTitle>Menu </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-4">
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
                    label="My Shop"
                    labelIcon={<Store />}
                    href={`/shops/${orgSlug}`}
                  />

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
      </SheetContent>
    </Sheet>
  )
}
export default MobileNavMenu
