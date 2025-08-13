<template lang="pug">
.layout-container
  .layout-header
    NuxtLink(to="/") Greek Learning Games
    DarkModeToggle
  
  main.layout-main
    slot
</template>

<script setup lang="ts">
// Default layout for all pages
</script>

<style lang="scss" scoped>
.layout-container {
  min-height: 100vh;
  background-color: var(--bg-color);
  transition: background-color 0.3s ease;
  position: relative;
}

.layout-header {
  z-index: 100;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between
}

.layout-main {
  width: 100%;
  min-height: 100vh;
}
</style>
