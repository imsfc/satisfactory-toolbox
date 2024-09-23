import { syncRef, useColorMode, useLocalStorage } from '@vueuse/core'
import {
  NConfigProvider,
  NMessageProvider,
  darkTheme,
  dateZhCN,
  zhCN,
} from 'naive-ui'
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterView } from 'vue-router'

export default defineComponent({
  name: 'App',
  setup() {
    const { locale } = useI18n()

    const localStorageLocale = useLocalStorage('locale', locale.value)
    syncRef(locale, localStorageLocale)

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
        theme={isDark.value ? darkTheme : null}
        locale={locale.value === 'zh-CN' ? zhCN : null}
        dateLocale={locale.value === 'zh-CN' ? dateZhCN : null}
      >
        <NMessageProvider>
          <RouterView />
        </NMessageProvider>
      </NConfigProvider>
    )
  },
})
