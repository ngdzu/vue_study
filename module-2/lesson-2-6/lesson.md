# Lesson 2.6 — Provide/Inject Pattern

## Learning Goals
- Understand the provide/inject pattern for dependency injection
- Avoid prop drilling in deeply nested components
- Implement type-safe provide/inject with TypeScript
- Create reusable context providers (theme, form validation, etc.)
- Know when to use provide/inject vs props/events
- Master the composition between provide/inject and composables

## Prerequisites
- Completed Lessons 2.1-2.5
- Understanding of component hierarchy and props
- Basic TypeScript knowledge (interfaces, generics)

## What You Will Build
A theme provider system with provide/inject that allows any component in the tree to access and modify the current theme without prop drilling.

---

## What is Provide/Inject?

**Provide/Inject** is Vue's built-in dependency injection system. A parent component can **provide** data, and any descendant component (at any depth) can **inject** it.

### The Problem: Prop Drilling

```ts
<!-- App.vue -->
<script setup lang="ts">
const theme = ref('light')
</script>

<template>
  <Header :theme="theme" />
</template>

<!-- Header.vue -->
<script setup lang="ts">
defineProps<{ theme: string }>()
</script>

<template>
  <Navigation :theme="theme" />
</template>

<!-- Navigation.vue -->
<script setup lang="ts">
defineProps<{ theme: string }>()
</script>

<template>
  <NavItem :theme="theme" />
</template>

<!-- NavItem.vue -->
<script setup lang="ts">
const props = defineProps<{ theme: string }>()
</script>

<template>
  <div :class="`theme-${props.theme}`">Nav Item</div>
</template>
```

> ⚠️ **CRITICAL**: Passing props through multiple levels just to reach a deep component is called **prop drilling** - it's verbose and hard to maintain!

---

## Provide/Inject Solution

```ts
<!-- App.vue -->
<script setup lang="ts">
import { ref, provide } from 'vue'

const theme = ref('light')
provide('theme', theme)
</script>

<template>
  <Header />
</template>

<!-- Header.vue -->
<template>
  <Navigation />
</template>

<!-- Navigation.vue -->
<template>
  <NavItem />
</template>

<!-- NavItem.vue -->
<script setup lang="ts">
import { inject } from 'vue'

const theme = inject('theme')
</script>

<template>
  <div :class="`theme-${theme}`">Nav Item</div>
</template>
```

✅ **Benefits**:
- No intermediate components need to know about `theme`
- Cleaner component interfaces
- Easy to add new consumers

---

## Basic Usage

### Providing Data

```ts
<script setup lang="ts">
import { ref, provide } from 'vue'

const message = ref('Hello World')
const count = ref(0)

provide('message', message)
provide('count', count)
</script>
```

### Injecting Data

```ts
<script setup lang="ts">
import { inject } from 'vue'

const message = inject('message')
const count = inject('count')
</script>

<template>
  <p>{{ message }} - Count: {{ count }}</p>
</template>
```

> 💡 **IMPORTANT**: Provided values are reactive - changes propagate to all injecting components!

---

## Type-Safe Provide/Inject

Using string keys is error-prone. Use **InjectionKey** for type safety:

### Define the Key and Type

```ts
// keys.ts
import { InjectionKey, Ref } from 'vue'

export const ThemeKey: InjectionKey<Ref<string>> = Symbol('theme')
```

### Provide with Type Safety

```ts
<script setup lang="ts">
import { ref, provide } from 'vue'
import { ThemeKey } from './keys'

const theme = ref('light')
provide(ThemeKey, theme) // ✅ Type-checked!
</script>
```

### Inject with Type Safety

```ts
<script setup lang="ts">
import { inject } from 'vue'
import { ThemeKey } from './keys'

const theme = inject(ThemeKey) // Type: Ref<string> | undefined
</script>
```

> ⚠️ **CRITICAL**: `inject()` returns `undefined` if no provider exists! Always provide a default value or check for `undefined`.

---

## Providing Default Values

```ts
import { inject } from 'vue'
import { ThemeKey } from './keys'

// Option 1: Default value
const theme = inject(ThemeKey, ref('light'))

// Option 2: Factory function
const theme = inject(ThemeKey, () => ref('light'))

// Option 3: Check for undefined
const theme = inject(ThemeKey)
if (!theme) {
  throw new Error('Theme provider not found!')
}
```

---

## Practical Example: Theme Provider

### Theme Types and Key

