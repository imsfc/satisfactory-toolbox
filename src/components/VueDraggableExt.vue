<script setup lang="ts" generic="T">
import { VueDraggable } from 'vue-draggable-plus'

defineProps<{
  value: T[]
  onUpdateValue: (newValue: T[]) => void
  animation?: number
  target?: string
  handle?: string
}>()
</script>

<template>
  <VueDraggable
    :model-value="value"
    :animation="animation"
    :target="target"
    :handle="handle"
    direction="vertical"
    drag-class="opacity-0"
    @update:model-value="onUpdateValue"
  >
    <slot />
  </VueDraggable>
</template>
