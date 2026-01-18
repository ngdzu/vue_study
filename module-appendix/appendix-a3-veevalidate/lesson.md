# VeeValidate: Professional Form Validation

VeeValidate is a form validation library that simplifies building validated forms in Vue 3. It pairs with schema validators like **Yup** or **Zod** to centralize validation rules.

> 💡 IMPORTANT: VeeValidate reduces form code by ~70% compared to manual validation. It handles error display, field state, and async validation automatically.

## 1) Setup and Installation

### 1.1 Install dependencies
```bash
npm install vee-validate yup
# or for Zod
npm install vee-validate zod
```

### 1.2 Basic configuration (main.ts)
```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')

// No special plugin needed; VeeValidate is imported per-component
```

## 2) Simple Form with useForm and useField

### 2.1 Basic form structure
```ts
<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

// Define validation schema
const validationSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8, 'Min 8 chars').required('Password required'),
})

// Initialize form
const { handleSubmit, errors } = useForm({
  validationSchema,
})

// Get individual field values
const { value: email } = useField('email')
const { value: password } = useField('password')

// Handle form submission
const onSubmit = handleSubmit((values) => {
  console.log('Form submitted:', values)
})
</script>

<template>
  <form @submit="onSubmit">
    <div>
      <label for="email">Email</label>
      <input
        id="email"
        v-model="email"
        type="email"
        placeholder="Enter email"
      >
      <span v-if="errors.email" class="error">{{ errors.email }}</span>
    </div>

    <div>
      <label for="password">Password</label>
      <input
        id="password"
        v-model="password"
        type="password"
        placeholder="Enter password"
      >
      <span v-if="errors.password" class="error">{{ errors.password }}</span>
    </div>

    <button type="submit">Submit</button>
  </form>
</template>
```

## 3) Form Component Wrapper

### 3.1 Reusable FormField component
```ts
<!-- FormField.vue -->
<script setup lang="ts">
import { useField } from 'vee-validate'

interface Props {
  name: string
  type?: string
  label?: string
  placeholder?: string
}

defineProps<Props>()

const { value, errors } = useField((props) => props.name)
</script>

<template>
  <div class="form-field">
    <label v-if="label" :for="name">{{ label }}</label>
    <input
      :id="name"
      v-model="value"
      :type="type || 'text'"
      :placeholder="placeholder"
    >
    <span v-if="errors.length" class="error">{{ errors[0] }}</span>
  </div>
</template>

<style scoped>
.form-field { margin-bottom: 1rem; }
input { width: 100%; padding: 0.5rem; }
.error { color: red; font-size: 0.875rem; }
</style>
```

### 3.2 Using the wrapper
```ts
<script setup lang="ts">
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import FormField from './FormField.vue'

const validationSchema = yup.object({
  name: yup.string().required('Name required'),
  email: yup.string().email().required('Email required'),
})

const { handleSubmit } = useForm({ validationSchema })

const onSubmit = handleSubmit((values) => {
  console.log(values)
})
</script>

<template>
  <form @submit="onSubmit">
    <FormField name="name" label="Full Name" />
    <FormField name="email" type="email" label="Email" />
    <button type="submit">Submit</button>
  </form>
</template>
```

## 4) Advanced: Multi-Step Forms

### 4.1 Step-by-step validation
```ts
<script setup lang="ts">
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { ref } from 'vue'

const step = ref(1)

const validationSchema = yup.object({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
})

const { handleSubmit, values, validateField, setFieldError } = useForm({
  validationSchema,
})

// Validate only current step fields
const nextStep = async () => {
  const stepFields = step.value === 1
    ? ['firstName', 'lastName']
    : ['email', 'password']

  for (const field of stepFields) {
    await validateField(field)
  }

  // Check if valid before advancing
  const stepValid = stepFields.every((f) => !errors.value[f])
  if (stepValid) step.value++
}

const onSubmit = handleSubmit((values) => {
  console.log('All steps complete:', values)
})
</script>

<template>
  <form @submit="onSubmit">
    <!-- Step 1 -->
    <fieldset v-if="step === 1">
      <legend>Personal Info</legend>
      <input v-model="values.firstName" name="firstName" placeholder="First name" />
      <input v-model="values.lastName" name="lastName" placeholder="Last name" />
      <button type="button" @click="nextStep">Next</button>
    </fieldset>

    <!-- Step 2 -->
    <fieldset v-if="step === 2">
      <legend>Account Info</legend>
      <input v-model="values.email" name="email" type="email" placeholder="Email" />
      <input v-model="values.password" name="password" type="password" placeholder="Password" />
      <button type="button" @click="step--">Back</button>
      <button type="submit">Submit</button>
    </fieldset>
  </form>
</template>
```

