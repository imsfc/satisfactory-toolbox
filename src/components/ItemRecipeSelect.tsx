import { computed, defineComponent, watch, type PropType } from 'vue'
import {
  NFlex,
  NSelect,
  type SelectRenderLabel,
  type SelectRenderTag,
} from 'naive-ui'

import type { Id } from '@/types'
import { getRecipeById, recipes } from '@/data/recipes'
import { getBuildingById } from '@/data/buildings'
import { getItemById } from '@/data/items'

const renderLabel: SelectRenderLabel = (option) => {
  const recipe = getRecipeById(option.value as Id)
  const building = getBuildingById(recipe.producedIn)

  const inputs = recipe.input.map(({ itemId, amount }) => {
    return {
      item: getItemById(itemId),
      amount,
    }
  })

  const outputs = recipe.output.map(({ itemId, amount }) => {
    return {
      item: getItemById(itemId),
      amount,
    }
  })

  return (
    <NFlex
      style={{ padding: '8px 0' }}
      size="small"
      align="center"
      wrap={false}
    >
      <NFlex size={4} justify="center" wrap={false} vertical>
        <img
          src={`\\buildings\\${recipe.producedIn}.png`}
          width={48}
          height={48}
        />
        <div style={{ fontSize: '12px', lineHeight: 1 }}>{building.name}</div>
      </NFlex>
      <NFlex size={8} vertical>
        <div style={{ fontSize: '16px', lineHeight: 1 }}>{option.label}</div>
        <NFlex>
          <NFlex>
            {inputs.map(({ item, amount }) => (
              <NFlex size={4} align="center" vertical>
                <img src={`\\items\\${item.id}.png`} width={24} height={24} />
                <div style={{ fontSize: '12px', lineHeight: 1 }}>
                  {amount}×{item.name}
                </div>
                <div style={{ fontSize: '12px', lineHeight: 1 }}>
                  {(amount * 60) / recipe.producedInTime}/min
                </div>
              </NFlex>
            ))}
          </NFlex>
          <NFlex size={0} align="center" vertical>
            <div>→</div>
            <div style={{ fontSize: '12px' }}>{recipe.producedInTime}s</div>
          </NFlex>
          <NFlex>
            {outputs.map(({ item, amount }) => (
              <NFlex size={4} align="center" vertical>
                <img src={`\\items\\${item.id}.png`} width={24} height={24} />
                <div style={{ fontSize: '12px', lineHeight: 1 }}>
                  {amount}×{item.name}
                </div>
                <div style={{ fontSize: '12px', lineHeight: 1 }}>
                  {(amount * 60) / recipe.producedInTime}/min
                </div>
              </NFlex>
            ))}
          </NFlex>
        </NFlex>
      </NFlex>
    </NFlex>
  )
}

const renderTag: SelectRenderTag = ({ option }) => option.label as string

export default defineComponent({
  props: {
    value: String as PropType<Id | null>,
    itemId: String as PropType<Id | null>,
  },
  emits: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    'update:value': (value: Id | null) => true,
  },
  setup(props, { emit }) {
    const options = computed(() => {
      if (props.itemId) {
        return recipes
          .filter(({ output }) => {
            return output.some(({ itemId }) => itemId === props.itemId)
          })
          .map(({ id, name }) => {
            return {
              label: name,
              value: id,
            }
          })
      }

      return []
    })

    watch(options, (options) => {
      if (options.length === 0) {
        emit('update:value', null)
      } else {
        emit('update:value', options[0].value)
      }
    })

    return () => (
      <NSelect
        value={props.value}
        onUpdateValue={(newValue) => {
          emit('update:value', newValue)
        }}
        options={options.value}
        consistent-menu-width={false}
        renderLabel={renderLabel}
        renderTag={renderTag}
        filterable
        clearable
      />
    )
  },
})
