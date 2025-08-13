<template lang="pug">
div
  .page-header
    h1 Greek Alphabet Game
  
  .game-content
    GreekAlphabetGame
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
.page-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 800px;
  text-align: center;

  .back-button {
    flex-shrink: 0;
  }

  h1 {
    color: var(--text-color);
    font-size: 2rem;
    font-weight: 700;
    margin: 0;
    text-align: center;
    flex-grow: 1;
  }
}

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

    .back-button {
      align-self: flex-start;
    }

    h1 {
      font-size: 1.5rem;
    }
  }
}
</style>
