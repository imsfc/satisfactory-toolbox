import { defineComponent, ref, useTemplateRef, type PropType } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { NInput } from 'naive-ui'

export default defineComponent({
  props: {
    value: String as PropType<string>,
    onUpdateValue: Function as PropType<(value: string) => void>,
  },
  setup(props) {
    const isEdit = ref(false)

    const inputInstance = useTemplateRef<InstanceType<typeof NInput>>('input')

    onClickOutside(inputInstance, () => {
      isEdit.value = false
    })

    return () => {
      if (isEdit.value) {
        return (
          <NInput
            ref="input"
            value={props.value}
            onUpdateValue={props.onUpdateValue}
            size="small"
          />
        )
      }

      return (
        <div
          style={{ height: '28px', lineHeight: '28px' }}
          onClick={() => {
            isEdit.value = true
          }}
        >
          {props.value}
        </div>
      )
    }
  },
})
