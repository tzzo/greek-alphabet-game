<template lang="pug">
button.game-btn(
  :type="type"
  :disabled="disabled || processing"
  :class="buttonClasses"
  @click="handleClick"
) 
  span(v-if="!processing") {{ label }}
  span(v-else) {{ processingLabel }}
</template>

<script setup lang="ts">
interface Props {
  label: string
  type?: 'button' | 'submit'
  variant?: 'primary' | 'secondary' | 'option'
  state?: 'default' | 'success' | 'failure' | 'selected' | 'correct' | 'incorrect'
  disabled?: boolean
  processing?: boolean
  processingLabel?: string
}

interface Emits {
  (e: 'click'): void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  state: 'default',
  disabled: false,
  processing: false,
  processingLabel: 'Processing...'
})

const emit = defineEmits<Emits>()

const buttonClasses = computed(() => {
  const classes = ['btn']
  
  // Add variant class
  classes.push(props.variant)
  
  // Add state classes
  if (props.state !== 'default') {
    classes.push(props.state)
  }
  
  // Add processing class
  if (props.processing) {
    classes.push('processing')
  }
  
  return classes
})

function handleClick() {
  if (!props.disabled && !props.processing) {
    emit('click')
  }
}
</script>

<style lang="scss" scoped>
.game-btn {
  padding: 1rem 1.5rem;
  border: 2px solid transparent;
  border-radius: 12px;
  font-family: inherit;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  // Primary variant (default blue)
  &.primary {
    background-color: var(--primary-color);
    color: white;
    border-color: var(--primary-color);

    &:hover:not(:disabled) {
      background-color: var(--primary-color-hover);
      border-color: var(--primary-color-hover);
      box-shadow: 0 4px 12px rgba(44, 62, 80, 0.4);
    }

    &.success {
      background-color: #27ae60;
      border-color: #27ae60;
      
      &:hover:not(:disabled) {
        background-color: #229954;
        border-color: #229954;
        box-shadow: 0 4px 12px rgba(39, 174, 96, 0.4);
      }
    }

    &.failure {
      background-color: #e74c3c;
      border-color: #e74c3c;
      
      &:hover:not(:disabled) {
        background-color: #c0392b;
        border-color: #c0392b;
        box-shadow: 0 4px 12px rgba(231, 76, 60, 0.4);
      }
    }
  }

  // Secondary variant
  &.secondary {
    background-color: var(--secondary-color);
    color: white;
    border-color: var(--secondary-color);

    &:hover:not(:disabled) {
      background-color: var(--secondary-color-hover);
      border-color: var(--secondary-color-hover);
      box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
    }

    &.success {
      background-color: #27ae60;
      border-color: #27ae60;
      
      &:hover:not(:disabled) {
        background-color: #229954;
        border-color: #229954;
      }
    }

    &.failure {
      background-color: #e74c3c;
      border-color: #e74c3c;
      
      &:hover:not(:disabled) {
        background-color: #c0392b;
        border-color: #c0392b;
      }
    }
  }

  // Option variant (for multiple choice buttons)
  &.option {
    background-color: var(--secondary-color);
    color: white;
    border-color: var(--secondary-color);

    &:hover:not(:disabled):not(.selected) {
      background-color: var(--secondary-color-hover);
      border-color: var(--secondary-color-hover);
      box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
    }

    &.selected {
      border-color: var(--primary-color);
      background-color: var(--primary-color);
      color: white;
      transform: scale(1.02);
      box-shadow: 0 4px 12px rgba(44, 62, 80, 0.4);
    }

    &.correct {
      background-color: #27ae60;
      border-color: #27ae60;
      color: white;
      
      &:hover:not(:disabled) {
        background-color: #27ae60;
        border-color: #27ae60;
      }
    }

    &.incorrect {
      background-color: #e74c3c;
      border-color: #e74c3c;
      color: white;
      
      &:hover:not(:disabled) {
        background-color: #e74c3c;
        border-color: #e74c3c;
      }
    }
  }

  &.processing {
    opacity: 0.8;
    cursor: wait;
    
    span {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
</style>
