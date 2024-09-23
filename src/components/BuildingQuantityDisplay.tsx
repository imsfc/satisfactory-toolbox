import { Decimal } from 'decimal.js'
import { type PropType, computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

import { getBuilding } from '@/data'
import { useAssemblyLineComputedStore } from '@/stores/assemblyLineComputedStore'
import type { Id } from '@/types'

import BuildingImage from './BuildingImage'

export default defineComponent({
  name: 'BuildingQuantityDisplay',
  props: {
    assemblyLineId: {
      type: [String, Number] as PropType<Id>,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n()

    const assemblyLineComputedStore = useAssemblyLineComputedStore()

    const assemblyLineComputed = computed(
      () => assemblyLineComputedStore.data[props.assemblyLineId],
    )

    const building = computed(
      () =>
        assemblyLineComputed.value &&
        getBuilding(assemblyLineComputed.value.buildingId),
    )

    const buildingQuantityDP = computed(
      () =>
        assemblyLineComputed.value &&
        assemblyLineComputed.value.buildingQuantity
          .toDP(0, Decimal.ROUND_UP)
          .toNumber(),
    )

    const buildingQuantityDP2 = computed(
      () =>
        assemblyLineComputed.value &&
        assemblyLineComputed.value.buildingQuantity
          .toDP(2, Decimal.ROUND_UP)
          .toNumber(),
    )

    return () =>
      building.value && (
        <div class="flex items-center gap-x-3">
          <BuildingImage
            name={building.value.key}
            sizes={[48, 96, 144]}
            formats={['avif', 'webp', 'png']}
          />
          <div class="flex flex-col gap-y-0.5">
            <div class="text-sm leading-4 truncate">
              {t(`buildings.${building.value.key}`)}
            </div>
            <div class="text-xs leading-3.5 opacity-75">
              <b>{buildingQuantityDP.value}</b>
              {buildingQuantityDP.value !== buildingQuantityDP2.value && (
                <> ({buildingQuantityDP2.value})</>
              )}
            </div>
          </div>
        </div>
      )
  },
})
