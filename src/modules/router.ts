import { setupLayouts } from 'virtual:generated-layouts'
import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router'
import { routes as generatedRoutes } from 'vue-router/auto/routes'
import { Plugin } from 'vue'

const staticRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
  },
]

export const install: Plugin = (app) => {
  const routes = setupLayouts(generatedRoutes)

  const router = createRouter({
    history: createWebHashHistory(),
    routes: [...staticRoutes, ...routes],
  })

  app.use(router)
}