## 5) Async Validation (Server-Side Checks)

### 5.1 Email uniqueness check
```ts
<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

const checkEmailExists = async (email: string) => {
  // Simulated API call
  const response = await fetch(`/api/check-email?email=${email}`)
  const data = await response.json()
  return !data.exists
}

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email')
    .required('Email required')
    .test('unique-email', 'Email already in use', checkEmailExists),
})

const { handleSubmit, errors, isSubmitting } = useForm({
  validationSchema,
})

const { value: email } = useField('email')

const onSubmit = handleSubmit((values) => {
  console.log('Valid:', values)
})
</script>

<template>
  <form @submit="onSubmit">
    <input v-model="email" type="email" placeholder="Email">
    <span v-if="errors.email" class="error">{{ errors.email }}</span>
    <button type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Checking...' : 'Submit' }}
    </button>
  </form>
</template>
```

## 6) Custom Validators

### 6.1 Define custom rule
```ts
import * as yup from 'yup'

// Password strength check
yup.string().test(
  'strong-password',
  'Password must contain uppercase, lowercase, and number',
  (value) => {
    if (!value) return false
    return /[A-Z]/.test(value) && /[a-z]/.test(value) && /[0-9]/.test(value)
  }
)

// Custom range validator
yup.number().test(
  'in-range',
  'Must be between 18 and 100',
  (value) => value >= 18 && value <= 100
)
```

### 6.2 Reusable validation schema
```ts
const createUserSchema = () =>
  yup.object({
    username: yup
      .string()
      .required('Username required')
      .min(3, 'Min 3 characters')
      .test('username-available', 'Username taken', async (val) => {
        const response = await fetch(`/api/check-username/${val}`)
        return (await response.json()).available
      }),
    email: yup.string().email().required(),
    age: yup.number().min(18, 'Must be 18+').max(100),
    password: yup
      .string()
      .min(8)
      .test('strong', 'Weak password', (val) =>
        /[A-Z]/.test(val) && /[0-9]/.test(val)
      ),
  })
```

## 6.3 Global custom rules with defineRule

### 6.3.1 Define global rule once
```ts
import { defineRule } from 'vee-validate'

// Strong password rule
defineRule('strongPassword', (value: string) => {
  if (!value) return true // Allow empty (use required separately)
  if (!/[A-Z]/.test(value)) return 'Must contain uppercase'
  if (!/[a-z]/.test(value)) return 'Must contain lowercase'
  if (!/[0-9]/.test(value)) return 'Must contain number'
  return true // Valid
})

// Reusable username availability check
defineRule('usernameAvailable', async (value: string) => {
  if (!value) return true
  const response = await fetch(`/api/check-username/${value}`)
  const data = await response.json()
  return data.available ? true : 'Username taken'
})

// Custom range rule
defineRule('ageRange', (value: number) => {
  if (value < 18) return 'Must be 18 or older'
  if (value > 120) return 'Invalid age'
  return true
})
```

### 6.3.2 Using global rules in schemas
```ts
import * as yup from 'yup'

const registrationSchema = yup.object({
  username: yup
    .string()
    .required('Username required')
    .min(3)
    .test('usernameAvailable'), // Use global rule
  password: yup
    .string()
    .required('Password required')
    .min(8)
    .test('strongPassword'), // Use global rule
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref('password')], 'Passwords must match'),
  age: yup
    .number()
    .required()
    .test('ageRange'), // Use global rule
})

const { handleSubmit, errors } = useForm({
  validationSchema: registrationSchema,
})
```

