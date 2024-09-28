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
          <b>
            {props.averagePowerUsage.lt(0) && '+'}
            {decimalRound(props.averagePowerUsage.abs(), 1)}
          </b>
          {' MW'}
        </div>
        {props.powerUsageRange && (
          <div class="text-xs leading-3.5 opacity-75">
            {props.powerUsageRange.min.lt(0) && '+'}
            {decimalRound(props.powerUsageRange.min.abs(), 1)} MW -{' '}
            {props.powerUsageRange.max.lt(0) && '+'}
            {decimalRound(props.powerUsageRange.max.abs(), 1)} MW
          </div>
        )}
      </div>
    )
  },
})
