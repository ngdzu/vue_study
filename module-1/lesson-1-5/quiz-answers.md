# Quiz Answers - Lesson 1.5: Component Basics & Props

Detailed explanations for all quiz questions.

---

## 1. What is a Vue component?
**Answer: b) A reusable Vue instance with template, logic, and styles**

Components are self-contained units that encapsulate HTML structure, JavaScript logic, and CSS styles. They can be reused throughout your application.

```ts
<script setup lang="ts">
// Logic
</script>
<template>
  <!-- HTML -->
</template>
<style scoped>
/* CSS */
</style>
```

---

## 2. Which syntax is recommended for Composition API components?
**Answer: d) `<script setup lang="ts">`**

This provides the best TypeScript support, less boilerplate, and better IDE integration.

```ts
<!-- ✅ Recommended -->
<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
</script>
```

---

## 3. What are props used for?
**Answer: b) Passing data from parent to child**

Props enable parent components to pass data down to child components, creating one-way data flow.

```ts
<!-- Parent -->
<ChildComponent :user-name="name" />

<!-- Child receives userName prop -->
```

---

## 4. How do you declare props with TypeScript?
**Answer: b) `const props = defineProps<{ title: string }>()`**

`defineProps` is the Composition API function for declaring props with TypeScript.

```ts
const props = defineProps<{
  title: string
  count: number
}>()
```

---

## 5. What does `withDefaults` do?
**Answer: b) Provides default values for TypeScript props**

It allows you to set default values when using type-based prop declarations.

```ts
const props = withDefaults(defineProps<{
  title?: string
  count?: number
}>(), {
  title: 'Default',
  count: 0
})
```

---

## 6. Which is the correct way to mark a prop as required?
**Answer: a) `title: { type: String, required: true }`**

This is the runtime declaration syntax for required props.

```ts
const props = defineProps({
  title: {
    type: String,
    required: true  // Must be provided
  }
})
```

---

## 7. Why use a factory function for array/object defaults?
**Answer: b) Avoid shared references between instances**

Without factory functions, all component instances would share the same array/object.

```ts
// ❌ Wrong - shared reference
default: []

// ✅ Correct - new array per instance
default: () => []
```

---

## 8. What happens when you mutate a prop directly?
**Answer: b) Vue throws an error in development**

Props are read-only. Mutating them violates one-way data flow and triggers warnings.

```ts
// ❌ This causes a warning
const props = defineProps<{ count: number }>()
props.count++  // Error!
```

---

## 9. Which naming convention is used for component files?
**Answer: c) PascalCase (AppButton.vue)**

Component files should use PascalCase to distinguish them from regular HTML elements.

```
✅ AppButton.vue
✅ UserCard.vue
❌ app-button.vue
❌ user_card.vue
```

---

## 10. How do you pass a dynamic prop value?
**Answer: b) `<Component :prop="value" />`**

The `:` shorthand for `v-bind` treats the value as a JavaScript expression.

```ts
<!-- Static string -->
<Component title="Hello" />

<!-- Dynamic value -->
<Component :title="dynamicTitle" />
```

---

## 11. What is one-way data flow?
**Answer: b) Data only flows from parent to child**

Props flow down, events flow up. Children cannot directly modify parent state.

```
Parent (state)
   ↓ (props)
Child
   ↑ (events)
Parent (updates state)
```

---

## 12. How do you provide default values for object props?
**Answer: d) Both b and c are correct**

Both arrow functions and regular functions work as factory functions.

```ts
// Both are correct
default: () => ({})
default() { return {} }
```

---

## 13. What does `scoped` in `<style scoped>` mean?
**Answer: b) Styles only apply to this component**

Scoped styles are isolated to the component and don't leak globally.

```ts
<style scoped>
.button {
  /* Only affects buttons in this component */
}
</style>
```

---

## 14. Which prop type allows multiple possible types?
**Answer: a) `type: [String, Number]`**

Array syntax in runtime declaration allows multiple types.

```ts
const props = defineProps({
  id: {
    type: [String, Number]  // Can be either
  }
})

// TypeScript equivalent:
const props = defineProps<{
  id: string | number
}>()
```

---

## 15. How do you validate a prop value?
**Answer: b) `validator: (val) => val > 0`**

The `validator` property provides custom runtime validation.

```ts
const props = defineProps({
  age: {
    type: Number,
    validator: (value: number) => value >= 0 && value <= 150
  }
})
```

---

## 16. What is the correct way to use boolean props in templates?
**Answer: d) Both a and b are correct**

Boolean props can be passed explicitly or use shorthand syntax.

```ts
<!-- Explicit -->
<Component :is-active="true" />

<!-- Shorthand (same as above) -->
<Component is-active />
```

---

## 17. What does `v-bind="object"` do?
**Answer: b) Passes all object properties as individual props**

