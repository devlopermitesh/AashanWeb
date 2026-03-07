import type { CSSProperties, ComponentType } from 'react'
import { NavbarSectionProps } from './types'
import CenterLayout from './layouts/CenterLayout'
import SplitLayout from './layouts/SplitLayout'
import LeftLayout from './layouts/LeftLayout'

const MAX_NAV_LINKS = 5

const mergeNavbarLinks = (
  links: NavbarSectionProps['links'],
  categorieslink?: NavbarSectionProps['categorieslink']
) => {
  const combined = [...(links ?? []), ...(categorieslink ?? [])]
  const seen = new Set<string>()

  return combined.filter((link) => {
    const key = `${link.label}::${link.href}`
    if (seen.has(key)) {
      return false
    }

    seen.add(key)
    return Boolean(link.label && link.href)
  })
}

export default function NavbarSection(props: NavbarSectionProps) {
  const { layout, sticky, links, categorieslink } = props
  const style: CSSProperties = {
    backgroundColor: '#ffffff',
    color: '#000000',
  }
  const mergedLinks = mergeNavbarLinks(links, categorieslink).slice(0, MAX_NAV_LINKS)

  const className = `
    w-full 
    ${sticky ? 'sticky top-0 z-50' : ''}
  `
  //layoutComponent is reusable for any layout
  let LayoutComponent: ComponentType<NavbarSectionProps>

  switch (layout) {
    case 'center':
      LayoutComponent = CenterLayout
      break
    case 'split':
      LayoutComponent = SplitLayout
      break
    default:
      LayoutComponent = LeftLayout
  }

  return (
    <nav style={style} className={className}>
      <LayoutComponent {...props} links={mergedLinks} />
    </nav>
  )
}
