export type Id = string

export type PowerUsage = number | [number, number]

export interface AssemblyLine {
  id: Id
  outputItemId: Id | null
  outputsPerMinute: number | null
  recipeId: Id | null
}

export interface ModuleFactory {
  id: Id
  name: string
  remark: string
  data: AssemblyLine[]
}

export interface Item {
  id: Id
}

export interface ItemQuantity {
  itemId: Id
  quantity: number
}

export interface RecipeItemQuantity extends ItemQuantity {
  quantityPerMinute: number
}

export interface Recipe {
  id: Id
  inputs: RecipeItemQuantity[]
  outputs: RecipeItemQuantity[]
  producedIn: Id
  productionDuration: number
  powerUsage?: PowerUsage
}

export interface Building {
  id: Id
  powerUsage: PowerUsage | 'variable'
}
