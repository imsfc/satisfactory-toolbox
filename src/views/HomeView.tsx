import { useElementSize, useWindowSize } from '@vueuse/core'
import { Decimal } from 'decimal.js'
import {
  type DataTableColumns,
  NButton,
  NDataTable,
  NEmpty,
  NFlex,
  NGrid,
  NGridItem,
  NPopconfirm,
  NStatistic,
} from 'naive-ui'
import { isEmpty } from 'radash'
import { type PropType, computed, defineComponent, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'

import ItemQuantityPerMinuteDisplay from '@/components/ItemQuantityPerMinuteDisplay'
import ModularFactoryDrawer, {
  type Exposed as ModularFactoryDrawerExposed,
} from '@/components/ModularFactoryDrawer'
import PowerDisplay from '@/components/PowerDisplay'
import VueDraggableExt from '@/components/VueDraggableExt.vue'
import AddOutlined from '@/components/icons/AddOutlined'
import DragHandleOutlined from '@/components/icons/DragHandleOutlined'
import { useModularFactoryComputedStore } from '@/stores/modularFactoryComputedStore'
import { useModularFactoryStore } from '@/stores/modularFactoryStore'
import type { Id, ModularFactory } from '@/types'
import { decimalRound } from '@/utils/decimalHelper'

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

    const { height: windowHeight } = useWindowSize()
    const { height: summaryHeight } = useElementSize(useTemplateRef('summary'))
    const tableHeight = computed(() => {
      return (
        windowHeight.value - 64 - 48 - 36 - 34 - 64.78125 - summaryHeight.value
      )
    })

    const modularFactoryStore = useModularFactoryStore()
    const modularFactoryComputedStore = useModularFactoryComputedStore()

    const modularFactoryDrawerInstance = useTemplateRef<
      InstanceType<typeof ModularFactoryDrawer> & ModularFactoryDrawerExposed
    >('modularFactoryDrawerInstance')

    const columns = computed<DataTableColumns<ModularFactory>>(() => {
      return [
        {
          title: t('sort'),
          key: 'sort',
          width: 50,
          fixed: 'left',
          render: () => (
            <DragHandleOutlined class="sort-handle flex cursor-move w-7 h-7" />
          ),
        },
        {
          title: t('factoryName'),
          key: 'name',
        },
        {
          title: t('remark'),
          key: 'remark',
        },
        {
          title: t('power'),
          key: 'power',
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
                    ) &&
                    !modularFactoryComputed.totalPowerUsage.max.eq(
                      modularFactoryComputed.totalPowerUsage.min,
                    )
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
          width: 160,
          fixed: 'right',
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
        <NFlex class="h-full" size="large" vertical>
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
                {{
                  icon: () => <AddOutlined />,
                  default: () => t('newFactory'),
                }}
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

          {modularFactoryStore.data.length > 0 ? (
            <VueDraggableExt
              value={modularFactoryStore.data}
              onUpdateValue={(value) => {
                modularFactoryStore.data = value
              }}
              target=".n-data-table-tbody"
              handle=".sort-handle"
              animation={150}
            >
              <NDataTable
                class="min-h-52"
                style={{ height: `${tableHeight.value}px` }}
                rowKey={({ id }: ModularFactory) => id}
                columns={columns.value}
                data={modularFactoryStore.data}
                scrollX={960}
                size="small"
                flexHeight
              />
            </VueDraggableExt>
          ) : (
            <NDataTable
              class="min-h-52"
              style={{ height: `${tableHeight.value}px` }}
              rowKey={({ id }: ModularFactory) => id}
              columns={columns.value}
              data={modularFactoryStore.data}
              scrollX={960}
              size="small"
              flexHeight
            />
          )}

          {modularFactoryComputedStore.finalComputed
            ?.averageTotalPowerUsage && (
            <NStatistic label={t('globalAverageTotalPowerUsage')}>
              {{
                suffix: () => 'MW',
                default: () =>
                  modularFactoryComputedStore.finalComputed &&
                  decimalRound(
                    modularFactoryComputedStore.finalComputed
                      .averageTotalPowerUsage,
                    1,
                  ),
              }}
            </NStatistic>
          )}

          <NGrid ref="summary" xGap={16} cols={2}>
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
