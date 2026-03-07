import { caller } from '@/trpc/server'
import { notFound } from 'next/navigation'
import SectionRenderer from '@/modules/shop/ui/view/SectionRenderer'
import { FONTS, getTheme, type Plan, type SectionConfig } from '@/config'
import type { CSSProperties } from 'react'
import type { Template } from '@/payload-types'
import { normalizeNavbarSettings } from '@/blocks/navbar/navbar-layout'
import { normalizeHeroSettings } from '@/blocks/Hero/hero-layout'

export const revalidate = 60
interface Props {
  params: Promise<{
    slug: string
  }>
}
type SectionSettingsNormalizer = (value: Record<string, unknown>) => SectionConfig['settings']
type TemplateSection = Template['sections'][number]

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

// Reusable registry: add `hero`, `footer` normalizers here when those sections are introduced.
const SECTION_SETTINGS_NORMALIZERS: Partial<
  Record<SectionConfig['type'], SectionSettingsNormalizer>
> = {
  navbar: normalizeNavbarSettings,
  hero: normalizeHeroSettings,
}

const mergeSectionSettings = (
  type: SectionConfig['type'],
  baseSettings: unknown,
  overrideSettings: unknown
): SectionConfig['settings'] => {
  const base = isRecord(baseSettings) ? baseSettings : {}
  const override = isRecord(overrideSettings) ? overrideSettings : {}
  const merged = { ...base, ...override }
  const normalize = SECTION_SETTINGS_NORMALIZERS[type]
  return normalize ? normalize(merged) : (merged as unknown as SectionConfig['settings'])
}

const getBlockSettings = (section: TemplateSection): unknown => {
  switch (section.blockType) {
    case 'navbar':
      return section.settings
    case 'hero':
      // Hero keeps content inside `settings`, while layout selector lives at top-level `type`.
      return {
        type: section.type,
        ...(isRecord(section.settings) ? section.settings : {}),
      }
    case 'productgrid':
      return section.settings
    default:
      return {}
  }
}

const Page = async ({ params }: Props) => {
  const { slug } = await params
  try {
    const shop = await caller.shop.getShop(slug)
    if (!shop?.id) {
      notFound()
    }
    const shopTemplate = await caller.shopTemplate.getShop({
      shopId: shop.id,
    })

    if (typeof shopTemplate.baseTemplate === 'string') {
      throw new Error('baseTemplate relation not populated')
    }

    const baseTemplate = shopTemplate.baseTemplate
    const finalSections: SectionConfig[] = baseTemplate.sections.map((section, index) => {
      const sectionId = section.id ?? `${section.blockType}-${index}`
      // only sections that are overwritten
      const override = shopTemplate.sectionOverrides?.find(
        (overrideSection) => overrideSection.sectionId === sectionId
      )

      return {
        id: sectionId,
        type: section.blockType,
        enabled: !(override?.disabled ?? false),
        variant: section.variant ?? undefined,
        settings: mergeSectionSettings(
          section.blockType,
          getBlockSettings(section),
          override?.settings
        ),
      }
    })

    const basePlanCategory =
      typeof baseTemplate.plan === 'string' ? 'free' : (baseTemplate.plan.category ?? 'free')
    const plan: Plan = basePlanCategory === 'paid' ? 'premium' : 'free'

    const themePreset = shopTemplate.themeOverride ?? baseTemplate.themePreset
    const fontPreset = shopTemplate.fontOverride ?? baseTemplate.fontPreset

    const theme = getTheme(themePreset)
    const font = FONTS[fontPreset]

    const tenantStyle: CSSProperties = {
      backgroundColor: theme.background,
      color: theme.text,
      fontFamily: font.body,
    }
    console.log('finalSectins', finalSections)
    return (
      <div style={tenantStyle} data-theme={themePreset} data-font={fontPreset}>
        <SectionRenderer sections={finalSections} plan={plan} />
      </div>
    )
  } catch (error) {
    console.error('Failed to render tenant shop page', error)
    notFound()
  }

  return null
}

export default Page
