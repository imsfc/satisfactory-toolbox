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
import { recipes } from '@/data/recipes'
import ItemSelect from '@/components/ItemSelect'
import { buildings } from '@/data/buildings'

interface OptionalItemAmount {
  itemId: string | null
  amount: number | null
}

interface OptionalRecipe {
  id: string | null
  name: string | null
  input: OptionalItemAmount[]
  output: OptionalItemAmount[]
  producedIn: string | null
  producedInTime: number | null
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
            {row.input.map((input, index) => (
              <NFlex key={index} size="small" align="center" wrap={false}>
                <NInputNumber
                  value={input.amount}
                  onUpdateValue={(value) => {
                    input.amount = value
                  }}
                />
                <ItemSelect
                  value={input.itemId}
                  onUpdate:value={(value) => {
                    input.itemId = value
                  }}
                />
                <NButton
                  type="error"
                  size="tiny"
                  ghost
                  onClick={() => {
                    row.input.splice(index, 1)
                  }}
                >
                  删
                </NButton>
              </NFlex>
            ))}
            <NButton
              onClick={() => {
                row.input.push({
                  itemId: null,
                  amount: null,
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
            {row.output.map((output, index) => (
              <NFlex key={index} size="small" align="center" wrap={false}>
                <NInputNumber
                  value={output.amount}
                  onUpdateValue={(value) => {
                    output.amount = value
                  }}
                />
                <ItemSelect
                  value={output.itemId}
                  onUpdate:value={(value) => {
                    output.itemId = value
                  }}
                />
                <NButton
                  type="error"
                  size="tiny"
                  ghost
                  onClick={() => {
                    row.output.splice(index, 1)
                  }}
                >
                  删
                </NButton>
              </NFlex>
            ))}
            <NButton
              onClick={() => {
                row.output.push({
                  itemId: null,
                  amount: null,
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
      key: 'producedInTime',
      width: 160,
      render: (row) => {
        return (
          <NInputNumber
            value={row.producedInTime}
            onUpdateValue={(value) => {
              row.producedInTime = value ?? 0
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
                    input: [],
                    output: [],
                    producedIn: null,
                    producedInTime: null,
                  })
                }}
              >
                新增
              </NButton>
            </NFlex>
            <NFlex align="center">
              <div>{data.value.length}条数据</div>
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
