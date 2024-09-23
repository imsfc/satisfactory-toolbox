import { useWindowSize } from '@vueuse/core'
import { NDrawer, NDrawerContent } from 'naive-ui'
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import type { Id } from '@/types'

import ModularFactoryDrawerContent from './ModularFactoryDrawerContent'

export interface Exposed {
  open: (id: Id) => void
}

export default defineComponent({
  name: 'ModularFactoryDrawer',
  setup(props, { expose }) {
    const { t } = useI18n()

    const { height: windowHeight } = useWindowSize()

    const show = ref(false)
    const modularFactoryId = ref<Id>()

    const open = (id: Id) => {
      modularFactoryId.value = id
      show.value = true
    }

    expose({
      open,
    } satisfies Exposed)

    return () => (
      <NDrawer
        show={show.value}
        onUpdateShow={(value) => {
          show.value = value
        }}
        height={windowHeight.value - 64}
        placement="bottom"
      >
        <NDrawerContent
          title={t('factoryConfig')}
          nativeScrollbar={false}
          closable
        >
          {modularFactoryId.value && (
            <ModularFactoryDrawerContent
              modularFactoryId={modularFactoryId.value}
            />
          )}
        </NDrawerContent>
      </NDrawer>
    )
  },
})
