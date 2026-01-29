# Lesson 2.5 — Component Props Advanced

## Learning Goals

By the end of this lesson, you will be able to:

- ✅ Understand props destructuring in `<script setup>`
- ✅ Work with computed props and derived state
- ✅ Handle fallthrough attributes with `$attrs`
- ✅ Control attribute inheritance with `inheritAttrs: false`
- ✅ Create transparent wrapper components
- ✅ Use `v-bind="$attrs"` for attribute forwarding
- ✅ Apply best practices for props validation and defaults
- ✅ Build configurable components that properly handle all attribute types

## Prerequisites

Before starting this lesson, you should:

- ✅ Understand basic props usage
- ✅ Be comfortable with the Composition API
- ✅ Know TypeScript basics
- ✅ Have completed Module 2, Lessons 2.1-2.4

## What You Will Build

In this lesson, you will:

1. **Create a BaseButton** wrapper component with transparent props
2. **Build a BaseInput** component with proper attribute handling
3. **Design a Form wrapper** that forwards all attributes
4. **Implement props validation** and default values
5. **Handle events and attributes** simultaneously

---

## Props Destructuring

In `<script setup>`, you can destructure props, but with important caveats.

### Basic Props Destructuring

```ts
<script setup lang="ts">
// ❌ WRONG: Loses reactivity!
const { name, age } = defineProps<{
  name: string
  age: number
}>()

// name and age are NOT reactive
watch(() => name, () => {
  console.log('Will never trigger!')
})
</script>

<template>
  <!-- ❌ Won't update when prop changes -->
  <div>{{ name }}</div>
</template>
```

> ⚠️ **CRITICAL**: Destructuring props directly loses reactivity!

### Correct Approach: Use `toRefs`

```ts
<script setup lang="ts">
import { toRefs } from 'vue'

const props = defineProps<{
  name: string
  age: number
}>()

// ✅ CORRECT: Preserves reactivity
const { name, age } = toRefs(props)

watch(name, () => {
  console.log('Name changed!') // ✅ Works!
})
</script>

<template>
  <!-- ✅ Reactive -->
  <div>{{ name }}</div>
</template>
```

### When Destructuring is Safe

```ts
<script setup lang="ts">
const props = defineProps<{
  initialCount: number
}>()

// ✅ Safe: Using it once to initialize local state
const count = ref(props.initialCount)

// ✅ Safe: In function that runs once
onMounted(() => {
  console.log(props.initialCount)
})
</script>
```

---

## Computed Props

Create derived state from props using `computed`.

### Basic Computed Prop

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

### Complex Computed Example

```ts
<script setup lang="ts">
import { computed } from 'vue'

interface Product {
  price: number
  quantity: number
  discount?: number
}

const props = defineProps<Product>()

const subtotal = computed(() => {
  return props.price * props.quantity
})

const discountAmount = computed(() => {
  if (!props.discount) return 0
  return subtotal.value * (props.discount / 100)
})

const total = computed(() => {
  return subtotal.value - discountAmount.value
})
</script>

<template>
  <div class="product">
    <p>Subtotal: ${{ subtotal.toFixed(2) }}</p>
    <p v-if="discountAmount > 0">Discount: -${{ discountAmount.toFixed(2) }}</p>
    <p><strong>Total: ${{ total.toFixed(2) }}</strong></p>
  </div>
</template>
```

---

## Fallthrough Attributes (`$attrs`)

**Fallthrough attributes** are attributes or event listeners passed to a component that aren't declared as props or emits.

### Default Behavior

```ts
// Button.vue
<script setup lang="ts">
defineProps<{
  variant: string
}>()
</script>

<template>
  <button class="btn">
    <slot></slot>
  </button>
</template>

// Parent
<Button variant="primary" class="large" id="submit-btn" @click="handleClick">
  Submit
</Button>

// Rendered output:
// <button class="btn large" id="submit-btn" @click="handleClick">
//   Submit
// </button>
```

> 💡 **IMPORTANT**: Non-prop attributes automatically fall through to the root element!

---

## Disabling Attribute Inheritance

