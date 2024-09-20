import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'

import messages from '@intlify/unplugin-vue-i18n/messages'

import App from './App'
import router from './router'

import 'virtual:uno.css'

const i18n = createI18n({
  locale: localStorage.getItem('locale') ?? 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages,
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')
