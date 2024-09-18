import { computed, defineComponent, ref } from 'vue'
import { useClipboard, useWindowSize } from '@vueuse/core'
import {
  NButton,
  NDataTable,
  NFlex,
  NImage,
  NInputNumber,
  NModal,
  useMessage,
  type DataTableColumns,
} from 'naive-ui'

import ShowOrEdit from '@/components/ShowOrEdit'
import type { Building } from '@/types'
import { buildings } from '@/data/buildings'

const columns: DataTableColumns<Building> = [
  {
    title: '图片',
    key: 'image',
    width: 60,
    render: (row) => {
      return (
        <NImage
          style={{ display: 'flex' }}
          src={`\\buildings\\${row.id}.png`}
          width={28}
          height={28}
        />
      )
    },
  },
  {
    title: '名称',
    key: 'name',
    minWidth: 200,
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
    minWidth: 200,
    render: (row) => {
      return (
        <ShowOrEdit
          value={row.id.replace(/_+/g, ' ')}
          onUpdateValue={(value) => {
            row.id = value.trim().replace(/\s+/g, '_')
          }}
        />
      )
    },
  },
  {
    title: '功率',
    key: 'powerUsage',
    width: 200,
    render: (row) => {
      return (
        <NInputNumber
          value={row.powerUsage}
          onUpdateValue={(value) => {
            row.powerUsage = value ?? 0
          }}
        >
          {{
            suffix: () => 'MW',
          }}
        </NInputNumber>
      )
    },
  },
]

export default defineComponent({
  setup() {
    const data = ref<Building[]>(structuredClone(buildings))

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
                    id: '',
                    name: '',
                    powerUsage: 0,
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
            flexHeight
            columns={columns}
            data={data.value}
          />
        </NFlex>
        <NModal />
      </>
    )
  },
})
