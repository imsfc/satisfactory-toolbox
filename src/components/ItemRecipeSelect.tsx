import type { Decimal } from 'decimal.js'
import { NSelect } from 'naive-ui'
import { type PropType, computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

import { getBuilding, getItem, getRecipe, recipes } from '@/data'
import type { Id } from '@/types'
import { calculateQuantityPerMinute } from '@/utils/dataCalculators'

import BuildingImage from './BuildingImage'
import ItemImage from './ItemImage'

const ItemRecipeSelectLabelItem = defineComponent({
  name: 'ItemRecipeSelectLabelItem',
  props: {
    itemId: {
      type: [Number, String] as PropType<Id>,
      required: true,
    },
    quantityPerCycle: {
      type: Object as PropType<Decimal>,
      required: true,
    },
    quantityPerMinute: {
      type: Object as PropType<Decimal>,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n()

    const item = computed(() => getItem(props.itemId))

    return () => (
      <div class="flex flex-col items-center gap-y-1">
        <ItemImage
          name={item.value.key}
          sizes={[32, 64, 96]}
          formats={['avif', 'webp', 'png']}
        />
        <div class="w-16 flex flex-col grow text-xs text-center whitespace-normal">
          <div class="grow line-clamp-2">
            {props.quantityPerCycle.toNumber()}×{t(`items.${item.value.key}`)}
          </div>
          <div class="opacity-75 truncate">
            {props.quantityPerMinute.toNumber()}
            {t('perMinute')}
          </div>
        </div>
      </div>
    )
  },
})

const ItemRecipeSelectLabel = defineComponent({
  name: 'ItemRecipeSelectLabel',
  props: {
    label: {
      type: String,
      required: true,
    },
    recipeId: {
      type: [Number, String] as PropType<Id>,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n()

    const recipe = computed(() => getRecipe(props.recipeId))
    const building = computed(() => getBuilding(recipe.value.producedInId))

    return () => (
      <div class="py-2 flex items-center gap-x-3">
        <div class="flex flex-col gap-y-2">
          <BuildingImage
            name={building.value.key}
            sizes={[48, 96, 144]}
            formats={['avif', 'webp', 'png']}
          />
          <div class="w-12 text-xs text-center whitespace-normal">
            {t(`buildings.${building.value.key}`)}
          </div>
        </div>
        <div class="flex flex-col gap-y-2">
          <div class="text-sm">{props.label}</div>
          <div class="flex gap-x-3">
            <div class="flex gap-x-3">
              {recipe.value.inputs.map(({ itemId, quantityPerCycle }) => (
                <ItemRecipeSelectLabelItem
                  key={itemId}
                  itemId={itemId}
                  quantityPerCycle={quantityPerCycle}
                  quantityPerMinute={calculateQuantityPerMinute(
                    quantityPerCycle,
                    recipe.value.productionDuration,
                  )}
                />
              ))}
            </div>
            <div class="w-12 self-center flex flex-col justify-center items-center gap-y-2">
              <div class="text-xl leading-none">→</div>
              <div class="text-sm leading-none">
                {recipe.value.productionDuration.toNumber()}
                {t('seconds')}
              </div>
            </div>
            <div class="flex gap-x-3">
              {recipe.value.outputs.map(({ itemId, quantityPerCycle }) => (
                <ItemRecipeSelectLabelItem
                  key={itemId}
                  itemId={itemId}
                  quantityPerCycle={quantityPerCycle}
                  quantityPerMinute={calculateQuantityPerMinute(
                    quantityPerCycle,
                    recipe.value.productionDuration,
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  },
})

export default defineComponent({
  name: 'ItemRecipeSelect',
  props: {
    value: Number as PropType<Id | null>,
    onUpdateValue: Function as PropType<(value: Id | null) => void>,
    itemType: String as PropType<'input' | 'output'>,
    itemId: Number as PropType<Id | null>,
  },
  setup(props) {
    const { t } = useI18n()

    const options = computed(() => {
      if (props.itemId) {
        return recipes
          .filter(({ inputs, outputs }) => {
            return (props.itemType === 'input' ? inputs : outputs).some(
              ({ itemId }) => itemId === props.itemId,
            )
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

    type Option = (typeof options.value)[number]

    return () => (
      <NSelect
        value={props.value}
        onUpdateValue={props.onUpdateValue}
        options={options.value}
        consistentMenuWidth={false}
        renderLabel={(option: Option) => (
          <ItemRecipeSelectLabel label={option.label} recipeId={option.value} />
        )}
        renderTag={({ option }) => option.label as Option['label']}
        filterable
        clearable
      />
    )
  },
})
