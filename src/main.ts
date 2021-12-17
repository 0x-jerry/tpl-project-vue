import App from './App.vue'
import { createApp } from 'vue'

const app = createApp(App)

const modules = import.meta.globEager('./modules/*.ts')

for (const key in modules) {
  const m = modules[key]

  m.install?.(app)
}

app.mount('#app')
