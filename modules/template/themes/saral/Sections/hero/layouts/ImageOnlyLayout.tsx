import type { HeroWrapperProps } from '../types'
import { HeroActions, HeroHeading, HeroMedia, getSectionStyle } from '../components/HeroCommon'

export function ImageOnlyLayout(props: HeroWrapperProps) {
  const { heading, image, fallbackImage, cta, styling } = props

  return (
    <section className="w-full" style={getSectionStyle(styling)}>
      <div className="relative isolate">
        <HeroMedia
          image={image}
          fallbackImage={fallbackImage}
          heading={heading}
          styling={styling}
          className="h-[70vh] min-h-[460px]"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
          <div className="mx-auto max-w-7xl space-y-4">
            <HeroHeading text={heading} styling={styling} className="font-extrabold" />
            <div className="pointer-events-auto">
              <HeroActions cta={cta} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
