<template lang="pug">
.dark-mode-toggle(@click="toggleColorMode")
  .icon {{ colorMode === 'dark' ? '☀️' : '🌙' }}
</template>

<script setup lang="ts">
// Access the color mode composable
const colorMode = useColorMode()

const toggleColorMode = (): void => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<style lang="scss" scoped>
.dark-mode-toggle {
  background: var(--card-background);
  border: 2px solid var(--input-border);
  border-radius: 50%;
  display: flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--shadow);
  z-index: 1000;

  @media (min-width: 768px) {
    width: 45px;
    height: 45px;
  }

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
  
  .icon {
    font-size: 1.3rem;
    color: var(--text-color);
    transition: transform 0.3s ease;
    user-select: none;
  }
  
  &:hover .icon {
    transform: rotate(20deg);
  }
}
</style>
