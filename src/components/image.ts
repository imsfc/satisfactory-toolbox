const imageMap = new Map<string, string>()

export function resolveKey(
  name: string,
  width?: number,
  height?: number,
  format?: string,
) {
  return [name, width ?? '', height ?? '', format ?? ''].join('_')
}

function _getImage(
  name: string,
  width?: number,
  height?: number,
  format?: string,
) {
  const key = resolveKey(name, width, height, format)
  return imageMap.get(key)
}

export function getImage(name: string, width?: number, height?: number) {
  const list: string[] = []
  const avif = _getImage(name, width, height, 'avif')
  if (avif) {
    list.push(avif)
  }
  const webp = _getImage(name, width, height, 'webp')
  if (webp) {
    list.push(webp)
  }
  return {
    src: webp || avif,
    srcset: list.join(', '),
  }
}

function addImages(
  obj: Record<string, string>,
  width?: number,
  height?: number,
  format?: string,
) {
  for (const key in obj) {
    const url = obj[key]
    imageMap.set(
      resolveKey(key.replace('../assets/images/', ''), width, height, format),
      url,
    )
  }
}

addImages(
  import.meta.glob<string>('../assets/images/*', {
    query: '?w=512&h=512&format=webp',
    import: 'default',
    eager: true,
  }),
  undefined,
  undefined,
  'webp',
)

addImages(
  import.meta.glob<string>('../assets/images/*', {
    query: '?w=512&h=512&format=avif',
    import: 'default',
    eager: true,
  }),
  undefined,
  undefined,
  'avif',
)
