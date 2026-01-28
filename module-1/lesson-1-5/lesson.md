# Lesson 1.5: Component Basics & Props

## Introduction

Components are the building blocks of Vue applications. They allow you to split your UI into independent, reusable pieces that can be composed together. Props are the mechanism for passing data from parent components to child components, enabling flexible and reusable component architectures.

This lesson covers component creation, prop declaration with TypeScript, validation patterns, and best practices for component composition.

---

## Table of Contents

1. [Component Fundamentals](#component-fundamentals)
2. [Creating Your First Component](#creating-your-first-component)
3. [Props Basics](#props-basics)
4. [Prop Types & Validation](#prop-types--validation)
5. [Default Values & Required Props](#default-values--required-props)
6. [TypeScript Props](#typescript-props)
7. [One-Way Data Flow](#one-way-data-flow)
8. [Component Composition](#component-composition)
9. [Props Best Practices](#props-best-practices)
10. [Common Patterns](#common-patterns)
11. [Anti-Patterns to Avoid](#anti-patterns-to-avoid)

---

## Component Fundamentals

### What Are Components?

Components are Vue instances with reusable templates, logic, and styles. They encapsulate UI elements and behaviors into self-contained units.

**Benefits of Components:**
- **Reusability**: Write once, use everywhere
- **Maintainability**: Isolated logic is easier to debug
- **Testability**: Test components independently
- **Composition**: Build complex UIs from simple pieces
- **Code Organization**: Clear separation of concerns

### Component Structure

A typical Vue component has three sections:

```ts
<script setup lang="ts">
// Logic: reactive state, computed, methods, lifecycle hooks
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <!-- Template: HTML structure with Vue directives -->
  <div class="counter">
    <p>Count: {{ count }}</p>
  </div>
</template>

<style scoped>
/* Styles: CSS scoped to this component */
.counter {
  padding: 20px;
  border: 1px solid #ccc;
}
</style>
```

> ⚠️ **CRITICAL**: Use `<script setup>` for Composition API components. It provides better TypeScript inference and less boilerplate.

---

## Creating Your First Component

### Simple Button Component

Let's create a reusable button component:

```ts
<!-- components/AppButton.vue -->
<script setup lang="ts">
// No props yet - just a basic button
</script>

<template>
  <button class="app-button">
    Click Me
  </button>
</template>

<style scoped>
.app-button {
  padding: 10px 20px;
  background-color: #3490dc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.app-button:hover {
  background-color: #2779bd;
}
</style>
```

### Using the Component

```ts
<!-- App.vue -->
<script setup lang="ts">
import AppButton from './components/AppButton.vue'
</script>

<template>
  <div>
    <h1>My App</h1>
    <AppButton />
    <AppButton />
    <AppButton />
  </div>
</template>
```

> 💡 **IMPORTANT**: Component names should be multi-word (PascalCase) to avoid conflicts with HTML elements.

---

## Props Basics

Props allow parent components to pass data to child components. They create a **one-way data flow** from parent to child.

### Declaring Props

```ts
<!-- components/AppButton.vue -->
<script setup lang="ts">
const props = defineProps({
  label: String
})
</script>

<template>
  <button class="app-button">
    {{ label }}
  </button>
</template>
```

### Using Props

```ts
<!-- App.vue -->
<script setup lang="ts">
import AppButton from './components/AppButton.vue'
</script>

<template>
  <div>
    <AppButton label="Save" />
    <AppButton label="Cancel" />
    <AppButton label="Delete" />
  </div>
</template>
```

### Dynamic Props

Use `v-bind` (or `:`) to pass dynamic values:

```ts
<script setup lang="ts">
import { ref } from 'vue'
import AppButton from './components/AppButton.vue'

const buttonText = ref('Click Me')
const isDisabled = ref(false)
</script>

<template>
  <div>
    <AppButton :label="buttonText" />
    <AppButton :label="`Count: ${count}`" />
  </div>
</template>
```

> ⚠️ **CRITICAL**: Without `v-bind` (`:)`), the value is treated as a string literal, not a JavaScript expression.

**Examples:**

```ts
<!-- Static string -->
<AppButton label="Save" />

<!-- Dynamic value (reactive variable) -->
<AppButton :label="buttonText" />

<!-- Expression -->
<AppButton :label="`Total: ${total}`" />

<!-- Boolean shorthand -->
<AppButton disabled />  <!-- Same as :disabled="true" -->
```

---

## Prop Types & Validation

Vue allows you to specify prop types for runtime validation and better developer experience.

### Basic Type Validation

```ts
<script setup lang="ts">
const props = defineProps({
  title: String,
  count: Number,
  isActive: Boolean,
  tags: Array,
  user: Object,
  callback: Function
})
</script>
```

### Multiple Types

```ts
const props = defineProps({
  id: [String, Number],  // Can be string OR number
  status: String
})
```

### Object Syntax with Validation

```ts
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    validator: (value: string) => {
      return ['pending', 'active', 'completed'].includes(value)
    }
  }
})
```

### Validation Options

| Option      | Purpose           | Example                                                      |
| ----------- | ----------------- | ------------------------------------------------------------ |
| `type`      | Expected type     | `String`, `Number`, `Boolean`, `Array`, `Object`, `Function` |
| `required`  | Must be provided  | `required: true`                                             |
| `default`   | Fallback value    | `default: 0` or `default: () => []`                          |
| `validator` | Custom validation | `validator: (val) => val > 0`                                |

> ⚠️ **CRITICAL**: Use a factory function for object/array defaults to avoid shared references.

**Wrong:**
```ts
const props = defineProps({
  tags: {
    type: Array,
    default: []  // ❌ Shared across all instances!
  }
})
```

**Correct:**
```ts
const props = defineProps({
  tags: {
    type: Array,
    default: () => []  // ✅ New array for each instance
  }
})
```

---

## Default Values & Required Props

### Required Props

Mark props that must be provided:

```ts
const props = defineProps({
  userId: {
    type: String,
    required: true  // Parent MUST provide this
  },
  userName: {
    type: String,
    required: true
  }
})
```

### Default Values

Provide fallback values for optional props:

```ts
const props = defineProps({
  variant: {
    type: String,
    default: 'primary'  // Used if parent doesn't provide
  },
  size: {
    type: String,
    default: 'medium'
  },
  isDisabled: {
    type: Boolean,
    default: false
  }
})
```

### Complex Default Values

Use factory functions for objects/arrays:

```ts
const props = defineProps({
  user: {
    type: Object,
    default: () => ({
      name: 'Guest',
      role: 'viewer'
    })
  },
  options: {
    type: Array,
    default: () => ['option1', 'option2']
  },
  config: {
    type: Object,
    default: () => ({
      theme: 'light',
      locale: 'en'
    })
  }
})
```

> 💡 **IMPORTANT**: Factory functions ensure each component instance gets its own object/array, preventing unintended sharing.

---

## TypeScript Props

With TypeScript, you get compile-time type checking and better IDE support.

### Type-Based Props Declaration

```ts
<script setup lang="ts">
interface Props {
  title: string
  count?: number  // Optional
  isActive?: boolean
}

const props = defineProps<Props>()
</script>
```

### With Default Values

Use `withDefaults` for type-safe defaults:

```ts
<script setup lang="ts">
interface Props {
  title: string
  count?: number
  variant?: 'primary' | 'secondary' | 'danger'
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  variant: 'primary'
})
</script>
```

### Complex Types

```ts
<script setup lang="ts">
interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
}

interface Props {
  user: User
  tags: string[]
  metadata?: Record<string, unknown>
}

const props = withDefaults(defineProps<Props>(), {
  tags: () => [],
  metadata: () => ({})
})
</script>
```

### Union Types

```ts
interface Props {
  size: 'small' | 'medium' | 'large'
  status: 'pending' | 'active' | 'completed' | 'failed'
  id: string | number
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  status: 'pending'
})
```

> ⚠️ **CRITICAL**: TypeScript prop types are checked at compile time. Runtime validators provide additional safety.

### Combining TypeScript and Runtime Validation

```ts
<script setup lang="ts">
interface Props {
  count: number
}

const props = defineProps<Props>()

// Additional runtime validation
if (props.count < 0) {
  console.warn('Count should not be negative')
}
</script>
```

---

## One-Way Data Flow

Props follow a **one-way data flow**: parent to child. This prevents child components from mutating parent state, which makes data flow easier to understand.

### The Rule

> ⚠️ **CRITICAL**: Never mutate props directly. Props are read-only.

**Wrong:**
```ts
<script setup lang="ts">
const props = defineProps<{ count: number }>()

const increment = () => {
  props.count++  // ❌ ERROR: Cannot mutate prop!
}
</script>
```

### Solutions

#### 1. Use a Local Copy (for initial value)

```ts
<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ initialCount: number }>()

// Create local state initialized from prop
const count = ref(props.initialCount)

const increment = () => {
  count.value++  // ✅ Mutate local state, not prop
}
</script>
```

#### 2. Emit Event to Parent (for two-way communication)

```ts
<script setup lang="ts">
const props = defineProps<{ count: number }>()
const emit = defineEmits<{
  (e: 'update:count', value: number): void
}>()

const increment = () => {
  emit('update:count', props.count + 1)  // ✅ Ask parent to update
}
</script>
```

Parent:
```ts
<script setup lang="ts">
import { ref } from 'vue'
import Counter from './Counter.vue'

const count = ref(0)
</script>

<template>
  <Counter :count="count" @update:count="count = $event" />
</template>
```

#### 3. Computed Property (for transformation)

```ts
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ firstName: string; lastName: string }>()

const fullName = computed(() => {
  return `${props.firstName} ${props.lastName}`
})
</script>

<template>
  <p>{{ fullName }}</p>
</template>
```

### Why One-Way Flow Matters

```ts
// Parent.vue
<script setup lang="ts">
import { ref } from 'vue'
import ChildA from './ChildA.vue'
import ChildB from './ChildB.vue'

const sharedCount = ref(10)
</script>

<template>
  <div>
    <ChildA :count="sharedCount" />
    <ChildB :count="sharedCount" />
  </div>
</template>
```

If children could mutate props directly:
- Changes from `ChildA` would affect `ChildB`
- Hard to track where changes originate
- Debugging becomes nightmare
- Breaks component encapsulation

> 💡 **IMPORTANT**: One-way data flow ensures predictable state management and easier debugging.

---

## Component Composition

### Basic Composition

Build complex UIs by composing simple components:

```ts
<!-- components/UserCard.vue -->
<script setup lang="ts">
import AppButton from './AppButton.vue'

interface Props {
  userName: string
  userEmail: string
  userAvatar: string
}

const props = defineProps<Props>()
</script>

<template>
  <div class="user-card">
    <img :src="userAvatar" :alt="userName" />
    <h3>{{ userName }}</h3>
    <p>{{ userEmail }}</p>
    <AppButton label="Follow" />
    <AppButton label="Message" />
  </div>
</template>
```

### Nested Components

```ts
<!-- App.vue -->
<script setup lang="ts">
import UserCard from './components/UserCard.vue'
import { ref } from 'vue'

const users = ref([
  { id: 1, name: 'Alice', email: 'alice@example.com', avatar: '/alice.jpg' },
  { id: 2, name: 'Bob', email: 'bob@example.com', avatar: '/bob.jpg' }
])
</script>

<template>
  <div class="user-list">
    <UserCard
      v-for="user in users"
      :key="user.id"
      :user-name="user.name"
      :user-email="user.email"
      :user-avatar="user.avatar"
    />
  </div>
</template>
```

### Component Hierarchies

```
App
├── Header
│   ├── Logo
│   └── Navigation
│       ├── NavItem
│       └── NavItem
├── MainContent
│   ├── Sidebar
│   │   └── FilterPanel
│   └── ContentArea
│       ├── ProductCard
│       ├── ProductCard
│       └── ProductCard
└── Footer
```

Each component receives props from its parent and passes props to its children.

---

## Props Best Practices

### 1. Naming Conventions

**Component Names:**
```ts
// ✅ Good: PascalCase, multi-word
AppButton.vue
UserCard.vue
ProductList.vue

// ❌ Bad: single word, lowercase
button.vue
card.vue
list.vue
```

**Prop Names:**
```ts
// ✅ Good: camelCase in JavaScript
const props = defineProps<{
  userName: string
  isActive: boolean
  maxCount: number
}>()

// ✅ Good: kebab-case in templates
<UserCard user-name="Alice" :is-active="true" :max-count="10" />
```

### 2. Prop Type Specificity

```ts
// ❌ Bad: Too vague
const props = defineProps<{
  data: any
  config: object
}>()

// ✅ Good: Specific types
interface User {
  id: string
  name: string
}

interface Config {
  theme: 'light' | 'dark'
  locale: string
}

const props = defineProps<{
  user: User
  config: Config
}>()
```

### 3. Boolean Props

```ts
// ✅ Good: Prefix with is/has/should
const props = defineProps<{
  isDisabled: boolean
  hasError: boolean
  shouldAutoSave: boolean
}>()

// Template usage
<AppButton is-disabled />  <!-- Same as :is-disabled="true" -->
<AppButton :is-disabled="false" />
```

### 4. Avoid Prop Mutation

```ts
// ❌ Bad: Mutating prop
const props = defineProps<{ items: string[] }>()

const addItem = (item: string) => {
  props.items.push(item)  // ❌ Mutates prop!
}

// ✅ Good: Emit event or use local state
import { ref, watch } from 'vue'

const props = defineProps<{ items: string[] }>()
const emit = defineEmits<{
  (e: 'update:items', items: string[]): void
}>()

const localItems = ref([...props.items])

const addItem = (item: string) => {
  localItems.value.push(item)
  emit('update:items', localItems.value)
}
```

### 5. Validate Complex Props

```ts
const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value: string) => {
      return ['draft', 'published', 'archived'].includes(value)
    }
  },
  priority: {
    type: Number,
    validator: (value: number) => {
      return value >= 1 && value <= 5
    }
  }
})
```

### 6. Document Your Props

```ts
<script setup lang="ts">
/**
 * AppButton - Reusable button component
 * 
 * @prop {string} label - Button text content
 * @prop {'primary' | 'secondary' | 'danger'} variant - Visual style variant
 * @prop {'small' | 'medium' | 'large'} size - Button size
 * @prop {boolean} isDisabled - Whether button is disabled
 * @prop {boolean} isLoading - Show loading spinner
 */
interface Props {
  label: string
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
  isDisabled?: boolean
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium',
  isDisabled: false,
  isLoading: false
})
</script>
```

---

## Common Patterns

### 1. Multi-Variant Components

```ts
<!-- components/AppButton.vue -->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium'
})

const buttonClasses = computed(() => {
  return [
    'app-button',
    `app-button--${props.variant}`,
    `app-button--${props.size}`
  ]
})
</script>

<template>
  <button :class="buttonClasses">
    <slot />
  </button>
</template>

<style scoped>
.app-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.app-button--primary {
  background-color: #3490dc;
  color: white;
}

.app-button--secondary {
  background-color: #6c757d;
  color: white;
}

.app-button--danger {
  background-color: #e3342f;
  color: white;
}

.app-button--small {
  padding: 5px 10px;
  font-size: 12px;
}

.app-button--medium {
  padding: 10px 20px;
  font-size: 14px;
}

.app-button--large {
  padding: 15px 30px;
  font-size: 16px;
}
</style>
```

Usage:
```ts
<AppButton variant="primary" size="large">Save</AppButton>
<AppButton variant="danger" size="small">Delete</AppButton>
<AppButton variant="secondary">Cancel</AppButton>
```

### 2. Data Objects as Props

```ts
<script setup lang="ts">
interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
}

interface Props {
  user: User
}

const props = defineProps<Props>()
</script>

<template>
  <div class="user-profile">
    <h3>{{ user.name }}</h3>
    <p>{{ user.email }}</p>
    <span class="badge">{{ user.role }}</span>
  </div>
</template>
```

### 3. Prop Spreading

```ts
<script setup lang="ts">
import { ref } from 'vue'
import UserCard from './UserCard.vue'

const user = ref({
  id: '1',
  name: 'Alice',
  email: 'alice@example.com',
  role: 'admin' as const
})
</script>

<template>
  <!-- Pass all properties as individual props -->
  <UserCard v-bind="user" />
  
  <!-- Equivalent to: -->
  <!-- <UserCard :id="user.id" :name="user.name" :email="user.email" :role="user.role" /> -->
</template>
```

### 4. Conditional Props

```ts
<script setup lang="ts">
import { ref } from 'vue'
import AppButton from './AppButton.vue'

const isAdmin = ref(true)
const userRole = ref('admin')
</script>

<template>
  <!-- Conditional prop binding -->
  <AppButton :variant="isAdmin ? 'primary' : 'secondary'" />
  
  <!-- Conditional prop presence -->
  <AppButton
    label="Delete"
    :is-disabled="userRole !== 'admin'"
  />
</template>
```

### 5. Fallback Props

```ts
<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Default Title',
  subtitle: 'Default Subtitle'
})
</script>

<template>
  <div>
    <h1>{{ title }}</h1>
    <h2>{{ subtitle }}</h2>
  </div>
</template>
```

---

## Anti-Patterns to Avoid

### ❌ 1. Mutating Props

```ts
// ❌ BAD
<script setup lang="ts">
const props = defineProps<{ count: number }>()

const increment = () => {
  props.count++  // ERROR: Mutating prop
}
</script>

// ✅ GOOD
<script setup lang="ts">
const props = defineProps<{ count: number }>()
const emit = defineEmits<{
  (e: 'increment'): void
}>()

const increment = () => {
  emit('increment')  // Ask parent to handle
}
</script>
```

### ❌ 2. Using Props as Local State (without copying)

```ts
// ❌ BAD: Props can change, loses sync
<script setup lang="ts">
const props = defineProps<{ userId: string }>()

const loadUser = () => {
  fetch(`/api/users/${props.userId}`)  // What if userId changes?
}
</script>

// ✅ GOOD: Watch for changes
<script setup lang="ts">
import { watch } from 'vue'

const props = defineProps<{ userId: string }>()

watch(() => props.userId, (newId) => {
  fetch(`/api/users/${newId}`)
}, { immediate: true })
</script>
```

### ❌ 3. Overly Generic Props

```ts
// ❌ BAD: No type safety
const props = defineProps<{
  data: any
  options: object
}>()

// ✅ GOOD: Specific types
interface Product {
  id: string
  name: string
  price: number
}

interface DisplayOptions {
  showPrice: boolean
  currency: string
}

const props = defineProps<{
  product: Product
  options: DisplayOptions
}>()
```

### ❌ 4. Too Many Props

```ts
// ❌ BAD: Component has too many responsibilities
<script setup lang="ts">
const props = defineProps<{
  userName: string
  userEmail: string
  userAvatar: string
  userBio: string
  userRole: string
  isOnline: boolean
  lastSeen: Date
  postsCount: number
  followersCount: number
  followingCount: number
}>()
</script>

// ✅ GOOD: Group related data
interface User {
  name: string
  email: string
  avatar: string
  bio: string
  role: string
}

interface UserStats {
  isOnline: boolean
  lastSeen: Date
  postsCount: number
  followersCount: number
  followingCount: number
}

const props = defineProps<{
  user: User
  stats: UserStats
}>()
```

### ❌ 5. Prop Names Matching HTML Attributes

```ts
// ❌ BAD: Conflicts with native attributes
const props = defineProps<{
  class: string  // Reserved
  style: string  // Reserved
  id: string     // Can conflict
}>()

// ✅ GOOD: Use descriptive names
const props = defineProps<{
  customClass: string
  customStyle: string
  elementId: string
}>()
```

### ❌ 6. Non-Reactive Prop Destructuring

```ts
// ❌ BAD: Loses reactivity
<script setup lang="ts">
const { count, title } = defineProps<{
  count: number
  title: string
}>()

// count and title are no longer reactive!
</script>

// ✅ GOOD: Access via props object
<script setup lang="ts">
const props = defineProps<{
  count: number
  title: string
}>()

// Use props.count, props.title
</script>

// ✅ ALSO GOOD: Use toRefs for destructuring
<script setup lang="ts">
import { toRefs } from 'vue'

const props = defineProps<{
  count: number
  title: string
}>()

const { count, title } = toRefs(props)  // Maintains reactivity
</script>
```

---

## Decision Matrix

### When to Use Props

| Scenario                       | Use Props? | Why                         |
| ------------------------------ | ---------- | --------------------------- |
| Pass data from parent to child | ✅ Yes      | Primary use case            |
| Child needs to modify data     | ❌ No       | Use emit events instead     |
| Data shared across siblings    | ❌ No       | Lift state to common parent |
| Deep nesting (3+ levels)       | ⚠️ Maybe    | Consider provide/inject     |
| Global configuration           | ❌ No       | Use provide/inject or Pinia |

### Prop vs. State

| Data Characteristic          | Solution                     |
| ---------------------------- | ---------------------------- |
| Comes from parent            | **Prop**                     |
| Managed by component         | **State** (`ref`/`reactive`) |
| Derived from other data      | **Computed**                 |
| Changes trigger side effects | **Watcher**                  |

---

## Performance Considerations

### 1. Prop Change Detection

Vue tracks prop changes shallowly:

```ts
<script setup lang="ts">
import { watch } from 'vue'

interface User {
  id: string
  name: string
}

const props = defineProps<{ user: User }>()

// Triggers when user object reference changes
watch(() => props.user, (newUser) => {
  console.log('User changed:', newUser)
})

// Triggers when user.name changes
watch(() => props.user.name, (newName) => {
  console.log('Name changed:', newName)
})
</script>
```

### 2. Large Object Props

```ts
// ❌ BAD: Re-renders on any property change
const props = defineProps<{
  largeConfig: Record<string, unknown>
}>()

// ✅ GOOD: Only watch what you need
import { computed } from 'vue'

const props = defineProps<{
  largeConfig: Record<string, unknown>
}>()

const relevantSetting = computed(() => props.largeConfig.mySetting)
```

### 3. Avoid Prop-Based Computed in Loops

```ts
<!-- ❌ BAD: Computed recalculates for every item -->
<template>
  <div v-for="item in items" :key="item.id">
    <ChildComponent :computed-value="expensiveComputation(item)" />
  </div>
</template>

<!-- ✅ GOOD: Pass raw data, let child compute -->
<template>
  <div v-for="item in items" :key="item.id">
    <ChildComponent :item="item" />
  </div>
</template>
```

---

## Summary

### Key Takeaways

1. **Components** encapsulate UI, logic, and styles into reusable units
2. **Props** enable parent-to-child data flow
3. **TypeScript** provides compile-time type safety for props
4. **One-way data flow** keeps state changes predictable
5. **Never mutate props** - use local state or emit events
6. **Validate props** for runtime safety
7. **Compose components** to build complex UIs from simple pieces

### Props Checklist

✅ Define prop types with TypeScript  
✅ Use `withDefaults` for default values  
✅ Mark required props explicitly  
✅ Use factory functions for object/array defaults  
✅ Never mutate props directly  
✅ Validate props with custom validators when needed  
✅ Use camelCase in script, kebab-case in templates  
✅ Document complex props with JSDoc  
✅ Keep components focused (avoid too many props)  
✅ Use computed for prop transformations  

---

## Next Steps

Now that you understand props, you're ready to learn about **events and emits** - how child components communicate back to parents.

Continue to [Lesson 1.6: Events & Emits](../lesson-1-6/README.md) to complete the component communication picture.

---

## Additional Resources

- [Vue 3 Props Documentation](https://vuejs.org/guide/components/props.html)
- [TypeScript with Vue](https://vuejs.org/guide/typescript/composition-api.html)
- [Component Basics](https://vuejs.org/guide/essentials/component-basics.html)
- [Component Registration](https://vuejs.org/guide/components/registration.html)
