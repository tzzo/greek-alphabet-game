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
  
  .english-content
    .english-text {{ currentWord.english }}
    .instruction Type the Greek translation:
  
  .translation-input
    input.greek-input(
      ref="greekInput"
      v-model="userInput"
      type="text"
      :placeholder="inputPlaceholder"
      :disabled="showResult"
      @keyup.enter="checkAnswer"
      @keyup.space="showResult ? nextWord() : null"
      @input="onInputChange"
      :class="{ 'correct': showResult && isCorrect, 'incorrect': showResult && !isCorrect }"
    )
    .input-lang-hint Greek keyboard recommended • Press Enter to check • Space to continue
  
  .game-buttons
    GameButton(
      label="Check Answer"
      variant="primary"
      :disabled="!userInput.trim() || showResult"
      @click="checkAnswer"
      v-if="!showResult"
    )
    GameButton(
      :label="nextButtonLabel"
      variant="primary"
      @click="nextWord"
      v-if="showResult"
    )
  
  .result-feedback(v-if="showResult")
    .feedback-message(:class="{ 'correct': isCorrect, 'incorrect': !isCorrect }")
      span(v-if="isCorrect") ✓ Correct!
      span(v-else) ✗ Incorrect
    .correct-answer(v-if="!isCorrect")
      .label Correct answer:
      .greek-answer {{ currentWord.greek }}
</template>

<script setup lang="ts">
interface Word {
  greek: string
  english: string
  gender: 'masculine' | 'feminine' | 'neutral'
}

const score = ref(0)
const highScore = ref(0)
const showResult = ref(false)
const isCorrect = ref(false)
const userInput = ref('')
const currentIndex = ref(0)
const greekInput = ref<HTMLInputElement>()

const shuffledWords = ref<Word[]>([])
const wordsData = ref<Word[]>([])

const currentWord = computed(() => shuffledWords.value[currentIndex.value] || { greek: '', english: '', gender: 'masculine' })

const inputPlaceholder = computed(() => {
  return showResult.value ? '' : 'Type in Greek...'
})

const nextButtonLabel = computed(() => {
  return currentIndex.value < shuffledWords.value.length - 1 ? 'Next Word' : 'Start Over'
})

// Greek keyboard detection and setup
function setupGreekKeyboard() {
  if (process.client && greekInput.value) {
    // Try to set Greek keyboard if supported
    try {
      greekInput.value.setAttribute('lang', 'el')
      greekInput.value.setAttribute('inputmode', 'text')
      // Some browsers support this attribute for keyboard layout suggestion
      greekInput.value.setAttribute('data-language', 'greek')
    } catch (error) {
      console.log('Greek keyboard setup not fully supported:', error)
    }
  }
}

function onInputChange() {
  // Auto-focus and setup Greek keyboard on first input
  if (process.client && greekInput.value && userInput.value.length === 1) {
    setupGreekKeyboard()
  }
}

async function loadWords() {
  try {
    const data = await $fetch<Word[]>('/words.json')
    wordsData.value = data
    loadHighScores()
    resetGame()
  } catch (error) {
    console.error('Failed to load words:', error)
    wordsData.value = []
  }
}

function shuffleWords() {
  if (wordsData.value.length === 0) return
  shuffledWords.value = [...wordsData.value].sort(() => Math.random() - 0.5)
  currentIndex.value = 0
  showResult.value = false
  userInput.value = ''
  isCorrect.value = false
}

function resetGame() {
  score.value = 0
  shuffleWords()
  nextTick(() => {
    if (greekInput.value) {
      greekInput.value.focus()
      setupGreekKeyboard()
    }
  })
}

function saveHighScores() {
  if (process.client) {
    localStorage.setItem('greek-translate-highscore', highScore.value.toString())
  }
}

function loadHighScores() {
  if (process.client) {
    const savedScore = localStorage.getItem('greek-translate-highscore')
    if (savedScore) {
      highScore.value = parseInt(savedScore, 10)
    }
  }
}

