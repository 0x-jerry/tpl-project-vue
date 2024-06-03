/// <reference types="vitest" />

import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import imports from 'unplugin-auto-import/vite'
import components from 'unplugin-vue-components/vite'
import Unocss from 'unocss/vite'
import Env from '@0x-jerry/unplugin-env/vite'
import { VueRoutePlugin } from './vite/VueRoutePlugin'

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

      // https://github.com/antfu/unplugin-auto-import
      imports({
        dts: 'types/generated/auto-imports.d.ts',
        imports: ['vue', 'vue-router'],
      }),

      // https://github.com/antfu/unplugin-vue-components
      components({
        dts: 'types/generated/auto-components.d.ts',
        dirs: ['src/components'],
      }),

      VueRoutePlugin({}),

      // https://github.com/unocss/unocss
      Unocss(),

      Env({
        dts: 'types/generated/env.d.ts',
        envFile: 'src/configs/env.ts',
      }),
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