Use `inheritAttrs: false` to prevent automatic attribute inheritance.

### Basic Example

```ts
<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

defineProps<{
  variant: string
}>()
</script>

<template>
  <!-- Attributes NO LONGER automatically applied -->
  <button class="btn">
    <slot></slot>
  </button>
</template>
```

Now `class="large"` and other attrs won't be added automatically.

---

## Manual Attribute Binding with `v-bind="$attrs"`

Manually apply fallthrough attributes to specific elements.

### Wrapper Component Example

```ts
// CustomInput.vue
<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

defineProps<{
  label: string
  error?: string
}>()
</script>

<template>
  <div class="input-wrapper">
    <label>{{ label }}</label>
    
    <!-- Apply $attrs to the input, not the root div -->
    <input v-bind="$attrs" class="input" />
    
    <span v-if="error" class="error">{{ error }}</span>
  </div>
</template>

<style scoped>
.input-wrapper {
  margin-bottom: 1rem;
}

.input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.error {
  color: #dc3545;
  font-size: 0.875rem;
}
</style>
```

### Usage

```ts
<CustomInput
  label="Email"
  type="email"
  placeholder="Enter email"
  v-model="email"
  @blur="validate"
  required
/>

// The type, placeholder, v-model, @blur, and required
// all go to the <input>, NOT the root <div>
```

---

## Accessing `$attrs` in Script

```ts
<script setup lang="ts">
import { useAttrs } from 'vue'

const attrs = useAttrs()

// Access specific attributes
console.log(attrs.class)
console.log(attrs.id)
console.log(attrs.onClick)
</script>
```

---

## Transparent Wrapper Components

**Transparent wrappers** forward all props and attributes to a child element while adding minimal functionality.

### BaseButton Example

```ts
// BaseButton.vue
<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

const props = defineProps<{
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
  loading?: boolean
  disabled?: boolean
}>()
</script>

<template>
  <button
    v-bind="$attrs"
    :class="[
      'btn',
      `btn--${variant || 'primary'}`,
      `btn--${size || 'medium'}`,
      { 'btn--loading': loading }
    ]"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="spinner"></span>
    <slot></slot>
  </button>
</template>

<style scoped>
.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn--primary {
  background: #007bff;
  color: white;
}

.btn--secondary {
  background: #6c757d;
  color: white;
}

.btn--danger {
  background: #dc3545;
  color: white;
}

.btn--small {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.btn--medium {
  padding: 0.5rem 1rem;
}

.btn--large {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
}

.btn--loading {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
```

### Usage

```ts
<BaseButton
  variant="primary"
  size="large"
  type="submit"
  @click="handleSubmit"
  class="my-custom-class"
  data-testid="submit-button"
  :loading="isSubmitting"
>
  Submit Form
</BaseButton>

// variant, size, loading → custom props
// type, @click, class, data-testid → fallthrough to <button>
```

---

## Props Validation and Defaults

### Runtime Validation

```ts
<script setup lang="ts">
const props = defineProps({
  // Type check
  age: Number,
  
  // Type check + required
  name: {
    type: String,
    required: true
  },
  
  // Default value
  role: {
    type: String,
    default: 'user'
  },
  
  // Custom validator
  status: {
    type: String,
    validator: (value: string) => {
      return ['active', 'inactive', 'pending'].includes(value)
    }
  },
  
  // Object/Array default (must use function)
  options: {
    type: Object,
    default: () => ({ theme: 'light' })
  }
})
</script>
```

### TypeScript Validation with Defaults

```ts
<script setup lang="ts">
interface Props {
  name: string
  age?: number
  role?: 'admin' | 'user' | 'guest'
}

const props = withDefaults(defineProps<Props>(), {
  age: 0,
  role: 'user'
})
</script>
```

---

## Multi-Root Components and Attributes

With multiple root elements, Vue doesn't know where to apply fallthrough attributes.

### Problem

```ts
<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <!-- ⚠️ Multiple roots - where do attrs go? -->
  <h1>{{ title }}</h1>
  <p>Content</p>
</template>
```

### Solution: Explicit `v-bind="$attrs"`

