import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import Image from '../../src/components/Image.vue'

import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Image', Image)
  },
} satisfies Theme
