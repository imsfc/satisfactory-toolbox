import { Decimal } from 'decimal.js'
import { defineStore } from 'pinia'
import { computed } from 'vue'

import { getBuilding, getRecipe } from '@/data'
import type { AssemblyLineComputed, Id } from '@/types'
import {
  calculateAveragePowerUsage,
  calculateQuantityPerMinute,
  calculateTotalPowerUsage,
} from '@/utils/dataCalculators'

import { useModularFactoryStore } from './modularFactoryStore'

const storeKey = 'assemblyLineComputedStore'

export const useAssemblyLineComputedStore = defineStore(storeKey, () => {
  const modularFactoryStore = useModularFactoryStore()

  const data = computed(() => {
    const _data: Record<Id, AssemblyLineComputed | null> = {}

    modularFactoryStore.data.forEach(({ data }) => {
      data.forEach(
        ({
          id,
          targetItemType,
          targetItemId,
          targetItemSpeed: targetItemSpeedNumber,
          recipeId,
          clockSpeed: clockSpeedNumber,
        }) => {
          if (
            targetItemType &&
            targetItemId &&
            targetItemSpeedNumber &&
            recipeId &&
            clockSpeedNumber
          ) {
            const targetItemSpeed = new Decimal(targetItemSpeedNumber)
            const clockSpeed = new Decimal(clockSpeedNumber)

            // 选择的配方
            const recipe = getRecipe(recipeId)

            // 配方的建筑
            const building = getBuilding(recipe.producedInId)

            // 配方中的的目标物品对象
            const targetOutputItem = recipe[
              targetItemType === 'input' ? 'inputs' : 'outputs'
            ].find(({ itemId }) => itemId === targetItemId)

            // 目标物品和配方不匹配
            if (!targetOutputItem) {
              _data[id] = null
              return
            }

            // 每栋建筑每分钟的目标物品产量
            const targetItemQuantityPerMinutePerBuilding =
              calculateQuantityPerMinute(
                targetOutputItem.quantityPerCycle,
                recipe.productionDuration,
              )

            // 需要的总时钟速度 = 目标每分钟产量 ÷ 每栋建筑每分钟的目标物品产量
            const totalClockSpeed = targetItemSpeed.div(
              targetItemQuantityPerMinutePerBuilding,
            )

            // 需要的建筑数量 = 总时钟速度 ÷ 建筑的时钟速度
            const buildingQuantity = totalClockSpeed.div(clockSpeed)

            // 标准功率
            const powerUsage =
              recipe.powerUsage ?? building.powerUsage ?? new Decimal(0)

            // 总功率
            const totalPowerUsage = calculateTotalPowerUsage(
              powerUsage,
              clockSpeed,
              buildingQuantity,
            )

            // 平均总功率
            const averageTotalPowerUsage =
              calculateAveragePowerUsage(totalPowerUsage)

            const inputs = recipe.inputs.map(({ itemId, quantityPerCycle }) => {
              return {
                itemId,
                quantityPerMinute: calculateQuantityPerMinute(
                  quantityPerCycle,
                  recipe.productionDuration,
                ).mul(totalClockSpeed),
              }
            })

            const outputs = recipe.outputs.map(
              ({ itemId, quantityPerCycle }) => {
                return {
                  itemId,
                  quantityPerMinute: calculateQuantityPerMinute(
                    quantityPerCycle,
                    recipe.productionDuration,
                  ).mul(totalClockSpeed),
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

  return { data }
})
