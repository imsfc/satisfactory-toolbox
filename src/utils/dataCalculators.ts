import { Decimal } from 'decimal.js'

export const calculateQuantityPerMinute = (
  quantity: number,
  productionDuration: number,
) => {
  const cyclesPerMinute = new Decimal(60).div(productionDuration).toNumber()
  return new Decimal(quantity).mul(cyclesPerMinute).toNumber()
}
