<template lang="pug">
GameCard(v-if="gameStarted && !gameComplete")
  .score-display
    .score-item
      .label Current Streak
      .value {{ currentScore }}
    .score-item
      .label High Score
      .value {{ highScore }}
  
  .progress-container
    .progress-bar(:style="{ width: progressPercentage + '%' }")
  
  .greek-content
    .greek-letter.readable {{ currentLetter.symbol }}
    .greek-letter.stylized {{ currentLetter.symbol }}
  
  .game-info
    p.case-indicator {{ currentLetter.case === 'upper' ? 'Uppercase' : 'Lowercase' }}
  
  form(
    @submit.prevent="!isProcessingAnswer && checkAnswer()"
    autocomplete="off"
  )
    input.game-input(
      v-model="userAnswer"
      @keyup.enter="!isProcessingAnswer && checkAnswer()"
      @input="resetInputState"
      @focus="handleInputFocus"
      :class="inputState"
      :disabled="isProcessingAnswer"
      placeholder="Enter letter name (Alpha, άλφα, etc.)"
      ref="answerInput"
      autocomplete="off"
      autocorrect="off"
      spellcheck="false"
      inputmode="text"
      data-form-type="other"
      data-lpignore="true"
      data-1p-ignore="true"
      readonly
      @touchstart="enableInput"
      @click="enableInput"
    )
    
    .game-buttons
      GameButton(
        type="submit"
        label="Submit"
        variant="secondary"
        :state="getButtonState()"
        :disabled="!userAnswer.trim() || isProcessingAnswer"
        :processing="isProcessingAnswer"
        :processing-label="inputState === 'correct' ? 'Next...' : 'Game Over...'"
        @click="checkAnswer"
      )

GameCard(v-if="gameComplete && completedSuccessfully")
  .game-results
    h2 Congratulations! 
    .celebration 🎉
    .final-stats
      div You completed all {{ totalLetters }} letters!
      div Final streak: 
        span.stat-value {{ currentScore }}
      div(v-if="isNewHighScore") New High Score! 🏆
    GameButton(
      label="Play Again"
      variant="primary"
      @click="restartGame"
    )
  
GameCard(v-if="gameComplete && !completedSuccessfully")
  .game-results
    h2 Game Over 
    .celebration 😔
    .failure-message Oops! You got it wrong.
    .correct-answer 
      div The correct answer was: {{ correctAnswerText }}
      div.greek-name (Greek: {{ currentLetter.greek }})
    .final-stats
      div Your streak: 
        span.stat-value {{ currentScore }}
      div(v-if="isNewHighScore") New High Score! 🏆
      div(v-else-if="currentScore > 0") {{ currentScore === 1 ? 'Not bad for your first try!' : `You got ${currentScore} letters right!` }}
    GameButton(
      label="Try Again"
      variant="primary"
      @click="restartGame"
    )
</template>

<script setup lang="ts">
// Types
interface GreekLetter {
  name: string
  alternatives: string[]
  greek: string
}

interface GameLetter extends GreekLetter {
  symbol: string
  case: 'upper' | 'lower'
}

// Greek alphabet data with both cases
const greekLettersBase: GreekLetter[] = [
  { name: 'alpha', alternatives: ['alfa'], greek: 'άλφα' },
  { name: 'beta', alternatives: ['vita'], greek: 'βήτα' },
  { name: 'gamma', alternatives: [], greek: 'γάμμα' },
  { name: 'delta', alternatives: [], greek: 'δέλτα' },
  { name: 'epsilon', alternatives: [], greek: 'έψιλον' },
  { name: 'zeta', alternatives: ['zita'], greek: 'ζήτα' },
  { name: 'eta', alternatives: ['ita'], greek: 'ήτα' },
  { name: 'theta', alternatives: ['thita'], greek: 'θήτα' },
  { name: 'iota', alternatives: [], greek: 'ιώτα' },
  { name: 'kappa', alternatives: [], greek: 'κάππα' },
  { name: 'lambda', alternatives: ['lamda'], greek: 'λάμδα' },
  { name: 'mu', alternatives: ['miu'], greek: 'μι' },
  { name: 'nu', alternatives: ['niu'], greek: 'νι' },
  { name: 'xi', alternatives: ['ksi'], greek: 'ξι' },
  { name: 'omicron', alternatives: [], greek: 'όμικρον' },
  { name: 'pi', alternatives: [], greek: 'πι' },
  { name: 'rho', alternatives: ['ro'], greek: 'ρο' },
  { name: 'sigma', alternatives: [], greek: 'σίγμα' },
  { name: 'tau', alternatives: [], greek: 'ταυ' },
  { name: 'upsilon', alternatives: ['ypsilon'], greek: 'ύψιλον' },
  { name: 'phi', alternatives: ['fi'], greek: 'φι' },
  { name: 'chi', alternatives: ['khi'], greek: 'χι' },
  { name: 'psi', alternatives: [], greek: 'ψι' },
  { name: 'omega', alternatives: [], greek: 'ωμέγα' }
]

