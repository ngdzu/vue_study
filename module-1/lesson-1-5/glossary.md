# Glossary - Lesson 1.5: Component Basics & Props

## Core Concepts

### Component
A reusable Vue instance with its own template, logic, and styles. Components are the building blocks of Vue applications.

**Example:**
```ts
<!-- UserCard.vue is a component -->
<script setup lang="ts">
const props = defineProps<{ userName: string }>()
</script>
<template>
  <div class="user-card">{{ userName }}</div>
</template>
```

### Props
Properties passed from a parent component to a child component. Props enable data flow down the component tree.

**Example:**
```ts
<!-- Parent passes 'title' prop -->
<ChildComponent title="Hello" />
```

### defineProps
Composition API function to declare component props with type information and validation.

**Example:**
```ts
const props = defineProps<{
  title: string
  count: number
}>()
```

### withDefaults
Helper function to provide default values for props when using TypeScript.

**Example:**
```ts
const props = withDefaults(defineProps<{
  title?: string
  count?: number
}>(), {
  title: 'Default Title',
  count: 0
})
```

---

## Prop Declaration

### Type-Based Declaration
TypeScript-first approach using interfaces for prop typing.

**Example:**
```ts
interface Props {
  userName: string
  age: number
}
const props = defineProps<Props>()
```

### Runtime Declaration
JavaScript-style object syntax with runtime validation.

**Example:**
```ts
const props = defineProps({
  userName: {
    type: String,
    required: true
  },
  age: Number
})
```

### Required Prop
A prop that must be provided by the parent component, otherwise Vue will warn.

**Example:**
```ts
const props = defineProps({
  userId: {
    type: String,
    required: true
  }
})
```

### Optional Prop
A prop that can be omitted; typically has a default value.

**Example:**
```ts
interface Props {
  title?: string  // Optional (note the ?)
}
const props = withDefaults(defineProps<Props>(), {
  title: 'Default'
})
```

### Default Value
Fallback value used when a prop is not provided by the parent.

**Example:**
```ts
const props = defineProps({
  variant: {
    type: String,
    default: 'primary'
  }
})
```

### Factory Function
A function that returns a default value for object/array props to avoid shared references.

**Example:**
```ts
const props = defineProps({
  tags: {
    type: Array,
    default: () => []  // Factory function
  }
})
```

---

## Prop Types

### String Prop
Prop that expects a string value.

**Example:**
```ts
const props = defineProps<{ title: string }>()
```

### Number Prop
Prop that expects a numeric value.

**Example:**
```ts
const props = defineProps<{ count: number }>()
```

### Boolean Prop
Prop that expects true/false value. Can be used as shorthand in templates.

**Example:**
```ts
const props = defineProps<{ isDisabled: boolean }>()

// Usage: <Component is-disabled /> is same as :is-disabled="true"
```

### Array Prop
Prop that expects an array value.

**Example:**
```ts
const props = defineProps<{ tags: string[] }>()
```

### Object Prop
Prop that expects an object value.

**Example:**
```ts
interface User {
  id: string
  name: string
}
const props = defineProps<{ user: User }>()
```

### Function Prop
Prop that expects a function (often a callback).

**Example:**
```ts
const props = defineProps<{
  onClick: (event: MouseEvent) => void
}>()
```

### Union Type
Prop that can accept multiple types.

**Example:**
```ts
const props = defineProps<{
  id: string | number  // Can be string OR number
  size: 'small' | 'medium' | 'large'  // One of three strings
}>()
```

---

## Validation

### Prop Validator
Custom function to validate prop values at runtime.

**Example:**
```ts
const props = defineProps({
  age: {
    type: Number,
    validator: (value: number) => value >= 0 && value <= 150
  }
})
```

### Type Validation
Vue's built-in runtime type checking for props.

**Example:**
```ts
const props = defineProps({
  count: Number,  // Vue checks it's a number at runtime
  title: String
})
```

---

## Data Flow

### One-Way Data Flow
Vue's principle that data flows from parent to child via props, and children cannot mutate props.

**Example:**
```ts
// ❌ BAD: Child mutating prop
const props = defineProps<{ count: number }>()
props.count++  // ERROR

// ✅ GOOD: Emit event to parent
const emit = defineEmits<{ (e: 'increment'): void }>()
emit('increment')
```

### Reactive Prop
Props are reactive - when parent changes prop value, child automatically receives update.

**Example:**
```ts
// Parent
const count = ref(0)
setInterval(() => count.value++, 1000)

// Child receives updated count every second
<ChildComponent :count="count" />
```

### Prop Mutation
Anti-pattern of directly modifying prop values in child component.

**Example:**
```ts
// ❌ WRONG - Never do this
const props = defineProps<{ items: string[] }>()
props.items.push('new item')  // Mutates parent's array!
```

---

## Component Structure

### Single File Component (SFC)
Vue component defined in a `.vue` file with `<script>`, `<template>`, and `<style>` sections.

**Example:**
```ts
<script setup lang="ts">
// Logic
</script>

<template>
  <!-- Template -->
</template>

<style scoped>
/* Styles */
</style>
```

### Script Setup
Composition API syntax that reduces boilerplate and improves TypeScript support.

**Example:**
```ts
<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
// Everything is automatically exposed to template
</script>
```

### Scoped Styles
CSS that only applies to the current component, preventing style leakage.

**Example:**
```ts
<style scoped>
.button {
  color: blue;  /* Only affects buttons in this component */
}
</style>
```

