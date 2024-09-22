import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { syncRef, useLocalStorage } from '@vueuse/core'
import Decimal from 'decimal.js'

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

  const assemblyLineComputedRecord = computed(() => {
    const _data: Record<Id, AssemblyLineComputed | null> = {}
    data.value.forEach(({ data }) => {
      data.forEach(
        ({ id, targetItemId, targetItemSpeed, recipeId, clockSpeed }) => {
          if (recipeId && targetItemId && targetItemSpeed && clockSpeed) {
            const recipe = getRecipeById(recipeId)
            const building = getBuildingById(recipe.producedInId)

            // 配方输出的目标物品对象
            const targetOutputItem = recipe.outputs.find(
              ({ itemId }) => itemId === targetItemId,
            )

            // 目标物品 和 配方 选择不匹配
            if (!targetOutputItem) {
              _data[id] = null
              return
            }

            // 目标物品每周期生产数量
            const targetItemQuantityPerCycle = targetOutputItem.quantityPerCycle

            // 目标物品 100% 频率每分钟生产数量
            const targetItemQuantityPerMinutePerBuilding =
              calculateQuantityPerMinute(
                targetItemQuantityPerCycle,
                recipe.productionDuration,
              )

            // 达到目标产量需要的总频率
            const totalClockSpeed = new Decimal(targetItemSpeed)
              .div(targetItemQuantityPerMinutePerBuilding)
              .toNumber()

            // 需要的建筑数量
            const buildingQuantity = new Decimal(targetItemSpeed)
              .div(
                new Decimal(targetItemQuantityPerMinutePerBuilding).mul(
                  clockSpeed,
                ),
              )
              .toNumber()

            // 目标物品 100% 频率的功率
            const powerUsage =
              building.powerUsage === 'variable'
                ? recipe.powerUsage
                : building.powerUsage

            // 总功率
            const totalPowerUsage =
              powerUsage &&
              calculateTotalPowerUsage(powerUsage, buildingQuantity, clockSpeed)
            const averageTotalPowerUsage =
              totalPowerUsage && calculateAveragePowerUsage(totalPowerUsage)

            // 流水线总输入
            const inputs = recipe.inputs.map(({ itemId, quantityPerCycle }) => {
              return {
                itemId,
                quantityPerMinute: new Decimal(
                  calculateQuantityPerMinute(
                    quantityPerCycle,
                    recipe.productionDuration,
                  ),
                )
                  .mul(totalClockSpeed)
                  .toNumber(),
              }
            })

            // 流水线总输出
            const outputs = recipe.outputs.map(
              ({ itemId, quantityPerCycle }) => {
                return {
                  itemId,
                  quantityPerMinute: new Decimal(
                    calculateQuantityPerMinute(
                      quantityPerCycle,
                      recipe.productionDuration,
                    ),
                  )
                    .mul(totalClockSpeed)
                    .toNumber(),
                }
              },
            )

            _data[id] = {
              buildingId: building.id,
              buildingQuantity,
              powerUsage,
              totalPowerUsage,
              averageTotalPowerUsage,
              inputs,
              outputs,
            }
          } else {
            _data[id] = null
          }
        },
      )
    })
    return _data
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
      clockSpeed: 1,
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
    assemblyLineComputedRecord,
    newModularFactory,
    deleteModularFactory,
    getModularFactory,
    newAssemblyLine,
    deleteAssemblyLine,
    getAssemblyLine,
    deleteAll,
  }
})
