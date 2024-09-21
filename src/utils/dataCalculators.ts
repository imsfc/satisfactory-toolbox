import { Decimal } from 'decimal.js'

export const calculatePerMinute = (
  quantity: number,
  productionDuration: number,
) => {
  return new Decimal(quantity)
    .div(new Decimal(productionDuration).div(new Decimal(60)))
    .toNumber()
}
