import { computed, defineComponent, useTemplateRef, type PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  NButton,
  NDataTable,
  NEmpty,
  NFlex,
  NGrid,
  NGridItem,
  NPopconfirm,
  NStatistic,
  type DataTableColumns,
} from 'naive-ui'
import Decimal from 'decimal.js'
import { isEmpty } from 'radash'

import ModularFactoryDrawer, {
  type Exposed as ModularFactoryDrawerExposed,
} from '@/components/ModularFactoryDrawer'
import ItemQuantityPerMinuteDisplay from '@/components/ItemQuantityPerMinuteDisplay'
import PowerDisplay from '@/components/PowerDisplay'
import type { Id, ModularFactory } from '@/types'
import { useModularFactoryStore } from '@/stores/modularFactoryStore'
import { useModularFactoryComputedStore } from '@/stores/modularFactoryComputedStore'

const ItemQuantityPerMinuteDisplayList = defineComponent({
  name: 'ItemQuantityPerMinuteDisplayList',
  props: {
    modularFactoryId: {
      type: [String, Number] as PropType<Id>,
      required: true,
    },
    type: {
      type: String as PropType<'inputs' | 'outputs'>,
      required: true,
    },
  },
  setup(props) {
    const modularFactoryComputedStore = useModularFactoryComputedStore()

    const modularFactoryComputed = computed(
      () => modularFactoryComputedStore.data[props.modularFactoryId],
    )

    return () => (
      <div class="flex flex-col gap-y-2">
        {modularFactoryComputed.value?.[props.type].map(
          ({ itemId, quantityPerMinute }) => (
            <ItemQuantityPerMinuteDisplay
              itemId={itemId}
              quantityPerMinute={quantityPerMinute}
            />
          ),
        )}
      </div>
    )
  },
})

export default defineComponent({
  name: 'HomeView',
  setup() {
    const { t } = useI18n()

    const modularFactoryStore = useModularFactoryStore()
    const modularFactoryComputedStore = useModularFactoryComputedStore()

    const modularFactoryDrawerInstance = useTemplateRef<
      InstanceType<typeof ModularFactoryDrawer> & ModularFactoryDrawerExposed
    >('modularFactoryDrawerInstance')

    const columns = computed<DataTableColumns<ModularFactory>>(() => {
      return [
        {
          title: t('name'),
          key: 'name',
          minWidth: 160,
          width: 240,
        },
        {
          title: t('remark'),
          key: 'remark',
          minWidth: 240,
          width: 320,
        },
        {
          title: t('power'),
          key: 'power',
          minWidth: 120,
          width: 160,
          render: (row) => {
            const modularFactoryComputed =
              modularFactoryComputedStore.data[row.id]
            return (
              modularFactoryComputed && (
                <PowerDisplay
                  averagePowerUsage={
                    modularFactoryComputed.averageTotalPowerUsage
                  }
                  powerUsageRange={
                    !Decimal.isDecimal(
                      modularFactoryComputed.totalPowerUsage,
                    ) && modularFactoryComputed.totalPowerUsage.max.gt(0)
                      ? modularFactoryComputed.totalPowerUsage
                      : undefined
                  }
                />
              )
            )
          },
        },
        {
          title: t('inputs'),
          key: 'inputs',
          minWidth: 120,
          width: 160,
          render: (row) => (
            <ItemQuantityPerMinuteDisplayList
              modularFactoryId={row.id}
              type="inputs"
            />
          ),
        },
        {
          title: t('outputs'),
          key: 'outputs',
          minWidth: 120,
          width: 160,
          render: (row) => (
            <ItemQuantityPerMinuteDisplayList
              modularFactoryId={row.id}
              type="outputs"
            />
          ),
        },
        {
          title: t('action'),
          key: 'action',
          width: 180,
          render: (row) => (
            <NFlex>
              <NButton
                size="small"
                onClick={() => {
                  modularFactoryDrawerInstance.value?.open(row.id)
                }}
              >
                {t('config')}
              </NButton>
              <NPopconfirm
                onPositiveClick={() => {
                  modularFactoryStore.deleteModularFactory(row.id)
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
          ),
        },
      ]
    })

    return () => (
      <>
        <NFlex size="large" vertical>
          <NFlex justify="space-between">
            <NFlex>
              <NButton
                type="primary"
                onClick={() => {
                  modularFactoryDrawerInstance.value?.open(
                    modularFactoryStore.newModularFactory(),
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
                  modularFactoryStore.deleteAll()
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
            rowKey={({ id }: ModularFactory) => id}
            columns={columns.value}
            data={modularFactoryStore.data}
          />

          <NGrid xGap={16} cols={2}>
            <NGridItem>
              <NStatistic label={t('finalTotalInputs')}>
                {isEmpty(modularFactoryComputedStore.finalComputed?.inputs) ? (
                  <NEmpty />
                ) : (
                  <NFlex>
                    {modularFactoryComputedStore.finalComputed?.inputs.map(
                      ({ itemId, quantityPerMinute }) => (
                        <ItemQuantityPerMinuteDisplay
                          itemId={itemId}
                          quantityPerMinute={quantityPerMinute}
                        />
                      ),
                    )}
                  </NFlex>
                )}
              </NStatistic>
            </NGridItem>
            <NGridItem>
              <NStatistic label={t('finalTotalOutputs')}>
                {isEmpty(modularFactoryComputedStore.finalComputed?.outputs) ? (
                  <NEmpty />
                ) : (
                  <NFlex>
                    {modularFactoryComputedStore.finalComputed?.outputs.map(
                      ({ itemId, quantityPerMinute }) => (
                        <ItemQuantityPerMinuteDisplay
                          itemId={itemId}
                          quantityPerMinute={quantityPerMinute}
                        />
                      ),
                    )}
                  </NFlex>
                )}
              </NStatistic>
            </NGridItem>
          </NGrid>
        </NFlex>
        <ModularFactoryDrawer ref="modularFactoryDrawerInstance" />
      </>
    )
  },
})
