import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHashHistory } from 'vue-router'
import { routes as generatedRoutes } from 'vue-router/auto/routes'
import { Plugin } from 'vue'

export const install: Plugin = (app) => {
  const routes = setupLayouts(generatedRoutes)

  const router = createRouter({
    history: createWebHashHistory(),
    routes,
  })

  app.use(router)
}
