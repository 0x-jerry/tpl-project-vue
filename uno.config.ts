import {
  defineConfig,
  presetIcons,
  transformerDirectives,
  transformerVariantGroup,
  presetMini,
} from 'unocss'
import { presetBrand } from '@0x-jerry/unocss-preset-brand'

export default defineConfig({
  presets: [presetMini(), presetIcons, presetBrand()],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
