export type Id = string

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
  name: string
}

export interface ItemAmount {
  itemId: Id
  amount: number
}

export interface Recipe {
  id: Id
  name: string
  input: ItemAmount[]
  output: ItemAmount[]
  producedIn: Id
  producedInTime: number
}

export interface Building {
  id: Id
  name: string
  powerUsage: number
}