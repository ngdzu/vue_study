# Exercises, Validation, and Grading — Lesson 2.2

## Exercise A: Convert Options API Counter to Composition API

Goal: Practice converting a simple Options API component to both `setup()` and `<script setup>` versions.

**Requirements**
- Given the following Options API counter component, convert it to Composition API
- Create TWO versions:
  1. Using `setup()` function
  2. Using `<script setup>` syntax
- Maintain all functionality (count, increment, decrement, reset)
- Add a computed property for doubled value
- Add a watcher that logs when count is divisible by 5

**Original Component (Options API)**:
```ts
export default {
  data() {
    return {
      count: 0
    }
  },
  computed: {
    doubled() {
      return this.count * 2
    }
  },
  watch: {
    count(newValue) {
      if (newValue % 5 === 0) {
        console.log('Count is divisible by 5!')
      }
    }
  },
  methods: {
    increment() {
      this.count++
    },
    decrement() {
      this.count--
    },
    reset() {
      this.count = 0
    }
  }
}
```

**Validation (Manual)**
- Both versions produce identical functionality
- Clicking increment/decrement updates count
- Doubled value updates correctly
- Console logs when count hits 0, 5, 10, etc.
- Reset button works
- TypeScript has no errors

**Grading Points** (20 points)
- Correct `setup()` version (8 pts)
- Correct `<script setup>` version (8 pts)
- Computed property works (2 pts)
- Watcher works correctly (2 pts)

---

## Exercise B: Create useMouse Composable

Goal: Build a reusable composable that tracks mouse position and demonstrates cleanup.

**Requirements**
- Create `composables/useMouse.ts`
- Track mouse X and Y coordinates
- Update on `mousemove` event
- Use lifecycle hooks (`onMounted`, `onUnmounted`)
- Properly cleanup event listeners
- Return reactive `x` and `y` values
- Use in a component to display mouse position

**Expected Composable API**:
```ts
const { x, y } = useMouse()
```

**Validation (Manual)**
- Moving mouse updates X/Y values in real-time
- No memory leaks (listeners removed on unmount)
- Values are reactive (template updates automatically)
- TypeScript types are correct
- Works in multiple components simultaneously

**Grading Points** (20 points)
- Correct ref usage for x/y (4 pts)
- Event listener setup in onMounted (4 pts)
- Event listener cleanup in onUnmounted (4 pts)
- Proper TypeScript types (4 pts)
- Component usage demonstration (4 pts)

---

## Exercise C: Create useLocalStorage Composable

Goal: Build a composable for persistent state with localStorage.

**Requirements**
- Create `composables/useLocalStorage.ts`
- Accept key and default value as parameters
- Load initial value from localStorage if exists
- Auto-save to localStorage on value changes
- Support any JSON-serializable type with TypeScript generics
- Handle JSON parse errors gracefully
- Use `watch` with `deep: true` for objects

**Expected Composable API**:
```ts
const count = useLocalStorage('count', 0)
const user = useLocalStorage('user', { name: '', age: 0 })

// Auto-persists to localStorage
count.value++
user.value.name = 'Alice'
```

**Validation (Manual)**
- Initial value loads from localStorage if exists
- Updates persist to localStorage automatically
- Refresh page - values persist
- Works with primitives (numbers, strings, booleans)
- Works with objects and arrays
- Invalid JSON in localStorage doesn't crash app
- Multiple instances with different keys work independently

**Grading Points** (25 points)
- Generic TypeScript implementation (5 pts)
- Load from localStorage (5 pts)
- Watch and save on changes (5 pts)
- Deep watching for objects (5 pts)
- Error handling (3 pts)
- Component usage demonstration (2 pts)

---

## Exercise D: Refactor Complex Form Component

Goal: Refactor an Options API form to Composition API with extracted composables.

**Requirements**
- Given a user profile form with validation (Options API)
- Refactor to `<script setup>` 
- Extract validation logic into `useFormValidation` composable
- Extract form state management into `useForm` composable
- Maintain all validation rules and error messages
- Add form submission with loading state

