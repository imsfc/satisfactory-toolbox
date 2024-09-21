import { computed, defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { syncRef, useColorMode, useLocalStorage } from '@vueuse/core'
import {
  darkTheme,
  dateZhCN,
  NConfigProvider,
  NMessageProvider,
  zhCN,
} from 'naive-ui'

export default defineComponent({
  setup() {
    const { locale } = useI18n()

    const _locale = useLocalStorage('locale', locale.value)
    syncRef(locale, _locale)

    const colorMode = useColorMode()

    const isDark = computed(() => {
      return (
        (colorMode.store.value === 'auto'
          ? colorMode.system.value
          : colorMode.store.value) === 'dark'
      )
    })

    return () => (
      <NConfigProvider
        theme={isDark.value ? darkTheme : undefined}
        locale={locale.value === 'zh-CN' ? zhCN : undefined}
        dateLocale={locale.value === 'zh-CN' ? dateZhCN : undefined}
      >
        <NMessageProvider>
          <RouterView />
        </NMessageProvider>
      </NConfigProvider>
    )
  },
})
