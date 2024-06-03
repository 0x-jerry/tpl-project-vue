import { routes } from 'router:routes.ts'
import type { Plugin } from 'vue'
import { type RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router'

const staticRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
  },
]

export const install: Plugin = (app) => {
  const router = createRouter({
    history: createWebHashHistory(),
    routes: [...staticRoutes, ...routes],
  })

  app.use(router)
}