---

## Component Composition

### Component Hierarchy
Tree structure of parent and child components.

**Example:**
```
App
├── Header
│   └── Navigation
│       ├── NavItem
│       └── NavItem
└── MainContent
    └── ProductCard
```

### Component Reusability
Ability to use the same component multiple times with different props.

**Example:**
```ts
<AppButton variant="primary">Save</AppButton>
<AppButton variant="danger">Delete</AppButton>
<AppButton variant="secondary">Cancel</AppButton>
```

### Component Registration
Making a component available for use in templates. With `<script setup>`, imports are auto-registered.

**Example:**
```ts
<script setup lang="ts">
import AppButton from './AppButton.vue'  // Auto-registered
</script>

<template>
  <AppButton />  <!-- Can use immediately -->
</template>
```

---

## Advanced Patterns

### Prop Spreading
Using `v-bind` to pass all properties of an object as individual props.

**Example:**
```ts
const user = { name: 'Alice', email: 'alice@example.com' }

<UserCard v-bind="user" />
<!-- Same as: <UserCard :name="user.name" :email="user.email" /> -->
```

### Prop Destructuring
Extracting prop values while maintaining reactivity using `toRefs`.

**Example:**
```ts
import { toRefs } from 'vue'

const props = defineProps<{ title: string; count: number }>()
const { title, count } = toRefs(props)  // Maintains reactivity
```

### Prop Fallback
Default value used when prop is not provided.

**Example:**
```ts
const props = withDefaults(defineProps<{
  theme?: 'light' | 'dark'
}>(), {
  theme: 'light'  // Fallback
})
```

### Prop Watcher
Watching prop changes to trigger side effects.

**Example:**
```ts
import { watch } from 'vue'

const props = defineProps<{ userId: string }>()

watch(() => props.userId, (newId) => {
  fetchUser(newId)
})
```

---

## Naming Conventions

### PascalCase
Component names use PascalCase (UpperCamelCase).

**Example:**
```ts
AppButton.vue
UserCard.vue
ProductList.vue
```

### camelCase (script)
Prop names use camelCase in JavaScript/TypeScript.

**Example:**
```ts
const props = defineProps<{
  userName: string
  isActive: boolean
}>()
```

### kebab-case (template)
Prop names use kebab-case in HTML templates.

**Example:**
```ts
<UserCard user-name="Alice" :is-active="true" />
```

---

## Performance

### Shallow Prop Watching
Vue watches prop references, not deep object properties by default.

**Example:**
```ts
const props = defineProps<{ user: User }>()

// Triggers when user object changes
watch(() => props.user, () => {})

// Triggers when user.name changes
watch(() => props.user.name, () => {})
```

### Prop Memoization
Avoiding unnecessary recalculations using computed properties.

**Example:**
```ts
const props = defineProps<{ items: Item[] }>()

const sortedItems = computed(() => {
  return [...props.items].sort()  // Only recalculates when items change
})
```

---

## Anti-Patterns

### Prop Drilling
Passing props through multiple levels of components that don't use them.

**Example:**
```ts
<!-- ❌ BAD: Prop drilling -->
App → Header → Nav → NavItem → UserBadge (finally uses userId)

<!-- ✅ GOOD: Use provide/inject -->
App (provides userId) → ... → UserBadge (injects userId)
```

### Shared Reference
Using the same object/array as default for multiple component instances.

**Example:**
```ts
// ❌ BAD
default: []  // All instances share same array!

// ✅ GOOD
default: () => []  // Each instance gets its own array
```

### Over-Validation
Excessive prop validation that slows down runtime without adding value.

**Example:**
```ts
// ❌ Overkill for simple props
validator: (value: string) => {
  return value.length > 0 && value.length < 100 && /^[a-z]+$/.test(value)
}

// ✅ Use TypeScript types instead
title: string  // Type checking at compile time
```

---

## TypeScript Integration

### Type Inference
Vue automatically infers prop types from TypeScript interfaces.

**Example:**
```ts
interface Props {
  count: number
}
const props = defineProps<Props>()
// props.count is typed as number
```

### Generic Props
Using TypeScript generics for flexible prop types.

**Example:**
```ts
interface Props<T> {
  items: T[]
  selectedItem: T | null
}
```

### Utility Types
TypeScript helpers like `Partial`, `Required`, `Readonly` for prop types.

**Example:**
```ts
interface User {
  id: string
  name: string
  email: string
}

interface Props {
  user: Partial<User>  // All properties optional
}
```

---

## Best Practices

### Prop Prefix Convention
Using prefixes like `is`, `has`, `should` for boolean props.

**Example:**
```ts
const props = defineProps<{
  isDisabled: boolean
  hasError: boolean
  shouldAutoFocus: boolean
}>()
```

### Prop Documentation
Using JSDoc comments to document prop purposes.

**Example:**
```ts
/**
 * @prop {string} userName - Display name of the user
 * @prop {boolean} isOnline - Whether user is currently online
 */
interface Props {
  userName: string
  isOnline: boolean
}
```

### Minimal Props
Keeping component APIs simple with minimal number of props.

**Example:**
```ts
// ✅ GOOD: Group related data
interface Props {
  user: User  // Single object with all user data
}

// ❌ BAD: Too many individual props
interface Props {
  userName: string
  userEmail: string
  userAvatar: string
  userBio: string
  // ... 10 more props
}
```
