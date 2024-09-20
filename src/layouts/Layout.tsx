import { defineComponent, watchEffect } from 'vue'
import { RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useColorMode } from '@vueuse/core'
import {
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NButton,
  NFlex,
} from 'naive-ui'

import logo from '@/assets/logo.png'

export default defineComponent({
  setup() {
    const { t, locale } = useI18n()

    watchEffect(() => {
      localStorage.setItem('locale', locale.value)
    })

    const colorMode = useColorMode()

    return () => (
      <NLayout class="h-screen">
        <NLayoutHeader class="px-8 h-16 flex items-center gap-4" bordered>
          <NFlex class="cursor-pointer" align="center">
            <img src={logo} width={32} height={32} />
            <div class="text-lg text-bold leading-none">{t('logoTitle')}</div>
          </NFlex>
          <div class="flex-1"></div>
          <NFlex align="center">
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
          </NFlex>
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
