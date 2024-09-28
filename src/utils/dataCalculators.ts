import { Decimal } from 'decimal.js'

import type { PowerUsage } from '@/types'

// 超频功率指数
const OVERCLOCKING_POWER_EXPONENT = 1.321928

// 计算每分钟的产量
export const calculateQuantityPerMinute = (
  quantityPerCycle: Decimal,
  productionDuration: Decimal,
) => {
  // 每分钟的周期数
  const cyclesPerMinute = Decimal.div(60, productionDuration)
  // 每分钟的产量 = 每周期数量 × 每分钟的周期数
  return Decimal.mul(quantityPerCycle, cyclesPerMinute)
}

// 计算功率
export const calculatePowerUsage = (
  powerUsage: PowerUsage,
  clockSpeed: Decimal,
) => {
  // 超频功率乘数 = 时钟速度 的 超频功率指数 次方
  const overclockingPowerMultiplier = Decimal.pow(
    clockSpeed,
    OVERCLOCKING_POWER_EXPONENT,
  )
  if (Decimal.isDecimal(powerUsage)) {
    return Decimal.mul(
      powerUsage,
      powerUsage.lt(0) ? clockSpeed : overclockingPowerMultiplier,
    )
  }
  return {
    min: Decimal.mul(
      powerUsage.min,
      powerUsage.min.lt(0) ? clockSpeed : overclockingPowerMultiplier,
    ),
    max: Decimal.mul(
      powerUsage.max,
      powerUsage.min.lt(0) ? clockSpeed : overclockingPowerMultiplier,
    ),
  }
}

// 计算总功率
export const calculateTotalPowerUsage = (
  powerUsage: PowerUsage,
  clockSpeed: Decimal,
  buildingQuantity: Decimal,
): PowerUsage => {
  const powerUsagePerBuilding = calculatePowerUsage(powerUsage, clockSpeed)

  if (Decimal.isDecimal(powerUsagePerBuilding)) {
    return Decimal.mul(powerUsagePerBuilding, buildingQuantity)
  }
  return {
    min: Decimal.mul(powerUsagePerBuilding.min, buildingQuantity),
    max: Decimal.mul(powerUsagePerBuilding.max, buildingQuantity),
  }
}

export const calculateAveragePowerUsage = (powerUsage: PowerUsage): Decimal => {
  if (Decimal.isDecimal(powerUsage)) {
    return powerUsage
  }
  return Decimal.add(powerUsage.min, powerUsage.max).div(2)
}
