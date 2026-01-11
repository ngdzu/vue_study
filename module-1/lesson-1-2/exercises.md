# Exercises, Validation, and Grading — Lesson 1.2

## Exercise A: Password Strength Meter Component

Goal: Practice `computed()`, `v-model`, and component composition.

**Requirements**
- Create a standalone `PasswordStrength.vue` component
- Props: `password` (string)
- Computes strength based on:
  - Length (8+ chars = +1, 12+ chars = +1)
  - Contains lowercase AND uppercase = +1
  - Contains numbers = +1
  - Contains special characters = +1
- Display strength level (0-5) with colored bar and label
- Labels: "Too Short", "Weak", "Fair", "Good", "Strong", "Very Strong"
- Color-code the strength bar (red → yellow → green)
- Use `v-model` in parent to bind password input

**Validation (Manual)**
- Typing in the password field updates the strength meter in real-time
- Strength calculation is accurate based on criteria above
- Visual bar fills proportionally to strength level
- Colors change appropriately (red/yellow/green gradient)
- Component is reusable (no hard-coded parent dependencies)

**Grading Points** (20 points)
- Correct strength computation (10 pts)
- Real-time reactivity with v-model (5 pts)
- Visual feedback (bar + label) (3 pts)
- Clean, reusable component design (2 pts)

---

## Exercise B: Debounced Search Input

Goal: Practice `watch()`, debouncing, and async operations.

**Requirements**
- Input field for search query (v-model bound)
- Watch the search query with debounce (300ms delay)
- Simulate API call (use `setTimeout` for 500ms fake delay)
- Show loading indicator while "fetching"
- Display mock search results (generate 5 random items matching query)
- Clear results when input is empty
- Prevent multiple simultaneous API calls

**Validation (Manual)**
- Typing triggers search after 300ms pause (not on every keystroke)
- Loading indicator appears during "API call"
- Results update after loading completes
- Clearing input clears results immediately
- Rapid typing doesn't cause multiple overlapping calls
- No console errors

**Grading Points** (20 points)
- Correct debounce implementation (5 pts)
- Watch setup with proper cleanup (5 pts)
- Loading state management (5 pts)
- Prevents race conditions (3 pts)
- Clean UI feedback (2 pts)

---

## Exercise C: Two-Way Binding Form with Modifiers

Goal: Master `v-model` and its modifiers.

**Requirements**
- Create a settings form with:
  - Name (text input, `.trim` modifier)
  - Age (number input, `.number` modifier)
  - Bio (textarea, `.lazy` modifier for performance)
  - Notifications enabled (checkbox)
  - Theme preference (select dropdown: light/dark/auto)
- Display live preview of all values below the form
- Show data types in preview (e.g., age should be number, not string)
- Auto-save to localStorage on any change

**Validation (Manual)**
- Name input trims whitespace automatically
- Age input stores as number type (not string)
- Bio updates only on blur (lazy), not on every keystroke
- Checkbox toggles boolean value
- Select updates the theme value
- Preview matches form state exactly
- localStorage contains the saved data
- Reloading page restores saved values

**Grading Points** (20 points)
- All v-model modifiers used correctly (6 pts)
- Data types are correct (number, boolean, string) (5 pts)
- localStorage persistence works (5 pts)
- Live preview matches form state (2 pts)
- Clean code structure (2 pts)

---

## Exercise D: Computed vs Watch Challenge

Goal: Understand when to use `computed()` vs `watch()`.

**Requirements**
Refactor the following poorly written code:

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'

const items = ref([
  { id: 1, name: 'Apple', price: 1.5, quantity: 2 },
  { id: 2, name: 'Banana', price: 0.8, quantity: 5 }
])

// ❌ Bad: Using watch for derived state
const total = ref(0)
watch(items, () => {
  total.value = items.value.reduce((sum, item) => 
    sum + item.price * item.quantity, 0
  )
}, { deep: true, immediate: true })

