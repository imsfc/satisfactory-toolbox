import type { Building, Id, Item, Recipe } from '@/types'
import buildingsJson from './buildings.json'
import itemsJson from './items.json'
import recipesJson from './recipes.json'

export const buildings: Building[] = buildingsJson as Building[]
export const items: Item[] = itemsJson as Item[]
export const recipes: Recipe[] = recipesJson as Recipe[]

/**
 * 获取建筑
 * @param buildingId 建筑ID
 * @returns {Building} 建筑信息
 * @throws {Error} 建筑不存在
 */
export function getBuildingById(buildingId: Id): Building {
  const building = buildings.find(({ id }) => id === buildingId)
  if (!building) {
    throw new Error(`建筑不存在: ${buildingId}`)
  }
  return building
}

/**
 * 获取物品
 * @param itemId 物品ID
 * @returns {Item} 物品信息
 * @throws {Error} 物品不存在
 */
export function getItemById(itemId: Id): Item {
  const item = items.find(({ id }) => id === itemId)
  if (!item) {
    throw new Error(`物品不存在: ${itemId}`)
  }
  return item
}

/**
 * 获取配方
 * @param recipeId 配方ID
 * @returns {Recipe} 配方信息
 * @throws {Error} 配方不存在
 */
export function getRecipeById(recipeId: Id): Recipe {
  const recipe = recipes.find(({ id }) => id === recipeId)
  if (!recipe) {
    throw new Error(`配方不存在: ${recipeId}`)
  }
  return recipe
}
