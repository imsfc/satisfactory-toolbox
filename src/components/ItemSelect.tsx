import { computed, defineComponent, type PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import { NFlex, NSelect, type SelectRenderLabel } from 'naive-ui'

import type { Id } from '@/types'
import { items, recipes } from '@/data'

import ItemImage from './ItemImage'

const renderLabel: SelectRenderLabel = (option) => {
  return (
    <NFlex size="small" align="center" wrap={false}>
      <ItemImage
        name={option.value as string}
        sizes={[32, 64, 96]}
        formats={['avif', 'webp', 'png']}
        width={24}
        height={24}
      />
      <div class="truncate">{option.label}</div>
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
    const { t } = useI18n()

    const options = computed(() =>
      items
        .filter(({ id }) => {
          return recipes.some(({ outputs }) => {
            return outputs.some(({ itemId }) => itemId === id)
          })
        })
        .map(({ id }) => {
          return {
            label: t(`items.${id}`),
            value: id,
          }
        }),
    )

    return () => (
      <NSelect
        value={props.value}
        onUpdateValue={(newValue) => {
          emit('update:value', newValue)
        }}
        options={options.value}
        consistent-menu-width={false}
        renderLabel={renderLabel}
        filterable
        clearable
      />
    )
  },
})