// ❌ Bad: Using computed for side effects
const savedItems = computed(() => {
  localStorage.setItem('items', JSON.stringify(items.value))
  return items.value
})
</script>
```

**Task**: Rewrite this code properly using:
- `computed()` for the total calculation
- `watch()` for localStorage side effect
- Remove unnecessary reactivity

**Validation (Automated)**
Run this self-check:
```ts
// Total should be computed
console.assert(total instanceof ComputedRef, 'total should be computed')

// localStorage should be handled in watch, not computed
// (Manual check: savedItems should not exist)
```

**Grading Points** (20 points)
- Total uses computed (8 pts)
- localStorage uses watch (8 pts)
- No unnecessary reactivity (2 pts)
- Code clarity (2 pts)

---

## Exercise E: Reactive Object Pitfalls

Goal: Avoid common reactivity mistakes.

**Requirements**
Fix the following broken code:

```vue
<script setup lang="ts">
import { reactive } from 'vue'

// ❌ Problem 1: Destructuring loses reactivity
const state = reactive({ count: 0, name: 'Alice' })
let { count, name } = state

function increment() {
  count++ // Won't trigger updates!
}

// ❌ Problem 2: Reassignment breaks reactivity
let user = reactive({ id: 1, name: 'Bob' })
function resetUser() {
  user = { id: 0, name: '' } // Breaks reactivity!
}

// ❌ Problem 3: Passing primitive to child loses reactivity
const items = reactive({ list: ['a', 'b', 'c'] })
// Passing items.list to child component - will it stay reactive?
</script>
```

**Task**: Fix all three problems using proper Vue reactivity patterns.

**Solutions**:
1. Use `toRefs()` for destructuring
2. Use `ref()` instead of `reactive()` for reassignable objects
3. Pass the entire reactive object or use `toRef()`

**Validation (Manual)**
- Increment button updates the UI
- Reset user updates the UI
- Child component receives reactive data

**Grading Points** (20 points)
- Problem 1 fixed with toRefs (7 pts)
- Problem 2 fixed with ref (7 pts)
- Problem 3 fixed correctly (4 pts)
- Understanding demonstrated (2 pts)

---

## Grading Rubric (Total: 100 points)

- Exercise A (Password Strength): 20 points
- Exercise B (Debounced Search): 20 points
- Exercise C (v-model Modifiers): 20 points
- Exercise D (Computed vs Watch): 20 points
- Exercise E (Reactivity Pitfalls): 20 points

**Passing Score**: 80/100 (80%)

---

## Automated Validation Ideas (Optional)

### Unit Test for Password Strength

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PasswordStrength from '@/components/PasswordStrength.vue'

describe('PasswordStrength', () => {
  it('computes weak for short password', () => {
    const wrapper = mount(PasswordStrength, {
      props: { password: 'abc' }
    })
    expect(wrapper.text()).toContain('Weak')
  })

  it('computes strong for complex password', () => {
    const wrapper = mount(PasswordStrength, {
      props: { password: 'MyP@ssw0rd123!' }
    })
    expect(wrapper.text()).toContain('Strong')
  })
})
```

### E2E Test for Debounced Search

```ts
// cypress/e2e/search.cy.ts
describe('Debounced Search', () => {
  it('debounces input and shows results', () => {
    cy.visit('/')
    cy.get('[data-test="search-input"]').type('vue')
    cy.get('[data-test="loading"]').should('be.visible')
    cy.wait(800)
    cy.get('[data-test="results"]').should('be.visible')
    cy.get('[data-test="result-item"]').should('have.length.gt', 0)
  })
})
```

---

## Submission Checklist

- All exercises completed and manually validated
- Code runs without errors
- Reactivity works as expected (no .value errors, no stale data)
- TypeScript types are correct (no `any` types)
- Code is clean and follows Vue best practices
- Optional: Unit tests pass
- Optional: E2E tests pass

When all exercises pass validation, proceed to the quiz!
