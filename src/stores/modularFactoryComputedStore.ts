import { Decimal } from 'decimal.js'
import { defineStore } from 'pinia'
import { computed } from 'vue'

import type {
  AllComputed,
  Id,
  ModularFactoryComputed,
  PowerUsage,
} from '@/types'
import { calculateAveragePowerUsage } from '@/utils/dataCalculators'

import { useAssemblyLineComputedStore } from './assemblyLineComputedStore'
import { useModularFactoryStore } from './modularFactoryStore'

const makeNetValues = () => {
  const netValues: {
    itemId: Id
    netValue: Decimal
  }[] = []

  const addNetValue = (
    type: 'input' | 'output',
    itemId: Id,
    quantityPerMinute: Decimal,
  ) => {
    let netValue = netValues.find((item) => item.itemId === itemId)
    if (!netValue) {
      netValue = {
        itemId,
        netValue: new Decimal(0),
      }
      netValues.push(netValue)
    }

    netValue.netValue =
      netValue.netValue[type === 'input' ? 'sub' : 'add'](quantityPerMinute)
  }

  const getInputs = () => {
    return netValues
      .filter(({ netValue }) => netValue.lt(-0.00001))
      .sort((a, b) => a.netValue.sub(b.netValue).toNumber())
      .map(({ itemId, netValue }) => ({
        itemId,
        quantityPerMinute: netValue.abs(),
      }))
  }

  const getOutputs = () => {
    return netValues
      .filter(({ netValue }) => netValue.gt(0.00001))
      .sort((a, b) => b.netValue.sub(a.netValue).toNumber())
      .map(({ itemId, netValue }) => ({
        itemId,
        quantityPerMinute: netValue,
      }))
  }

  return { addNetValue, getInputs, getOutputs }
}

const storeKey = 'modularFactoryComputedStore'

export const useModularFactoryComputedStore = defineStore(storeKey, () => {
  const modularFactoryStore = useModularFactoryStore()
  const assemblyLineComputedStore = useAssemblyLineComputedStore()

  const data = computed(() => {
    const _data: Record<Id, ModularFactoryComputed | null> = {}

    modularFactoryStore.data.forEach(({ id, data }) => {
      const { addNetValue, getInputs, getOutputs } = makeNetValues()

      const totalPowerUsage: PowerUsage = {
        min: new Decimal(0),
        max: new Decimal(0),
      }

      data.forEach(({ id }) => {
        const assemblyLineComputed = assemblyLineComputedStore.data[id]
        if (assemblyLineComputed) {
          if (Decimal.isDecimal(assemblyLineComputed.totalPowerUsage)) {
            totalPowerUsage.min = totalPowerUsage.min.add(
              assemblyLineComputed.totalPowerUsage,
            )
            totalPowerUsage.max = totalPowerUsage.max.add(
              assemblyLineComputed.totalPowerUsage,
            )
          } else {
            totalPowerUsage.min = totalPowerUsage.min.add(
              assemblyLineComputed.totalPowerUsage.min,
            )
            totalPowerUsage.max = totalPowerUsage.max.add(
              assemblyLineComputed.totalPowerUsage.max,
            )
          }
          assemblyLineComputed.inputs.forEach(
            ({ itemId, quantityPerMinute }) => {
              addNetValue('input', itemId, quantityPerMinute)
            },
          )
          assemblyLineComputed.outputs.forEach(
            ({ itemId, quantityPerMinute }) => {
              addNetValue('output', itemId, quantityPerMinute)
            },
          )
        }
      })

      _data[id] = {
        modularFactoryId: id,
        totalPowerUsage,
        averageTotalPowerUsage: calculateAveragePowerUsage(totalPowerUsage),
        inputs: getInputs(),
        outputs: getOutputs(),
      }
    })

    return _data
  })

  const finalComputed = computed<AllComputed | null>(() => {
    if (!data.value) {
      return null
    }

    const { addNetValue, getInputs, getOutputs } = makeNetValues()

    const totalPowerUsage: PowerUsage = {
      min: new Decimal(0),
      max: new Decimal(0),
    }

    for (const key in data.value) {
      if (Object.prototype.hasOwnProperty.call(data.value, key)) {
        const dataValue = data.value[key]
        if (!dataValue) {
          continue
        }

        if (Decimal.isDecimal(dataValue.totalPowerUsage)) {
          totalPowerUsage.min = totalPowerUsage.min.add(
            dataValue.totalPowerUsage,
          )
          totalPowerUsage.max = totalPowerUsage.max.add(
            dataValue.totalPowerUsage,
          )
        } else {
          totalPowerUsage.min = totalPowerUsage.min.add(
            dataValue.totalPowerUsage.min,
          )
          totalPowerUsage.max = totalPowerUsage.max.add(
            dataValue.totalPowerUsage.max,
          )
        }

        dataValue.inputs.forEach(({ itemId, quantityPerMinute }) => {
          addNetValue('input', itemId, quantityPerMinute)
        })
        dataValue.outputs.forEach(({ itemId, quantityPerMinute }) => {
          addNetValue('output', itemId, quantityPerMinute)
        })
      }
    }

    return {
      totalPowerUsage,
      averageTotalPowerUsage: calculateAveragePowerUsage(totalPowerUsage),
      inputs: getInputs(),
      outputs: getOutputs(),
    }
  })

  return { data, finalComputed }
})
