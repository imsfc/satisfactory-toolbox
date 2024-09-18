import type { Building, Id } from '@/types'

export const buildings: Building[] = [
  {
    id: 'Constructor',
    name: '构筑站',
    powerUsage: 4,
  },
  {
    id: 'Assembler',
    name: '装配站',
    powerUsage: 15,
  },
  {
    id: 'Manufacturer',
    name: '制造站',
    powerUsage: 55,
  },
  {
    id: 'Packager',
    name: '罐装站',
    powerUsage: 10,
  },
  {
    id: 'Refinery',
    name: '精炼站',
    powerUsage: 30,
  },
  {
    id: 'Blender',
    name: '混料站',
    powerUsage: 75,
  },
  {
    id: 'Particle_Accelerator',
    name: '粒子加速器',
    powerUsage: 0,
  },
  {
    id: 'Converter',
    name: '转化站',
    powerUsage: 0,
  },
  {
    id: 'Quantum_Encoder',
    name: '量子编码站',
    powerUsage: 0,
  },
  {
    id: 'Smelter',
    name: '冶炼站',
    powerUsage: 4,
  },
  {
    id: 'Foundry',
    name: '铸造站',
    powerUsage: 16,
  },
]

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