```ts
<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

defineProps<{
  title: string
}>()
</script>

<template>
  <h1 v-bind="$attrs">{{ title }}</h1>
  <p>Content</p>
</template>
```

---

## Event Handling with `$attrs`

Event listeners are included in `$attrs`.

### Example

```ts
// Wrapper component
<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})
</script>

<template>
  <div class="wrapper">
    <input v-bind="$attrs" class="input" />
  </div>
</template>

// Parent
<CustomInput
  @input="handleInput"
  @blur="handleBlur"
  @focus="handleFocus"
/>

// All event listeners forwarded to <input>
```

---

## Practical Example: BaseInput

```ts
// BaseInput.vue
<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

interface Props {
  label?: string
  error?: string
  hint?: string
  required?: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <div class="input-group">
    <label v-if="label" class="label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    
    <input
      v-bind="$attrs"
      :class="['input', { 'input--error': error }]"
      :aria-invalid="!!error"
      :aria-describedby="error ? 'error-message' : hint ? 'hint-message' : undefined"
    />
    
    <span v-if="hint && !error" id="hint-message" class="hint">
      {{ hint }}
    </span>
    
    <span v-if="error" id="error-message" class="error">
      {{ error }}
    </span>
  </div>
</template>

<style scoped>
.input-group {
  margin-bottom: 1rem;
}

.label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.required {
  color: #dc3545;
}

.input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
}

.input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.input--error {
  border-color: #dc3545;
}

.hint {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #6c757d;
}

.error {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #dc3545;
}
</style>
```

### Usage

```ts
<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from './BaseInput.vue'

const email = ref('')
const emailError = ref('')

const validateEmail = () => {
  if (!email.value.includes('@')) {
    emailError.value = 'Invalid email address'
  } else {
    emailError.value = ''
  }
}
</script>

<template>
  <BaseInput
    v-model="email"
    label="Email Address"
    type="email"
    placeholder="Enter your email"
    required
    :error="emailError"
    hint="We'll never share your email"
    @blur="validateEmail"
  />
</template>
```

---

## Best Practices

### 1. Use `inheritAttrs: false` for Wrapper Components

```ts
// ✅ GOOD: Control where attributes go
defineOptions({
  inheritAttrs: false
})

<template>
  <div class="wrapper">
    <input v-bind="$attrs" />
  </div>
</template>
```

### 2. Document Fallthrough Behavior

```ts
/**
 * CustomInput component
 * 
 * Accepts all standard input attributes (type, placeholder, etc.)
 * and forwards them to the underlying <input> element.
 * 
 * @prop {string} label - Input label
 * @prop {string} error - Error message
 */
```

### 3. Combine Props and Attrs Carefully

```ts
// ✅ GOOD: Props for component config, attrs for HTML attributes
<BaseButton
  variant="primary"    // Component prop
  size="large"         // Component prop
  type="submit"        // HTML attribute
  disabled             // HTML attribute
>
  Submit
</BaseButton>
```

### 4. Validate Props with TypeScript

```ts
// ✅ GOOD: Type-safe props
interface Props {
  variant: 'primary' | 'secondary' | 'danger'
  size: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium'
})
```

---

## Summary

In this lesson, you learned:

- ✅ Props destructuring with `toRefs` to preserve reactivity
- ✅ Creating computed props from prop values
- ✅ Understanding fallthrough attributes (`$attrs`)
- ✅ Controlling attribute inheritance with `inheritAttrs: false`
- ✅ Building transparent wrapper components
- ✅ Using `v-bind="$attrs"` for manual attribute forwarding
- ✅ Props validation and default values
- ✅ Best practices for configurable components

**Next Steps**: Complete the exercises to build wrapper components with proper attribute handling. Then move on to Lesson 2.6: Provide/Inject Pattern.

---

## Additional Resources

- [Vue Props Guide](https://vuejs.org/guide/components/props.html)
- [Fallthrough Attributes](https://vuejs.org/guide/components/attrs.html)
- [TypeScript with Composition API](https://vuejs.org/guide/typescript/composition-api.html)
