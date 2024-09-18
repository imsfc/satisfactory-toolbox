import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import { NConfigProvider, NMessageProvider } from 'naive-ui'
import { zhCN, dateZhCN } from 'naive-ui'

export default defineComponent({
  setup() {
    return () => (
      <NConfigProvider locale={zhCN} dateLocale={dateZhCN}>
        <NMessageProvider>
          <RouterView />
        </NMessageProvider>
      </NConfigProvider>
    )
  },
})
