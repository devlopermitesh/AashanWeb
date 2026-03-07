export const AVAILABLE_SECTIONS = ['navbar', 'hero', 'productgrid'] as const

export const SECTION_OPTIONS = AVAILABLE_SECTIONS.map((section) => ({
  label: section.charAt(0).toUpperCase() + section.slice(1),
  value: section,
}))
