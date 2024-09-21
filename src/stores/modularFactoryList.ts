import { ref } from 'vue'
import { defineStore } from 'pinia'
import { syncRef, useLocalStorage } from '@vueuse/core'

import type { AssemblyLine, Id, ModularFactory } from '@/types'

export const useModularFactoryList = defineStore('modularFactoryList', () => {
  const _data = useLocalStorage<ModularFactory[]>('modular-factory-list', [], {
    listenToStorageChanges: false,
  })
  const data = ref(_data.value)
  syncRef(data, _data, {
    direction: 'ltr',
  })

  const modularFactoryMap = new Map<Id, ModularFactory>()
  const assemblyLineMap = new Map<Id, AssemblyLine>()

  data.value.forEach((modularFactory) => {
    modularFactoryMap.set(modularFactory.id, modularFactory)
    modularFactory.data.forEach((assemblyLine) => {
      assemblyLineMap.set(assemblyLine.id, assemblyLine)
    })
  })

  // 自增ID
  let currentId: Id = Math.max(
    0,
    ...data.value.map(({ id, data }) => {
      return Math.max(id, ...data.map(({ id }) => id))
    }),
  )
  const generateId = () => {
    return ++currentId
  }

  const newModularFactory = (): Id => {
    const id = generateId()
    const modularFactory: ModularFactory = {
      id,
      name: `Factory_${id}`,
      remark: '',
      data: [],
    }
    data.value.unshift(modularFactory)
    modularFactoryMap.set(id, modularFactory)
    return id
  }

  const deleteModularFactory = (modularFactoryId: Id) => {
    const modularFactory = getModularFactory(modularFactoryId)
    modularFactory.data.forEach(({ id }) => {
      deleteAssemblyLine(modularFactoryId, id)
    })
    data.value = data.value.filter(({ id }) => id !== modularFactoryId)
    modularFactoryMap.delete(modularFactoryId)
  }

  const getModularFactory = (modularFactoryId: Id): ModularFactory => {
    if (modularFactoryMap.has(modularFactoryId)) {
      return modularFactoryMap.get(modularFactoryId)!
    }
    throw new Error(`工厂不存在: ${modularFactoryId}`)
  }

  const newAssemblyLine = (modularFactoryId: Id): Id => {
    const modularFactory = getModularFactory(modularFactoryId)
    const id = generateId()
    const assemblyLine: AssemblyLine = {
      id,
      targetItemId: null,
      targetItemSpeed: null,
      recipeId: null,
    }
    modularFactory.data.unshift(assemblyLine)
    assemblyLineMap.set(id, assemblyLine)
    return id
  }

  const deleteAssemblyLine = (modularFactoryId: Id, assemblyLineId: Id) => {
    const modularFactory = getModularFactory(modularFactoryId)
    modularFactory.data = modularFactory.data.filter(
      ({ id }) => id !== assemblyLineId,
    )
    assemblyLineMap.delete(assemblyLineId)
  }

  const getAssemblyLine = (assemblyLineId: Id) => {
    if (assemblyLineMap.has(assemblyLineId)) {
      return assemblyLineMap.get(assemblyLineId)!
    }
    throw new Error(`流水线不存在: ${assemblyLineId}`)
  }

  const deleteAll = () => {
    data.value.forEach(({ id }) => {
      deleteModularFactory(id)
    })
  }

  return {
    data,
    newModularFactory,
    deleteModularFactory,
    getModularFactory,
    newAssemblyLine,
    deleteAssemblyLine,
    getAssemblyLine,
    deleteAll,
  }
})