Prop spreading passes each property as a separate prop.

```ts
const user = { name: 'Alice', email: 'alice@example.com' }

<UserCard v-bind="user" />
<!-- Same as: -->
<UserCard :name="user.name" :email="user.email" />
```

---

## 18. How do you destructure props while maintaining reactivity?
**Answer: b) `const { title } = toRefs(props)`**

`toRefs` converts each prop to a ref, maintaining reactivity.

```ts
import { toRefs } from 'vue'

const props = defineProps<{ title: string; count: number }>()
const { title, count } = toRefs(props)  // Reactive refs
```

---

## 19. What is prop drilling?
**Answer: b) Passing props through multiple component levels**

When props are passed through intermediate components that don't use them.

```
App (has userId)
 ├─ Header (passes userId, doesn't use)
    └─ UserMenu (passes userId, doesn't use)
       └─ UserAvatar (finally uses userId)
```

---

## 20. Which is the recommended solution to prop drilling?
**Answer: c) Use provide/inject or state management**

These patterns avoid passing props through intermediate components.

```ts
// Parent provides
provide('userId', userId)

// Deep child injects
const userId = inject('userId')
```

---

## 21. What naming prefix is recommended for boolean props?
**Answer: b) is, has, should**

These prefixes make boolean intent clear.

```ts
const props = defineProps<{
  isDisabled: boolean
  hasError: boolean
  shouldAutoFocus: boolean
}>()
```

---

## 22. Can child components modify prop values?
**Answer: c) No, props are read-only**

Props follow one-way data flow and should never be mutated.

```ts
// ❌ Wrong
props.count++

// ✅ Correct - emit event to parent
emit('update:count', props.count + 1)
```

---

## 23. What is the correct prop name format in JavaScript?
**Answer: c) `userName`**

Use camelCase in JavaScript/TypeScript code.

```ts
const props = defineProps<{
  userName: string  // camelCase
  isActive: boolean
}>()
```

---

## 24. What is the correct prop name format in templates?
**Answer: a) `user-name`**

Use kebab-case in HTML templates.

```ts
<UserCard user-name="Alice" :is-active="true" />
```

---

## 25. Which statement about component composition is true?
**Answer: b) Components can contain child components**

Components can be composed to build complex UIs from simple pieces.

```ts
<template>
  <div>
    <Header />
    <MainContent>
      <ProductCard />
      <ProductCard />
    </MainContent>
  </div>
</template>
```

---

## 26. What happens if a required prop is not provided?
**Answer: b) Vue shows a warning in development**

Vue warns you but still renders the component (in dev mode).

```ts
const props = defineProps({
  userId: {
    type: String,
    required: true  // Warning if missing
  }
})
```

---

## 27. How do you define an optional prop with TypeScript?
**Answer: d) Both b and c are correct**

Both `?` and explicit union with `undefined` work.

```ts
interface Props {
  title?: string              // Optional
  subtitle: string | undefined // Also optional
}
```

---

## 28. What is the purpose of prop validation?
**Answer: b) Catch errors at runtime**

Validation helps catch incorrect prop usage during development.

```ts
const props = defineProps({
  status: {
    type: String,
    validator: (value: string) => {
      return ['draft', 'published'].includes(value)
    }
  }
})
```

---

## 29. Which is a valid prop type in runtime declaration?
**Answer: d) All of the above**

Vue supports all JavaScript constructor types.

```ts
const props = defineProps({
  title: String,
  count: Number,
  isActive: Boolean,
  items: Array,
  user: Object,
  callback: Function
})
```

---

## 30. What does `defineProps` return?
**Answer: b) A reactive object with prop values**

It returns a reactive props object that you can access in your component.

```ts
const props = defineProps<{ title: string }>()
console.log(props.title)  // Access prop value
```

---

## Scoring Guide

- **27-30 correct (90-100%)**: Excellent! You have mastered props and components.
- **24-26 correct (80-89%)**: Great job! You understand the core concepts.
- **20-23 correct (67-79%)**: Good progress. Review the missed topics.
- **Below 20 (< 67%)**: Review the lesson material and try again.

---

## Common Misconceptions

### 1. Props can be mutated
**Wrong**: Props are read-only and follow one-way data flow.

**Correct**: Emit events to ask parent to update, or use local state.

### 2. Default values work without factory functions
**Wrong**: `default: []` is shared across instances.

**Correct**: `default: () => []` creates new array per instance.

### 3. Props lose reactivity when destructured
**Wrong**: `const { title } = defineProps()` breaks reactivity.

**Correct**: Use `toRefs` or access via `props.title`.

### 4. camelCase in templates
**Wrong**: `<Component userName="Alice" />`

**Correct**: `<Component user-name="Alice" />`
