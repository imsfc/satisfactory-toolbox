import Decimal from 'decimal.js'
import { NDropdown, NInputNumber } from 'naive-ui'
import {
  type PropType,
  computed,
  defineComponent,
  ref,
  withModifiers,
} from 'vue'
import { useI18n } from 'vue-i18n'

import { useAssemblyLineComputedStore } from '@/stores/assemblyLineComputedStore'
import { useModularFactoryStore } from '@/stores/modularFactoryStore'
import type { Id } from '@/types'
import { decimalRound } from '@/utils/decimalHelper'

export default defineComponent({
  name: 'ClockSpeed',
  props: {
    assemblyLineId: {
      type: [String, Number] as PropType<Id>,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n()

    const modularFactoryStore = useModularFactoryStore()

    const assemblyLine = computed(() => {
      return modularFactoryStore.getAssemblyLine(props.assemblyLineId)
    })

    const assemblyLineComputedStore = useAssemblyLineComputedStore()

    const dropdownX = ref(0)
    const dropdownY = ref(0)
    const showDropdown = ref(false)

    return () => (
      <>
        <NInputNumber
          value={
            assemblyLine.value.clockSpeed &&
            new Decimal(assemblyLine.value.clockSpeed).mul(100).toNumber()
          }
          onUpdateValue={(value) => {
            modularFactoryStore.setAssemblyLineClockSpeed(
              props.assemblyLineId,
              value && decimalRound(new Decimal(value).div(100), 6),
            )
          }}
          min={1}
          max={250}
          // @ts-ignore
          onContextmenu={withModifiers<(e: MouseEvent) => void>(
            (e) => {
              dropdownX.value = e.clientX
              dropdownY.value = e.clientY
              showDropdown.value = true
            },
            ['prevent'],
          )}
        />
        <NDropdown
          placement="bottom-start"
          trigger="manual"
          x={dropdownX.value}
          y={dropdownY.value}
          options={[{ label: t('energySaving'), key: 'down' }]}
          show={showDropdown.value}
          onClickoutside={() => {
            showDropdown.value = false
          }}
          onSelect={() => {
            const buildingQuantity =
              assemblyLineComputedStore.data[props.assemblyLineId]
                ?.buildingQuantity
            if (buildingQuantity && assemblyLine.value.clockSpeed) {
              assemblyLine.value.clockSpeed = decimalRound(
                buildingQuantity
                  .div(buildingQuantity.ceil())
                  .mul(assemblyLine.value.clockSpeed),
                6,
              )
            }
          }}
        />
      </>
    )
  },
})
