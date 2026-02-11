"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import Logo from "./Logo"
import { routes } from "./routes"
import LinkItem from "./LinkItem"
import MobileNavMenu from "./MobileNavMenu"

const Header = () => {
  const [open, setOpen] = useState(false)

  return (
    <header className="w-full bg-white border-b">
      <div className="flex items-center justify-between h-16 px-4 sm:max-w-7xl lg:max-w-full mx-auto">

        {/* Logo */}
        <Logo size="md" />

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 h-full">
          {routes.map((route) => (
            <LinkItem key={route.link} {...route} />
          ))}

          <button className="h-full px-6 flex items-center font-medium border-l border-r">
            Login
          </button>

          <button className="h-full px-6 flex items-center bg-black text-white">
            Start Free
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (      
        <MobileNavMenu close={()=>setOpen(false)} isOpen={open}/>
      )}
    </header>
  )
}

export default Header
