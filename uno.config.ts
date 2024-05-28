import {
  defineConfig,
  presetUno,
  presetIcons,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import { presetBrand } from '@0x-jerry/unocss-preset-brand'

export default defineConfig({
  presets: [presetUno(), presetIcons, presetBrand()],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
