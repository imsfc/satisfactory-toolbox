import { useColorMode } from '@vueuse/core'
import { NLayout, NLayoutContent, NLayoutHeader, NSelect } from 'naive-ui'
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterView } from 'vue-router'

// @ts-ignore
import logo from '@/assets/logo.png?w=96'
import ComputerOutlined from '@/components/icons/ComputerOutlined'
import DarkModeOutlined from '@/components/icons/DarkModeOutlined'
import LanguageOutlined from '@/components/icons/LanguageOutlined'
import LightModeOutlined from '@/components/icons/LightModeOutlined'

export default defineComponent({
  name: 'Layout',
  setup() {
    const { t, locale } = useI18n()

    const colorMode = useColorMode()

    return () => (
      <NLayout class="h-screen">
        <NLayoutHeader class="px-8 h-16 flex items-center gap-4" bordered>
          <div class="flex items-center gap-x-3 cursor-pointer">
            <img src={logo} width={32} height={32} />
            <div class="text-lg font-bold leading-none">{t('logoTitle')}</div>
          </div>
          <div class="flex-1"></div>
          <div class="flex items-center gap-x-3">
            <NSelect
              class="w-auto"
              value={locale.value}
              onUpdateValue={(value) => {
                locale.value = value
              }}
              options={[
                { label: t('zh-CN'), value: 'zh-CN' },
                { label: t('en'), value: 'en' },
              ]}
              consistentMenuWidth={false}
              renderLabel={({ label }: { label: string }) => (
                <div class="flex items-center gap-x-1">{label}</div>
              )}
              renderTag={({ option }) => (
                <div class="flex items-center gap-x-1">
                  <LanguageOutlined class="w-5 h-5" />
                  <span class="leading-5">{option.label as string}</span>
                </div>
              )}
            />
            <NSelect
              class="w-auto"
              value={colorMode.store.value}
              onUpdateValue={(value) => {
                colorMode.store.value = value
              }}
              options={[
                { label: t('auto'), value: 'auto' },
                { label: t('light'), value: 'light' },
                { label: t('dark'), value: 'dark' },
              ]}
              consistentMenuWidth={false}
              renderLabel={({
                label,
                value,
              }: {
                label: string
                value: string
              }) => (
                <div class="flex items-center gap-x-1">
                  {
                    {
                      auto: <ComputerOutlined class="w-5 h-5" />,
                      light: <LightModeOutlined class="w-5 h-5" />,
                      dark: <DarkModeOutlined class="w-5 h-5" />,
                    }[value]
                  }
                  <span class="leading-5">{label}</span>
                </div>
              )}
            />
            <div class="leading-none">v0.1</div>
          </div>
        </NLayoutHeader>

        <NLayoutContent
          class="!top-16"
          contentClass="px-6 py-4"
          position="absolute"
          nativeScrollbar={false}
        >
          <RouterView />
        </NLayoutContent>
      </NLayout>
    )
  },
})
