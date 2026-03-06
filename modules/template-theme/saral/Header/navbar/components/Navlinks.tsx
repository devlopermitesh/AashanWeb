import { NavbarLink } from '@/blocks/navbar/navbar-layout'
import Link from 'next/link'

interface NavlinksProps {
  links?: NavbarLink[]
  containerClassName?: string
  linkClassName?: string
}

const MAX_NAV_LINKS = 5
const hasProtocol = (url: string) => /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url)

const normalizeExternalHref = (href: string) => (hasProtocol(href) ? href : `https://${href}`)

const Navlinks = ({ links = [], containerClassName = '', linkClassName = '' }: NavlinksProps) => {
  const visibleLinks = links.slice(0, MAX_NAV_LINKS)
  if (!visibleLinks.length) {
    return null
  }

  const finalContainerClass = `flex gap-6 ${containerClassName}`.trim()
  const finalLinkClass =
    `text-sm font-medium transition-opacity hover:opacity-70 ${linkClassName}`.trim()

  return (
    <div className={finalContainerClass}>
      {visibleLinks.map((link) =>
        link.external ? (
          <a
            key={`${link.label}-${link.href}`}
            href={normalizeExternalHref(link.href)}
            target="_blank"
            rel="noopener noreferrer"
            className={finalLinkClass}
          >
            {link.label}
          </a>
        ) : (
          <Link key={`${link.label}-${link.href}`} href={link.href} className={finalLinkClass}>
            {link.label}
          </Link>
        )
      )}
    </div>
  )
}

export default Navlinks
