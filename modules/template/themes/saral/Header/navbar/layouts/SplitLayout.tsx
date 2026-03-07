import { NavbarSectionProps } from '../types'
import Navlinks from '../components/Navlinks'
import NavbarWrapper from './NavbarWrapper'
import CTAButton from '../components/CTAButton'

export default function SplitLayout({ logo, links, showCTA, cta }: NavbarSectionProps) {
  const logoNode = (() => {
    if (logo?.type === 'image' && logo.value) {
      return <img src={logo.value} alt="logo" className="h-8 w-auto" />
    }

    if (logo?.type === 'text' && logo.value) {
      return <span className="font-bold text-lg">{logo.value}</span>
    }

    return <span className="font-bold text-lg">Store</span>
  })()

  const safeLinks = links || []
  const middleIndex = Math.ceil(safeLinks.length / 2)
  const leftLinks = safeLinks.slice(0, middleIndex)
  const rightLinks = safeLinks.slice(middleIndex)
  const shouldShowCTA = Boolean(showCTA && cta?.label)
  const ctaNode = shouldShowCTA && cta ? <CTAButton cta={cta} /> : null

  return (
    <NavbarWrapper logo={logoNode} links={links} ctaNode={ctaNode}>
      <div className="grid grid-cols-3 items-center gap-4">
        <Navlinks links={leftLinks} containerClassName="justify-start flex-wrap" />
        <div className="flex justify-center">{logoNode}</div>
        <div className="flex items-center justify-end gap-4">
          <Navlinks links={rightLinks} containerClassName="justify-end flex-wrap" />
          {ctaNode}
        </div>
      </div>
    </NavbarWrapper>
  )
}
