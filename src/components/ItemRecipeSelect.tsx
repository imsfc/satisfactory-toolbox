import { computed, defineComponent, watch, type PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  NFlex,
  NSelect,
  type SelectRenderLabel,
  type SelectRenderTag,
} from 'naive-ui'

import type { Id } from '@/types'
import { getRecipeById, recipes } from '@/data'

import BuildingImage from './BuildingImage'
import ItemImage from './ItemImage'

const renderItem = (itemId: Id, quantity: number, perMinute: number) => {
  const { t } = useI18n()

  return (
    <NFlex size={4} align="center" vertical>
      <ItemImage
        name={itemId}
        sizes={[32, 64, 96]}
        formats={['avif', 'webp', 'png']}
      />
      <NFlex
        class="w-16 text-xs text-center whitespace-normal grow"
        size={0}
        vertical
      >
        <div class="grow line-clamp-2">
          {quantity}×{t(`items.${itemId}`)}
        </div>
        <div class="opacity-75 truncate">
          {perMinute}
          {t('perMinute')}
        </div>
      </NFlex>
    </NFlex>
  )
}

const renderLabel: SelectRenderLabel = (option) => {
  const { t } = useI18n()

  const recipe = getRecipeById(option.value as Id)

  return (
    <NFlex class="py-2" align="center">
      <NFlex vertical>
        <BuildingImage
          name={recipe.producedIn}
          sizes={[48, 96, 144]}
          formats={['avif', 'webp', 'png']}
        />
        <div class="w-12 text-xs text-center whitespace-normal">
          {t(`buildings.${recipe.producedIn}`)}
        </div>
      </NFlex>
      <NFlex size={8} vertical>
        <div class="text-sm">{option.label}</div>
        <NFlex>
          <NFlex>
            {recipe.inputs.map(({ itemId, quantity, quantityPerMinute }) =>
              renderItem(itemId, quantity, quantityPerMinute),
            )}
          </NFlex>
          <NFlex
            class="w-12 self-center"
            justify="center"
            align="center"
            vertical
          >
            <div class="text-xl leading-none">→</div>
            <div class="text-sm leading-none">
              {recipe.productionDuration}
              {t('seconds')}
            </div>
          </NFlex>
          <NFlex>
            {recipe.outputs.map(({ itemId, quantity, quantityPerMinute }) =>
              renderItem(itemId, quantity, quantityPerMinute),
            )}
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
