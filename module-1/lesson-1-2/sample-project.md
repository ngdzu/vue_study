# Sample Project — Real-Time Form Validator

Purpose: Demonstrate Vue's reactivity system with `ref()`, `reactive()`, `computed()`, `watch()`, and `v-model` in a practical form validation scenario.

## Requirements

Build a user registration form with real-time validation feedback:

- **Fields**: Username, email, password, confirm password
- **Reactive validation**: Show errors/success immediately as user types
- **Computed properties**: Form validity, password strength indicator
- **Watchers**: Auto-save draft to localStorage, check username availability (simulated)
- **Two-way binding**: All inputs use `v-model`
- **Visual feedback**: Color-coded validation states (red/green borders, icons)

## Suggested File Layout

```
src/
  components/
    RegistrationForm.vue     # Main form component
    PasswordStrength.vue     # Password strength indicator component
  composables/
    useFormValidation.ts     # Validation logic (optional, for practice)
  App.vue
```

## Implementation Steps

### 1. Setup Reactive State

```ts
import { ref, reactive } from 'vue'

const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// OR use individual refs
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
```

### 2. Computed Validation Rules

```ts
import { computed } from 'vue'

const isUsernameValid = computed(() => {
  return formData.username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(formData.username)
})

const isEmailValid = computed(() => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
})

const isPasswordValid = computed(() => {
  return formData.password.length >= 8
})

const doPasswordsMatch = computed(() => {
  return formData.password === formData.confirmPassword && formData.confirmPassword !== ''
})

const isFormValid = computed(() => {
  return isUsernameValid.value && 
         isEmailValid.value && 
         isPasswordValid.value && 
         doPasswordsMatch.value
})
```

### 3. Password Strength Computation

```ts
const passwordStrength = computed(() => {
  const pwd = formData.password
  if (pwd.length === 0) return { level: 0, label: '' }
  
  let strength = 0
  if (pwd.length >= 8) strength++
  if (pwd.length >= 12) strength++
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++
  if (/\d/.test(pwd)) strength++
  if (/[^a-zA-Z0-9]/.test(pwd)) strength++
  
  const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
  return { level: strength, label: labels[strength - 1] || 'Weak' }
})
```

### 4. Watch for Auto-Save to localStorage

```ts
import { watch } from 'vue'

watch(formData, (newData) => {
  localStorage.setItem('registration-draft', JSON.stringify(newData))
}, { deep: true })

// Restore on mount
import { onMounted } from 'vue'

onMounted(() => {
  const draft = localStorage.getItem('registration-draft')
  if (draft) {
    Object.assign(formData, JSON.parse(draft))
  }
})
```

### 5. Watch Username for Availability Check (Debounced)

```ts
const isCheckingUsername = ref(false)
const isUsernameAvailable = ref<boolean | null>(null)

let debounceTimer: number

watch(() => formData.username, (newUsername) => {
  clearTimeout(debounceTimer)
  isUsernameAvailable.value = null
  
  if (!isUsernameValid.value) return
  
  isCheckingUsername.value = true
  
  debounceTimer = setTimeout(async () => {
    // Simulate API check
    await new Promise(resolve => setTimeout(resolve, 500))
    isUsernameAvailable.value = !['admin', 'root', 'test'].includes(newUsername)
    isCheckingUsername.value = false
  }, 500)
})
```

### 6. Template with v-model and Validation Feedback

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <div class="field">
      <label>Username</label>
      <input 
        v-model="formData.username" 
        type="text"
        :class="{ 
          'valid': isUsernameValid && isUsernameAvailable, 
          'invalid': formData.username && !isUsernameValid 
        }"
      >
      <span v-if="isCheckingUsername">Checking...</span>
      <span v-else-if="formData.username && !isUsernameValid" class="error">
        3+ chars, alphanumeric only
      </span>
      <span v-else-if="isUsernameAvailable === false" class="error">
        Username taken
      </span>
      <span v-else-if="isUsernameAvailable === true" class="success">
        ✓ Available
      </span>
    </div>

    <div class="field">
      <label>Email</label>
      <input 
        v-model="formData.email" 
        type="email"
        :class="{ 
          'valid': isEmailValid, 
          'invalid': formData.email && !isEmailValid 
        }"
      >
      <span v-if="formData.email && !isEmailValid" class="error">
        Invalid email format
      </span>
    </div>

    <div class="field">
      <label>Password</label>
      <input 
        v-model="formData.password" 
        type="password"
        :class="{ 
          'valid': isPasswordValid, 
          'invalid': formData.password && !isPasswordValid 
        }"
      >
      <PasswordStrength :strength="passwordStrength" />
      <span v-if="formData.password && !isPasswordValid" class="error">
        Minimum 8 characters
      </span>
    </div>

    <div class="field">
      <label>Confirm Password</label>
      <input 
        v-model="formData.confirmPassword" 
        type="password"
        :class="{ 
          'valid': doPasswordsMatch, 
          'invalid': formData.confirmPassword && !doPasswordsMatch 
        }"
      >
      <span v-if="formData.confirmPassword && !doPasswordsMatch" class="error">
        Passwords don't match
      </span>
    </div>

    <button type="submit" :disabled="!isFormValid">
      Register
    </button>
  </form>
</template>
```

## Acceptance Criteria

- All fields use `v-model` for two-way binding
- Validation feedback appears in real-time as user types
- Password strength indicator updates dynamically
- Username availability check is debounced (500ms delay)
- Form auto-saves to localStorage on every change
- Draft is restored from localStorage on page load
- Submit button is disabled until form is valid
- CSS classes (valid/invalid) applied based on computed properties
- No console errors

## Stretch Goals (Optional)

- Extract validation logic into a `useFormValidation` composable
- Add transition animations for error messages (Vue `<Transition>`)
- Implement "Show Password" toggle
- Add accessibility: ARIA labels, error announcements
- Create a `PasswordStrength.vue` child component with visual strength bar
- Add a "Clear Form" button that also clears localStorage
- Implement actual API call for username availability (use JSONPlaceholder or similar)

## Visual Design Suggestions

```css
.field {
  margin-bottom: 1rem;
}

input.valid {
  border: 2px solid #10b981;
}

input.invalid {
  border: 2px solid #ef4444;
}

.error {
  color: #ef4444;
  font-size: 0.875rem;
}

.success {
  color: #10b981;
  font-size: 0.875rem;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

## Self-Check Questions

- Can you explain why computed properties are better than methods for validation?
- Why is debouncing necessary for the username availability check?
- What would happen if you didn't use `deep: true` in the localStorage watcher?
- How does Vue track dependencies in the computed properties?
- What's the performance difference between watching the entire `formData` object vs individual fields?
