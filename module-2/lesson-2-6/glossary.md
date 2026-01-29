# Glossary — Lesson 2.6 Terms & Definitions

Quick reference for technical terms used in this lesson.

---

## Core Concepts

### Provide/Inject
**Definition**: Vue's built-in dependency injection system that allows a parent component to provide data and any descendant to inject it, regardless of component depth.

**Example**:
```ts
// Provider (parent)
provide('theme', 'dark')

// Consumer (any descendant)
const theme = inject('theme')
```

---

### Dependency Injection
**Definition**: A design pattern where dependencies are "injected" into a component rather than created inside it.

**Benefits**:
- Loose coupling
- Easier testing
- Better code reuse

---

### Prop Drilling
**Definition**: Passing props through multiple intermediate components just to reach a deeply nested component that needs the data.

**Problem**:
```ts
<App :theme /> → <Header :theme /> → <Nav :theme /> → <Item :theme />
```

**Solution with Provide/Inject**:
```ts
<App provide(theme)> → <Header /> → <Nav /> → <Item inject(theme) />
```

---

### InjectionKey
**Definition**: A TypeScript type that provides type safety for provide/inject by using Symbols as keys.

**Example**:
```ts
import { InjectionKey, Ref } from 'vue'

export const ThemeKey: InjectionKey<Ref<string>> = Symbol('theme')

// Provide
provide(ThemeKey, ref('dark'))

// Inject (type-safe!)
const theme = inject(ThemeKey) // Ref<string> | undefined
```

---

### Context Provider Pattern
**Definition**: A component that provides shared state/functions to its descendants via provide/inject.

**Example**:
```ts
<script setup lang="ts">
import { ref, provide } from 'vue'

const user = ref(null)
const login = () => { /* ... */ }

provide('auth', { user, login })
</script>

<template>
  <slot /> <!-- Child components can inject 'auth' -->
</template>
```

---

### Symbol
**Definition**: A JavaScript primitive type that creates unique identifiers, perfect for injection keys to avoid naming collisions.

**Example**:
```ts
const key1 = Symbol('theme')
const key2 = Symbol('theme')

console.log(key1 === key2) // false (unique!)
```

---

### Readonly
**Definition**: Vue utility that makes a reactive object read-only, preventing mutations.

**Example**:
```ts
import { ref, readonly, provide } from 'vue'

const count = ref(0)
provide('count', readonly(count)) // Consumers can't modify!
```

---

### Reactive Propagation
**Definition**: When provided reactive data changes, all injecting components automatically update.

**Example**:
```ts
// Provider
const theme = ref('light')
provide('theme', theme)

// Later...
theme.value = 'dark' // All consumers update automatically!
```

---

## Quick Reference Table

| Term              | Definition                          | Use Case               |
| ----------------- | ----------------------------------- | ---------------------- |
| **provide()**     | Makes data available to descendants | Share context          |
| **inject()**      | Retrieves provided data             | Access context         |
| **InjectionKey**  | Type-safe Symbol for inject         | TypeScript projects    |
| **readonly()**    | Prevents mutations                  | Protect shared state   |
| **Symbol()**      | Unique identifier                   | Prevent key collisions |
| **Prop Drilling** | Passing props through many levels   | Anti-pattern to avoid  |

---

## Common Patterns

### Pattern 1: Provider Component
```ts
<ThemeProvider>
  <App />
</ThemeProvider>
```

### Pattern 2: Composable Wrapper
```ts
export function useTheme() {
  return inject(ThemeKey) ?? defaultTheme
}
```

### Pattern 3: Readonly + Methods
```ts
provide('state', readonly(state))
provide('update', updateFn)
```
