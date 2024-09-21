import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { syncRef, useLocalStorage } from '@vueuse/core'

import type {
  AssemblyLine,
  AssemblyLineComputed,
  Id,
  ModularFactory,
} from '@/types'
import { getBuildingById, getRecipeById } from '@/data'
import {
  calculateAveragePowerUsage,
  calculateQuantityPerMinute,
  calculateTotalPowerUsage,
} from '@/utils/dataCalculators'

export const useModularFactoryList = defineStore('modularFactoryList', () => {
  const _data = useLocalStorage<ModularFactory[]>('modular-factory-list', [], {
    listenToStorageChanges: false,
  })
  const data = ref(_data.value)
  syncRef(data, _data, {
    direction: 'ltr',
  })

  const assemblyLineComputedList = computed(() => {
    const assemblyLineComputed: Record<Id, AssemblyLineComputed | null> = {}
    data.value.forEach(({ data }) => {
      data.forEach(({ id, targetItemId, targetItemSpeed, recipeId }) => {
        if (recipeId && targetItemId && targetItemSpeed) {
          const recipe = getRecipeById(recipeId)
          const building = getBuildingById(recipe.producedInId)

          // 100%频率下目标物品每次生产数量
          const targetItemQuantityPerCycle = recipe.outputs.find(
            ({ itemId }) => itemId === targetItemId,
          )!.quantityPerCycle

          // 100%频率下单个建筑每秒产出的目标物品数量
          const targetItemQuantityPerMinutePerBuilding =
            calculateQuantityPerMinute(
              targetItemQuantityPerCycle,
              recipe.productionDuration,
            )

          // 100%频率下需要的建筑数量
          const buildingQuantity =
            targetItemSpeed / targetItemQuantityPerMinutePerBuilding

          const powerUsage =
            building.powerUsage === 'variable'
              ? recipe.powerUsage
              : building.powerUsage
          const totalPowerUsage =
            powerUsage && calculateTotalPowerUsage(powerUsage, buildingQuantity)
          const averageTotalPowerUsage =
            totalPowerUsage && calculateAveragePowerUsage(totalPowerUsage)

          // 流水线总输入
          const inputs = recipe.inputs.map(({ itemId, quantityPerCycle }) => {
            return {
              itemId,
              quantityPerMinute:
                calculateQuantityPerMinute(
                  quantityPerCycle,
                  recipe.productionDuration,
                ) * buildingQuantity,
            }
          })

          // 流水线总输出
          const outputs = recipe.outputs.map(({ itemId, quantityPerCycle }) => {
            return {
              itemId,
              quantityPerMinute:
                calculateQuantityPerMinute(
                  quantityPerCycle,
                  recipe.productionDuration,
                ) * buildingQuantity,
            }
          })

          assemblyLineComputed[id] = {
            buildingId: building.id,
            buildingQuantity,
            powerUsage,
            totalPowerUsage,
            averageTotalPowerUsage,
            inputs,
            outputs,
          }
        } else {
          assemblyLineComputed[id] = null
        }
      })
    })
    return assemblyLineComputed
  })

  // 自增ID
  let currentId: Id = Math.max(
    0,
    ...data.value.map(({ id, data }) => {
      return Math.max(id, ...data.map(({ id }) => id))
    }),
  )
  const generateId = () => {
    return ++currentId
  }

  const newModularFactory = (): Id => {
    const id = generateId()
    data.value.unshift({
      id,
      name: `Factory_${id}`,
      remark: '',
      data: [],
    })
    return id
  }

  const deleteModularFactory = (modularFactoryId: Id) => {
    data.value = data.value.filter(({ id }) => id !== modularFactoryId)
  }

  const getModularFactory = (modularFactoryId: Id): ModularFactory => {
    return data.value.find(({ id }) => id === modularFactoryId)!
  }

  const newAssemblyLine = (modularFactoryId: Id): Id => {
    const modularFactory = getModularFactory(modularFactoryId)
    const id = generateId()
    modularFactory.data.unshift({
      id,
      targetItemId: null,
      targetItemSpeed: null,
      recipeId: null,
    })
    return id
  }

  const deleteAssemblyLine = (modularFactoryId: Id, assemblyLineId: Id) => {
    const modularFactory = getModularFactory(modularFactoryId)
    modularFactory.data = modularFactory.data.filter(
      ({ id }) => id !== assemblyLineId,
    )
  }

  const getAssemblyLine = (assemblyLineId: Id): AssemblyLine => {
    const modularFactory = data.value.find(({ data }) => {
      return data.some(({ id }) => id === assemblyLineId)
    })!
    return modularFactory.data.find(({ id }) => id === assemblyLineId)!
  }

  const deleteAll = () => {
    data.value = []
  }

  return {
    data,
    assemblyLineComputedList,
    newModularFactory,
    deleteModularFactory,
    getModularFactory,
    newAssemblyLine,
    deleteAssemblyLine,
    getAssemblyLine,
    deleteAll,
  }
})
