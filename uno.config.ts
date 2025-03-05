import {
  defineConfig,
  presetIcons,
  transformerDirectives,
  transformerVariantGroup,
  presetWind4,
} from 'unocss'
import { presetBrand } from '@0x-jerry/unocss-preset-brand'

export default defineConfig({
  presets: [presetWind4(), presetIcons, presetBrand()],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
