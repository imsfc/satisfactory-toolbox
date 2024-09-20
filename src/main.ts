import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App'
import router from './router'

import 'virtual:uno.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
