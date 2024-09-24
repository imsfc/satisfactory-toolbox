import { NSelect } from 'naive-ui'
import { type PropType, computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

import { getItem, items, recipes } from '@/data'
import type { Id } from '@/types'

import ItemImage from './ItemImage'

const ItemSelectLabel = defineComponent({
  name: 'ItemSelectLabel',
  props: {
    label: {
      type: String,
      required: true,
    },
    itemId: {
      type: [Number, String] as PropType<Id>,
      required: true,
    },
  },
  setup(props) {
    const item = computed(() => getItem(props.itemId))

    return () => (
      <div class="flex items-center gap-x-2">
        <ItemImage
          name={item.value.key}
          sizes={[32, 64, 96]}
          formats={['avif', 'webp', 'png']}
          width={24}
          height={24}
        />
        <div class="truncate">{props.label}</div>
      </div>
    )
  },
})

export default defineComponent({
  name: 'ItemSelect',
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

    type Option = (typeof options.value)[number]

    return () => (
      <NSelect
        value={props.value}
        onUpdateValue={props.onUpdateValue}
        options={options.value}
        consistentMenuWidth={false}
        renderLabel={(option: Option) => (
          <ItemSelectLabel itemId={option.value} label={option.label} />
        )}
        filterable
        clearable
      />
    )
  },
})
