import App from './App.vue'
import { createApp } from 'vue'

import 'virtual:uno.css'

const app = createApp(App)

// install all modules
Object.values(import.meta.glob<any>('./modules/*.ts', { eager: true })).forEach((m) => {
  m.install?.(app)
})

app.mount('#app')
