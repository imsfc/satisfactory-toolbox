import { computed } from 'vue'
import { defineStore } from 'pinia'
import Decimal from 'decimal.js'

import type {
  AllComputed,
  Id,
  ModularFactoryComputed,
  PowerUsage,
} from '@/types'

import { useModularFactoryStore } from './modularFactoryStore'
import { useAssemblyLineComputedStore } from './assemblyLineComputedStore'
import { isObject } from 'radash'
import { calculateAveragePowerUsage } from '@/utils/dataCalculators'

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
      .filter(({ netValue }) => netValue.lt(0))
      .sort((a, b) => a.netValue.sub(b.netValue).toNumber())
      .map(({ itemId, netValue }) => ({
        itemId,
        quantityPerMinute: netValue.abs(),
      }))
  }

  const getOutputs = () => {
    return netValues
      .filter(({ netValue }) => netValue.gt(0))
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

    Object.values(data.value)
      .filter((data) => isObject(data))
      .forEach(({ totalPowerUsage: _totalPowerUsage, inputs, outputs }) => {
        if (Decimal.isDecimal(_totalPowerUsage)) {
          totalPowerUsage.min = totalPowerUsage.min.add(_totalPowerUsage)
          totalPowerUsage.max = totalPowerUsage.max.add(_totalPowerUsage)
        } else {
          totalPowerUsage.min = totalPowerUsage.min.add(_totalPowerUsage.min)
          totalPowerUsage.max = totalPowerUsage.max.add(_totalPowerUsage.max)
        }
        inputs.forEach(({ itemId, quantityPerMinute }) => {
          addNetValue('input', itemId, quantityPerMinute)
        })
        outputs.forEach(({ itemId, quantityPerMinute }) => {
          addNetValue('output', itemId, quantityPerMinute)
        })
      })

    return {
      totalPowerUsage,
      averageTotalPowerUsage: calculateAveragePowerUsage(totalPowerUsage),
      inputs: getInputs(),
      outputs: getOutputs(),
    }
  })

  return { data, finalComputed }
})
