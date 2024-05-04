<script setup lang="ts">
import { getImages } from './image'

const props = defineProps<{
  srcName: string
  srcWidth?: number
  srcHeight?: number
  alt?: string
  width?: number
  height?: number
}>()

const images = getImages(props.srcName, props.srcWidth, props.srcHeight)
</script>

<template>
  <img
    :src="images[0]"
    :srcset="images.join(', ')"
    :alt="alt"
    :width="width"
    :height="height"
  />
</template>
