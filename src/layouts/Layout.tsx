import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useColorMode } from '@vueuse/core'
import { NLayout, NLayoutHeader, NLayoutContent, NButton } from 'naive-ui'

// @ts-ignore
import logo from '@/assets/logo.png?w=96'

export default defineComponent({
  name: 'DefaultLayout',
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
            <NButton
              quaternary
              onClick={() => {
                locale.value = t('switchLanguageCode')
              }}
            >
              {t('switchLanguage')}
            </NButton>
            <NButton
              quaternary
              onClick={() => {
                colorMode.store.value = (
                  {
                    auto: 'light',
                    light: 'dark',
                    dark: 'auto',
                  } as const
                )[colorMode.store.value]
              }}
            >
              {
                {
                  auto: t('light'),
                  light: t('dark'),
                  dark: t('auto'),
                }[colorMode.store.value]
              }
            </NButton>
            <div class="leading-none">v0.1</div>
          </div>
        </NLayoutHeader>

        <NLayoutContent
          class="!top-16"
          contentClass="px-8 py-6"
          position="absolute"
          nativeScrollbar={false}
        >
          <RouterView />
        </NLayoutContent>
      </NLayout>
    )
  },
})
