import { computed, defineComponent, ref } from 'vue'
import { useClipboard, useWindowSize } from '@vueuse/core'
import {
  NButton,
  NDataTable,
  NFlex,
  NModal,
  useMessage,
  type DataTableColumns,
} from 'naive-ui'

import ShowOrEdit from '@/components/ShowOrEdit'
import type { Id } from '@/types'
import { items } from '@/data'
import ItemImage from '@/components/ItemImage'

interface OptionalItem {
  id: Id | null
  name: string | null
}

const columns: DataTableColumns<OptionalItem> = [
  {
    title: '图片',
    key: 'image',
    width: 60,
    render: (row) => {
      return (
        <ItemImage
          name={row.id ?? ''}
          sizes={[48, 72]}
          formats={['avif', 'webp', 'png']}
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
          value={row.id?.replace(/_+/g, ' ')}
          onUpdateValue={(value) => {
            row.id = value ? value.trim().replace(/\s+/g, '_') : null
          }}
        />
      )
    },
  },
]

export default defineComponent({
  setup() {
    const data = ref<OptionalItem[]>(structuredClone(items))

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
