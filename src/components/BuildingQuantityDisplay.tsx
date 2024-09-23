import { type PropType, computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

import { getBuilding } from '@/data'
import { useAssemblyLineComputedStore } from '@/stores/assemblyLineComputedStore'
import type { Id } from '@/types'
import { decimalRound } from '@/utils/decimalHelper'

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

    const buildingQuantityRound = computed(
      () =>
        assemblyLineComputed.value &&
        decimalRound(assemblyLineComputed.value.buildingQuantity, 0),
    )

    const buildingQuantityRound2 = computed(
      () =>
        assemblyLineComputed.value &&
        decimalRound(assemblyLineComputed.value.buildingQuantity, 2),
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
              <b>{buildingQuantityRound.value}</b>
              {buildingQuantityRound.value !== buildingQuantityRound2.value && (
                <> ({buildingQuantityRound2.value})</>
              )}
            </div>
          </div>
        </div>
      )
  },
})
