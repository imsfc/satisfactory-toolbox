import { computed, defineComponent, type PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  NButton,
  NDataTable,
  NFlex,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NPopconfirm,
  type DataTableColumns,
} from 'naive-ui'

import type { AssemblyLine, Id } from '@/types'
import { useModularFactoryList } from '@/stores/modularFactoryList'

import ItemSelect from './ItemSelect'
import ItemRecipeSelect from './ItemRecipeSelect'

function createColumns({
  onDelete,
}: {
  onDelete: (id: Id) => void
}): DataTableColumns<AssemblyLine> {
  const { t } = useI18n()

  return [
    {
      title: t('targetItem'),
      key: 'targetItem',
      minWidth: 160,
      render(row) {
        return (
          <ItemSelect
            value={row.targetItemId}
            onUpdateValue={(value) => {
              row.targetItemId = value //todo
            }}
          />
        )
      },
    },
    {
      title: t('recipe'),
      key: 'recipe',
      minWidth: 160,
      render(row) {
        return (
          <ItemRecipeSelect
            value={row.recipeId}
            onUpdateValue={(value) => {
              row.recipeId = value // todo
            }}
            itemId={row.targetItemId}
          />
        )
      },
    },
    {
      title: t('targetItemSpeed'),
      key: 'targetItemSpeed',
      minWidth: 180,
      width: 200,
      render(row) {
        return (
          <NInputNumber
            value={row.targetItemSpeed}
            onUpdateValue={(value) => {
              row.targetItemSpeed = value // todo
            }}
            min={0}
            max={1000000}
          >
            {{
              suffix: () => t('perMinute'),
            }}
          </NInputNumber>
        )
      },
    },
    {
      title: t('building'),
      key: 'building',
      minWidth: 160,
    },
    {
      title: t('power'),
      key: 'power',
      minWidth: 80,
    },
    {
      title: t('inputs'),
      key: 'inputs',
      minWidth: 160,
    },
    {
      title: t('outputs'),
      key: 'outputs',
      minWidth: 160,
    },
    {
      title: t('action'),
      key: 'action',
      width: 100,
      render(row) {
        return (
          <NFlex>
            <NPopconfirm
              onPositiveClick={() => {
                onDelete(row.id)
              }}
            >
              {{
                default: () => t('deleteConfirm'),
                trigger: () => (
                  <NButton type="error" size="small" ghost>
                    {t('delete')}
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
  props: {
    modularFactoryId: {
      type: Number as PropType<Id>,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n()

    const modularFactoryList = useModularFactoryList()

    const modularFactory = computed(() => {
      return modularFactoryList.getModularFactory(props.modularFactoryId)
    })

    return () => (
      <NFlex size="large" vertical align="start">
        <NForm labelPlacement="left" labelWidth="auto" inline>
          <NFormItem label={t('factoryName')} path="name">
            <NInput
              value={modularFactory.value.name}
              onUpdateValue={(value) => {
                modularFactory.value.name = value // todo
              }}
              maxlength={20}
              showCount
            />
          </NFormItem>
          <NFormItem label={t('remark')} path="remark">
            <NInput
              value={modularFactory.value.remark}
              onUpdateValue={(value) => {
                modularFactory.value.remark = value // todo
              }}
              maxlength={100}
              showCount
            />
          </NFormItem>
        </NForm>

        <NFlex>
          <NButton
            type="primary"
            onClick={() => {
              modularFactoryList.newAssemblyLine(modularFactory.value.id)
            }}
          >
            {t('newAssemblyLine')}
          </NButton>
        </NFlex>

        <NDataTable
          columns={createColumns({
            onDelete: (id) => {
              modularFactoryList.deleteAssemblyLine(modularFactory.value.id, id)
            },
          })}
          data={modularFactory.value.data}
        />
      </NFlex>
    )
  },
})
