<template lang="pug">
GameCard(v-if="gameState === 'playing'")
  .score-display
    .score-item
      .label Progress
      .value {{ correctAnswers }}/7
    .score-item
      .label Lives
      .value ❤️
  
  .progress-container
    .progress-bar(:style="`width: ${(correctAnswers / 7) * 100}%`")
  
  .greek-content
    .greek-text {{ currentWeekday.greek }}
  
  .game-info
    .instruction Select the correct English weekday:
      
  .weekday-options
    button.option-button(
      v-for="option in shuffledOptions" 
      :key="option"
      @click="selectAnswer(option)"
      :class="{ 'selected': selectedAnswer === option }"
    ) {{ option }}

GameCard(v-if="gameState === 'won'")
  .game-results
    h2 Congratulations!
    .celebration 🎉
    .final-stats
      div You've learned all 7 Greek weekdays!
      div Perfect Score: 
        span.stat-value 7/7
    .game-buttons
      button.btn.primary(@click="resetGame") Play Again
      NuxtLink(to="/" class="btn secondary") Back to Games

GameCard(v-if="gameState === 'lost'")
  .game-results
    h2 Game Over
    .celebration 😔
    .final-stats
      div You got 
        span.stat-value {{ correctAnswers }} 
        span  out of 7 weekdays correct
      div.encouragement Keep practicing to improve!
    .game-buttons
      button.btn.primary(@click="resetGame") Try Again
      NuxtLink(to="/" class="btn secondary") Back to Games
</template>

<script setup lang="ts">
interface Weekday {
  greek: string
  english: string
}

// Greek weekdays data
const weekdays: Weekday[] = [
  { greek: 'Δευτέρα', english: 'Monday' },
  { greek: 'Τρίτη', english: 'Tuesday' },
  { greek: 'Τετάρτη', english: 'Wednesday' },
  { greek: 'Πέμπτη', english: 'Thursday' },
  { greek: 'Παρασκευή', english: 'Friday' },
  { greek: 'Σάββατο', english: 'Saturday' },
  { greek: 'Κυριακή', english: 'Sunday' }
]

// Game state
const gameState = ref<'playing' | 'won' | 'lost'>('playing')
const correctAnswers = ref(0)
const currentWeekdayIndex = ref(0)
const selectedAnswer = ref('')
const usedWeekdays = ref<number[]>([])

// Computed properties
const currentWeekday = computed(() => {
  if (currentWeekdayIndex.value >= weekdays.length) {
    return weekdays[0]
  }
  return weekdays[currentWeekdayIndex.value]
})

const shuffledOptions = computed(() => {
  const current = currentWeekday.value
  if (!current) return []
  
  const correct = current.english
  const incorrect = weekdays
    .filter(w => w.english !== correct)
    .map(w => w.english)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
  
  const allOptions = [correct, ...incorrect]
  return allOptions.sort(() => Math.random() - 0.5)
})

// Methods
function selectAnswer(answer: string) {
  selectedAnswer.value = answer
  
  setTimeout(() => {
    const current = currentWeekday.value
    if (!current) return
    
    if (answer === current.english) {
      correctAnswers.value++
      usedWeekdays.value.push(currentWeekdayIndex.value)
      
      if (correctAnswers.value === 7) {
        gameState.value = 'won'
      } else {
        nextWeekday()
      }
    } else {
      gameState.value = 'lost'
    }
    
    selectedAnswer.value = ''
  }, 500)
}

function nextWeekday() {
  const availableIndices = weekdays
    .map((_, index) => index)
    .filter(index => !usedWeekdays.value.includes(index))
  
  if (availableIndices.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableIndices.length)
    const selectedIndex = availableIndices[randomIndex]
    if (selectedIndex !== undefined) {
      currentWeekdayIndex.value = selectedIndex
    }
  }
}

function resetGame() {
  gameState.value = 'playing'
  correctAnswers.value = 0
  selectedAnswer.value = ''
  usedWeekdays.value = []
  // Start with a random weekday instead of always index 0
  currentWeekdayIndex.value = Math.floor(Math.random() * weekdays.length)
}

// Initialize game
onMounted(() => {
  // Start with a random weekday on initial load
  currentWeekdayIndex.value = Math.floor(Math.random() * weekdays.length)
})
</script>

<style lang="scss" scoped>
// Game-specific styles for weekdays options
.weekday-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  max-width: 400px;
  margin: 0 auto;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.option-button {
  padding: 1rem 1.5rem;
  border: 2px solid var(--secondary-color);
  border-radius: 12px;
  background-color: var(--secondary-color);
  color: white;
  font-family: inherit;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.2);

  &:hover:not(.selected) {
    background-color: var(--secondary-color-hover);
    border-color: var(--secondary-color-hover);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
  }

  &.selected {
    border-color: var(--primary-color);
    background-color: var(--primary-color);
    color: white;
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(44, 62, 80, 0.4);
  }
}

.encouragement {
  font-size: 1.1rem;
  color: var(--muted-text);
  font-style: italic;
  margin-top: 1rem;
}
</style>
