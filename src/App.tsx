import { computed, defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import { useColorMode } from '@vueuse/core'
import {
  darkTheme,
  dateZhCN,
  NConfigProvider,
  NMessageProvider,
  zhCN,
} from 'naive-ui'

const colorMode = useColorMode()

const isDark = computed(() => {
  return (
    (colorMode.store.value === 'auto'
      ? colorMode.system.value
      : colorMode.store.value) === 'dark'
  )
})

export default defineComponent({
  setup() {
    return () => (
      <NConfigProvider
        theme={isDark.value ? darkTheme : undefined}
        locale={zhCN}
        dateLocale={dateZhCN}
      >
        <NMessageProvider>
          <RouterView />
        </NMessageProvider>
      </NConfigProvider>
    )
  },
})
