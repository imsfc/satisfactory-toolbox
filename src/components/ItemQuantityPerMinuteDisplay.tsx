import { computed, defineComponent, type PropType } from 'vue'
import { I18nT, useI18n } from 'vue-i18n'
import Decimal from 'decimal.js'

import { ItemType, type Id } from '@/types'
import { getItem } from '@/data'

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
              <b>{quantityPerMinuteDP.value}</b>
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