function normalizeGreekText(text: string): string {
  // Remove accents and normalize Greek text for comparison
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/ς/g, 'σ') // Replace final sigma with regular sigma
    .trim()
}

function checkAnswer() {
  if (showResult.value || !userInput.value.trim()) return
  
  showResult.value = true
  const userAnswer = normalizeGreekText(userInput.value)
  const correctAnswer = normalizeGreekText(currentWord.value.greek)
  
  // Also check for alternative spellings or partial matches
  isCorrect.value = userAnswer === correctAnswer || 
                   correctAnswer.includes(userAnswer) || 
                   userAnswer.includes(correctAnswer)
  
  if (isCorrect.value) {
    score.value++
    
    // Update high score
    if (score.value > highScore.value) {
      highScore.value = score.value
      saveHighScores()
    }
    
    // Auto-advance after 1.5 seconds for correct answers
    setTimeout(() => {
      nextWord()
    }, 1500)
  } else {
    // Reset score on wrong answer
    score.value = 0
    // Auto-advance after 3 seconds for incorrect answers to show the correct answer
    setTimeout(() => {
      nextWord()
    }, 3000)
  }
}

function nextWord() {
  showResult.value = false
  userInput.value = ''
  isCorrect.value = false
  
  if (currentIndex.value < shuffledWords.value.length - 1) {
    currentIndex.value++
  } else {
    shuffleWords()
  }
  
  nextTick(() => {
    if (greekInput.value) {
      greekInput.value.focus()
      setupGreekKeyboard()
    }
  })
}

onMounted(() => {
  loadWords()
})
</script>

<style scoped lang="scss">
.english-content {
  margin-bottom: 2rem;
  
  .english-text {
    font-size: 2rem;
    font-weight: 600;
    color: var(--text-color);
    margin-bottom: 1rem;
    display: block;
  }
  
  .instruction {
    font-size: 1.1rem;
    color: var(--secondary-color);
    font-style: italic;
  }
}

.translation-input {
  margin: 2rem 0;
  
  .greek-input {
    width: 100%;
    max-width: 300px;
    padding: 1rem;
    font-size: 1.5rem;
    text-align: center;
    border: 2px solid var(--border-color);
    border-radius: var(--border-radius);
    background: var(--bg-color);
    color: var(--text-color);
    outline: none;
    transition: all 0.3s ease;
    font-family: inherit;
    
    &:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(var(--primary-color-rgb), 0.1);
    }
    
    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    &.correct {
      border-color: var(--success-color);
      background: rgba(var(--success-color-rgb), 0.1);
      animation: correctPulse 0.6s ease;
    }
    
    &.incorrect {
      border-color: var(--danger-color);
      background: rgba(var(--danger-color-rgb), 0.1);
      animation: incorrectShake 0.6s ease;
    }
    
    &::placeholder {
      color: var(--muted-text);
      opacity: 0.7;
    }
  }
  
  .input-lang-hint {
    font-size: 0.8rem;
    color: var(--muted-text);
    margin-top: 0.5rem;
    opacity: 0.7;
  }
}

.result-feedback {
  margin: 1.5rem 0;
  
  .feedback-message {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 1rem;
    
    &.correct {
      color: var(--success-color);
    }
    
    &.incorrect {
      color: var(--danger-color);
    }
  }
  
  .correct-answer {
    .label {
      font-size: 1rem;
      color: var(--secondary-color);
      margin-bottom: 0.5rem;
    }
    
    .greek-answer {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-color);
      padding: 0.5rem 1rem;
      background: var(--card-background);
      border-radius: var(--border-radius);
      border: 1px solid var(--border-color);
    }
  }
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

@keyframes correctPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes incorrectShake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

@media (max-width: 768px) {
  .english-content .english-text {
    font-size: 1.5rem;
  }
  
  .translation-input .greek-input {
    font-size: 1.2rem;
    max-width: 250px;
  }
  
  .result-feedback .correct-answer .greek-answer {
    font-size: 1.2rem;
  }
}
</style>
