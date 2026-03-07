import type { HeroWrapperProps } from '../types'
import {
  HeroActions,
  HeroHeading,
  HeroMedia,
  HeroSubheading,
  getContentPaddingStyle,
  getSectionStyle,
} from '../components/HeroCommon'

export function CenterLayout(props: HeroWrapperProps) {
  const { heading, subheading, image, fallbackImage, cta, styling } = props

  return (
    <section className="w-full" style={getSectionStyle(styling)}>
      <div
        className="mx-auto max-w-6xl space-y-10 p-[var(--hero-pad-mobile)] text-center md:p-[var(--hero-pad-desktop)]"
        style={getContentPaddingStyle(styling)}
      >
        <div className="space-y-6">
          <HeroHeading text={heading} styling={styling} className="font-extrabold" />
          <HeroSubheading text={subheading} styling={styling} className="mx-auto max-w-3xl" />
          <div className="flex justify-center">
            <HeroActions cta={cta} />
          </div>
        </div>

        <HeroMedia
          image={image}
          fallbackImage={fallbackImage}
          heading={heading}
          styling={styling}
          className="mx-auto h-80 max-w-4xl md:h-[30rem]"
        />
      </div>
    </section>
  )
}
