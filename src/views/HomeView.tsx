import { defineComponent, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
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
                open(row.id)
              }}
            >
              {t('config')}
            </NButton>
            <NPopconfirm
              onPositiveClick={() => {
                remove(row.id)
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
                {t('newFactory')}
              </NButton>
              <NButton>{t('globalConfig')}</NButton>
            </NFlex>
            <NFlex>
              <NButton strong secondary>
                {t('import')}
              </NButton>
              <NButton strong secondary>
                {t('export')}
              </NButton>
              <NPopconfirm
                placement="bottom"
                onPositiveClick={() => {
                  removeModuleFactoryAll()
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