```ts
// types/theme.ts
export interface Theme {
  mode: 'light' | 'dark'
  colors: {
    primary: string
    background: string
    text: string
  }
}

export interface ThemeContext {
  theme: Ref<Theme>
  toggleTheme: () => void
}

// keys.ts
import { InjectionKey } from 'vue'
import { ThemeContext } from './types/theme'

export const ThemeKey: InjectionKey<ThemeContext> = Symbol('theme')
```

### Theme Provider Component

```ts
<!-- components/ThemeProvider.vue -->
<script setup lang="ts">
import { ref, provide, computed } from 'vue'
import { ThemeKey } from '../keys'
import type { Theme } from '../types/theme'

const lightTheme: Theme = {
  mode: 'light',
  colors: {
    primary: '#3490dc',
    background: '#ffffff',
    text: '#000000'
  }
}

const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    primary: '#6cb2eb',
    background: '#1a202c',
    text: '#ffffff'
  }
}

const mode = ref<'light' | 'dark'>('light')

const theme = computed(() => 
  mode.value === 'light' ? lightTheme : darkTheme
)

function toggleTheme() {
  mode.value = mode.value === 'light' ? 'dark' : 'light'
}

provide(ThemeKey, {
  theme,
  toggleTheme
})
</script>

<template>
  <div :style="{
    backgroundColor: theme.colors.background,
    color: theme.colors.text
  }">
    <slot />
  </div>
</template>
```

### Using the Theme (Composable Pattern)

```ts
// composables/useTheme.ts
import { inject } from 'vue'
import { ThemeKey } from '../keys'

export function useTheme() {
  const context = inject(ThemeKey)
  
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  
  return context
}
```

### Consumer Component

```ts
<script setup lang="ts">
import { useTheme } from '../composables/useTheme'

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <div>
    <h2 :style="{ color: theme.colors.primary }">
      Current Theme: {{ theme.mode }}
    </h2>
    <button @click="toggleTheme">Toggle Theme</button>
  </div>
</template>
```

### App Setup

```ts
<script setup lang="ts">
import ThemeProvider from './components/ThemeProvider.vue'
import MyComponent from './components/MyComponent.vue'
</script>

<template>
  <ThemeProvider>
    <MyComponent />
  </ThemeProvider>
</template>
```

---

## Provide/Inject with Readonly

Prevent child components from modifying provided data:

```ts
import { ref, provide, readonly } from 'vue'

const count = ref(0)

// Provide readonly version
provide('count', readonly(count))

// Provide methods to modify
provide('increment', () => count.value++)
```

**Consumer**:
```ts
const count = inject('count') // Readonly<Ref<number>>
const increment = inject('increment')

// count.value++ // ❌ Error: readonly!
increment() // ✅ OK
```

---

## Practical Example: Form Validation Context

```ts
// types/form.ts
export interface FormContext {
  errors: Ref<Record<string, string>>
  setError: (field: string, message: string) => void
  clearError: (field: string) => void
  isValid: ComputedRef<boolean>
}

// keys.ts
export const FormKey: InjectionKey<FormContext> = Symbol('form')

// components/FormProvider.vue
<script setup lang="ts">
import { ref, provide, computed } from 'vue'
import { FormKey } from '../keys'

const errors = ref<Record<string, string>>({})

function setError(field: string, message: string) {
  errors.value[field] = message
}

function clearError(field: string) {
  delete errors.value[field]
}

const isValid = computed(() => 
  Object.keys(errors.value).length === 0
)

provide(FormKey, {
  errors,
  setError,
  clearError,
  isValid
})
</script>

<template>
  <form @submit.prevent>
    <slot />
  </form>
</template>

// composables/useFormContext.ts
import { inject } from 'vue'
import { FormKey } from '../keys'

export function useFormContext() {
  const context = inject(FormKey)
  
  if (!context) {
    throw new Error('useFormContext must be used within FormProvider')
  }
  
  return context
}

// components/FormInput.vue
<script setup lang="ts">
import { computed } from 'vue'
import { useFormContext } from '../composables/useFormContext'

const props = defineProps<{
  name: string
  label: string
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { errors, setError, clearError } = useFormContext()

const error = computed(() => errors.value[props.name])

function validate(value: string) {
  if (!value) {
    setError(props.name, `${props.label} is required`)
  } else {
    clearError(props.name)
  }
}

function handleInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  emit('update:modelValue', value)
  validate(value)
}
</script>

<template>
  <div class="form-group">
    <label>{{ label }}</label>
    <input 
      :value="modelValue"
      @input="handleInput"
      :class="{ 'has-error': error }"
    >
    <span v-if="error" class="error">{{ error }}</span>
  </div>
</template>
```

