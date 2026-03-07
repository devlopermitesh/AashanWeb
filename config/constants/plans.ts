import { SectionType } from '../sections/types'
import { ThemePreset } from '../theme/available'

// config/constants/plans.ts
type PlanFeatures = {
  maxProducts: number
  sections: SectionType[]
  themes: ThemePreset[]
}

export const PLAN_FEATURES: Record<'free' | 'premium', PlanFeatures> = {
  free: {
    maxProducts: 50,
    sections: ['navbar', 'hero', 'productgrid'],
    themes: ['hobby-fabric'],
  },
  premium: {
    maxProducts: Infinity,
    sections: ['navbar', 'hero'],
    themes: ['hobby-fabric'],
  },
}

export type Plan = keyof typeof PLAN_FEATURES

// Helper function
export function canAccessSection(plan: Plan, sectionType: SectionType): boolean {
  return PLAN_FEATURES[plan].sections.includes(sectionType)
}

export function canAccessTheme(plan: Plan, theme: ThemePreset): boolean {
  return PLAN_FEATURES[plan].themes.includes(theme)
}
