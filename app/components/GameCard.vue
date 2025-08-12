<template lang="pug">
.game-card.fade-in
  slot
</template>

<script setup lang="ts">
// Reusable game card component with common styling
</script>

<style lang="scss" scoped>
.game-card {
  text-align: center;
  width: 100%;
  max-width: 500px;
  filter: backdrop-blur(10px);
  padding: 16px;
  margin: 0 auto;
  
  @media (min-width: 550px) {
    padding: 30px;
    margin: 20px auto;
    background: var(--card-background);
    box-shadow: var(--shadow);
    border-radius: 12px;
  }
}

// Animation for card appearance
.fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Common game element styles that can be used within slots
:deep(.score-display) {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  
  @media (min-width: 550px) {
    flex-direction: row;
    justify-content: space-between;
    margin: 20px 0;
  }
  
  .score-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    text-align: center;
    
    @media (min-width: 550px) {
      display: block;
      width: auto;
    }
    
    .label {
      font-size: 0.8rem;
      color: var(--muted-text);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .value {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--primary-color);
      
      @media (min-width: 550px) {
        font-size: 2rem;
      }
    }
  }
}

:deep(.progress-container) {
  width: 100%;
  background-color: var(--progress-bg);
  border-radius: 10px;
  overflow: hidden;
  margin: 20px 0;
  
  .progress-bar {
    height: 10px;
    background-color: var(--success-color);
    transition: width 0.3s ease;
    border-radius: 10px;
  }
}

:deep(.greek-content) {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 40px;
  user-select: none;
  margin: 20px 0;
  
  .greek-text {
    font-size: 3rem;
    font-weight: bold;
    color: var(--primary-color);
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: 'Times New Roman', serif;
    
    @media (min-width: 550px) {
      font-size: 4rem;
    }
  }
  
  .greek-letter {
    font-size: 5rem;
    font-weight: bold;
    color: var(--primary-color);
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    
    @media (min-width: 550px) {
      font-size: 8rem;
    }
    
    &.readable {
      font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    }
    
    &.stylized {
      font-family: 'EB Garamond', 'Crimson Text', Georgia, serif;
      font-style: italic;
      color: var(--primary-color-dark);
    }
  }
}

:deep(.game-info) {
  .case-indicator, .instruction {
    color: var(--muted-text);
    font-style: italic;
    font-size: 1.1rem;
    margin: 10px 0;
  }
  
  .instruction {
    font-size: 1.2rem;
    margin: 20px 0;
  }
}

:deep(.game-input) {
  width: 100%;
  padding: 15px;
  font-size: 1.2rem;
  border: 2px solid var(--input-border);
  border-radius: 8px;
  margin: 20px 0;
  text-align: center;
  transition: all 0.3s ease;
  background-color: var(--card-background);
  color: var(--text-color);
  
  &:focus {
    outline: none;
    border-color: var(--secondary-color);
    box-shadow: 0 0 8px rgba(52, 152, 219, 0.3);
  }
  
  &.correct {
    border-color: var(--success-color);
    background-color: rgba(39, 174, 96, 0.15);
    box-shadow: 0 0 12px rgba(39, 174, 96, 0.3);
    transform: scale(1.02);
  }
  
  &.incorrect {
    border-color: var(--danger-color);
    background-color: rgba(231, 76, 60, 0.15);
    box-shadow: 0 0 12px rgba(231, 76, 60, 0.3);
    animation: shake 0.5s ease-in-out;
  }
}

:deep(.game-buttons) {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 20px;
}

:deep(.btn) {
  background-color: var(--secondary-color);
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  
  &:hover:not(:disabled) {
    background-color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:disabled {
    background-color: var(--muted-text);
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  &.primary {
    background-color: var(--primary-color);
    
    &:hover:not(:disabled) {
      background-color: var(--primary-color-dark);
    }
  }
  
  &.processing {
    position: relative;
    color: transparent;
    
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  }
}

:deep(.game-results) {
  text-align: center;
  padding: 2rem;
  
  h2 {
    color: var(--text-color);
    margin-bottom: 1rem;
  }
  
  .celebration {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
  
  .final-stats {
    color: var(--muted-text);
    margin: 1rem 0;
    
    .stat-value {
      color: var(--primary-color);
      font-weight: bold;
    }
  }
}

// Animations
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@keyframes spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}
</style>
