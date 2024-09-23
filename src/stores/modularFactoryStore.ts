import { nanoid } from 'nanoid'
import { defineStore } from 'pinia'
import { computed, ref, watchEffect } from 'vue'

import { recipes } from '@/data'
import type { AssemblyLine, Id, ModularFactory } from '@/types'

const storeKey = 'modularFactoryStore'

export const useModularFactoryStore = defineStore(storeKey, () => {
  const localStorageData = localStorage.getItem(storeKey)

  const data = ref<ModularFactory[]>(
    localStorageData ? JSON.parse(localStorageData) : [],
  )

  const modularFactoryMap = computed(() => {
    const _dataMap: Record<Id, ModularFactory> = {}
    data.value.forEach((item) => {
      _dataMap[item.id] = item
    })
    return _dataMap
  })

  const assemblyLineMap = computed(() => {
    const _dataMap: Record<Id, AssemblyLine> = {}
    data.value.forEach(({ data }) => {
      data.forEach((item) => {
        _dataMap[item.id] = item
      })
    })
    return _dataMap
  })

  watchEffect(() => {
    localStorage.setItem(storeKey, JSON.stringify(data.value))
  })

  const newModularFactory = (): Id => {
    const id = nanoid()
    data.value.unshift({
      id,
      name: `Factory_${id}`,
      remark: '',
      data: [],
    })
    return id
  }

  const deleteModularFactory = (modularFactoryId: Id) => {
    data.value = data.value.filter(({ id }) => id !== modularFactoryId)
  }

  const getModularFactory = (modularFactoryId: Id): ModularFactory => {
    return modularFactoryMap.value[modularFactoryId]
  }

  const setModularFactoryName = (modularFactoryId: Id, name: string) => {
    const modularFactory = getModularFactory(modularFactoryId)
    modularFactory.name = name
  }

  const setModularFactoryRemark = (modularFactoryId: Id, remark: string) => {
    const modularFactory = getModularFactory(modularFactoryId)
    modularFactory.remark = remark
  }

  const newAssemblyLine = (modularFactoryId: Id): Id => {
    const modularFactory = getModularFactory(modularFactoryId)
    const id = nanoid()
    modularFactory.data.unshift({
      id,
      targetItemId: null,
      targetItemSpeed: null,
      recipeId: null,
      clockSpeed: 1,
    })
    return id
  }

  const deleteAssemblyLine = (modularFactoryId: Id, assemblyLineId: Id) => {
    const modularFactory = getModularFactory(modularFactoryId)
    modularFactory.data = modularFactory.data.filter(
      ({ id }) => id !== assemblyLineId,
    )
  }

  const getAssemblyLine = (assemblyLineId: Id): AssemblyLine => {
    return assemblyLineMap.value[assemblyLineId]
  }

  const setAssemblyLineTargetItem = (
    assemblyLineId: Id,
    targetItemId: Id | null,
  ) => {
    const assemblyLine = getAssemblyLine(assemblyLineId)
    assemblyLine.targetItemId = targetItemId

    // 过滤出输出这个物品的配方
    const filteredRecipes = targetItemId
      ? recipes.filter(({ outputs }) => {
          return outputs.some(({ itemId }) => itemId === targetItemId)
        })
      : []

    // 如果配方为空(包括未选择目标物品的情况) 则清除选中配方
    if (assemblyLine.recipeId && filteredRecipes.length === 0) {
      assemblyLine.recipeId = null
      return
    }

    // 如果当前没有选中配方 则默认选择过滤后的第一个配方
    if (!assemblyLine.recipeId && filteredRecipes.length > 0) {
      assemblyLine.recipeId = filteredRecipes[0].id
      return
    }

    // 如果配方不为空，但是当前选中的配方不存在于过滤后的配方列表中，则默认选择过滤后的第一个配方
    if (
      filteredRecipes.length > 0 &&
      !filteredRecipes.some(({ id }) => id === assemblyLine.recipeId)
    ) {
      assemblyLine.recipeId = filteredRecipes[0].id
      return
    }
  }

  const setAssemblyLineRecipe = (assemblyLineId: Id, recipeId: Id | null) => {
    const assemblyLine = getAssemblyLine(assemblyLineId)
    assemblyLine.recipeId = recipeId
  }

  const setAssemblyLineTargetItemSpeed = (
    assemblyLineId: Id,
    targetItemSpeed: number | null,
  ) => {
    const assemblyLine = getAssemblyLine(assemblyLineId)
    assemblyLine.targetItemSpeed = targetItemSpeed
  }

  const setAssemblyLineClockSpeed = (
    assemblyLineId: Id,
    clockSpeed: number | null,
  ) => {
    const assemblyLine = getAssemblyLine(assemblyLineId)
    assemblyLine.clockSpeed = clockSpeed
  }

  const deleteAll = () => {
    data.value = []
  }

  return {
    data,
    newModularFactory,
    deleteModularFactory,
    getModularFactory,
    setModularFactoryName,
    setModularFactoryRemark,
    newAssemblyLine,
    deleteAssemblyLine,
    getAssemblyLine,
    setAssemblyLineTargetItem,
    setAssemblyLineRecipe,
    setAssemblyLineTargetItemSpeed,
    setAssemblyLineClockSpeed,
    deleteAll,
  }
})
