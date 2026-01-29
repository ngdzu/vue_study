# Quiz Answers — Lesson 2.5 (Component Props Advanced)

1) **What happens when you destructure props directly without `toRefs`?**

You lose reactivity! The destructured values become static and won't update when props change.

```ts
// ❌ WRONG: Loses reactivity
const { name } = defineProps<{ name: string }>()
// name is now a static string, not reactive
```

---

2) **Write code to correctly destructure props while preserving reactivity.**

```ts
import { toRefs } from 'vue'

const props = defineProps<{
  name: string
  age: number
}>()

// ✅ CORRECT: Preserves reactivity
const { name, age } = toRefs(props)

// Now name and age are reactive refs
watch(name, () => {
  console.log('Name changed!')
})
```

---

3) **What is a fallthrough attribute?**

An attribute or event listener passed to a component that isn't declared as a prop or emit. It automatically "falls through" to the root element.

Examples: `class`, `style`, `id`, `data-*`, `@click`, etc.

---

4) **What is the purpose of `inheritAttrs: false`?**

It prevents automatic application of fallthrough attributes to the root element, allowing you to manually control where they're applied using `v-bind="$attrs"`.

```ts
defineOptions({
  inheritAttrs: false
})
```

---

5) **How do you manually apply fallthrough attributes to an element?**

Use `v-bind="$attrs"`:

```ts
<template>
  <div class="wrapper">
    <input v-bind="$attrs" />
  </div>
</template>
```

---

6) **Write a component that forwards all attributes to an `<input>` instead of the root `<div>`.**

```ts
<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})
</script>

<template>
  <div class="wrapper">
    <label>Label</label>
    <input v-bind="$attrs" class="input" />
  </div>
</template>
```

---

7) **What is `$attrs`? How do you access it in script setup?**

`$attrs` is an object containing all fallthrough attributes.

In template: Use `$attrs` directly
In script: Use `useAttrs()`

```ts
<script setup lang="ts">
import { useAttrs } from 'vue'

const attrs = useAttrs()
console.log(attrs.class, attrs.onClick)
</script>
```

---

8) **What's the difference between props and fallthrough attributes?**

- **Props**: Explicitly declared, validated, type-checked, accessed via `props` object
- **Fallthrough attrs**: Not declared, automatically forwarded, accessed via `$attrs`

---

9) **How does Vue merge class and style attributes?**

Vue intelligently merges them:
- **class**: Combines classes from child and parent
- **style**: Merges style objects/strings
- **Other attrs**: Parent value wins

```ts
// Child has class="btn"
// Parent passes class="large"
// Result: class="btn large"
```

---

10) **What happens to event listeners passed to a component?**

They're included in `$attrs` as `onEventName` and automatically forwarded to the root element (or where you use `v-bind="$attrs"`).

```ts
// Parent
<MyButton @click="handler" />

// Child
const attrs = useAttrs()
console.log(attrs.onClick) // handler function
```

---

11) **Write code to create computed fullName from firstName and lastName props.**

```ts
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  firstName: string
  lastName: string
}>()

const fullName = computed(() => {
  return `${props.firstName} ${props.lastName}`
})
</script>

<template>
  <div>{{ fullName }}</div>
</template>
```

---

12) **What is `withDefaults` used for in TypeScript components?**

It defines default values for props while maintaining TypeScript type inference.

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

13) **Why should wrapper components use `inheritAttrs: false`?**

To prevent attributes from being applied to the wrapper element and instead forward them to the actual interactive element inside.

```ts
// Without inheritAttrs: false
<div class="wrapper" type="text" placeholder="..."> // ❌ Invalid!
  <input />
</div>

// With inheritAttrs: false
<div class="wrapper">
  <input type="text" placeholder="..." /> // ✅ Correct!
</div>
```

---

14) **How do you provide default values for props in TypeScript?**

Use `withDefaults`:

```ts
const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary'
  size?: 'small' | 'large'
}>(), {
  variant: 'primary',
  size: 'large'
})
```

---

15) **What is a transparent wrapper component?**

A component that wraps another element/component while forwarding all props and attributes, making it feel like you're using the underlying element directly.

Example: `BaseButton` wraps `<button>` but exposes all button attributes.

---

16) **Can you have multiple default values for the same prop?**

No, each prop can only have one default value.

---

17) **What accessibility considerations are important for input wrappers?**

- Proper label-input association (`for` and `id`)
- ARIA attributes (`aria-invalid`, `aria-describedby`, `aria-required`)
- Error messages with `role="alert"`
- Meaningful hints linked via `aria-describedby`
- Focus management

---

18) **How do you handle multi-root components with fallthrough attributes?**

Use `inheritAttrs: false` and explicitly apply `v-bind="$attrs"` to the desired root element.

```ts
<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <h1 v-bind="$attrs">Title</h1>
  <p>Content</p>
</template>
```

---

19) **What's wrong with this code?**
```ts
const { name } = defineProps<{ name: string }>()
watch(name, () => console.log('Changed'))
```

Destructuring props directly loses reactivity. `name` is no longer reactive, so `watch` won't work.

**Fix**:
```ts
const props = defineProps<{ name: string }>()
const { name } = toRefs(props)
watch(name, () => console.log('Changed'))
```

---

20) **How do you validate prop values at runtime?**

Use the validator function:

```ts
defineProps({
  status: {
    type: String,
    validator: (value: string) => {
      return ['active', 'inactive', 'pending'].includes(value)
    }
  },
  age: {
    type: Number,
    validator: (value: number) => value >= 0
  }
})
```
