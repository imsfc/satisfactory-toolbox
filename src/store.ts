import { ref, watchEffect } from 'vue'

import type { Id, ModuleFactory } from '@/types'
import { nanoid } from 'nanoid'

const moduleFactoryListKey = 'factory-list'

function readModuleFactoryList(): ModuleFactory[] {
  const moduleFactoryList = localStorage.getItem(moduleFactoryListKey)
  if (moduleFactoryList) {
    return JSON.parse(moduleFactoryList)
  }
  return []
}

function saveModuleFactoryList(moduleFactoryList: ModuleFactory[]) {
  localStorage.setItem(moduleFactoryListKey, JSON.stringify(moduleFactoryList))
}

export const moduleFactoryList = ref<ModuleFactory[]>(readModuleFactoryList())

watchEffect(() => {
  saveModuleFactoryList(moduleFactoryList.value)
  console.log(moduleFactoryList.value)
})

/**
 * 创建模块工厂
 * @returns 模块工厂ID
 */
export function newModuleFactory(): Id {
  const id = nanoid()
  moduleFactoryList.value.unshift({
    id,
    name: `新工厂-${id.slice(0, 5)}`,
    remark: '',
    data: [],
  })
  return id
}

/**
 * 删除模块工厂
 * @param moduleFactoryId 模块工厂ID
 */
export function removeModuleFactory(moduleFactoryId: Id) {
  moduleFactoryList.value = moduleFactoryList.value.filter(
    ({ id }) => id !== moduleFactoryId,
  )
}

/**
 * 删除全部模块工厂
 */
export function removeModuleFactoryAll() {
  moduleFactoryList.value = []
}

/**
 * 获取模块工厂
 * @param moduleFactoryId 模块工厂ID
 * @returns {ModuleFactory} 模块工厂对象
 * @throws {Error} 模块工厂不存在
 */
export function getModuleFactory(moduleFactoryId: Id): ModuleFactory {
  const moduleFactory = moduleFactoryList.value.find(
    ({ id }) => id === moduleFactoryId,
  )
  if (!moduleFactory) {
    throw new Error(`模块工厂不存在: ${moduleFactoryId}`)
  }
  return moduleFactory
}

/**
 * 根据流水线获取模块工厂
 * @param assemblyLineId 流水线ID
 * @returns {ModuleFactory} 模块工厂对象
 * @throws {Error} 流水线不存在
 */
export function getModuleFactoryByAssemblyLineId(
  assemblyLineId: Id,
): ModuleFactory {
  const moduleFactory = moduleFactoryList.value.find(({ data }) =>
    data.some(({ id }) => id === assemblyLineId),
  )
  if (!moduleFactory) {
    throw new Error(`流水线不存在: ${assemblyLineId}`)
  }
  return moduleFactory
}

/**
 * 创建流水线
 * @param moduleFactoryId 模块工厂ID
 * @returns 流水线ID
 */
export function newAssemblyLine(moduleFactoryId: Id): Id {
  const moduleFactory = getModuleFactory(moduleFactoryId)
  const id = nanoid()
  moduleFactory.data.unshift({
    id: nanoid(),
    outputItemId: null,
    outputsPerMinute: null,
    recipeId: null,
  })
  return id
}

/**
 * 删除流水线
 * 如果指定了模块工厂ID，则从该模块工厂删除流水线，否则根据流水线ID自动查找并删除
 * @param assemblyLineId 流水线ID
 * @param moduleFactoryId 可选的模块工厂ID
 */
export function removeAssemblyLine(assemblyLineId: Id, moduleFactoryId?: Id) {
  let moduleFactory: ModuleFactory

  if (moduleFactoryId) {
    moduleFactory = getModuleFactory(assemblyLineId)
  } else {
    moduleFactory = getModuleFactoryByAssemblyLineId(assemblyLineId)
  }

  moduleFactory.data = moduleFactory.data.filter(
    ({ id }) => id !== assemblyLineId,
  )
}
