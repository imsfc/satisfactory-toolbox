import type { Decimal } from 'decimal.js'

export type Id = number | string

export type PowerUsage = Decimal | { min: Decimal; max: Decimal }
export type PowerUsageJson = number | { min: number; max: number }

export interface Building {
  id: Id
  key: string
  powerUsage?: PowerUsage
}

export type BuildingsJson = Omit<Building, 'powerUsage'> & {
  powerUsage?: PowerUsageJson
}

export enum ItemType {
  solid,
  fluid,
}

export interface Item {
  id: Id
  key: string
  type: ItemType
}

export type ItemJson = Item

export interface ItemQuantityPerCycle {
  itemId: Id
  quantityPerCycle: Decimal
}

export type ItemQuantityPerCycleJson = Omit<
  ItemQuantityPerCycle,
  'quantityPerCycle'
> & {
  quantityPerCycle: number
}

export interface ItemQuantityPerMinute {
  itemId: Id
  quantityPerMinute: Decimal
}

export interface Recipe {
  id: Id
  key: string
  inputs: ItemQuantityPerCycle[]
  outputs: ItemQuantityPerCycle[]
  producedInId: Id
  productionDuration: Decimal
  powerUsage?: PowerUsage
}

export type RecipeJson = Omit<
  Recipe,
  'inputs' | 'outputs' | 'productionDuration' | 'powerUsage'
> & {
  inputs: ItemQuantityPerCycleJson[]
  outputs: ItemQuantityPerCycleJson[]
  productionDuration: number
  powerUsage?: PowerUsageJson
}

export interface AssemblyLine {
  id: Id
  targetItemType: 'input' | 'output'
  targetItemId: Id | null
  targetItemSpeed: number | null
  recipeId: Id | null
  clockSpeed: number | null
}

export interface AssemblyLineComputed {
  buildingId: Id
  buildingQuantity: Decimal
  powerUsage: PowerUsage
  totalPowerUsage: PowerUsage
  averageTotalPowerUsage: Decimal
  inputs: ItemQuantityPerMinute[]
  outputs: ItemQuantityPerMinute[]
}

export interface ModularFactory {
  id: Id
  name: string
  remark: string
  data: AssemblyLine[]
}

export interface ModularFactoryComputed {
  modularFactoryId: Id
  totalPowerUsage: PowerUsage
  averageTotalPowerUsage: Decimal
  inputs: ItemQuantityPerMinute[]
  outputs: ItemQuantityPerMinute[]
}

export interface AllComputed {
  totalPowerUsage: PowerUsage
  averageTotalPowerUsage: Decimal
  inputs: ItemQuantityPerMinute[]
  outputs: ItemQuantityPerMinute[]
}
