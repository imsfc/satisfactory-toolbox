import { defineComponent, type PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import { NFlex, NSelect, type SelectRenderLabel } from 'naive-ui'

import ItemImage from '@/components/ItemImage'
import type { Id } from '@/types'
import { items } from '@/data'

const options = items.map(({ id }) => {
  return {
    label: id,
    value: id,
  }
})

const renderLabel: SelectRenderLabel = (option) => {
  const { t } = useI18n()

  return (
    <NFlex size="small" align="center" wrap={false}>
      <ItemImage
        name={option.value as string}
        sizes={[24, 48, 72]}
        formats={['avif', 'webp', 'png']}
      />
      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {t(`items.${option.label}`)}
      </div>
    </NFlex>
  )
}

export default defineComponent({
  props: {
    value: String as PropType<Id | null>,
  },
  emits: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    'update:value': (value: Id | null) => true,
  },
  setup(props, { emit }) {
    return () => (
      <NSelect
        value={props.value}
        onUpdateValue={(newValue) => {
          emit('update:value', newValue)
        }}
        options={options}
        consistent-menu-width={false}
        renderLabel={renderLabel}
        filterable
        clearable
      />
    )
  },
})