**Usage**:
```ts
<script setup lang="ts">
import { ref } from 'vue'
import FormProvider from './components/FormProvider.vue'
import FormInput from './components/FormInput.vue'
import { useFormContext } from './composables/useFormContext'

const username = ref('')
const email = ref('')
</script>

<template>
  <FormProvider>
    <FormInput 
      v-model="username" 
      name="username" 
      label="Username" 
    />
    <FormInput 
      v-model="email" 
      name="email" 
      label="Email" 
    />
  </FormProvider>
</template>
```

---

## When to Use Provide/Inject

### ✅ Use Provide/Inject When:
- Deeply nested components need shared data
- Building reusable component libraries
- Creating app-wide contexts (theme, i18n, auth)
- Avoiding prop drilling through many levels

### ❌ Don't Use Provide/Inject When:
- Direct parent-child communication (use props/emits)
- Only 1-2 levels deep (props are fine)
- Complex state management (use Pinia instead)
- Need time-travel debugging (use Pinia)

---

## Provide/Inject vs Pinia

| Feature     | Provide/Inject     | Pinia            |
| ----------- | ------------------ | ---------------- |
| Scope       | Component tree     | Global           |
| Debugging   | Limited            | DevTools support |
| Time-travel | No                 | Yes              |
| Use case    | Component contexts | App state        |

> 💡 **IMPORTANT**: Provide/Inject is for component-level contexts, Pinia is for app-level state!

---

## Common Patterns

### Pattern 1: Provider Component + Composable

```ts
// 1. Define key
export const MyKey: InjectionKey<MyContext> = Symbol()

// 2. Provider component
<script setup>
const context = { /* ... */ }
provide(MyKey, context)
</script>

// 3. Composable
export function useMyContext() {
  const context = inject(MyKey)
  if (!context) throw new Error('...')
  return context
}

// 4. Consumer
const { ... } = useMyContext()
```

### Pattern 2: Reactive Provide

```ts
const state = reactive({
  count: 0,
  message: ''
})

provide('state', state)

// Any changes propagate to all consumers
state.count++
```

### Pattern 3: Function Provide

```ts
function updateUser(user: User) {
  // ... logic
}

provide('updateUser', updateUser)

// Consumer
const updateUser = inject('updateUser')
updateUser({ name: 'Alice' })
```

---

## Testing Provide/Inject

```ts
import { mount } from '@vue/test-utils'
import { ThemeKey } from './keys'
import MyComponent from './MyComponent.vue'

describe('MyComponent', () => {
  it('uses theme from provider', () => {
    const mockTheme = ref({ mode: 'dark', /* ... */ })
    const mockToggle = vi.fn()

    const wrapper = mount(MyComponent, {
      global: {
        provide: {
          [ThemeKey as symbol]: {
            theme: mockTheme,
            toggleTheme: mockToggle
          }
        }
      }
    })

    expect(wrapper.text()).toContain('dark')
  })
})
```

---

## Common Mistakes

### ❌ Mistake 1: Not Providing Default

```ts
// ❌ WRONG: undefined if no provider
const theme = inject('theme')
```

```ts
// ✅ CORRECT: Always have a default
const theme = inject('theme', ref('light'))
```

### ❌ Mistake 2: Mutating Readonly

```ts
const count = inject('count') // Readonly
count.value++ // ❌ Error!
```

```ts
// ✅ CORRECT: Use provided methods
const increment = inject('increment')
increment()
```

### ❌ Mistake 3: Using Strings Instead of Symbols

```ts
// ❌ WRONG: String keys can collide
provide('theme', theme)
```

```ts
// ✅ CORRECT: Use Symbol for uniqueness
const ThemeKey = Symbol('theme')
provide(ThemeKey, theme)
```

---

## Summary

✅ **Provide/Inject** avoids prop drilling  
✅ **InjectionKey** provides type safety  
✅ **Composables** wrap inject logic  
✅ **Readonly** prevents unwanted mutations  
✅ **Provider components** encapsulate context logic  
✅ Use for component contexts, not app state

---

## Next Steps
- Complete [sample-project.md](sample-project.md) to build a theme provider
- Work through [exercises.md](exercises.md) to practice provide/inject patterns
- Take the [quiz.md](quiz.md) to test your understanding
- Complete Module 2 Capstone Project
