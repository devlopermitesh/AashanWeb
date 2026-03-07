import { AVAILABLE_SECTIONS } from './available'
import type { NavbarSettings } from '../../blocks/navbar/navbar-layout'
import { HeroSetting } from '@/blocks/Hero/hero-layout'
import type { ProductGridSettings } from '@/modules/template/themes/saral/Sections/productgrid/types'

export type SectionType = (typeof AVAILABLE_SECTIONS)[number]

// Extend this map as new section types are added (hero, footer, etc).
export interface SectionSettingsMap {
  navbar: NavbarSettings
  hero: HeroSetting
  productgrid: ProductGridSettings
}

export type SectionSettings<T extends SectionType = SectionType> =
  T extends keyof SectionSettingsMap ? SectionSettingsMap[T] : Record<string, unknown>

export interface SectionConfig<T extends SectionType = SectionType> {
  id: string
  type: T
  enabled: boolean
  variant?: string
  settings?: SectionSettings<T>
  styles?: Record<string, unknown>
}
