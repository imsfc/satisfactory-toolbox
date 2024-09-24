import { Decimal } from 'decimal.js'
import { NPopover } from 'naive-ui'
import { type PropType, computed, defineComponent } from 'vue'
import { I18nT, useI18n } from 'vue-i18n'

import { conveyorBelts, getItem, pipelines } from '@/data'
import { type Id, ItemType } from '@/types'
import { decimalRound } from '@/utils/decimalHelper'

import BuildingImage from './BuildingImage'
import ItemImage from './ItemImage'

export default defineComponent({
  name: 'ItemQuantityPerMinuteDisplay',
  props: {
    itemId: {
      type: [Number, String] as PropType<Id>,
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

    const quantityPerMinuteRound4 = computed(() =>
      decimalRound(props.quantityPerMinute, 4),
    )

    return () => (
      <div class="flex items-center gap-x-3">
        <ItemImage
          name={item.value.key}
          sizes={[32, 64, 96]}
          formats={['avif', 'webp', 'png']}
        />
        <div class="flex flex-col gap-y-0.5">
          <div class="text-sm leading-4 truncate">
            {t(`items.${item.value.key}`)}
          </div>
          <div class="text-xs leading-3.5 opacity-75 truncate">
            <I18nT keypath="unitsPerMinute" scope="global">
              <NPopover>
                {{
                  trigger: () => (
                    <b class="cursor-help hover:underline decoration-dashed underline-offset-2">
                      {quantityPerMinuteRound4.value}
                    </b>
                  ),
                  default: () => (
                    <div class="flex flex-col gap-y-1">
                      {(item.value.type === ItemType.solid
                        ? conveyorBelts
                        : pipelines
                      ).map(({ key, itemsPerMinute }) => {
                        const quantityPerMinuteRound = decimalRound(
                          props.quantityPerMinute.div(itemsPerMinute),
                          0,
                        )
                        const quantityPerMinuteRound2 = decimalRound(
                          props.quantityPerMinute.div(itemsPerMinute),
                          2,
                        )
                        return (
                          <div class="flex items-center gap-x-1">
                            <BuildingImage
                              name={key}
                              sizes={[48, 96]}
                              formats={['avif', 'webp', 'png']}
                              width={24}
                              height={24}
                            />
                            <span>{t(`buildings.${key}`)}</span>
                            <span>: </span>
                            <span>
                              <b>{quantityPerMinuteRound}</b>
                              {quantityPerMinuteRound !==
                                quantityPerMinuteRound2 && (
                                <span> ({quantityPerMinuteRound2})</span>
                              )}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  ),
                }}
              </NPopover>
              {t(
                item.value.type === ItemType.solid
                  ? 'itemUnitName'
                  : 'fluidUnitName',
                quantityPerMinuteRound4.value,
              )}
            </I18nT>
          </div>
        </div>
      </div>
    )
  },
})
