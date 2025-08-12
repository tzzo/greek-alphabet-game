<template lang="pug">
.games-container
  .header
    h1 Greek Learning Games
    p Choose a game to start learning Greek
  
  .games-grid
    .game-card(v-for="game in games" :key="game.id")
      NuxtLink(:to="game.route" class="game-link")
        .game-icon
          span {{ game.icon }}
        .game-info
          h3 {{ game.title }}
          p {{ game.description }}
          .game-stats
            span.difficulty(:class="`difficulty-${game.difficulty}`") {{ game.difficulty }}
            span.duration {{ game.duration }}
</template>

<script setup lang="ts">
// Set page metadata
useHead({
  title: 'Greek Learning Games - Interactive Greek Language Learning',
  meta: [
    { name: 'description', content: 'Learn Greek with interactive games. Master the Greek alphabet, vocabulary, and more.' }
  ]
})

// Games data
const games = [
  {
    id: 'alphabet',
    title: 'Greek Alphabet',
    description: 'Learn the 24 letters of the Greek alphabet with interactive exercises',
    icon: 'Αα',
    route: '/alphabet',
    difficulty: 'beginner',
    duration: '10-15 min'
  },
  {
    id: 'weekdays',
    title: 'Greek Weekdays',
    description: 'Master the 7 days of the week in Greek with multiple choice questions',
    icon: '📅',
    route: '/weekdays',
    difficulty: 'beginner',
    duration: '5-10 min'
  }
  // Future games will be added here:
  // {
  //   id: 'vocabulary',
  //   title: 'Basic Vocabulary',
  //   description: 'Learn essential Greek words and phrases',
  //   icon: '📚',
  //   route: '/vocabulary',
  //   difficulty: 'beginner',
  //   duration: '15-20 min'
  // }
]
</script>

<style lang="scss" scoped>
.games-container {
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--bg-color);
  transition: background-color 0.3s ease;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
  max-width: 600px;

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

  p {
    font-size: 1.2rem;
    color: var(--secondary-color);
    margin-bottom: 0;
  }
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  width: 100%;
}

.game-card {
  background-color: var(--bg-color);
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: var(--shadow);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: var(--primary-color);

    .dark & {
      box-shadow: 0 8px 25px rgba(255, 255, 255, 0.1);
    }
  }
}

.game-link {
  display: block;
  text-decoration: none;
  color: inherit;
  padding: 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
}

.game-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
}

.game-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-color);
    margin: 0;
  }

  p {
    font-size: 1rem;
    color: var(--secondary-color);
    margin: 0;
    line-height: 1.5;
  }
}

.game-stats {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  justify-content: center;
  flex-wrap: wrap;

  span {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 500;
  }
}

.difficulty {
  &.difficulty-beginner {
    background-color: var(--success-color);
    color: white;
  }

  &.difficulty-intermediate {
    background-color: #ffc107;
    color: #212529;
  }

  &.difficulty-advanced {
    background-color: var(--danger-color);
    color: white;
  }
}

.duration {
  background-color: var(--border-color);
  color: var(--text-color);

  .dark & {
    background-color: #444;
  }
}

@media (max-width: 768px) {
  .games-container {
    padding: 1rem;
  }

  .header {
    margin-bottom: 2rem;

    h1 {
      font-size: 2rem;
    }

    p {
      font-size: 1rem;
    }
  }

  .games-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .game-link {
    padding: 1.5rem;
  }

  .game-icon {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }

  .game-info h3 {
    font-size: 1.25rem;
  }

  .game-stats {
    gap: 0.5rem;
    
    span {
      font-size: 0.75rem;
    }
  }
}
</style>
