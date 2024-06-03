import { parse } from '@vue/compiler-sfc'
import type { Plugin, ViteDevServer } from 'vite'
import fg from 'fast-glob'
import { readFileSync } from 'fs'
import path from 'path'
import { URI } from 'vscode-uri'

const VirtualURI = URI.from({
  scheme: 'virtual',
})

const RouteURI = URI.from({
  scheme: 'vue-route',
})

const ROUTES_ID = VirtualURI.with({
  path: 'routes.ts',
}).toString()

const LAYOUTS_ID = VirtualURI.with({
  path: 'layouts.ts',
}).toString()

const ROUTER_PREFIX = VirtualURI.toString()
const ROUTE_PREFIX = RouteURI.toString()

export interface VueRoutePluginOption {
  /**
   * @default 'src/pages'
   */
  routesDir?: string

  /**
   * @default 'src/layouts'
   */
  layoutsDir?: string

  /**
   * @default 'default'
   */
  defaultLayout?: string
}

export function VueRoutePlugin(opt: VueRoutePluginOption = {}) {
  let server: ViteDevServer

  const routeCodeCache = new Map<string, string>()

  const plugin: Plugin = {
    name: 'vite-vue-fs-routes',
    configureServer(s) {
      server = s
    },
    resolveId(source, importer, options) {
      if (source.startsWith(ROUTER_PREFIX)) {
        return source
      }

      if (source.startsWith(ROUTE_PREFIX)) {
        return source
      }
    },
    async load(id, options) {
      if (id === ROUTES_ID) {
        return loadRoutesModule(opt)
      }

      if (id === LAYOUTS_ID) {
        return loadLayoutModule(opt)
      }

      if (id.startsWith(ROUTE_PREFIX)) {
        const ctx: LoadRouteModuleContext = {
          cache: routeCodeCache
        }

        return loadRouteModule(id, ctx)
      }
    },
    watchChange(id, change) {
      if (id.endsWith('.vue')) {
        const routeID = ROUTE_PREFIX + id.replace('.vue', '.ts')

        const node = server.moduleGraph.getModuleById(routeID)

        if (node) {
          if (change.event === 'update') {
            const route = getRouteBlockCode(id)
            const code = routeCodeCache.get(id)

            if (code !== route?.content) {
              server.reloadModule(node)
            }
          } else {
            server.reloadModule(node)
          }
        }
      }
    },
  }

  return plugin
}

interface LoadRouteModuleContext {
  cache: Map<string, string>
}

async function loadRouteModule(id: string, ctx: LoadRouteModuleContext) {
  const uri = URI.parse(id)
  const query = parseURLQuery(uri.query)

  const fsPath = path.join(query.cwd, uri.path)

  const vueFilepath = fsPath.replace('.ts', '.vue')

  const route = getRouteBlockCode(vueFilepath)

  if (route?.content) {
    ctx.cache.set(vueFilepath, route?.content)
  }

  const code = `
  export const component = () => import('${vueFilepath}')

  export const path = '${convertFsPathToRoutePath(uri.path, query.prefix)}'

  export const route = ${route?.content}
  `

  return code
}


interface LoadRoutesModuleOption {
  /**
   * @default 'src/pages'
   */
  routesDir?: string

  /**
   * @default 'default'
   */
  defaultLayout?: string
}

async function loadRoutesModule(opt: LoadRoutesModuleOption = {}) {
  const { routesDir = 'src/pages', defaultLayout = 'default' } = opt

  const dir = path.join(process.cwd(), routesDir)

  const files = await fg('**/*.vue', { cwd: dir })

  const routeFiles = files.map((file, idx) => {
    const uri = RouteURI.with({
      path: file.replace('.vue', '.ts'),
      query: `cwd=${dir}&prefix=/`,
    })

    return `import * as route_${idx} from '${uri.toString()}'`
  })

  const defaultLayoutName = JSON.stringify(defaultLayout)

  const code = `
  ${routeFiles.join('\n')}
  import { layouts } from '${LAYOUTS_ID}'

  const _routes = [
    ${files.map((_, idx) => `route_${idx}`).join(',\n')}
  ]

  export const routes = normalizeRoutes(_routes)

  function normalizeRoutes(routes) {
    return routes.map((config) => {
      const { path, component, route } = config
      const layout = route?.meta?.layout || ${defaultLayoutName}
  
      if (layout) {
        return {
          path,
          component: layouts[layout],
          meta: {
            isLayout: true,
            ...route?.meta,
          },
          children: [
            {
              ...route,
              component,
              path: '',
            },
          ],
        }
      }
  
      return {
        ...config,
          path,
          component,
        }
      })
    }
    `

  return code
}

interface LoadLayoutModuleOption {
  /**
   * @default 'src/layouts'
   */
  layoutsDir?: string
}

async function loadLayoutModule(opt: LoadLayoutModuleOption = {}) {
  const { layoutsDir = 'src/layouts' } = opt

  const dir = path.join(process.cwd(), layoutsDir)

  const files = await fg('*.vue', { cwd: dir, absolute: true })

  const routeFiles = files.map((file, idx) => {
    const name = path.basename(file, '.vue')

    return `${name}: () => import('${file}')`
  })

  const code = `
  export const layouts =  {
    ${routeFiles.join(',\n')}
  }
  `

  return code
}

function getRouteBlockCode(sfcPath: string) {
  const code = readFileSync(sfcPath, { encoding: 'utf-8' })

  const descriptor = parse(code).descriptor

  const route = descriptor.customBlocks.find((n) => n.type === 'route')

  return route
}

function parseURLQuery(query: string) {
  return query.split('&').reduce((acc, cur) => {
    const [key, value] = cur.split('=')
    acc[key] = value
    return acc
  }, {} as Record<string, string>)
}

/**
 *
 * rs/index.ts => /rs
 * test/index.ts => /test
 * test2.ts => /test2
 *
 * @param fsPath
 * @returns
 */
function convertFsPathToRoutePath(fsPath: string, prefix: string) {
  if (fsPath === 'index.ts') {
    return prefix
  }

  const _path = fsPath.replace(/\/index\.ts$/, '').replace(/\.ts$/, '')

  return path.join(prefix, _path)
}
