<template lang="pug">
.layout-container
  .layout-header
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
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 100;
}

.layout-main {
  width: 100%;
  min-height: 100vh;
}

@media (max-width: 768px) {
  .layout-header {
    top: 0.5rem;
    right: 0.5rem;
  }
}
</style>
