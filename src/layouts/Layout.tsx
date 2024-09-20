import { defineComponent, watchEffect } from 'vue'
import { RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useColorMode } from '@vueuse/core'
import {
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NText,
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
      <NLayout style={{ height: '100vh' }}>
        <NLayoutHeader
          style={{
            padding: '0 32px',
            height: '64px',
            display: 'grid',
            alignItems: 'center',
            gridTemplateColumns: '240px 1fr auto',
          }}
          bordered
        >
          <NText
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              fontSize: '18px',
              fontWeight: 'bold',
              lineHeight: 1,
            }}
          >
            <img
              style={{ marginRight: '12px', width: '32px', height: '32px' }}
              src={logo}
            />
            <div>{t('logoTitle')}</div>
          </NText>
          <div></div>
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
          style={{
            top: '64px',
            bottom: '0',
          }}
          content-style="padding: 24px 32px"
          position="absolute"
          nativeScrollbar={false}
        >
          <RouterView />
        </NLayoutContent>
      </NLayout>
    )
  },
})