const uppercaseSymbols: string[] = ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω']
const lowercaseSymbols: string[] = ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω']

// Game state
const gameStarted = ref<boolean>(true)  // Auto-start the game
const gameComplete = ref<boolean>(false)
const completedSuccessfully = ref<boolean>(false)
const currentScore = ref<number>(0)
const highScore = ref<number>(0)
const userAnswer = ref<string>('')
const inputState = ref<string>('')
const answerInput = ref<HTMLInputElement | null>(null)
const isNewHighScore = ref<boolean>(false)
const correctAnswerText = ref<string>('')
const isProcessingAnswer = ref<boolean>(false)

// Randomized letters for current game
const shuffledLetters = ref<GameLetter[]>([])
const currentIndex = ref<number>(0)

// Computed properties
const currentLetter = computed((): GameLetter => 
  shuffledLetters.value[currentIndex.value] || { 
    symbol: 'Α', 
    name: 'alpha', 
    case: 'upper' as const, 
    alternatives: [],
    greek: 'άλφα'
  }
)
const totalLetters = computed((): number => shuffledLetters.value.length)
const progressPercentage = computed((): number => (currentIndex.value / totalLetters.value) * 100)

// Generate letters with both uppercase and lowercase
const generateGameLetters = (): GameLetter[] => {
  const letters: GameLetter[] = []
  
  // Add all uppercase letters
  greekLettersBase.forEach((letter, index) => {
    const symbol = uppercaseSymbols[index]
    if (symbol) {
      letters.push({
        symbol,
        name: letter.name,
        alternatives: letter.alternatives,
        greek: letter.greek,
        case: 'upper'
      })
    }
  })
  
  // Add all lowercase letters
  greekLettersBase.forEach((letter, index) => {
    const symbol = lowercaseSymbols[index]
    if (symbol) {
      letters.push({
        symbol,
        name: letter.name,
        alternatives: letter.alternatives,
        greek: letter.greek,
        case: 'lower'
      })
    }
  })
  
  return letters
}

// Cookie management for high score
const highScoreCookie = useCookie('greek-alphabet-high-score', {
  default: () => 0,
  maxAge: 60 * 60 * 24 * 365 // 1 year
})

// Initialize high score from cookie and start game
onMounted(() => {
  highScore.value = highScoreCookie.value || 0
  startGame()
})

// Game functions
const startGame = (): void => {
  gameStarted.value = true
  gameComplete.value = false
  currentScore.value = 0
  currentIndex.value = 0
  isNewHighScore.value = false
  isProcessingAnswer.value = false
  
  // Generate and shuffle all letters (both uppercase and lowercase)
  const gameLetters = generateGameLetters()
  shuffledLetters.value = [...gameLetters].sort(() => Math.random() - 0.5)
  
  // Focus on input with iOS Safari handling
  nextTick(() => {
    if (answerInput.value) {
      answerInput.value.removeAttribute('readonly')
      answerInput.value.focus()
    }
  })
}

const getButtonState = () => {
  if (inputState.value === 'correct') return 'success'
  if (inputState.value === 'incorrect') return 'failure'
  return 'default'
}

