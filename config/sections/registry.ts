import type { ComponentType } from 'react'
import NavbarSection from '@/modules/template-theme/saral/Header/navbar/NavbarSection'
import type { SectionType } from './types'
import HeroSection from '@/modules/template-theme/saral/Sections/hero/HeroSection'

type SectionComponent = ComponentType<Record<string, unknown>>

export const SECTION_REGISTRY: Partial<Record<SectionType, SectionComponent>> = {
  navbar: NavbarSection as unknown as SectionComponent,
  hero: HeroSection as unknown as SectionComponent,
}
