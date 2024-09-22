import { Decimal } from 'decimal.js'

import type { PowerUsage } from '@/types'

const overclockingPowerIndex = 1.321928

export const calculateQuantityPerMinute = (
  quantityPerCycle: number,
  productionDuration: number,
) => {
  const cyclesPerMinute = new Decimal(60).div(productionDuration).toNumber()
  return new Decimal(quantityPerCycle).mul(cyclesPerMinute).toNumber()
}

export const calculateTotalPowerUsage = (
  powerUsage: PowerUsage,
  buildingQuantity: number,
  clockSpeed: number,
): PowerUsage => {
  const powerMul = new Decimal(clockSpeed).pow(overclockingPowerIndex)
  if (typeof powerUsage === 'number') {
    return powerMul.mul(powerUsage).mul(buildingQuantity).toNumber()
  }
  return [
    powerMul.mul(powerUsage[0]).mul(buildingQuantity).toNumber(),
    powerMul.mul(powerUsage[1]).mul(buildingQuantity).toNumber(),
  ]
}

export const calculateAveragePowerUsage = (powerUsage: PowerUsage): number => {
  if (typeof powerUsage === 'number') {
    return powerUsage
  }
  return new Decimal(powerUsage[0]).add(powerUsage[1]).div(2).toNumber()
}
