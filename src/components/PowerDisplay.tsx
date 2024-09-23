import { Decimal } from 'decimal.js'
import { type PropType, defineComponent } from 'vue'

import { decimalRound } from '@/utils/decimalHelper'

export default defineComponent({
  name: 'PowerDisplay',
  props: {
    averagePowerUsage: {
      type: Object as PropType<Decimal>,
      required: true,
    },
    powerUsageRange: Object as PropType<{ min: Decimal; max: Decimal }>,
  },
  setup(props) {
    return () => (
      <div class="flex flex-col gap-y-1">
        <div class="text-sm leading-4">
          <b>{decimalRound(props.averagePowerUsage, 1)}</b>
          {' MW'}
        </div>
        {props.powerUsageRange && (
          <div class="text-xs leading-3.5 opacity-75">
            {decimalRound(props.powerUsageRange.min, 1)} MW -{' '}
            {decimalRound(props.powerUsageRange.max, 1)} MW
          </div>
        )}
      </div>
    )
  },
})
