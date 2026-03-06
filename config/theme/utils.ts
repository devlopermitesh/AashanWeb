import { THEME_PRESETS } from './presents'
import { ThemePreset } from './available'

export function getTheme(preset: ThemePreset) {
  return THEME_PRESETS[preset]
}
