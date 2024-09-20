import { computed, defineComponent, watch, type PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import { NSelect, type SelectRenderLabel, type SelectRenderTag } from 'naive-ui'

import BuildingImage from '@/components/BuildingImage'
import ItemImage from '@/components/ItemImage'
import type { Id } from '@/types'
import { getRecipeById, recipes } from '@/data'

const renderItem = (itemId: Id, quantity: number, perMinute: number) => {
  const { t } = useI18n()

  return (
    <div class="w-12 h-11 flex flex-col items-center gap-0.5">
      <ItemImage
        name={itemId}
        sizes={[24, 48, 72]}
        formats={['avif', 'webp', 'png']}
      />
      <div class="w-2/1 h-2 origin-top-center scale-50 text-sm leading-none text-center text-nowrap">
        {t(`items.${itemId}`)}
      </div>
      <div class="w-2/1 h-2 origin-top-center scale-50 text-sm leading-none text-center text-nowrap">
        {quantity}({perMinute}/min)
      </div>
    </div>
  )
}

const renderLabel: SelectRenderLabel = (option) => {
  const { t } = useI18n()

  const recipe = getRecipeById(option.value as Id)

  return (
    <div class="p-2 flex gap-2">
      <div class="w-16 flex flex-col justify-center items-center gap-1">
        <BuildingImage
          name={recipe.producedIn}
          sizes={[48, 96, 144]}
          formats={['avif', 'webp', 'png']}
        />
        <div class="text-xs leading-none">
          {t(`buildings.${recipe.producedIn}`)}
        </div>
      </div>
      <div class="h-16 flex flex-col gap-2">
        <div class="text-sm leading-none font-medium">{option.label}</div>
        <div class="flex">
          <div class="w-48 flex">
            {recipe.inputs.map(({ itemId, quantity, quantityPerMinute }) =>
              renderItem(itemId, quantity, quantityPerMinute),
            )}
          </div>
          <div class="w-12 flex flex-col justify-center items-center">
            <div class="text-sm leading-none">→</div>
            <div class="text-xs leading-none">{recipe.productionDuration}s</div>
          </div>
          <div class="flex">
            {recipe.outputs.map(({ itemId, quantity, quantityPerMinute }) =>
              renderItem(itemId, quantity, quantityPerMinute),
            )}
          </div>
        </div>
      </div>
    </div>
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
    const { t } = useI18n()

    const options = computed(() => {
      if (props.itemId) {
        return recipes
          .filter(({ outputs }) => {
            return outputs.some(({ itemId }) => itemId === props.itemId)
          })
          .map(({ id }) => {
            return {
              label: t(`recipes.${id}`),
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
