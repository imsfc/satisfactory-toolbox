<script setup lang="ts">
import { NLayout, NLayoutHeader, NLayoutContent, NText } from 'naive-ui'
</script>

<template>
  <NLayout class="layout">
    <NLayoutHeader class="header" style="height: 64px" bordered>
      <NText class="logo">
        <img src="@/assets/logo.png" />
        <span>幸福工厂小助手</span>
      </NText>
      <div></div>
      <div>
        <NText>v0.1</NText>
      </div>
    </NLayoutHeader>

    <NLayoutContent
      class="content"
      content-style="padding: 24px 32px"
      position="absolute"
      :native-scrollbar="false"
    >
      <RouterView />
    </NLayoutContent>
  </NLayout>
</template>

<style scoped>
.layout {
  height: 100vh;
}
.header {
  padding: 0 32px;
  height: 64px;
  display: grid;
  align-items: center;
  grid-template-columns: 240px 1fr auto;
}
.header .logo {
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  line-height: 1;
}
.header .logo img {
  margin-right: 12px;
  width: 32px;
  height: 32px;
}
.content {
  top: 64px;
  bottom: 0;
}
</style>
