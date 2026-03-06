import type { HeroWrapperProps } from './types'
import { CenterLayout } from './layouts/CenterLayout'
import { ImageLeftLayout } from './layouts/ImageLeftLayout'
import { ImageOnlyLayout } from './layouts/ImageOnlyLayout'
import { ImageRightLayout } from './layouts/ImageRightLayout'
import { TextOnlyLayout } from './layouts/TextOnlyLayout'

export function HeroSection(props: HeroWrapperProps) {
  switch (props.type) {
    case 'imageLeft':
      return <ImageLeftLayout {...props} />
    case 'centered':
      return <CenterLayout {...props} />
    case 'imageOnly':
      return <ImageOnlyLayout {...props} />
    case 'textOnly':
      return <TextOnlyLayout {...props} />
    case 'imageRight':
    default:
      return <ImageRightLayout {...props} />
  }
}

export default HeroSection
