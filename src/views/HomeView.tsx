import { defineComponent, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  NButton,
  NDataTable,
  NFlex,
  NPopconfirm,
  type DataTableColumns,
} from 'naive-ui'

import { useModularFactoryList } from '@/stores/modularFactoryList'
import ModularFactoryDrawer, {
  type Exposed as ModularFactoryDrawerExposed,
} from '@/components/ModularFactoryDrawer'
import type { Id, ModularFactory } from '@/types'

function createColumns({
  onEdit,
  onDelete,
}: {
  onEdit: (id: Id) => void
  onDelete: (id: Id) => void
}): DataTableColumns<ModularFactory> {
  const { t } = useI18n()

  return [
    {
      title: t('name'),
      key: 'name',
    },
    {
      title: t('remark'),
      key: 'remark',
    },
    {
      title: t('power'),
      key: 'power',
    },
    {
      title: t('inputs'),
      key: 'inputs',
    },
    {
      title: t('outputs'),
      key: 'outputs',
    },
    {
      title: t('action'),
      key: 'action',
      width: 180,
      render(row) {
        return (
          <NFlex>
            <NButton
              size="small"
              onClick={() => {
                onEdit(row.id)
              }}
            >
              {t('config')}
            </NButton>
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
  setup() {
    const { t } = useI18n()

    const modularFactoryList = useModularFactoryList()

    const modularFactoryInstance = useTemplateRef<
      InstanceType<typeof ModularFactoryDrawer> & ModularFactoryDrawerExposed
    >('modularFactoryInstance')

    return () => (
      <>
        <NFlex size="large" vertical>
          <NFlex justify="space-between">
            <NFlex>
              <NButton
                type="primary"
                onClick={() => {
                  modularFactoryInstance.value!.open(
                    modularFactoryList.newModularFactory(),
                  )
                }}
              >
                {t('newFactory')}
              </NButton>
              <NButton disabled>{t('globalConfig')}</NButton>
            </NFlex>
            <NFlex>
              <NButton strong secondary disabled>
                {t('import')}
              </NButton>
              <NButton strong secondary disabled>
                {t('export')}
              </NButton>
              <NPopconfirm
                placement="bottom"
                onPositiveClick={() => {
                  modularFactoryList.deleteAll()
                }}
              >
                {{
                  default: () => t('clearAllDataConfirm'),
                  trigger: () => (
                    <NButton type="error">{t('clearAllData')}</NButton>
                  ),
                }}
              </NPopconfirm>
            </NFlex>
          </NFlex>
          <NDataTable
            columns={createColumns({
              onEdit: (id) => {
                modularFactoryInstance.value!.open(id)
              },
              onDelete: (id) => {
                modularFactoryList.deleteModularFactory(id)
              },
            })}
            data={modularFactoryList.data}
          />
        </NFlex>
        <ModularFactoryDrawer ref="modularFactoryInstance" />
      </>
    )
  },
})
