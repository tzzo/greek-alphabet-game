<template lang="pug">
GameCard
  .score-display
    .score-item
      .label Score
      .value {{ score }}
    .score-item
      .label High Score
      .value {{ highScore }}
    .score-item
      button.btn-small(@click="resetGame") Reset
  
  .greek-content
    .greek-text {{ currentWord.greek }}
    .english-translation {{ currentWord.english }}
  
  .game-buttons
    GameButton(
      v-for="g in genders"
      :key="g.value"
      :label="g.label"
      variant="option"
      :state="getButtonState(g.value)"
      :disabled="showResult"
      @click="guessGender(g.value)"
    )
</template>

<script setup lang="ts">
interface Word {
  greek: string
  english: string
  gender: 'masculine' | 'feminine' | 'neutral'
}

const genders = [
  { value: 'masculine', label: 'Masculine' },
  { value: 'feminine', label: 'Feminine' },
  { value: 'neutral', label: 'Neuter' }
]

const score = ref(0)
const highScore = ref(0)
const usedIndices = ref<number[]>([])
const showResult = ref(false)
const selectedGender = ref<string>('')
const currentIndex = ref(0)

const shuffledWords = ref<Word[]>([])
const wordsData = ref<Word[]>([])

const currentWord = computed(() => shuffledWords.value[currentIndex.value] || { greek: '', english: '', gender: 'masculine' })

async function loadWords() {
  try {
    const data = await $fetch<Word[]>('/words.json')
    wordsData.value = data
    loadHighScore()
    resetGame()
  } catch (error) {
    console.error('Failed to load words:', error)
    // Fallback to empty array if loading fails
    wordsData.value = []
  }
}

function shuffleWords() {
  if (wordsData.value.length === 0) return
  shuffledWords.value = [...wordsData.value].sort(() => Math.random() - 0.5)
  currentIndex.value = 0
  usedIndices.value = []
  showResult.value = false
  selectedGender.value = ''
}

function resetGame() {
  score.value = 0
  shuffleWords()
}

function saveHighScore() {
  if (process.client) {
    localStorage.setItem('greek-gender-highscore', highScore.value.toString())
  }
}

function loadHighScore() {
  if (process.client) {
    const saved = localStorage.getItem('greek-gender-highscore')
    if (saved) {
      highScore.value = parseInt(saved, 10)
    }
  }
}

function getButtonState(genderValue: string) {
  if (showResult.value) {
    if (genderValue === currentWord.value.gender) {
      return 'correct'
    } else if (selectedGender.value === genderValue && selectedGender.value !== currentWord.value.gender) {
      return 'incorrect'
    }
  }
  return selectedGender.value === genderValue ? 'selected' : 'default'
}

function guessGender(gender: string) {
  if (showResult.value) return
  selectedGender.value = gender
  showResult.value = true
  
  if (gender === currentWord.value.gender) {
    score.value++
    // Update high score if current score exceeds it
    if (score.value > highScore.value) {
      highScore.value = score.value
      saveHighScore()
    }
    // Auto-advance after 1.2 seconds for correct answers
    setTimeout(() => {
      nextWord()
    }, 1200)
  } else {
    score.value = 0 // Reset score on wrong answer
    // Auto-advance after 2.5 seconds for incorrect answers to show the correct answer
    setTimeout(() => {
      nextWord()
    }, 2500)
  }
}

function nextWord() {
  showResult.value = false
  selectedGender.value = ''
  if (currentIndex.value < shuffledWords.value.length - 1) {
    currentIndex.value++
  } else {
    shuffleWords()
  }
}

onMounted(() => {
  loadWords()
})
</script>

<style scoped lang="scss">
.english-translation {
  font-size: 1.3rem;
  color: var(--muted-text);
  margin-bottom: 2rem;
  font-style: italic;
  display: block;
  text-align: center;
}

.greek-content {
  flex-direction: column;
  gap: 0;
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  border: 1px solid var(--border-color);
  background: var(--card-background);
  color: var(--text-color);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: var(--secondary-color);
    color: white;
  }
}
</style>
