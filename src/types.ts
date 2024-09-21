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
}

export interface ItemQuantity {
  itemId: Id
  quantity: number
}

export interface Recipe {
  id: Id
  key: string
  inputs: ItemQuantity[]
  outputs: ItemQuantity[]
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
}
