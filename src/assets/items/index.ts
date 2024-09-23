const images = import.meta.glob<string[]>('./*.png', {
  query: `?w=96;64;32&format=avif;webp;png`,
  import: 'default',
  eager: true,
})

const sizes = [96, 64, 32] as const
const formats = ['avif', 'webp', 'png'] as const

export type Size = (typeof sizes)[number]
export type Format = (typeof formats)[number]

export const hasImg = (name: string) => {
  return !!images[`./${name}.png`]
}

export const img = (name: string, size: Size, format: Format) => {
  const image = images[`./${name}.png`]

  const index = sizes.indexOf(size) * formats.length + formats.indexOf(format)
  return image[index]
}
