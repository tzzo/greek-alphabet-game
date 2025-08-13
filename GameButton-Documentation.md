# GameButton Component

A reusable button component for the Greek Game application that provides consistent styling and behavior across all game components.

## Features

- **Multiple variants**: Primary, Secondary, and Option styles
- **Different states**: Default, Success, Failure, Selected, Correct, Incorrect
- **Processing state**: Shows loading indicator with custom text
- **Accessibility**: Proper disabled states and ARIA support
- **Consistent styling**: Unified design across all games

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | Required | The text to display on the button |
| `type` | `'button' \| 'submit'` | `'button'` | HTML button type |
| `variant` | `'primary' \| 'secondary' \| 'option'` | `'primary'` | Button style variant |
| `state` | `'default' \| 'success' \| 'failure' \| 'selected' \| 'correct' \| 'incorrect'` | `'default'` | Button state for styling |
| `disabled` | `boolean` | `false` | Whether the button is disabled |
| `processing` | `boolean` | `false` | Whether the button is in processing state |
| `processingLabel` | `string` | `'Processing...'` | Text to show when processing |

## Events

| Event | Description |
|-------|-------------|
| `@click` | Emitted when the button is clicked (only if not disabled or processing) |

## Usage Examples

### Basic Usage
```vue
<GameButton 
  label="Submit" 
  @click="handleSubmit" 
/>
```

### Submit Button with Processing State
```vue
<GameButton 
  type="submit"
  label="Submit Answer"
  variant="secondary"
  :disabled="!userInput"
  :processing="isSubmitting"
  processing-label="Checking..."
  @click="checkAnswer"
/>
```

### Multiple Choice Options
```vue
<GameButton 
  v-for="option in options"
  :key="option.id"
  :label="option.label"
  variant="option"
  :state="getButtonState(option.id)"
  @click="selectOption(option.id)"
/>
```

### Success/Failure States
```vue
<GameButton 
  label="Try Again"
  variant="primary"
  state="failure"
  @click="retry"
/>
```

## Variants

### Primary (Default)
- Blue background with white text
- Used for main actions like "Play Again", "Submit"

### Secondary  
- Light blue background
- Used for secondary actions

### Option
- Used for multiple choice buttons
- Supports selected, correct, and incorrect states
- Perfect for quiz-style interactions

## States

- **Default**: Normal button appearance
- **Success**: Green color scheme
- **Failure**: Red color scheme  
- **Selected**: Highlighted to show current selection
- **Correct**: Green styling to show correct answer
- **Incorrect**: Red styling to show wrong answer

## Migration from Old Buttons

### Before (WeekdaysGame)
```vue
<button class="option-button" 
  :class="{ 'selected': selectedAnswer === option }"
  @click="selectAnswer(option)">
  {{ option }}
</button>
```

### After
```vue
<GameButton 
  :label="option"
  variant="option"
  :state="selectedAnswer === option ? 'selected' : 'default'"
  @click="selectAnswer(option)"
/>
```

## Benefits

1. **Consistency**: All buttons across the app now have the same look and feel
2. **Maintainability**: Changes to button styles only need to be made in one place
3. **Reusability**: Easy to add new buttons with different states and variants
4. **Accessibility**: Built-in disabled and processing states
5. **Type Safety**: Full TypeScript support with proper prop validation
