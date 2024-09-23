import { Decimal } from 'decimal.js'
import { isNumber, isObject } from 'radash'

import type {
  Building,
  BuildingsJson,
  Id,
  Item,
  ItemJson,
  ItemQuantityPerCycle,
  ItemQuantityPerCycleJson,
  PowerUsage,
  PowerUsageJson,
  Recipe,
  RecipeJson,
} from '@/types'

import buildingsJson from './buildings.json'
import itemsJson from './items.json'
import recipesJson from './recipes.json'

const parseDecimal = (value: number): Decimal => {
  return new Decimal(value)
}

const parsePowerUsage = (
  powerUsageJson?: PowerUsageJson,
): PowerUsage | undefined => {
  if (isNumber(powerUsageJson)) {
    return parseDecimal(powerUsageJson)
  }
  if (isObject(powerUsageJson)) {
    return {
      min: parseDecimal(powerUsageJson.min),
      max: parseDecimal(powerUsageJson.max),
    }
  }
  return undefined
}

const parseQuantityPerCycle = ({
  itemId,
  quantityPerCycle,
}: ItemQuantityPerCycleJson): ItemQuantityPerCycle => {
  return {
    itemId,
    quantityPerCycle: parseDecimal(quantityPerCycle),
  }
}

// 建筑数据
export const buildings: Building[] = []
export const buildingMap: Record<Id, Building> = {}
export const getBuilding = (id: Id) => {
  const building = buildingMap[id]
  if (!building) {
    throw new Error(`Building not found: ${id}`)
  }
  return building
}

buildingsJson.forEach(({ id, key, powerUsage }: BuildingsJson) => {
  const building: Building = {
    id,
    key,
    powerUsage: parsePowerUsage(powerUsage),
  }
  buildings.push(building)
  buildingMap[id] = building
})

// 物品数据
export const items: Item[] = []
export const itemMap: Record<Id, Item> = {}
export const getItem = (id: Id) => {
  const item = itemMap[id]
  if (!item) {
    throw new Error(`Item not found: ${id}`)
  }
  return item
}

itemsJson.forEach(({ id, key, type }: ItemJson) => {
  const item: Item = {
    id,
    key,
    type,
  }
  items.push(item)
  itemMap[id] = item
})

// 配方数据
export const recipes: Recipe[] = []
export const recipeMap: Record<Id, Recipe> = {}
export const getRecipe = (id: Id) => {
  const recipe = recipeMap[id]
  if (!recipe) {
    throw new Error(`Recipe not found: ${id}`)
  }
  return recipe
}

recipesJson.forEach(
  ({
    id,
    key,
    inputs,
    outputs,
    producedInId,
    productionDuration,
    powerUsage,
  }: RecipeJson) => {
    const recipe: Recipe = {
      id,
      key,
      inputs: inputs.map(parseQuantityPerCycle),
      outputs: outputs.map(parseQuantityPerCycle),
      producedInId,
      productionDuration: parseDecimal(productionDuration),
      powerUsage: parsePowerUsage(powerUsage),
    }
    recipes.push(recipe)
    recipeMap[id] = recipe
  },
)
