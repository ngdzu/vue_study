# Sample Project — Wrapper Components with Transparent Props

Purpose: Build a set of base components (BaseButton, BaseInput, BaseSelect) that wrap native HTML elements while providing enhanced functionality and forwarding all attributes transparently.

## Requirements

Create three wrapper components that:
- Accept custom props for enhanced functionality
- Forward all HTML attributes to the underlying element
- Handle events properly
- Provide consistent styling
- Maintain full accessibility

## File Layout

```
src/
  components/
    BaseButton.vue
    BaseInput.vue
    BaseSelect.vue
  App.vue
```

## Part 1: BaseButton

### Requirements
- Props: `variant`, `size`, `loading`, `disabled`
- Forward all other attributes to `<button>`
- Show loading spinner
- Disable when loading
- Preserve all event listeners

### Implementation

```ts
// src/components/BaseButton.vue
<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  loading?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium',
  loading: false,
  disabled: false
})
</script>

<template>
  <button
    v-bind="$attrs"
    :class="[
      'base-btn',
      `base-btn--${variant}`,
      `base-btn--${size}`,
      { 'base-btn--loading': loading }
    ]"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="spinner" aria-hidden="true"></span>
    <span :class="{ 'sr-only': loading && $slots.loadingText }">
      <slot></slot>
    </span>
    <span v-if="loading && $slots.loadingText">
      <slot name="loadingText"></slot>
    </span>
  </button>
</template>

<style scoped>
.base-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  line-height: 1.5;
}

.base-btn:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

.base-btn--small {
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
}

.base-btn--medium {
  padding: 0.5rem 1rem;
  font-size: 1rem;
}

.base-btn--large {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
}

.base-btn--primary {
  background: #3b82f6;
  color: white;
}

.base-btn--primary:hover:not(:disabled) {
  background: #2563eb;
}

.base-btn--secondary {
  background: #6b7280;
  color: white;
}

.base-btn--success {
  background: #10b981;
  color: white;
}

.base-btn--danger {
  background: #ef4444;
  color: white;
}

.base-btn--ghost {
  background: transparent;
  color: #3b82f6;
  border: 1px solid currentColor;
}

.base-btn:disabled,
.base-btn--loading {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
```

## Part 2: BaseInput

### Requirements
- Props: `label`, `error`, `hint`, `required`
- Forward all HTML input attributes
- Accessible error/hint messages
- Validation states

```ts
// src/components/BaseInput.vue
<script setup lang="ts">
import { computed, useAttrs } from 'vue'

defineOptions({
  inheritAttrs: false
})

interface Props {
  label?: string
  error?: string
  hint?: string
  required?: boolean
  modelValue?: string | number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const attrs = useAttrs()

const inputId = computed(() => {
  return attrs.id as string || `input-${Math.random().toString(36).substr(2, 9)}`
})

const describedBy = computed(() => {
  const ids = []
  if (props.error) ids.push(`${inputId.value}-error`)
  if (props.hint && !props.error) ids.push(`${inputId.value}-hint`)
  return ids.length > 0 ? ids.join(' ') : undefined
})
</script>

<template>
  <div class="input-group">
    <label v-if="label" :for="inputId" class="label">
      {{ label }}
      <span v-if="required" class="required" aria-label="required">*</span>
    </label>
    
    <input
      :id="inputId"
      v-bind="$attrs"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :class="['input', { 'input--error': error }]"
      :aria-invalid="!!error"
      :aria-describedby="describedBy"
      :aria-required="required"
    />
    
    <p v-if="hint && !error" :id="`${inputId}-hint`" class="hint">
      {{ hint }}
    </p>
    
    <p v-if="error" :id="`${inputId}-error`" class="error" role="alert">
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
.input-group {
  margin-bottom: 1rem;
}

.label {
  display: block;
  margin-bottom: 0.375rem;
  font-weight: 500;
  color: #374151;
}

.required {
  color: #ef4444;
  margin-left: 0.125rem;
}

.input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: all 0.2s;
}

.input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input--error {
  border-color: #ef4444;
}

.input--error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.hint {
  margin: 0.375rem 0 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.error {
  margin: 0.375rem 0 0;
  font-size: 0.875rem;
  color: #ef4444;
}
</style>
```

