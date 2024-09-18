import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import { NConfigProvider } from 'naive-ui'
import { zhCN, dateZhCN } from 'naive-ui'

export default defineComponent({
  setup() {
    return () => (
      <NConfigProvider locale={zhCN} dateLocale={dateZhCN}>
        <RouterView />
      </NConfigProvider>
    )
  },
})
