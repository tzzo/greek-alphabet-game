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
  position: fixed;
  bottom: 15px;
  right: 15px;
  background: var(--card-background);
  border: 2px solid var(--input-border);
  border-radius: 50%;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--shadow);
  z-index: 1000;
  
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
  
  // Very small screens
  @media (max-width: 320px) {
    bottom: 10px;
    right: 10px;
    width: 40px;
    height: 40px;
    
    .icon {
      font-size: 1.2rem;
    }
    
    // Hide when keyboard is likely visible on small screens
    @media (max-height: 400px) {
      opacity: 0;
      pointer-events: none;
      transform: scale(0.8);
    }
  }
  
  // Hide when keyboard is likely visible (viewport height is reduced)
  @media (max-height: 500px) {
    opacity: 0;
    pointer-events: none;
    transform: scale(0.8);
  }
  
  // Desktop positioning and sizing
  @media (min-width: 550px) {
    top: 20px;
    bottom: auto;
    right: 20px;
    width: 50px;
    height: 50px;
    
    .icon {
      font-size: 1.5rem;
    }
    
    // Remove keyboard hiding on desktop
    @media (max-height: 500px) {
      opacity: 1;
      pointer-events: auto;
      transform: none;
    }
  }
}
</style>