**Original Component (Simplified)**:
```ts
export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      errors: {}
    }
  },
  computed: {
    isUsernameValid() {
      return this.username.length >= 3
    },
    isEmailValid() {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)
    },
    isPasswordValid() {
      return this.password.length >= 8
    },
    doPasswordsMatch() {
      return this.password === this.confirmPassword
    },
    isFormValid() {
      return this.isUsernameValid && 
             this.isEmailValid && 
             this.isPasswordValid && 
             this.doPasswordsMatch
    }
  },
  methods: {
    validateField(field) {
      // Validation logic
    },
    async submit() {
      if (this.isFormValid) {
        // Submit logic
      }
    }
  }
}
```

**Validation (Manual)**
- All validation rules work correctly
- Error messages display for invalid fields
- Form submission prevented when invalid
- Loading state shows during submission
- Composables are reusable in other components
- TypeScript types are correct

**Grading Points** (35 points)
- Correct refactor to `<script setup>` (10 pts)
- `useFormValidation` composable (10 pts)
- `useForm` composable (10 pts)
- Form submission with loading state (3 pts)
- Error message display (2 pts)

---

## Bonus Exercise E: Create useDebounce Composable

Goal: Build a versatile debounce composable for search inputs and API calls.

**Requirements**
- Create `composables/useDebounce.ts`
- Accept a ref and delay as parameters
- Return debounced ref value
- Optionally accept immediate mode (trigger on leading edge)
- Use with search input to debounce API calls

**Expected Composable API**:
```ts
const searchQuery = ref('')
const debouncedQuery = useDebounce(searchQuery, 300)

// Watch debouncedQuery for API calls
watch(debouncedQuery, (newValue) => {
  fetchSearchResults(newValue)
})
```

**Alternative API with Callback**:
```ts
const { debouncedValue, cancel } = useDebounce(
  sourceRef, 
  300,
  { immediate: false }
)
```

**Validation (Manual)**
- Typing updates immediately show in input
- Debounced value updates after delay
- Rapid typing doesn't trigger multiple callbacks
- Can cancel pending debounce
- Works with different delay times
- Immediate mode works correctly

**Grading Points** (25 points)
- Correct debounce logic (10 pts)
- Generic TypeScript support (5 pts)
- Immediate mode support (5 pts)
- Cancel functionality (3 pts)
- Component usage demonstration (2 pts)

---

## Bonus Exercise F: Lifecycle Hooks Comparison

Goal: Understand lifecycle hook differences between Options API and Composition API.

**Requirements**
- Create a component that logs all lifecycle events
- Implement in BOTH Options API and Composition API
- Log timestamps for each hook
- Compare execution order
- Document differences

**Lifecycle Hooks to Log**:
- beforeCreate / created (setup for Composition API)
- beforeMount / onBeforeMount
- mounted / onMounted
- beforeUpdate / onBeforeUpdate
- updated / onUpdated
- beforeUnmount / onBeforeUnmount
- unmounted / onUnmounted

**Validation (Manual)**
- All hooks fire in correct order
- Timestamps are accurate
- Composition API hooks match Options API equivalents
- Console logs are clear and informative

**Grading Points** (15 points)
- Options API implementation (5 pts)
- Composition API implementation (5 pts)
- Comparison documentation (5 pts)

---

## General Validation Guidelines

For all exercises:

1. **TypeScript Compilation**: No TypeScript errors
2. **ESLint**: No linting warnings/errors
3. **Console**: No runtime errors or warnings
4. **Reactivity**: All reactive values update templates correctly
5. **Cleanup**: All event listeners and side effects properly cleaned up
6. **Code Style**: Consistent formatting, clear variable names
7. **Comments**: Complex logic is documented

---

## Self-Assessment Checklist

After completing exercises, verify:

- [ ] All exercises compile without TypeScript errors
- [ ] Composables follow naming convention (`use` prefix)
- [ ] Lifecycle hooks are used correctly
- [ ] Event listeners are cleaned up in `onUnmounted`
- [ ] Return values from composables use object destructuring pattern
- [ ] TypeScript types are explicit and correct
- [ ] `ref` and `reactive` are used appropriately
- [ ] `computed` is used for derived values
- [ ] `watch` is used for side effects
- [ ] Code is reusable and well-organized
