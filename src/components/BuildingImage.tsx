import { defineComponent, type PropType } from 'vue'

import { hasImg, img, type Format, type Size } from '@/assets/buildings'

export default defineComponent({
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
  },
  setup(props) {
    return () => (
      <picture class="flex">
        {hasImg(props.name) &&
        props.sizes.length > 0 &&
        props.formats.length > 0 ? (
          props.formats.map((format, index) => {
            if (index < props.formats.length - 1) {
              return (
                <source
                  type={`image/${format}`}
                  srcset={props.sizes
                    .map((size, index) => {
                      return `${img(props.name, size, format)} ${index + 1}x`
                    })
                    .join(', ')}
                />
              )
            }

            return (
              <img
                src={img(props.name, props.sizes[0], format)}
                width={props.sizes[0]}
                height={props.sizes[0]}
              />
            )
          })
        ) : (
          <img width={props.sizes[0]} height={props.sizes[0]} />
        )}
      </picture>
    )
  },
})
