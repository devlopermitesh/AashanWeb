import { NavbarSectionProps } from '../types'
import Navlinks from '../components/Navlinks'
import NavbarWrapper from './NavbarWrapper'
import CTAButton from '../components/CTAButton'

export default function LeftLayout({ logo, links, showCTA, cta }: NavbarSectionProps) {
  const logoNode = (() => {
    if (logo?.type === 'image' && logo.value) {
      return <img src={logo.value} alt="logo" className="h-8 max-h-12 w-auto object-fill" />
    }

    if (logo?.type === 'text' && logo.value) {
      return <span className="font-bold text-lg">{logo.value}</span>
    }

    return <span className="font-bold text-lg">Store</span>
  })()
  const shouldShowCTA = Boolean(showCTA && cta?.label)
  const ctaNode = shouldShowCTA && cta ? <CTAButton cta={cta} /> : null

  return (
    <NavbarWrapper logo={logoNode} links={links} ctaNode={ctaNode}>
      <div className="flex items-center justify-between gap-4">
        <div>{logoNode}</div>
        <div className="flex items-center gap-4">
          <Navlinks links={links} containerClassName="flex-wrap items-center" />
          {ctaNode}
        </div>
      </div>
    </NavbarWrapper>
  )
}
