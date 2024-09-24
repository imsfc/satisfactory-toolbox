import { useElementSize, useWindowSize } from '@vueuse/core'
import { Decimal } from 'decimal.js'
import {
  type DataTableColumns,
  NButton,
  NDataTable,
  NEmpty,
  NFlex,
  NForm,
  NFormItemGi,
  NGrid,
  NGridItem,
  NInput,
  NInputNumber,
  NPopconfirm,
  NStatistic,
} from 'naive-ui'
import { isEmpty } from 'radash'
import { type PropType, computed, defineComponent, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'

import { useAssemblyLineComputedStore } from '@/stores/assemblyLineComputedStore'
import { useModularFactoryComputedStore } from '@/stores/modularFactoryComputedStore'
import { useModularFactoryStore } from '@/stores/modularFactoryStore'
import type { AssemblyLine, Id } from '@/types'
import { decimalRound } from '@/utils/decimalHelper'

import BuildingQuantityDisplay from './BuildingQuantityDisplay'
import ItemQuantityPerMinuteDisplay from './ItemQuantityPerMinuteDisplay'
import ItemRecipeSelect from './ItemRecipeSelect'
import ItemSelect from './ItemSelect'
import PowerDisplay from './PowerDisplay'
import VueDraggableExt from './VueDraggableExt.vue'
import AddOutlined from './icons/AddOutlined'
import DragHandleOutlined from './icons/DragHandleOutlined'

const ItemQuantityPerMinuteDisplayList = defineComponent({
  name: 'ItemQuantityPerMinuteDisplayList',
  props: {
    assemblyLineId: {
      type: [String, Number] as PropType<Id>,
      required: true,
    },
    type: {
      type: String as PropType<'inputs' | 'outputs'>,
      required: true,
    },
  },
  setup(props) {
    const assemblyLineComputedStore = useAssemblyLineComputedStore()

    const assemblyLineComputed = computed(
      () => assemblyLineComputedStore.data[props.assemblyLineId],
    )

    return () => (
      <div class="flex flex-col gap-y-2">
        {assemblyLineComputed.value?.[props.type].map(
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
  name: 'ModularFactoryDrawerContent',
  props: {
    modularFactoryId: {
      type: [Number, String] as PropType<Id>,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n()

    const { height: windowHeight } = useWindowSize()
    const { height: summaryHeight } = useElementSize(useTemplateRef('summary'))
    const tableHeight = computed(() => {
      return (
        windowHeight.value -
        64 -
        51 -
        32 -
        48 -
        58 -
        34 -
        64.78125 -
        summaryHeight.value
      )
    })

    const modularFactoryStore = useModularFactoryStore()
    const assemblyLineComputedStore = useAssemblyLineComputedStore()
    const modularFactoryComputedStore = useModularFactoryComputedStore()

    const modularFactory = computed(() => {
      return modularFactoryStore.getModularFactory(props.modularFactoryId)
    })

    const modularFactoryComputed = computed(() => {
      return modularFactoryComputedStore.data[props.modularFactoryId]
    })

    const columns = computed<DataTableColumns<AssemblyLine>>(() => [
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
        title: t('targetItem'),
        key: 'targetItem',
        render: (row) => (
          <ItemSelect
            value={row.targetItemId}
            onUpdateValue={(value) => {
              modularFactoryStore.setAssemblyLineTargetItem(row.id, value)
            }}
          />
        ),
      },
      {
        title: t('recipe'),
        key: 'recipe',
        render: (row) => (
          <ItemRecipeSelect
            value={row.recipeId}
            onUpdateValue={(value) => {
              modularFactoryStore.setAssemblyLineRecipe(row.id, value)
            }}
            itemId={row.targetItemId}
          />
        ),
      },
      {
        title: t('targetItemSpeed'),
        key: 'targetItemSpeed',
        render: (row) => (
          <NInputNumber
            value={row.targetItemSpeed}
            onUpdateValue={(value) => {
              modularFactoryStore.setAssemblyLineTargetItemSpeed(
                row.id,
                value && decimalRound(value, 4),
              )
            }}
            min={0}
            max={1000000}
          />
        ),
      },
      {
        title: t('clockSpeed'),
        key: 'clockSpeed',
        render: (row) => {
          return (
            <NInputNumber
              value={
                row.clockSpeed &&
                new Decimal(row.clockSpeed).mul(100).toNumber()
              }
              onUpdateValue={(value) => {
                modularFactoryStore.setAssemblyLineClockSpeed(
                  row.id,
                  value && decimalRound(new Decimal(value).div(100), 6),
                )
              }}
              min={1}
              max={250}
            />
          )
        },
      },
      {
        title: t('building'),
        key: 'building',
        render: (row) => <BuildingQuantityDisplay assemblyLineId={row.id} />,
      },
      {
        title: t('power'),
        key: 'power',
        render: (row) => {
          const assemblyLineComputed = assemblyLineComputedStore.data[row.id]
          return (
            assemblyLineComputed?.averageTotalPowerUsage && (
              <PowerDisplay
                averagePowerUsage={assemblyLineComputed.averageTotalPowerUsage}
                powerUsageRange={
                  !Decimal.isDecimal(assemblyLineComputed.totalPowerUsage)
                    ? assemblyLineComputed.totalPowerUsage
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
            assemblyLineId={row.id}
            type="inputs"
          />
        ),
      },
      {
        title: t('outputs'),
        key: 'outputs',
        render: (row) => (
          <ItemQuantityPerMinuteDisplayList
            assemblyLineId={row.id}
            type="outputs"
          />
        ),
      },
      {
        title: t('action'),
        key: 'action',
        width: 80,
        fixed: 'right',
        render: (row) => (
          <NFlex>
            <NPopconfirm
              onPositiveClick={() => {
                modularFactoryStore.deleteAssemblyLine(
                  modularFactory.value.id,
                  row.id,
                )
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
    ])

    return () => (
      <NFlex class="h-full" size="large" vertical>
        <NForm labelPlacement="left" labelWidth="auto" inline>
          <NGrid cols="2 s:3 m:4 l:5 xl:6" xGap={16} responsive="screen">
            <NFormItemGi span={1} label={t('factoryName')}>
              <NInput
                value={modularFactory.value.name}
                onUpdateValue={(value) => {
                  modularFactoryStore.setModularFactoryName(
                    props.modularFactoryId,
                    value,
                  )
                }}
                maxlength={20}
                showCount
              />
            </NFormItemGi>
            <NFormItemGi span="1 s:2 m:3" label={t('remark')}>
              <NInput
                value={modularFactory.value.remark}
                onUpdateValue={(value) => {
                  modularFactoryStore.setModularFactoryRemark(
                    props.modularFactoryId,
                    value,
                  )
                }}
                maxlength={100}
                showCount
              />
            </NFormItemGi>
          </NGrid>
        </NForm>

        <NFlex>
          <NButton
            type="primary"
            onClick={() => {
              modularFactoryStore.newAssemblyLine(modularFactory.value.id)
            }}
          >
            {{
              icon: () => <AddOutlined />,
              default: () => t('newAssemblyLine'),
            }}
          </NButton>
        </NFlex>

        {modularFactory.value.data.length > 0 ? (
          <VueDraggableExt
            value={modularFactory.value.data}
            onUpdateValue={(value: AssemblyLine[]) => {
              modularFactory.value.data = value
            }}
            target=".n-data-table-tbody"
            handle=".sort-handle"
            animation={150}
          >
            <NDataTable
              class="min-h-52"
              style={{ height: `${tableHeight.value}px` }}
              rowKey={({ id }: AssemblyLine) => id}
              columns={columns.value}
              data={modularFactory.value.data}
              scrollX={1280}
              size="small"
              flexHeight
            />
          </VueDraggableExt>
        ) : (
          <NDataTable
            class="min-h-52"
            style={{ height: `${tableHeight.value}px` }}
            rowKey={({ id }: AssemblyLine) => id}
            columns={columns.value}
            data={modularFactory.value.data}
            scrollX={1280}
            size="small"
            flexHeight
          />
        )}

        {modularFactoryComputed.value?.averageTotalPowerUsage && (
          <NStatistic label={t('averageTotalPowerUsage')}>
            {{
              suffix: () => 'MW',
              default: () =>
                modularFactoryComputed.value &&
                decimalRound(
                  modularFactoryComputed.value.averageTotalPowerUsage,
                  1,
                ),
            }}
          </NStatistic>
        )}

        <NGrid ref="summary" xGap={16} cols={2}>
          <NGridItem>
            <NStatistic label={t('totalInputs')}>
              {isEmpty(modularFactoryComputed.value?.inputs) ? (
                <NEmpty />
              ) : (
                <NFlex>
                  {modularFactoryComputed.value?.inputs.map(
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
            <NStatistic label={t('totalOutputs')}>
              {isEmpty(modularFactoryComputed.value?.outputs) ? (
                <NEmpty />
              ) : (
                <NFlex>
                  {modularFactoryComputed.value?.outputs.map(
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
    )
  },
})
