import { defineComponent, type PropType } from 'vue'

interface OptionCource {
  type: 'source'
  format: string
  srcset: {
    src: string
    dpr: number
  }[]
}

interface OptionImg {
  type: 'img'
  src: string
  width?: number
  height?: number
}

export type Option = OptionCource | OptionImg

export default defineComponent({
  name: 'BaseImage',
  props: {
    options: {
      type: Array as PropType<Option[]>,
      required: true,
    },
    width: Number,
    height: Number,
  },
  setup(props) {
    return () => (
      <picture class="flex">
        {props.options.map((option, index) =>
          option.type === 'source' ? (
            <source
              key={index}
              type={`image/${option.format}`}
              srcset={option.srcset
                .map(({ src, dpr }) => `${src} ${dpr}x`)
                .join(', ')}
            />
          ) : (
            <img
              key={index}
              src={option.src}
              width={props.width ?? option.width}
              height={props.width ?? option.height}
            />
          ),
        )}
        {!props.options.some(({ type }) => type === 'img') && (
          // 空 img 标签占位
          <img width={props.width} height={props.height} />
        )}
      </picture>
    )
  },
})
