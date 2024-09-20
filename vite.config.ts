import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueI18n from '@intlify/unplugin-vue-i18n/vite'
import UnoCSS from 'unocss/vite'
import { imagetools } from 'vite-imagetools'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueI18n({
      include: [fileURLToPath(new URL('./src/locales/**', import.meta.url))],
    }),
    UnoCSS(),
    imagetools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
