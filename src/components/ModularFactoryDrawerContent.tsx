import { Decimal } from 'decimal.js'
import {
  type DataTableColumns,
  NButton,
  NDataTable,
  NEmpty,
  NFlex,
  NForm,
  NFormItem,
  NGrid,
  NGridItem,
  NInput,
  NInputNumber,
  NPopconfirm,
  NStatistic,
} from 'naive-ui'
import { isEmpty } from 'radash'
import { type PropType, computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

import { useAssemblyLineComputedStore } from '@/stores/assemblyLineComputedStore'
import { useModularFactoryComputedStore } from '@/stores/modularFactoryComputedStore'
import { useModularFactoryStore } from '@/stores/modularFactoryStore'
import type { AssemblyLine, Id } from '@/types'

import BuildingQuantityDisplay from './BuildingQuantityDisplay'
import ItemQuantityPerMinuteDisplay from './ItemQuantityPerMinuteDisplay'
import ItemRecipeSelect from './ItemRecipeSelect'
import ItemSelect from './ItemSelect'
import PowerDisplay from './PowerDisplay'

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
        title: t('targetItem'),
        key: 'targetItem',
        minWidth: 120,
        width: 160,
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
        minWidth: 120,
        width: 160,
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
        minWidth: 120,
        width: 160,
        render: (row) => (
          <NInputNumber
            value={row.targetItemSpeed}
            onUpdateValue={(value) => {
              modularFactoryStore.setAssemblyLineTargetItemSpeed(
                row.id,
                value &&
                  new Decimal(value).toDP(4, Decimal.ROUND_UP).toNumber(),
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
        minWidth: 120,
        width: 140,
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
                  value &&
                    new Decimal(value)
                      .toDP(4, Decimal.ROUND_UP)
                      .div(100)
                      .toNumber(),
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
        minWidth: 120,
        width: 140,
        render: (row) => <BuildingQuantityDisplay assemblyLineId={row.id} />,
      },
      {
        title: t('power'),
        key: 'power',
        minWidth: 80,
        width: 120,
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
        minWidth: 120,
        width: 160,
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
        minWidth: 120,
        width: 160,
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
        width: 100,
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
      <NFlex size="large" vertical>
        <NForm labelPlacement="left" labelWidth="auto" inline>
          <NFormItem label={t('name')} path="name">
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
          </NFormItem>
          <NFormItem label={t('remark')} path="remark">
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
          </NFormItem>
        </NForm>

        <NFlex>
          <NButton
            type="primary"
            onClick={() => {
              modularFactoryStore.newAssemblyLine(modularFactory.value.id)
            }}
          >
            {t('newAssemblyLine')}
          </NButton>
        </NFlex>

        <NDataTable
          rowKey={({ id }: AssemblyLine) => id}
          columns={columns.value}
          data={modularFactory.value.data}
        />

        {modularFactoryComputed.value?.averageTotalPowerUsage && (
          <NStatistic label={t('averageTotalPowerUsage')}>
            {{
              suffix: () => 'MW',
              default: () =>
                modularFactoryComputed.value?.averageTotalPowerUsage
                  .toDP(1)
                  .toNumber(),
            }}
          </NStatistic>
        )}

        <NGrid xGap={16} cols={2}>
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
