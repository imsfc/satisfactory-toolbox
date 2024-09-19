import type { Id, Recipe } from '@/types'

export const recipes: Recipe[] = [
  {
    id: 'Iron_Ingot',
    name: '铁锭',
    input: [{ itemId: 'Iron_Ore', amount: 1 }],
    output: [{ itemId: 'Iron_Ingot', amount: 1 }],
    producedIn: 'Smelter',
    producedInTime: 2,
  },
  {
    id: 'Pure_Iron_Ingot',
    name: '替代: 高纯度铁锭',
    input: [
      { itemId: 'Iron_Ore', amount: 7 },
      { itemId: 'Water', amount: 4 },
    ],
    output: [{ itemId: 'Iron_Ingot', amount: 13 }],
    producedIn: 'Refinery',
    producedInTime: 12,
  },
  {
    id: 'Basic_Iron_Ingot',
    name: '替代: 基础钢铁',
    input: [
      { itemId: 'Iron_Ore', amount: 5 },
      { itemId: 'Limestone', amount: 8 },
    ],
    output: [{ itemId: 'Iron_Ingot', amount: 10 }],
    producedIn: 'Foundry',
    producedInTime: 12,
  },
  {
    id: 'Iron_Alloy_Ingot',
    name: '替代: 铁合金锭',
    input: [
      { itemId: 'Iron_Ore', amount: 8 },
      { itemId: 'Copper_Ore', amount: 2 },
    ],
    output: [{ itemId: 'Iron_Ingot', amount: 15 }],
    producedIn: 'Foundry',
    producedInTime: 12,
  },
  {
    id: 'Leached_Iron_Ingot',
    name: '替代: 滤化铁锭',
    input: [
      { itemId: 'Iron_Ore', amount: 5 },
      { itemId: 'Sulfuric_Acid', amount: 1 },
    ],
    output: [{ itemId: 'Iron_Ingot', amount: 10 }],
    producedIn: 'Refinery',
    producedInTime: 6,
  },
  {
    id: 'Iron_Ore_(Limestone)',
    name: '铁矿石 (石灰石)',
    input: [
      { itemId: 'Reanimated_SAM', amount: 1 },
      { itemId: 'Limestone', amount: 24 },
    ],
    output: [{ itemId: 'Iron_Ore', amount: 12 }],
    producedIn: 'Converter',
    producedInTime: 6,
  },
  {
    id: 'Iron_Plate',
    name: '铁板',
    input: [{ itemId: 'Iron_Ingot', amount: 3 }],
    output: [{ itemId: 'Iron_Plate', amount: 2 }],
    producedIn: 'Constructor',
    producedInTime: 6,
  },
  {
    id: 'Coated_Iron_Plate',
    name: '替代: 镀层铁板',
    input: [
      { itemId: 'Iron_Ingot', amount: 5 },
      { itemId: 'Plastic', amount: 1 },
    ],
    output: [{ itemId: 'Iron_Plate', amount: 10 }],
    producedIn: 'Assembler',
    producedInTime: 8,
  },
  {
    id: 'Steel_Cast_Plate',
    name: '替代: 铸钢板',
    input: [
      { itemId: 'Iron_Ingot', amount: 1 },
      { itemId: 'Steel_Ingot', amount: 1 },
    ],
    output: [{ itemId: 'Iron_Plate', amount: 3 }],
    producedIn: 'Foundry',
    producedInTime: 4,
  },
  {
    id: 'Iron_Rod',
    name: '铁棒',
    input: [{ itemId: 'Iron_Ingot', amount: 1 }],
    output: [{ itemId: 'Iron_Rod', amount: 1 }],
    producedIn: 'Constructor',
    producedInTime: 4,
  },
  {
    id: 'Steel_Rod',
    name: '替代: 钢棒',
    input: [{ itemId: 'Steel_Ingot', amount: 1 }],
    output: [{ itemId: 'Iron_Rod', amount: 4 }],
    producedIn: 'Constructor',
    producedInTime: 5,
  },
  {
    id: 'Aluminum_Rod',
    name: '替代: 铝棒',
    input: [{ itemId: 'Aluminum_Ingot', amount: 1 }],
    output: [{ itemId: 'Iron_Rod', amount: 7 }],
    producedIn: 'Constructor',
    producedInTime: 8,
  },
  {
    id: 'Reinforced_Iron_Plate',
    name: '强化铁板',
    input: [
      { itemId: 'Iron_Plate', amount: 6 },
      { itemId: 'Screw', amount: 12 },
    ],
    output: [{ itemId: 'Reinforced_Iron_Plate', amount: 1 }],
    producedIn: 'Assembler',
    producedInTime: 12,
  },
  {
    id: 'Stitched_Iron_Plate',
    name: '替代: 拼接铁板',
    input: [
      { itemId: 'Iron_Plate', amount: 10 },
      { itemId: 'Wire', amount: 20 },
    ],
    output: [{ itemId: 'Reinforced_Iron_Plate', amount: 3 }],
    producedIn: 'Assembler',
    producedInTime: 32,
  },
  {
    id: 'Adhered_Iron_Plate',
    name: '替代: 粘合铁板',
    input: [
      { itemId: 'Iron_Plate', amount: 3 },
      { itemId: 'Rubber', amount: 1 },
    ],
    output: [{ itemId: 'Reinforced_Iron_Plate', amount: 1 }],
    producedIn: 'Assembler',
    producedInTime: 16,
  },
  {
    id: 'Bolted_Iron_Plate',
    name: '替代: 铆接铁板',
    input: [
      { itemId: 'Iron_Plate', amount: 18 },
      { itemId: 'Screw', amount: 50 },
    ],
    output: [{ itemId: 'Reinforced_Iron_Plate', amount: 3 }],
    producedIn: 'Assembler',
    producedInTime: 12,
  },
  {
    id: 'Cable',
    name: '电缆',
    input: [{ itemId: 'Wire', amount: 2 }],
    output: [{ itemId: 'Cable', amount: 1 }],
    producedIn: 'Constructor',
    producedInTime: 2,
  },
  {
    id: 'Quickwire_Cable',
    name: '替代: 急速电缆',
    input: [
      { itemId: 'Quickwire', amount: 3 },
      { itemId: 'Rubber', amount: 2 },
    ],
    output: [{ itemId: 'Cable', amount: 11 }],
    producedIn: 'Assembler',
    producedInTime: 24,
  },
  {
    id: 'Insulated_Cable',
    name: '替代: 绝缘电缆',
    input: [
      { itemId: 'Wire', amount: 9 },
      { itemId: 'Rubber', amount: 6 },
    ],
    output: [{ itemId: 'Cable', amount: 20 }],
    producedIn: 'Assembler',
    producedInTime: 12,
  },
  {
    id: 'Coated_Cable',
    name: '替代: 镀层电缆',
    input: [
      { itemId: 'Wire', amount: 5 },
      { itemId: 'Heavy_Oil_Residue', amount: 2 },
    ],
    output: [{ itemId: 'Cable', amount: 9 }],
    producedIn: 'Refinery',
    producedInTime: 8,
  },
]

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
