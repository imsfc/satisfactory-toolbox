import { type PropType, computed, defineComponent } from 'vue'

import { type Format, type Size, hasImg, img } from '@/assets/items'

import BaseImage, { type Option } from './BaseImage'

export default defineComponent({
  name: 'ItemImage',
  props: {
    name: {
      type: String,
      required: true,
    },
    sizes: {
      type: Array as PropType<Size[]>,
      required: true,
    },
    formats: {
      type: Array as PropType<Format[]>,
      required: true,
    },
    width: Number,
    height: Number,
  },
  setup(props) {
    const options = computed<Option[]>(() => {
      if (!hasImg(props.name) || props.sizes.length === 0) {
        return []
      }
      return [
        ...props.formats.map((format): Option => {
          return {
            type: 'source',
            format,
            srcset: props.sizes.map((size, index) => {
              return {
                src: img(props.name, size, format),
                dpr: index + 1,
              }
            }),
          }
        }),
        {
          type: 'img',
          src: img(props.name, props.sizes[props.sizes.length - 1], 'png'),
        },
      ]
    })

    return () => (
      <BaseImage
        options={options.value}
        width={props.width ?? props.sizes[0]}
        height={props.height ?? props.sizes[0]}
      />
    )
  },
})
