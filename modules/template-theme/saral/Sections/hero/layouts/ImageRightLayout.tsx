import type { HeroWrapperProps } from '../types'
import {
  HeroActions,
  HeroHeading,
  HeroHighlight,
  HeroMedia,
  HeroSubheading,
  getContentPaddingStyle,
  getSectionStyle,
} from '../components/HeroCommon'

export function ImageRightLayout(props: HeroWrapperProps) {
  const { heading, subheading, image, fallbackImage, cta, styling, highlighted } = props

  return (
    <section className="w-full" style={getSectionStyle(styling)}>
      <div
        className="mx-auto grid max-w-7xl items-center gap-10 p-[var(--hero-pad-mobile)] md:grid-cols-2 md:p-[var(--hero-pad-desktop)]"
        style={getContentPaddingStyle(styling)}
      >
        <div className="space-y-6">
          <HeroHighlight highlighted={highlighted} />
          <HeroHeading text={heading} styling={styling} className="font-extrabold" />
          <HeroSubheading text={subheading} styling={styling} className="max-w-2xl" />
          <HeroActions cta={cta} />
        </div>

        <HeroMedia
          image={image}
          fallbackImage={fallbackImage}
          heading={heading}
          styling={styling}
          className="h-80 md:h-[28rem]"
        />
      </div>
    </section>
  )
}
