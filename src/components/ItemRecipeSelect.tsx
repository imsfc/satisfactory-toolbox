import { computed, defineComponent, watch, type PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  NFlex,
  NSelect,
  type SelectRenderLabel,
  type SelectRenderTag,
} from 'naive-ui'

import type { Id } from '@/types'
import { getBuildingById, getItemById, getRecipeById, recipes } from '@/data'
import { calculateQuantityPerMinute } from '@/utils/dataCalculators'

import BuildingImage from './BuildingImage'
import ItemImage from './ItemImage'

const renderItem = (
  itemId: Id,
  quantityPerCycle: number,
  quantityPerMinute: number,
) => {
  const { t } = useI18n()

  const item = getItemById(itemId)

  return (
    <NFlex size={4} align="center" vertical>
      <ItemImage
        name={item.key}
        sizes={[32, 64, 96]}
        formats={['avif', 'webp', 'png']}
      />
      <NFlex
        class="w-16 text-xs text-center whitespace-normal grow"
        size={0}
        vertical
      >
        <div class="grow line-clamp-2">
          {quantityPerCycle}×{t(`items.${item.key}`)}
        </div>
        <div class="opacity-75 truncate">
          {quantityPerMinute}
          {t('perMinute')}
        </div>
      </NFlex>
    </NFlex>
  )
}

const renderLabel: SelectRenderLabel = (option) => {
  const { t } = useI18n()

  const recipe = getRecipeById(option.value as Id)
  const building = getBuildingById(recipe.producedInId)

  return (
    <NFlex class="py-2" align="center">
      <NFlex vertical>
        <BuildingImage
          name={building.key}
          sizes={[48, 96, 144]}
          formats={['avif', 'webp', 'png']}
        />
        <div class="w-12 text-xs text-center whitespace-normal">
          {t(`buildings.${building.key}`)}
        </div>
      </NFlex>
      <NFlex size={8} vertical>
        <div class="text-sm">{option.label}</div>
        <NFlex>
          <NFlex>
            {recipe.inputs.map(({ itemId, quantityPerCycle }) =>
              renderItem(
                itemId,
                quantityPerCycle,
                calculateQuantityPerMinute(
                  quantityPerCycle,
                  recipe.productionDuration,
                ),
              ),
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
            {recipe.outputs.map(({ itemId, quantityPerCycle }) =>
              renderItem(
                itemId,
                quantityPerCycle,
                calculateQuantityPerMinute(
                  quantityPerCycle,
                  recipe.productionDuration,
                ),
              ),
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
    itemId: Number as PropType<Id | null>,
    value: Number as PropType<Id | null>,
    onUpdateValue: Function as PropType<(value: Id | null) => void>,
  },
  setup(props) {
    const { t } = useI18n()

    const options = computed(() => {
      if (props.itemId) {
        return recipes
          .filter(({ outputs }) => {
            return outputs.some(({ itemId }) => itemId === props.itemId)
          })
          .map(({ id, key }) => {
            return {
              label: t(`recipes.${key}`),
              value: id,
            }
          })
      }

      return []
    })

    watch(options, (options) => {
      if (options.length === 0) {
        props.onUpdateValue?.(null)
      } else {
        props.onUpdateValue?.(options[0].value)
      }
    })

    return () => (
      <NSelect
        value={props.value}
        onUpdateValue={props.onUpdateValue}
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
