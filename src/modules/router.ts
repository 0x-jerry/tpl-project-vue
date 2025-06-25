import { layouts } from 'virtual:layouts.ts'
import { routes } from 'virtual:routes.ts'
import type { Plugin } from 'vue'
import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from 'vue-router'

const staticRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
  },
]

export const install: Plugin = (app) => {
  console.log(routes, layouts)

  const router = createRouter({
    history: createWebHashHistory(),
    routes: [...staticRoutes, ...routes],
  })

  app.use(router)
}