const checkAnswer = (): void => {
  if (!userAnswer.value.trim() || isProcessingAnswer.value) return
  
  // Set processing state immediately
  isProcessingAnswer.value = true
  
  const answer = userAnswer.value.toLowerCase().trim()
  const letter = currentLetter.value
  
  // Create array of all accepted answers: English name, alternatives, and Greek name
  const correctAnswers = [
    letter.name, 
    ...letter.alternatives,
    letter.greek,
    // Also accept Greek name without accents for easier typing
    letter.greek.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  ]
  
  if (correctAnswers.includes(answer)) {
    // Correct answer - show green immediately
    currentScore.value++
    inputState.value = 'correct'
    
    setTimeout(() => {
      isProcessingAnswer.value = false
      nextLetter()
    }, 1000)
  } else {
    // Wrong answer - show red immediately
    // Store the correct answer before ending the game
    correctAnswerText.value = letter.name.charAt(0).toUpperCase() + letter.name.slice(1)
    inputState.value = 'incorrect'
    
    setTimeout(() => {
      isProcessingAnswer.value = false
      endGame()
    }, 1500)
  }
}

const nextLetter = (): void => {
  currentIndex.value++
  
  if (currentIndex.value >= totalLetters.value) {
    // All letters completed successfully!
    endGame(true)
  } else {
    userAnswer.value = ''
    inputState.value = ''
    
    // iOS Safari specific focus handling
    if (answerInput.value) {
      answerInput.value.removeAttribute('readonly')
    }
    
    // Ensure focus is maintained immediately and after DOM updates
    nextTick(() => {
      if (answerInput.value) {
        answerInput.value.focus()
        // Double-check focus on iOS Safari
        setTimeout(() => {
          if (answerInput.value && document.activeElement !== answerInput.value) {
            answerInput.value.focus()
          }
        }, 100)
      }
    })
  }
}

const endGame = (completed: boolean = false): void => {
  gameComplete.value = true
  completedSuccessfully.value = completed
  
  // Remove focus from input when game ends
  if (answerInput.value) {
    answerInput.value.blur()
  }
  
  // Check for high score
  if (currentScore.value > highScore.value) {
    highScore.value = currentScore.value
    highScoreCookie.value = currentScore.value
    isNewHighScore.value = true
  }
}

const restartGame = (): void => {
  gameComplete.value = false
  completedSuccessfully.value = false
  userAnswer.value = ''
  inputState.value = ''
  correctAnswerText.value = ''
  isProcessingAnswer.value = false
  
  // Start a new game immediately
  startGame()
}

const resetInputState = (): void => {
  if (inputState.value && !isProcessingAnswer.value) {
    inputState.value = ''
    // Ensure focus is maintained when resetting input state
    nextTick(() => {
      if (answerInput.value && document.activeElement !== answerInput.value) {
        answerInput.value.focus()
      }
    })
  }
}

// iOS Safari specific functions
const handleInputFocus = (): void => {
  // Remove readonly to allow input while preventing initial autofill
  if (answerInput.value) {
    answerInput.value.removeAttribute('readonly')
  }
}

const enableInput = (): void => {
  // Make input writable on touch/click to prevent iOS Safari readonly issues
  if (answerInput.value) {
    answerInput.value.removeAttribute('readonly')
    // Focus after a brief delay to ensure proper keyboard behavior
    if (document.activeElement !== answerInput.value) {
      setTimeout(() => {
        if (answerInput.value) {
          answerInput.value.focus()
        }
      }, 50)
    }
  }
}
</script>

<style lang="scss" scoped>
// Game-specific styles that aren't in the base GameCard component

.failure-message {
  font-size: 1.3rem;
  color: var(--muted-text);
  margin-bottom: 15px;
}

.correct-answer {
  font-size: 1.4rem;
  font-weight: bold;
  color: var(--success-color);
  margin: 15px 0 25px 0;
  padding: 15px;
  background-color: rgba(39, 174, 96, 0.1);
  border-radius: 8px;
  border-left: 4px solid var(--success-color);
  
  .greek-name {
    font-size: 1.2rem;
    font-weight: normal;
    color: var(--primary-color);
    font-style: italic;
    margin-top: 8px;
  }
}
</style>
