import { computed, defineComponent, ref } from 'vue'
import { useClipboard, useWindowSize } from '@vueuse/core'
import {
  NButton,
  NDataTable,
  NFlex,
  NInputNumber,
  NModal,
  NPopconfirm,
  NSelect,
  useMessage,
  type DataTableColumns,
} from 'naive-ui'

import ShowOrEdit from '@/components/ShowOrEdit'
import { buildings, recipes } from '@/data'
import ItemSelect from '@/components/ItemSelect'

interface OptionalItemQuantity {
  itemId: string | null
  quantity: number | null
}

interface OptionalRecipe {
  id: string | null
  name: string | null
  inputs: OptionalItemQuantity[]
  outputs: OptionalItemQuantity[]
  producedIn: string | null
  productionDuration: number | null
}

const buildingsOptions = buildings.map((building) => {
  return {
    label: building.name,
    value: building.id,
  }
})

const createColumns = ({
  remove,
}: {
  remove: (rowIndex: number) => void
}): DataTableColumns<OptionalRecipe> => {
  return [
    {
      type: 'selection',
    },
    {
      title: '名称',
      key: 'name',
      width: 200,
      render: (row) => {
        return (
          <ShowOrEdit
            value={row.name}
            onUpdateValue={(value) => {
              row.name = value
            }}
          />
        )
      },
    },
    {
      title: 'ID',
      key: 'id',
      width: 200,
      render: (row) => {
        return (
          <ShowOrEdit
            value={row.id?.replace(/_+/g, ' ')}
            onUpdateValue={(value) => {
              row.id = value ? value.trim().replace(/\s+/g, '_') : null
            }}
          />
        )
      },
    },
    {
      title: '生产建筑',
      key: 'producedIn',
      width: 120,
      render: (row) => {
        return (
          <NSelect
            value={row.producedIn}
            onUpdateValue={(value) => {
              row.producedIn = value
            }}
            options={buildingsOptions}
            filterable
            clearable
          />
        )
      },
    },
    {
      title: '输入',
      key: 'input',
      minWidth: 240,
      render: (row) => {
        return (
          <NFlex vertical>
            {row.inputs.map((item, index) => (
              <NFlex key={index} size="small" align="center" wrap={false}>
                <NInputNumber
                  value={item.quantity}
                  onUpdateValue={(value) => {
                    item.quantity = value
                  }}
                />
                <ItemSelect
                  value={item.itemId}
                  onUpdate:value={(value) => {
                    item.itemId = value
                  }}
                />
                <NButton
                  type="error"
                  size="tiny"
                  ghost
                  onClick={() => {
                    row.inputs.splice(index, 1)
                  }}
                >
                  删
                </NButton>
              </NFlex>
            ))}
            <NButton
              onClick={() => {
                row.inputs.push({
                  itemId: null,
                  quantity: null,
                })
              }}
              size="small"
              dashed
            >
              增加条目
            </NButton>
          </NFlex>
        )
      },
    },
    {
      title: '输出',
      key: 'output',
      minWidth: 240,
      render: (row) => {
        return (
          <NFlex vertical>
            {row.outputs.map((item, index) => (
              <NFlex key={index} size="small" align="center" wrap={false}>
                <NInputNumber
                  value={item.quantity}
                  onUpdateValue={(value) => {
                    item.quantity = value
                  }}
                />
                <ItemSelect
                  value={item.itemId}
                  onUpdate:value={(value) => {
                    item.itemId = value
                  }}
                />
                <NButton
                  type="error"
                  size="tiny"
                  ghost
                  onClick={() => {
                    row.outputs.splice(index, 1)
                  }}
                >
                  删
                </NButton>
              </NFlex>
            ))}
            <NButton
              onClick={() => {
                row.outputs.push({
                  itemId: null,
                  quantity: null,
                })
              }}
              size="small"
              dashed
            >
              增加条目
            </NButton>
          </NFlex>
        )
      },
    },
    {
      title: '生产周期',
      key: 'productionDuration',
      width: 160,
      render: (row) => {
        return (
          <NInputNumber
            value={row.productionDuration}
            onUpdateValue={(value) => {
              row.productionDuration = value ?? 0
            }}
          >
            {{
              suffix: () => '秒',
            }}
          </NInputNumber>
        )
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 72,
      render: (row, rowIndex) => {
        return (
          <NFlex>
            <NPopconfirm
              onPositiveClick={() => {
                remove(rowIndex)
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
    const data = ref<OptionalRecipe[]>(structuredClone(recipes))

    const message = useMessage()

    const source = computed(() => JSON.stringify(data.value))
    const { copy } = useClipboard({ source })

    const { height: windowHeight } = useWindowSize()

    const vaildDataCount = computed(() => {
      return new Set(
        data.value.filter(({ name }) => name).map(({ name }) => name!),
      ).size
    })

    return () => (
      <>
        <NFlex size="large" vertical>
          <NFlex justify="space-between">
            <NFlex>
              <NButton
                type="primary"
                onClick={() => {
                  data.value.push({
                    id: null,
                    name: null,
                    inputs: [],
                    outputs: [],
                    producedIn: null,
                    productionDuration: null,
                  })
                }}
              >
                新增
              </NButton>
            </NFlex>
            <NFlex align="center">
              <div>
                {vaildDataCount.value}/{data.value.length}条数据
              </div>
              <NButton
                onClick={() => {
                  copy().then(() => {
                    message.success('复制成功')
                  })
                }}
              >
                导出到剪贴板
              </NButton>
            </NFlex>
          </NFlex>
          <NDataTable
            style={{ height: `${windowHeight.value - 158}px` }}
            rowKey={(row) => data.value.indexOf(row)}
            flexHeight
            columns={createColumns({
              remove: (rowIndex) => {
                data.value.splice(rowIndex, 1)
              },
            })}
            data={data.value}
          />
        </NFlex>
        <NModal />
      </>
    )
  },
})
