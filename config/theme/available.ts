export const AVAILABLE_THEMES = ['hobby-fabric'] as const
export const AVAILABLE_FONTS = ['inter', 'poppins'] as const
export const SECTIONS_THEMES = AVAILABLE_THEMES.map((theme: string) => ({
  label: theme.charAt(0).toUpperCase() + theme.slice(1),
  value: theme,
}))
export const SECTIONS_FONTS = AVAILABLE_FONTS.map((font: string) => ({
  label: font.charAt(0).toUpperCase() + font.slice(1),
  value: font,
}))
export type ThemePreset = (typeof AVAILABLE_THEMES)[number]

export type FontFamily = (typeof AVAILABLE_FONTS)[number]
