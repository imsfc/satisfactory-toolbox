<script setup lang="ts">
import { NLayout, NLayoutHeader, NLayoutContent } from 'naive-ui'
</script>

<template>
  <NLayout style="height: 100vh">
    <NLayoutHeader style="height: 64px" bordered>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </NLayoutHeader>

    <NLayoutContent
      style="top: 64px; bottom: 0"
      position="absolute"
      :native-scrollbar="false"
    >
      <RouterView />
    </NLayoutContent>
  </NLayout>
</template>
