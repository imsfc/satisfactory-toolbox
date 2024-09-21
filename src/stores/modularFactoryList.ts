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
    return data.value.find(({ id }) => id === modularFactoryId)!
  }

  const newAssemblyLine = (modularFactoryId: Id): Id => {
    const modularFactory = getModularFactory(modularFactoryId)
    const id = generateId()
    modularFactory.data.unshift({
      id,
      targetItemId: null,
      targetItemSpeed: null,
      recipeId: null,
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
    const modularFactory = data.value.find(({ data }) => {
      return data.some(({ id }) => id === assemblyLineId)
    })!
    return modularFactory.data.find(({ id }) => id === assemblyLineId)!
  }

  const deleteAll = () => {
    data.value = []
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
