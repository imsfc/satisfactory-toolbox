import { Decimal } from 'decimal.js'
import { type PropType, defineComponent } from 'vue'

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
          <b>{props.averagePowerUsage.toDP(1).toNumber()}</b>
          {' MW'}
        </div>
        {props.powerUsageRange && (
          <div class="text-xs leading-3.5 opacity-75">
            {props.powerUsageRange.min.toDP(1).toNumber()} MW -{' '}
            {props.powerUsageRange.max.toDP(1).toNumber()} MW
          </div>
        )}
      </div>
    )
  },
})
