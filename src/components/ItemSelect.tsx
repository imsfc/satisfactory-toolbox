import { computed, defineComponent, type PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import { NFlex, NSelect, type SelectRenderLabel } from 'naive-ui'

import type { Id } from '@/types'
import { getItemById, items, recipes } from '@/data'

import ItemImage from './ItemImage'

const renderLabel: SelectRenderLabel = (option) => {
  const item = getItemById(option.value as Id)

  return (
    <NFlex size="small" align="center" wrap={false}>
      <ItemImage
        name={item.key}
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
    value: Number as PropType<Id | null>,
    onUpdateValue: Function as PropType<(value: Id | null) => void>,
  },
  setup(props) {
    const { t } = useI18n()

    const options = computed(() =>
      items
        .filter(({ id }) => {
          return recipes.some(({ outputs }) => {
            return outputs.some(({ itemId }) => itemId === id)
          })
        })
        .map(({ id, key }) => {
          return {
            label: t(`items.${key}`),
            value: id,
          }
        }),
    )

    return () => (
      <NSelect
        value={props.value}
        onUpdateValue={props.onUpdateValue}
        options={options.value}
        consistent-menu-width={false}
        renderLabel={renderLabel}
        filterable
        clearable
      />
    )
  },
})
