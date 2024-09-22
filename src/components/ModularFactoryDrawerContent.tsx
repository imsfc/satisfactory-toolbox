import { computed, defineComponent, type PropType } from 'vue'
import { I18nT, useI18n } from 'vue-i18n'
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
import { isArray } from 'radash'
import Decimal from 'decimal.js'

import type { AssemblyLine, Id, ItemQuantityPerMinute } from '@/types'
import { getBuildingById, getItemById } from '@/data'
import { useModularFactoryList } from '@/stores/modularFactoryList'

import BuildingImage from './BuildingImage'
import ItemImage from './ItemImage'
import ItemRecipeSelect from './ItemRecipeSelect'
import ItemSelect from './ItemSelect'

const renderItemQuantityPerMinute = ({
  itemId,
  quantityPerMinute,
}: ItemQuantityPerMinute) => {
  const { t } = useI18n()

  const item = getItemById(itemId)

  const quantityPerMinuteCeil2 = new Decimal(quantityPerMinute)
    .mul(100)
    .ceil()
    .div(100)
    .toNumber()

  return (
    <NFlex align="center" wrap={false}>
      <ItemImage
        name={item.key}
        sizes={[32, 64, 96]}
        formats={['avif', 'webp', 'png']}
      />
      <NFlex size={2} vertical>
        <div class="text-sm leading-3.5 truncate">{t(`items.${item.key}`)}</div>
        <div class="text-xs leading-4 opacity-75 truncate">
          <I18nT keypath="unitsPerMinute">
            <b>{quantityPerMinuteCeil2}</b>
            {t(
              item.type === 'solid' ? 'itemUnitName' : 'fluidUnitName',
              quantityPerMinuteCeil2,
            )}
          </I18nT>
        </div>
      </NFlex>
    </NFlex>
  )
}

function createColumns({
  onDelete,
}: {
  onDelete: (id: Id) => void
}): DataTableColumns<AssemblyLine> {
  const { t } = useI18n()

  const modularFactoryList = useModularFactoryList()

  return [
    {
      title: t('targetItem'),
      key: 'targetItem',
      minWidth: 120,
      width: 160,
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
      minWidth: 120,
      width: 160,
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
      minWidth: 120,
      width: 160,
      render(row) {
        return (
          <NInputNumber
            value={row.targetItemSpeed}
            onUpdateValue={(value) => {
              row.targetItemSpeed = value // todo
            }}
            min={0}
            max={1000000}
          />
        )
      },
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
              row.clockSpeed && new Decimal(row.clockSpeed).mul(100).toNumber()
            }
            onUpdateValue={(value) => {
              row.clockSpeed = value
                ? new Decimal(value).div(100).toNumber()
                : null // todo
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
      render: (row) => {
        const assemblyLineComputed =
          modularFactoryList.assemblyLineComputedList[row.id]
        if (!assemblyLineComputed) {
          return null
        }
        const building = getBuildingById(assemblyLineComputed.buildingId)
        const buildingQuantityCeil = new Decimal(
          assemblyLineComputed.buildingQuantity,
        )
          .ceil()
          .toNumber()
        const buildingQuantityCeil2 = new Decimal(
          assemblyLineComputed.buildingQuantity,
        )
          .mul(100)
          .ceil()
          .div(100)
          .toNumber()
        return (
          <NFlex align="center" wrap={false}>
            <BuildingImage
              name={building.key}
              sizes={[48, 96, 144]}
              formats={['avif', 'webp', 'png']}
            />
            <NFlex size={2} vertical>
              <div class="text-sm leading-3.5 truncate">
                {t(`buildings.${building.key}`)}
              </div>
              <div class="text-xs leading-4 opacity-75">
                <b>{buildingQuantityCeil}</b>
                {buildingQuantityCeil !== buildingQuantityCeil2 && (
                  <> ({buildingQuantityCeil2})</>
                )}
              </div>
            </NFlex>
          </NFlex>
        )
      },
    },
    {
      title: t('power'),
      key: 'power',
      minWidth: 80,
      width: 120,
      render: (row) => {
        const assemblyLineComputed =
          modularFactoryList.assemblyLineComputedList[row.id]
        if (!assemblyLineComputed?.averageTotalPowerUsage) {
          return null
        }
        return (
          <NFlex vertical>
            <div class="text-sm leading-3.5">
              <b>
                {new Decimal(assemblyLineComputed.averageTotalPowerUsage)
                  .ceil()
                  .toNumber()}
              </b>
              {' MW'}
            </div>
            {isArray(assemblyLineComputed.totalPowerUsage) && (
              <div class="text-xs leading-4 opacity-75">
                {assemblyLineComputed.totalPowerUsage
                  .map(
                    (powerUsage) =>
                      `${new Decimal(powerUsage).ceil().toNumber()} MW`,
                  )
                  .join(' - ')}
              </div>
            )}
          </NFlex>
        )
      },
    },
    {
      title: t('inputs'),
      key: 'inputs',
      minWidth: 120,
      width: 160,
      render: (row) => {
        const assemblyLineComputed =
          modularFactoryList.assemblyLineComputedList[row.id]
        if (!assemblyLineComputed) {
          return null
        }
        return (
          <NFlex size={8} vertical>
            {assemblyLineComputed.inputs.map(renderItemQuantityPerMinute)}
          </NFlex>
        )
      },
    },
    {
      title: t('outputs'),
      key: 'outputs',
      minWidth: 120,
      width: 160,
      render: (row) => {
        const assemblyLineComputed =
          modularFactoryList.assemblyLineComputedList[row.id]
        if (!assemblyLineComputed) {
          return null
        }
        return (
          <NFlex size={8} vertical>
            {assemblyLineComputed.outputs.map(renderItemQuantityPerMinute)}
          </NFlex>
        )
      },
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
          <NFormItem label={t('name')} path="name">
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
