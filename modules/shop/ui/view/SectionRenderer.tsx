import { canAccessSection, SECTION_REGISTRY } from '@/config'
import type { Plan, SectionConfig } from '@/config'

interface Props {
  sections: SectionConfig[]
  plan: Plan
}

export default function SectionRenderer({ sections, plan }: Props) {
  return (
    <>
      {sections.map((section) => {
        if (!section.enabled) {
          return null
        }

        // Premium check
        if (!canAccessSection(plan, section.type)) {
          return null // ya <UpgradePrompt /> dikhao
        }

        const Component = SECTION_REGISTRY[section.type]
        const settings = section.settings ?? {}

        if (!Component) {
          console.warn(`Section nahi mila bhai: ${section.type}`)
          return null
        }
        return <Component key={section.id} {...settings} />
      })}
    </>
  )
}