## Part 3: Complete Form Example

```ts
// src/App.vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseButton from './components/BaseButton.vue'
import BaseInput from './components/BaseInput.vue'

const form = ref({
  name: '',
  email: '',
  password: ''
})

const errors = ref({
  name: '',
  email: '',
  password: ''
})

const isSubmitting = ref(false)

const isValid = computed(() => {
  return form.value.name &&
    form.value.email &&
    form.value.password &&
    !errors.value.name &&
    !errors.value.email &&
    !errors.value.password
})

const validateName = () => {
  if (!form.value.name) {
    errors.value.name = 'Name is required'
  } else if (form.value.name.length < 2) {
    errors.value.name = 'Name must be at least 2 characters'
  } else {
    errors.value.name = ''
  }
}

const validateEmail = () => {
  if (!form.value.email) {
    errors.value.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Invalid email address'
  } else {
    errors.value.email = ''
  }
}

const validatePassword = () => {
  if (!form.value.password) {
    errors.value.password = 'Password is required'
  } else if (form.value.password.length < 8) {
    errors.value.password = 'Password must be at least 8 characters'
  } else {
    errors.value.password = ''
  }
}

const handleSubmit = async () => {
  validateName()
  validateEmail()
  validatePassword()
  
  if (!isValid.value) return
  
  isSubmitting.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  console.log('Form submitted:', form.value)
  isSubmitting.value = false
  
  // Reset form
  form.value = { name: '', email: '', password: '' }
}
</script>

<template>
  <div class="app">
    <div class="card">
      <h1>Registration Form</h1>
      
      <form @submit.prevent="handleSubmit">
        <BaseInput
          v-model="form.name"
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          required
          :error="errors.name"
          @blur="validateName"
        />
        
        <BaseInput
          v-model="form.email"
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          required
          :error="errors.email"
          hint="We'll never share your email"
          @blur="validateEmail"
        />
        
        <BaseInput
          v-model="form.password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          required
          :error="errors.password"
          hint="Must be at least 8 characters"
          @blur="validatePassword"
        />
        
        <div class="actions">
          <BaseButton
            type="submit"
            variant="primary"
            size="large"
            :loading="isSubmitting"
            :disabled="!isValid"
          >
            <template #default>Register</template>
            <template #loadingText>Creating account...</template>
          </BaseButton>
          
          <BaseButton
            type="button"
            variant="ghost"
            @click="form = { name: '', email: '', password: '' }"
          >
            Reset
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, -apple-system, sans-serif;
  background: #f3f4f6;
}

.app {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.card {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
}

h1 {
  margin: 0 0 1.5rem;
  font-size: 1.5rem;
  color: #111827;
}

.actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}
</style>
```

## Validation Criteria

### BaseButton (30 points)
- ✅ Variant and size props work (8 pts)
- ✅ Loading state displays spinner (6 pts)
- ✅ All HTML attributes forwarded (8 pts)
- ✅ Accessibility (focus states, disabled) (8 pts)

### BaseInput (40 points)
- ✅ Label, hint, error display correctly (10 pts)
- ✅ v-model binding works (10 pts)
- ✅ All input attributes forwarded (8 pts)
- ✅ Accessibility (ARIA attributes, IDs) (12 pts)

### Integration (30 points)
- ✅ Form validation works (10 pts)
- ✅ Submit flow (loading, disabled states) (10 pts)
- ✅ Responsive and polished UI (10 pts)

## Summary

This project demonstrates:
- Transparent wrapper components
- Proper attribute forwarding with `v-bind="$attrs"`
- Accessibility best practices
- Form handling and validation
- Loading and disabled states

Complete this project to master advanced props patterns!
