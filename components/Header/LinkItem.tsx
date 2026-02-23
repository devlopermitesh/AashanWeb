import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface LinkItemProps {
  title: string
  link: string
  icon: LucideIcon
}

const LinkItem = ({ icon: Icon, link, title }: LinkItemProps) => {
  const pathname = usePathname()
  const isActive = pathname === link
  return (
    <Link
      href={link}
      className={cn(
        'flex items-center gap-2 font-sans text-md text-black font-medium font-robot',
        isActive && 'bg-black text-white  rounded-full px-4 '
      )}
    >
      <Icon size={18} className="sm:hidden" />
      {title}
    </Link>
  )
}

export default LinkItem
