import type { ComponentType } from 'react'
import NavbarSection from '@/modules/template/themes/saral/Header/navbar/NavbarSection'
import type { SectionType } from './types'
import HeroSection from '@/modules/template/themes/saral/Sections/hero/HeroSection'
import ProductGridBlock from '@/modules/template/themes/saral/Sections/productgrid/ProductGridBlock'

type SectionComponent = ComponentType<Record<string, unknown>>

export const SECTION_REGISTRY: Partial<Record<SectionType, SectionComponent>> = {
  navbar: NavbarSection as unknown as SectionComponent,
  hero: HeroSection as unknown as SectionComponent,
  productgrid: ProductGridBlock as unknown as SectionComponent,
}
