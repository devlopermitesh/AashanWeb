import type { HeroWrapperProps } from '../types'
import {
  HeroActions,
  HeroHeading,
  HeroSubheading,
  getContentPaddingStyle,
  getSectionStyle,
} from '../components/HeroCommon'

export function TextOnlyLayout(props: HeroWrapperProps) {
  const { heading, subheading, cta, styling } = props

  return (
    <section className="w-full" style={getSectionStyle(styling)}>
      <div
        className="mx-auto max-w-4xl space-y-8 p-[var(--hero-pad-mobile)] md:p-[var(--hero-pad-desktop)]"
        style={getContentPaddingStyle(styling)}
      >
        <HeroHeading text={heading} styling={styling} className="font-extrabold" />
        <HeroSubheading text={subheading} styling={styling} className="max-w-2xl" />
        <HeroActions cta={cta} />
      </div>
    </section>
  )
}
