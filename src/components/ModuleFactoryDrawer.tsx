import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWindowSize } from '@vueuse/core'

import type { AssemblyLine, Id, ModuleFactory } from '@/types'
import { getModuleFactory, newAssemblyLine, removeAssemblyLine } from '@/store'
import {
  NButton,
  NDataTable,
  NDrawer,
  NDrawerContent,
  NFlex,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NPopconfirm,
  type DataTableColumns,
} from 'naive-ui'
import ItemSelect from '@/components/ItemSelect'
import ItemRecipeSelect from './ItemRecipeSelect'

function createColumns({
  remove,
}: {
  remove: (id: Id) => void
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
            value={row.outputItemId}
            onUpdate:value={(value) => {
              row.outputItemId = value
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
            onUpdate:value={(value) => (row.recipeId = value)}
            itemId={row.outputItemId}
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
            value={row.outputsPerMinute}
            onUpdate:value={(value) => {
              row.outputsPerMinute = value
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
      // render(row) {
      //   return h(AssemblyLinePowerDisplay, {
      //     buildingOrPower: 'building',
      //     outputItemId: row.outputItemId,
      //     outputsPerMinute: row.outputsPerMinute,
      //     recipeId: row.recipeId,
      //   })
      // },
    },
    {
      title: t('power'),
      key: 'power',
      minWidth: 80,
      // render(row) {
      //   return h(AssemblyLinePowerDisplay, {
      //     buildingOrPower: 'power',
      //     outputItemId: row.outputItemId,
      //     outputsPerMinute: row.outputsPerMinute,
      //     recipeId: row.recipeId,
      //   })
      // },
    },
    {
      title: t('inputs'),
      key: 'inputs',
      minWidth: 160,
      // render(row) {
      //   return h(AssemblyLineItemDisplay, {
      //     inputOrOutput: 'input',
      //     outputItemId: row.outputItemId,
      //     outputsPerMinute: row.outputsPerMinute,
      //     recipeId: row.recipeId,
      //   })
      // },
    },
    {
      title: t('outputs'),
      key: 'outputs',
      minWidth: 160,
      // render(row) {
      //   return h(AssemblyLineItemDisplay, {
      //     inputOrOutput: 'output',
      //     outputItemId: row.outputItemId,
      //     outputsPerMinute: row.outputsPerMinute,
      //     recipeId: row.recipeId,
      //   })
      // },
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

export interface Exposed {
  open: (id: Id) => void
}

export default defineComponent({
  setup(props, { expose }) {
    const { t } = useI18n()

    const { height: windowHeight } = useWindowSize()

    const show = ref(false)
    const moduleFactory = ref<ModuleFactory>()

    function open(id: Id) {
      moduleFactory.value = getModuleFactory(id)
      show.value = true
    }

    expose({
      open,
    } satisfies Exposed)

    return () => (
      <NDrawer
        show={show.value}
        onUpdate:show={(value) => {
          show.value = value
        }}
        height={windowHeight.value - 64}
        placement="bottom"
      >
        <NDrawerContent
          title={t('factoryConfig')}
          nativeScrollbar={false}
          closable
        >
          <NFlex size="large" vertical align="start">
            <NForm labelPlacement="left" labelWidth="auto" inline>
              <NFormItem label={t('factoryName')} path="name">
                <NInput
                  value={moduleFactory.value!.name}
                  onUpdate:value={(value) => {
                    moduleFactory.value!.name = value
                  }}
                  maxlength={20}
                  showCount
                />
              </NFormItem>
              <NFormItem label={t('remark')} path="remark">
                <NInput
                  value={moduleFactory.value!.remark}
                  onUpdate:value={(value) => {
                    moduleFactory.value!.remark = value
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
                  newAssemblyLine(moduleFactory.value!.id)
                }}
              >
                {t('newAssemblyLine')}
              </NButton>
            </NFlex>

            <NDataTable
              columns={createColumns({
                remove: (id) => {
                  removeAssemblyLine(id)
                },
              })}
              data={moduleFactory.value!.data}
            />
          </NFlex>
        </NDrawerContent>
      </NDrawer>
    )
  },
})
