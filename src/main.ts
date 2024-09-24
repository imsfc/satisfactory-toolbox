import { useLocalStorage } from '@vueuse/core'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

import App from './App'
import router from './router'

import messages from '@intlify/unplugin-vue-i18n/messages'

import 'virtual:uno.css'

const i18n = createI18n({
  locale: useLocalStorage('locale', 'zh-CN').value,
  fallbackLocale: 'en',
  messages,
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')
