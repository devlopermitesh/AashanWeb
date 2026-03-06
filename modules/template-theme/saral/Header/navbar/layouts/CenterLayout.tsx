import { NavbarSectionProps } from '../types'
import Navlinks from '../components/Navlinks'
import NavbarWrapper from './NavbarWrapper'
import CTAButton from '../components/CTAButton'

export default function CenterLayout({ logo, links, showCTA, cta }: NavbarSectionProps) {
  const logoNode = (() => {
    if (logo?.type === 'image' && logo.value) {
      return <img src={logo.value} alt="logo" className="h-8 w-auto" />
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
      <div className="flex flex-col items-center gap-3">
        {logoNode}
        <Navlinks links={links} containerClassName="items-center justify-center flex-wrap" />
        {ctaNode}
      </div>
    </NavbarWrapper>
  )
}
