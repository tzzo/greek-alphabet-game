<template lang="pug">
.page-header(:class="{ 'center-header': centered, 'home-header': isHome }")
  .header-content
    h1(v-if="title") {{ title }}
    p(v-if="subtitle" class="subtitle") {{ subtitle }}
    slot(name="extra-content")
</template>

<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
  centered?: boolean
  isHome?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  subtitle: '',
  centered: true,
  isHome: false
})
</script>

<style lang="scss" scoped>
.page-header {
  margin-bottom: 2rem;
  width: 100%;
  
  &.center-header {
    text-align: center;
    
    .header-content {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 2rem;
    }
  }
  
  &.home-header {
    text-align: center;
    margin-bottom: 3rem;
    
    .header-content {
      margin: 0 auto;
      padding: 0 2rem;
    }
    
    h1 {
      font-size: 3rem;
      font-weight: 700;
      color: var(--text-color);
      margin-bottom: 1rem;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .subtitle {
      font-size: 1.2rem;
      color: var(--secondary-color);
      margin-bottom: 0;
    }
  }
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

h1 {
  color: var(--text-color);
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.subtitle {
  color: var(--secondary-color);
  font-size: 1rem;
  margin: 0;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .page-header {
    margin-bottom: 1.5rem;
    
    &.home-header {
      margin-bottom: 2rem;
      
      h1 {
        font-size: 2rem;
      }
      
      .subtitle {
        font-size: 1rem;
      }
    }
    
    .header-content {
      padding: 0 1rem;
    }
  }
  
  h1 {
    font-size: 1.5rem;
  }
}
</style>