### 6.3.3 Parameterized global rules
```ts
// Rule that accepts parameters
defineRule('maxLength', (value: string, [max]: [number]) => {
  if (!value) return true
  return value.length <= max ? true : `Max ${max} characters`
})

// Use with parameters
const schema = yup.object({
  username: yup.string().test('maxLength', [20]),
  bio: yup.string().test('maxLength', [500]),
})
```

### 6.3.4 Combining Yup rules with defineRule
```ts
// Sometimes Yup + defineRule together is cleaner
defineRule('noSpaces', (value: string) => {
  return !value.includes(' ') ? true : 'No spaces allowed'
})

const schema = yup.object({
  slug: yup
    .string()
    .required('Slug required')
    .matches(/^[a-z0-9-]+$/, 'Lowercase, numbers, hyphens only')
    .test('noSpaces'), // Additional check
})
```

## 7) Integration with Pinia

### 7.1 Form state in store
```ts
// formStore.ts
import { defineStore } from 'pinia'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

export const useFormStore = defineStore('form', () => {
  const validationSchema = yup.object({
    email: yup.string().email().required(),
    message: yup.string().required(),
  })

  const { handleSubmit, errors, values } = useForm({
    validationSchema,
  })

  const submitForm = handleSubmit(async (formValues) => {
    // Submit to API via store
    await submitContactForm(formValues)
  })

  return { errors, values, submitForm }
})
```

### 7.2 Using store in component
```ts
<script setup lang="ts">
import { useFormStore } from '@/stores/formStore'

const formStore = useFormStore()
</script>

<template>
  <form @submit="formStore.submitForm">
    <input v-model="formStore.values.email" type="email" />
    <span v-if="formStore.errors.email">{{ formStore.errors.email }}</span>

    <textarea v-model="formStore.values.message"></textarea>
    <span v-if="formStore.errors.message">{{ formStore.errors.message }}</span>

    <button type="submit">Send</button>
  </form>
</template>
```

## 8) TypeScript Support

### 8.1 Typed form values
```ts
interface ContactForm {
  email: string
  name: string
  message: string
}

const validationSchema = yup.object<ContactForm>({
  email: yup.string().email().required(),
  name: yup.string().required(),
  message: yup.string().min(10).required(),
})

const { handleSubmit, values } = useForm<ContactForm>({
  validationSchema,
})

// values is now typed as ContactForm
const onSubmit = handleSubmit((values: ContactForm) => {
  console.log(values.email) // ✅ autocomplete works
})
```

## 9) Common Patterns

### 9.1 Dynamic field validation
```ts
const { validateField, setFieldError } = useForm({ validationSchema })

// Validate on demand
await validateField('email')

// Manually set error
setFieldError('email', 'Email already exists')
```

### 9.2 Show errors on blur
```ts
<input
  v-model="email"
  @blur="validateField('email')"
  placeholder="Email"
>
<span v-if="errors.email">{{ errors.email }}</span>
```

### 9.3 Display all errors
```ts
<div v-if="Object.keys(errors).length">
  <p v-for="(error, field) in errors" :key="field">
    <strong>{{ field }}:</strong> {{ error }}
  </p>
</div>
```

## 10) Best Practices

- **Centralize schemas**: Define validation in a separate `schemas/` folder
- **Reuse field wrappers**: Build `FormField` component once, use everywhere
- **Validate on submit**: Avoid over-validating on every keystroke
- **Show progress**: Use step indicators in multi-step forms
- **Type everything**: Use TypeScript for schema and form values
- **Test async validators**: Mock API calls in unit tests

> ⚠️ CRITICAL: Never trust client-side validation alone. Always validate on the server as well.

## 11) Practice Ideas

- Build a registration form with async email check
- Create a multi-step wizard with per-step validation
- Implement a dynamic form builder that adds/removes fields
- Build a form with conditional validation (field depends on another)
