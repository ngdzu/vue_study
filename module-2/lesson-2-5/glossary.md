# Glossary — Lesson 2.5 Terms & Definitions

Quick reference for technical terms used in this lesson.

---

## Core Concepts

### Props Destructuring
**Definition**: Extracting prop values from the props object into individual variables.

**Critical issue**: Direct destructuring loses reactivity in Vue!

**Example**:
```ts
// ❌ WRONG: Loses reactivity
const { name, age } = defineProps<{ name: string; age: number }>()

// ✅ CORRECT: Preserves reactivity
const props = defineProps<{ name: string; age: number }>()
const { name, age } = toRefs(props)
```

---

### Fallthrough Attributes
**Definition**: Attributes passed to a component that aren't declared as props or emits. They automatically "fall through" to the root element.

**Includes**: Class, style, ID, data attributes, event listeners, etc.

**Example**:
```ts
// Parent
<Button class="large" @click="handler" data-test="btn">

// Child (Button.vue)
<template>
  <!-- class, @click, data-test automatically applied -->
  <button class="btn"></button>
</template>
```

---

### $attrs
**Definition**: An object containing all non-prop attributes passed to a component.

**Access in template**: `$attrs`
**Access in script**: `useAttrs()`

**Example**:
```ts
<script setup lang="ts">
import { useAttrs } from 'vue'

const attrs = useAttrs()
console.log(attrs.class, attrs.onClick)
</script>

<template>
  <div v-bind="$attrs"></div>
</template>
```

---

### inheritAttrs
**Definition**: Component option that controls automatic attribute inheritance.

**Default**: `true` (attributes applied to root element)
**Set to `false`**: Prevent automatic inheritance, apply manually with `v-bind="$attrs"`

**Example**:
```ts
<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})
</script>

<template>
  <!-- Attrs NOT automatically applied to root -->
  <div class="wrapper">
    <input v-bind="$attrs" />
  </div>
</template>
```

---

### Transparent Wrapper
**Definition**: A component that wraps another element/component and forwards all props and attributes.

**Purpose**: Add minimal functionality without hiding underlying element's API.

**Example**:
```ts
// BaseButton wraps <button> but exposes all button attributes
<BaseButton
  variant="primary"  // Custom prop
  type="submit"      // HTML attribute (forwarded)
  @click="handler"   // Event listener (forwarded)
>
```

---

### v-bind="$attrs"
**Definition**: Directive that applies all fallthrough attributes to an element.

**Usage**: Manually control where attributes are applied.

**Example**:
```ts
<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <div class="wrapper">
    <!-- Apply all attrs here -->
    <input v-bind="$attrs" />
  </div>
</template>
```

---

### Computed Props
**Definition**: Derived reactive values calculated from component props.

**Use case**: Transform or combine prop values for display.

**Example**:
```ts
const props = defineProps<{
  firstName: string
  lastName: string
}>()

const fullName = computed(() => {
  return `${props.firstName} ${props.lastName}`
})
```

---

### toRefs
**Definition**: Converts all properties of a reactive object to individual refs, preserving reactivity.

**Use case**: Destructure props while maintaining reactivity.

**Example**:
```ts
const props = defineProps<{
  name: string
  age: number
}>()

const { name, age } = toRefs(props)

// name and age are now reactive refs
watch(name, () => console.log('Name changed'))
```

---

### withDefaults
**Definition**: TypeScript utility to define default prop values with type inference.

**Syntax**: `withDefaults(defineProps<Props>(), { /* defaults */ })`

**Example**:
```ts
interface Props {
  name: string
  age?: number
  role?: 'admin' | 'user'
}

const props = withDefaults(defineProps<Props>(), {
  age: 0,
  role: 'user'
})
```

---

### Multi-root Component
**Definition**: A component with multiple root elements in its template.

**Attribute inheritance issue**: Vue doesn't know which root to apply fallthrough attributes to.

**Solution**: Use `inheritAttrs: false` and `v-bind="$attrs"` explicitly.

**Example**:
```ts
<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <!-- Multiple roots -->
  <h1 v-bind="$attrs">Title</h1>
  <p>Content</p>
</template>
```

---

### Props Validation
**Definition**: Runtime checks to ensure props receive correct types and values.

**Example**:
```ts
const props = defineProps({
  age: {
    type: Number,
    required: true,
    validator: (value: number) => value >= 0
  },
  status: {
    type: String,
    validator: (value: string) => {
      return ['active', 'inactive'].includes(value)
    }
  }
})
```

---

### Event Listeners in $attrs
**Definition**: Event listeners (e.g., `@click`, `@input`) are included in `$attrs` as `onEventName`.

**Example**:
```ts
// Parent
<CustomInput @input="handleInput" @blur="handleBlur" />

// Child
const attrs = useAttrs()
console.log(attrs.onInput)  // handleInput function
console.log(attrs.onBlur)   // handleBlur function

// Forward all events
<input v-bind="$attrs" />
```

---

### Attribute Merging
**Definition**: When both component and fallthrough have the same attribute, they're merged intelligently.

**Special cases**:
- `class` and `style` are merged
- Event listeners are chained
- Other attrs: fallthrough value wins

**Example**:
```ts
// Child
<button class="btn"></button>

// Parent
<MyButton class="large" />

// Result: class="btn large"
```

---

## Best Practices

### Explicit Attribute Forwarding
**Definition**: Explicitly controlling where attributes are applied using `inheritAttrs: false` and `v-bind="$attrs"`.

**Benefit**: Clear intent, better control over component API.

---

### Props for Config, Attrs for HTML
**Pattern**: Use props for component-specific configuration, let HTML attributes fall through.

**Example**:
```ts
// Props: component config
<BaseButton variant="primary" size="large">

// Attrs: HTML attributes
<BaseButton type="submit" disabled>
```

---

### Defensive Defaults
**Definition**: Providing sensible default values for optional props.

**Example**:
```ts
const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary'
  size?: 'small' | 'medium' | 'large'
}>(), {
  variant: 'primary',
  size: 'medium'
})
```

---

## Summary

This glossary covers:
- Props destructuring and reactivity preservation
- Fallthrough attributes and `$attrs`
- Attribute inheritance control
- Transparent wrapper components
- Computed props and validation
- Multi-root components
- Best practices for props and attributes

Keep this reference open while working through the lesson and exercises!
