import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import imports from 'unplugin-auto-import/vite'
import components from 'unplugin-vue-components/vite'
import layouts from 'vite-plugin-vue-layouts'
import pages from 'vite-plugin-pages'
import windicss from 'vite-plugin-windicss'

export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    vue(),

    // https://github.com/antfu/unplugin-auto-import
    imports({
      dts: 'src/auto-imports.d.ts',
      imports: ['vue', 'vue-router'],
    }),

    // https://github.com/antfu/unplugin-vue-components
    components({
      dts: 'src/components.d.ts',
      dirs: ['src/components', 'src/biz-components'],
    }),

    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    layouts({
      exclude: ['**/components/*.vue', '**/*.ts'],
    }),

    // https://github.com/hannoeru/vite-plugin-pages
    pages({
      exclude: ['**/components/*.vue', '**/*.ts'],
    }),

    // https://github.com/windicss/vite-plugin-windicss
    windicss({
      config: {
        attributify: true,
      },
    }),
  ],

  optimizeDeps: {
    exclude: [],
  },
})
