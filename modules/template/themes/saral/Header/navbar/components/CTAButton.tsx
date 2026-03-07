import Link from 'next/link'
import { NavbarButton } from '@/blocks/navbar/navbar-layout'

interface CTAButtonProps {
  cta: NavbarButton
}

const hasProtocol = (url: string) => /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url)

const normalizeHref = (href: string) => {
  if (!href) {
    return '#'
  }

  return hasProtocol(href) ? href : href.startsWith('/') ? href : `https://${href}`
}

export default function CTAButton({ cta }: CTAButtonProps) {
  const href = normalizeHref(cta.href)
  const baseClass =
    'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-85'
  const variantClass =
    cta.variant === 'secondary'
      ? 'border border-current bg-transparent'
      : 'bg-black text-white dark:bg-white dark:text-black'
  const className = `${baseClass} ${variantClass}`

  if (hasProtocol(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {cta.label}
      </a>
    )
  }

  return (
    <Link href={href} className={className}>
      {cta.label}
    </Link>
  )
}
