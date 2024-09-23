import Decimal from 'decimal.js'

export const decimalRound = (
  decimal: Decimal | number,
  decimalPlaces: number,
  rounding: Decimal.Rounding = Decimal.ROUND_UP,
) => {
  return new Decimal(decimal).toDP(decimalPlaces, rounding).toNumber()
}
