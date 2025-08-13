<template lang="pug">
div
  PageHeader(title="Greek Alphabet Game")
  
  .game-content
    GamesGreekAlphabet
</template>

<script setup lang="ts">
// Set page metadata
useHead({
  title: 'Greek Alphabet Game',
  meta: [
    { name: 'description', content: 'Learn the Greek alphabet with this interactive game' }
  ]
})
</script>

<style lang="scss" scoped>
.game-content {
  width: 100%;
  display: flex;
  justify-content: center;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius);
  font-family: inherit;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &.btn-secondary {
    background-color: var(--secondary-color);
    color: white;

    &:hover {
      background-color: #5a6268;
      transform: translateY(-2px);
    }
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;

    h1 {
      font-size: 1.5rem;
    }
  }
}
</style>
