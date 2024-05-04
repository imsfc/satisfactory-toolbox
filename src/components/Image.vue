<script setup lang="ts">
import { getImage } from './image'

const props = defineProps<{
  srcName: string
  srcWidth?: number
  srcHeight?: number
  alt?: string
  width?: number
  height?: number
}>()

const image = getImage(props.srcName, props.srcWidth, props.srcHeight)
</script>

<template>
  <img
    :src="image.src"
    :srcset="image.srcset"
    :alt="alt"
    :width="width"
    :height="height"
  />
</template>
