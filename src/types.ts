export type Id = number

export type PowerUsage = number | [number, number]

export interface Building {
  id: Id
  key: string
  powerUsage: PowerUsage | 'variable'
}

export interface Item {
  id: Id
  key: string
  type: 'solid' | 'fluid'
}

export interface ItemQuantityPerCycle {
  itemId: Id
  quantityPerCycle: number
}

export interface ItemQuantityPerMinute {
  itemId: Id
  quantityPerMinute: number
}

export interface Recipe {
  id: Id
  key: string
  inputs: ItemQuantityPerCycle[]
  outputs: ItemQuantityPerCycle[]
  producedInId: Id
  productionDuration: number
  powerUsage?: PowerUsage // producedIn.powerUsage === 'variable' 时生效
}

export interface ModularFactory {
  id: Id
  name: string
  remark: string
  data: AssemblyLine[]
}

export interface AssemblyLine {
  id: Id
  targetItemId: Id | null
  targetItemSpeed: number | null
  recipeId: Id | null
  clockSpeed: number | null
}

export interface AssemblyLineComputed {
  buildingId: Id
  buildingQuantity: number
  powerUsage?: PowerUsage
  totalPowerUsage?: PowerUsage
  averageTotalPowerUsage?: number
  inputs: ItemQuantityPerMinute[]
  outputs: ItemQuantityPerMinute[]
}
