<template lang="pug">
.game-container
  .card.fade-in(v-if="gameStarted && !gameComplete")
    .score-display
      .score-item
        .label Current Streak
        .value {{ currentScore }}
      .score-item
        .label High Score
        .value {{ highScore }}
    
    .progress-container
      .progress-bar(:style="{ width: progressPercentage + '%' }")
    
    .greek-letter-container
      .greek-letter.readable {{ currentLetter.symbol }}
      .greek-letter.stylized {{ currentLetter.symbol }}
    
    .letter-info
      p.case-indicator {{ currentLetter.case === 'upper' ? 'Uppercase' : 'Lowercase' }}
    
    input.answer-input(
      v-model="userAnswer"
      @keyup.enter="checkAnswer"
      @input="resetInputState"
      :class="inputState"
      placeholder="Enter letter name (Alpha, άλφα, etc.)"
      ref="answerInput"
    )
    
    div
      button.btn.secondary(@click="checkAnswer" :disabled="!userAnswer.trim()") Submit
    
  .card.game-over.fade-in(v-if="gameComplete && completedSuccessfully")
    h2 Congratulations! 🎉
    .final-score You completed all {{ totalLetters }} letters!
    .final-score Final streak: {{ currentScore }}
    .final-score(v-if="isNewHighScore") New High Score! 🏆
    button.btn.primary(@click="restartGame") Play Again
    
  .card.game-failed.fade-in(v-if="gameComplete && !completedSuccessfully")
    h2 Game Over 😔
    .failure-message Oops! You got it wrong.
    .correct-answer 
      div The correct answer was: {{ correctAnswerText }}
      div.greek-name (Greek: {{ currentLetter.greek }})
    .final-score Your streak: {{ currentScore }}
    .final-score(v-if="isNewHighScore") New High Score! 🏆
    .final-score(v-else-if="currentScore > 0") {{ currentScore === 1 ? 'Not bad for your first try!' : `You got ${currentScore} letters right!` }}
    button.btn.primary(@click="restartGame") Try Again
</template>

<script setup>
// Greek alphabet data with both cases
const greekLettersBase = [
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

const uppercaseSymbols = ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω']
const lowercaseSymbols = ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω']

// Game state
const gameStarted = ref(true)  // Auto-start the game
const gameComplete = ref(false)
const completedSuccessfully = ref(false)
const currentScore = ref(0)
const highScore = ref(0)
const userAnswer = ref('')
const inputState = ref('')
const answerInput = ref(null)
const isNewHighScore = ref(false)
const correctAnswerText = ref('')

// Randomized letters for current game
const shuffledLetters = ref([])
const currentIndex = ref(0)

// Computed properties
const currentLetter = computed(() => shuffledLetters.value[currentIndex.value] || { symbol: 'Α', name: 'alpha', case: 'upper', alternatives: [] })
const totalLetters = computed(() => shuffledLetters.value.length)
const progressPercentage = computed(() => (currentIndex.value / totalLetters.value) * 100)

// Generate letters with both uppercase and lowercase
const generateGameLetters = () => {
  const letters = []
  
  // Add all uppercase letters
  greekLettersBase.forEach((letter, index) => {
    letters.push({
      symbol: uppercaseSymbols[index],
      name: letter.name,
      alternatives: letter.alternatives,
      greek: letter.greek,
      case: 'upper'
    })
  })
  
  // Add all lowercase letters
  greekLettersBase.forEach((letter, index) => {
    letters.push({
      symbol: lowercaseSymbols[index],
      name: letter.name,
      alternatives: letter.alternatives,
      greek: letter.greek,
      case: 'lower'
    })
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
const startGame = () => {
  gameStarted.value = true
  gameComplete.value = false
  currentScore.value = 0
  currentIndex.value = 0
  isNewHighScore.value = false
  
  // Generate and shuffle all letters (both uppercase and lowercase)
  const gameLetters = generateGameLetters()
  shuffledLetters.value = [...gameLetters].sort(() => Math.random() - 0.5)
  
  // Focus on input
  nextTick(() => {
    if (answerInput.value) {
      answerInput.value.focus()
    }
  })
}

const checkAnswer = () => {
  if (!userAnswer.value.trim()) return
  
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
    // Correct answer
    currentScore.value++
    inputState.value = 'correct'
    
    setTimeout(() => {
      nextLetter()
    }, 1000)
  } else {
    // Wrong answer - game over
    // Store the correct answer before ending the game
    const letter = currentLetter.value
    correctAnswerText.value = letter.name.charAt(0).toUpperCase() + letter.name.slice(1)
    
    inputState.value = 'incorrect'
    setTimeout(() => {
      endGame()
    }, 1500)
  }
}

const nextLetter = () => {
  currentIndex.value++
  
  if (currentIndex.value >= totalLetters.value) {
    // All letters completed successfully!
    endGame(true)
  } else {
    userAnswer.value = ''
    inputState.value = ''
    nextTick(() => {
      if (answerInput.value) {
        answerInput.value.focus()
      }
    })
  }
}

const endGame = (completed = false) => {
  gameComplete.value = true
  completedSuccessfully.value = completed
  
  // Check for high score
  if (currentScore.value > highScore.value) {
    highScore.value = currentScore.value
    highScoreCookie.value = currentScore.value
    isNewHighScore.value = true
  }
}

const restartGame = () => {
  gameComplete.value = false
  completedSuccessfully.value = false
  userAnswer.value = ''
  inputState.value = ''
  correctAnswerText.value = ''
  
  // Start a new game immediately
  startGame()
}

const resetInputState = () => {
  if (inputState.value) {
    inputState.value = ''
  }
}
</script>

<style lang="scss">
@import '../assets/scss/main.scss';
</style>
