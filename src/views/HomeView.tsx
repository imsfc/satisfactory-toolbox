import { defineComponent, useTemplateRef } from 'vue'
import {
  NButton,
  NDataTable,
  NFlex,
  NPopconfirm,
  type DataTableColumns,
} from 'naive-ui'

import ModuleFactoryDrawer, {
  type Exposed as ModuleFactoryDrawerExposed,
} from '@/components/ModuleFactoryDrawer'
import type { Id, ModuleFactory } from '@/types'
import {
  moduleFactoryList,
  newModuleFactory,
  removeModuleFactory,
  removeModuleFactoryAll,
} from '@/store'

function createColumns({
  open,
  remove,
}: {
  open: (id: Id) => void
  remove: (id: Id) => void
}): DataTableColumns<ModuleFactory> {
  return [
    {
      title: '名称',
      key: 'name',
    },
    {
      title: '备注',
      key: 'remark',
    },
    {
      title: '电力',
      key: 'power',
    },
    {
      title: '输入',
      key: 'input',
    },
    {
      title: '输出',
      key: 'output',
    },
    {
      title: '操作',
      key: 'action',
      width: 132,
      render(row) {
        return (
          <NFlex>
            <NButton
              size="small"
              onClick={() => {
                open(row.id)
              }}
            >
              配置
            </NButton>
            <NPopconfirm
              onPositiveClick={() => {
                remove(row.id)
              }}
            >
              {{
                default: () => '确认删除？',
                trigger: () => (
                  <NButton type="error" size="small" ghost>
                    删除
                  </NButton>
                ),
              }}
            </NPopconfirm>
          </NFlex>
        )
      },
    },
  ]
}

export default defineComponent({
  setup() {
    const moduleFactoryInstance = useTemplateRef<
      InstanceType<typeof ModuleFactoryDrawer> & ModuleFactoryDrawerExposed
    >('moduleFactoryInstance')

    return () => (
      <>
        <NFlex size="large" vertical>
          <NFlex justify="space-between">
            <NFlex>
              <NButton
                type="primary"
                onClick={() => {
                  moduleFactoryInstance.value!.open(newModuleFactory())
                }}
              >
                新增工厂
              </NButton>
              <NButton>全局配置</NButton>
            </NFlex>
            <NFlex>
              <NButton strong secondary>
                导入
              </NButton>
              <NButton strong secondary>
                导出
              </NButton>
              <NPopconfirm
                placement="bottom"
                onPositiveClick={() => {
                  removeModuleFactoryAll()
                }}
              >
                {{
                  default: () => '确认清空全部数据？',
                  trigger: () => <NButton type="error">清空全部数据</NButton>,
                }}
              </NPopconfirm>
            </NFlex>
          </NFlex>
          <NDataTable
            columns={createColumns({
              open: (id) => {
                moduleFactoryInstance.value!.open(id)
              },
              remove: (id) => {
                removeModuleFactory(id)
              },
            })}
            data={moduleFactoryList.value}
          />
        </NFlex>
        <ModuleFactoryDrawer ref="moduleFactoryInstance" />
      </>
    )
  },
})
