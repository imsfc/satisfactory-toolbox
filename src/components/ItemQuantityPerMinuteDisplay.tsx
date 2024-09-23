import { Decimal } from 'decimal.js'
import { NPopover } from 'naive-ui'
import { type PropType, computed, defineComponent } from 'vue'
import { I18nT, useI18n } from 'vue-i18n'

import { conveyorBelts, getItem, pipelines } from '@/data'
import { type Id, ItemType } from '@/types'

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

    const quantityPerMinuteDP = computed(() =>
      props.quantityPerMinute.toDP(4, Decimal.ROUND_UP).toNumber(),
    )

    return () => (
      <div class="flex items-center gap-x-3">
        <ItemImage
          name={item.value.key}
          sizes={[32, 64, 96]}
          formats={['avif', 'webp', 'png']}
        />
        <div class="flex flex-col gap-y-0.5">
          <div class="text-sm leading-3.5 truncate">
            {t(`items.${item.value.key}`)}
          </div>
          <div class="text-xs leading-4 opacity-75 truncate">
            <I18nT keypath="unitsPerMinute" scope="global">
              <NPopover>
                {{
                  trigger: () => (
                    <b class="cursor-help hover:underline decoration-dashed underline-offset-2">
                      {quantityPerMinuteDP.value}
                    </b>
                  ),
                  default: () => (
                    <div class="flex flex-col gap-y-1">
                      {(item.value.type === ItemType.solid
                        ? conveyorBelts
                        : pipelines
                      ).map(({ key, itemsPerMinute }) => (
                        <div class="flex items-center gap-x-1">
                          <BuildingImage
                            name={key}
                            sizes={[48, 96]}
                            formats={['avif', 'webp', 'png']}
                            width={24}
                            height={24}
                          />
                          <span>{t(`buildings.${key}`)}</span>
                          <span>
                            <b>
                              {props.quantityPerMinute
                                .div(itemsPerMinute)
                                .toDP(0, Decimal.ROUND_UP)
                                .toNumber()}
                            </b>{' '}
                            (
                            {props.quantityPerMinute
                              .div(itemsPerMinute)
                              .toDP(1, Decimal.ROUND_UP)
                              .toNumber()}
                            )
                          </span>
                        </div>
                      ))}
                    </div>
                  ),
                }}
              </NPopover>
              {t(
                item.value.type === ItemType.solid
                  ? 'itemUnitName'
                  : 'fluidUnitName',
                quantityPerMinuteDP.value,
              )}
            </I18nT>
          </div>
        </div>
      </div>
    )
  },
})
