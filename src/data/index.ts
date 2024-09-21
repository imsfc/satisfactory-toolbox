import type { Building, Id, Item, Recipe } from '@/types'

import buildingsJson from './buildings.json'
import itemsJson from './items.json'
import recipesJson from './recipes.json'

export const buildings: Building[] = buildingsJson as Building[]
export const items: Item[] = itemsJson as Item[]
export const recipes: Recipe[] = recipesJson as Recipe[]

// ID 映射表
const buildingMap = new Map<Id, Building>()
const itemMap = new Map<Id, Item>()
const recipeMap = new Map<Id, Recipe>()

// 在导入数据后，将数据放入 Map 中
buildings.forEach((building) => buildingMap.set(building.id, building))
items.forEach((item) => itemMap.set(item.id, item))
recipes.forEach((recipe) => recipeMap.set(recipe.id, recipe))

/**
 * 获取建筑
 * @param buildingId 建筑ID
 * @returns {Building} 建筑信息
 * @throws {Error} 建筑不存在
 */
export function getBuildingById(buildingId: Id): Building {
  if (buildingMap.has(buildingId)) {
    return buildingMap.get(buildingId)!
  }
  throw new Error(`建筑不存在: ${buildingId}`)
}

/**
 * 获取物品
 * @param itemId 物品ID
 * @returns {Item} 物品信息
 * @throws {Error} 物品不存在
 */
export function getItemById(itemId: Id): Item {
  if (itemMap.has(itemId)) {
    return itemMap.get(itemId)!
  }
  throw new Error(`物品不存在: ${itemId}`)
}

/**
 * 获取配方
 * @param recipeId 配方ID
 * @returns {Recipe} 配方信息
 * @throws {Error} 配方不存在
 */
export function getRecipeById(recipeId: Id): Recipe {
  if (recipeMap.has(recipeId)) {
    return recipeMap.get(recipeId)!
  }
  throw new Error(`配方不存在: ${recipeId}`)
}
