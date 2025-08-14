<template lang="pug">
div
  PageHeader(title="Greek Translation Game")
  .game-content
    GamesGreekTranslate
</template>

<script setup lang="ts">
useHead({
  title: 'Greek Translation Game - English to Greek',
  meta: [
    { name: 'description', content: 'Translate English words to Greek and improve your vocabulary' }
  ]
})
</script>

<style lang="scss" scoped>
.game-content {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
