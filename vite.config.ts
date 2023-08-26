/// <reference types="vitest" />

import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import imports from 'unplugin-auto-import/vite'
import components from 'unplugin-vue-components/vite'
import layouts from 'vite-plugin-vue-layouts'
import icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Unocss from 'unocss/vite'
import VueRouter from 'unplugin-vue-router/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const host = env.VITE_MAIN_API_HOST

  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },

    server: {
      proxy: {
        '/api': {
          target: host,
          changeOrigin: true,
          rewrite: (p) => p.slice('/api'.length),
        },
      },
    },

    plugins: [
      vue(),

      // https://github.com/antfu/unplugin-icons
      icons(),

      // https://github.com/antfu/unplugin-auto-import
      imports({
        dts: 'src/auto-imports.d.ts',
        imports: ['vue', 'vue-router'],
      }),

      // https://github.com/antfu/unplugin-vue-components
      components({
        dts: 'src/auto-components.d.ts',
        dirs: ['src/components'],
        resolvers: [IconsResolver()],
      }),

      // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
      layouts({
        exclude: ['**/components/*.vue', '**/*.ts'],
      }),

      // https://github.com/posva/unplugin-vue-router
      VueRouter({
        dts: 'src/auto-routes.d.ts',
        routesFolder: 'src/pages',
        exclude: ['**/components/*.vue'],
      }),

      // https://github.com/unocss/unocss
      Unocss(),
    ],

    optimizeDeps: {
      exclude: [],
    },

    // https://vitest.dev/
    test: {
      global: true,
      environment: 'happy-dom',
    },
  }
})
