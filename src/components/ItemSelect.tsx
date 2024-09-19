import { defineComponent, type PropType } from 'vue'
import { NFlex, NSelect, type SelectRenderLabel } from 'naive-ui'

import type { Id } from '@/types'
import { items } from '@/data/items'

const options = items.map(({ id, name }) => {
  return {
    label: name,
    value: id,
  }
})

const renderLabel: SelectRenderLabel = (option) => {
  return (
    <NFlex size="small" align="center" wrap={false}>
      <img src={`\\items\\${option.value}.png`} width={24} height={24} />
      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {option.label}
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
