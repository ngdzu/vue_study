# VeeValidate: Professional Form Validation

## What is VeeValidate?

VeeValidate is a form validation library for Vue 3 that **automates form state management**. Instead of manually tracking which fields have errors, whether the form is being submitted, and what validation rules apply, VeeValidate handles all of this for you.

Think of it as a bridge between your form inputs and validation logic. You define the rules once, and VeeValidate automatically:
- Tracks which fields are invalid
- Stores validation error messages
- Manages form submission state
- Handles field-level state (touched, dirty, etc.)

The best part? **You can use it with or without a schema validator** like Yup. You might start simple with manual validation functions and upgrade to Yup later as complexity grows.

> 💡 IMPORTANT: VeeValidate reduces form code by ~70% compared to manual validation. When paired with Yup, it reduces code another 50% by centralizing validation rules.

## 📑 Table of Contents

- [1) Setup and Installation](#1-setup-and-installation)
- [2) Manual Validation (No Yup) - The Verbose Way](#2-manual-validation-no-yup---the-verbose-way)
- [3) Custom Validators Without Yup](#3-custom-validators-without-yup)
- [3.3) Global Rules with defineRule](#33-global-rules-with-defirerule)
- [4) Introducing Yup - Schema-Based Validation](#4-introducing-yup---schema-based-validation-much-cleaner)
- [5) Form Component Wrapper with Yup](#5-form-component-wrapper-with-yup)
- [5.3) Component-Based API with v-slot](#53-component-based-api-with-v-slot)
- [6) Advanced: Multi-Step Forms](#6-advanced-multi-step-forms)
- [7) Async Validation (Server-Side Checks)](#7-async-validation-server-side-checks)
- [8) Custom Validators with Yup](#8-custom-validators-with-yup)
- [9) Integration with Pinia](#9-integration-with-pinia)
- [10) TypeScript Support](#10-typescript-support)
- [11) Common Patterns](#11-common-patterns)
- [12) Best Practices](#12-best-practices)
- [13) Practice Ideas](#13-practice-ideas)

## 1) Setup and Installation

### 1.1 Install VeeValidate (Yup optional)

VeeValidate is just a library—it has no dependencies on other validation tools. You install it as your base, then optionally add Yup later if you want schema-based validation.

```bash
# Just VeeValidate - for manual validation
npm install vee-validate

# Add Yup later when ready - for schema-based validation
npm install yup
```

### 1.2 Basic configuration (main.ts)

Unlike many libraries, VeeValidate **doesn't require a Vue plugin setup**. You simply import its composables (`useForm`, `useField`) directly in components where you need them. This is actually cleaner because you know exactly where validation is being used.

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

## 2) Manual Validation (No Yup) - The Verbose Way

Let's start with the "pure" approach: writing validation functions yourself. This shows what VeeValidate is abstracting away—it's verbose, but it teaches you what's happening under the hood.

### 2.1 Form with inline validation logic

When you have validation functions, you pass them to `useForm()` via the `validationSchema` object. VeeValidate will **call these functions automatically** whenever a field value changes, and collect any error messages.

> 💡 **Key Concepts:**
> - `validationSchema` is OPTIONAL (omit it if you manually set errors)
> - Field names in `validationSchema` must match names in `useField('name')`
> - YOU decide what fields to include based on your form's needs
> - Names can be anything: `email`, `firstName`, `zipCode`, `bio`, etc.

**How it works:**
1. Define validation functions that return either `true` (valid) or an error message string
2. Pass them to `useForm()` in a `validationSchema` object
3. VeeValidate runs these automatically and collects errors
4. Display errors in the template using `errors.email`, `errors.password`, etc.

**What is `useForm()`?**
`useForm()` returns an object with several properties. Here are the most important ones:
- `handleSubmit` — Function to run before submission (validates all fields first)
- `errors` — Object containing error messages for each field
- `values` — Object with current values for each field
- `touched` — Which fields has the user interacted with?
- `isSubmitting` — Boolean: is the form currently being submitted?

We **destructure** just the ones we need: `{ handleSubmit, errors }`. That's where `errors` comes from.

```ts
<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { ref } from 'vue'

// Step 1: Define validation functions
// Each function receives the field value and returns true or an error message
const validateEmail = (email: string) => {
  if (!email) return 'Email is required'
  if (!email.includes('@')) return 'Invalid email format'
  if (email.length < 5) return 'Email too short'
  return true // Valid
}

const validatePassword = (password: string) => {
  if (!password) return 'Password is required'
  if (password.length < 8) return 'Min 8 characters'
  if (!/[A-Z]/.test(password)) return 'Must contain uppercase letter'
  if (!/[0-9]/.test(password)) return 'Must contain number'
  return true // Valid
}

// Step 2: Initialize form with validation rules
const { handleSubmit, errors } = useForm({
  validationSchema: {
    email: validateEmail,      // VeeValidate calls this when email changes
    password: validatePassword, // VeeValidate calls this when password changes
  },
})

// Step 3: Get individual field values and bind them to inputs
// useField('fieldName') returns an object with reactive properties
// We destructure the 'value' property and rename it for convenience
const { value: email } = useField('email')
const { value: password } = useField('password')

// This is equivalent to:
// const emailField = useField('email')
// const email = emailField.value  // email is type string, not type email!
// const passwordField = useField('password')
// const password = passwordField.value

// Step 4: Handle form submission
// handleSubmit runs all validations before calling your function
const onSubmit = handleSubmit((values) => {
  // This only runs if ALL fields are valid
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
      <!-- errors.email contains the error message from validateEmail -->
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
      <!-- errors.password contains the error message from validatePassword -->
      <span v-if="errors.password" class="error">{{ errors.password }}</span>
    </div>

    <button type="submit">Submit</button>
  </form>
</template>

<style scoped>
.error { color: red; font-size: 0.875rem; }
</style>
```

**What's happening:**
- When user types in the email field, VeeValidate calls `validateEmail()` and stores the result in `errors.email`
- If it returns `true`, `errors.email` is cleared
- If it returns a string, that becomes the error message
- When user clicks Submit, `handleSubmit()` validates all fields before calling your callback

### Deep dive: Understanding `useField()` syntax

You might be confused by this line:
```ts
const { value: email } = useField('email')
```

**Let's break it down:**

**1. Is this TypeScript syntax?**

No! The `{ value: email }` part is **JavaScript destructuring**, not TypeScript. It works in both JavaScript and TypeScript. However, TypeScript adds optional type annotations.

**JavaScript version (works everywhere):**
```js
const { value: email } = useField('email')
// No types, just grab the value property and call it email
```

**TypeScript version (adds optional types):**
```ts
const { value: email }: { value: string } = useField('email')
// Same syntax, but with type annotation saying value is a string
```

**Or with a type for the whole object:**
```ts
interface FieldResult {
  value: string
  errors: string[]
  touched: boolean
}

const { value: email }: FieldResult = useField('email')
```

**In practice, you usually omit the types** and let TypeScript infer them:
```ts
const { value: email } = useField('email')  // TypeScript figures out email is string
```

**2. What does `useField('email')` return?**
An object with several properties:
```ts
{
  value: '',           // The current field value (string)
  errors: [],          // Array of error messages
  touched: false,      // Has user interacted with field?
  dirty: false,        // Has user changed the value?
  // ... other properties
}
```

**3. What is `{ value: email }` doing?**
This is **destructuring with renaming** (pure JavaScript). It means:
- Extract the `value` property from the object
- Rename it locally to `email` for convenience
- The `:` means "rename to", NOT "is type"

**4. So what type is `email`?**
It's a `string` (or whatever type of value gets stored), NOT a type called "email". The `email` is just a variable name, not a TypeScript type.

**This is equivalent to:**
```ts
const emailField = useField('email')
const email = emailField.value  // Just the value, renamed to 'email'
```

**5. What about other properties from `useField()`?**
You can destructure those too:
```ts
const { value: email, errors, touched } = useField('email')

// Now you have:
// - email: the current value
// - errors: array of error messages
// - touched: whether user has interacted
```

**6. Comparing destructuring syntaxes:**

```ts
// Rename: Extract and rename
const { value: email } = useField('email')
// email is now available

// No rename: Extract with same name
const { value } = useField('email')
// value is now available (same name as property)

// Rename with type (TypeScript only):
const { value: email }: { value: string } = useField('email')
// email is string type

// Multiple properties, some renamed:
const { value: email, errors, touched: hasTouched } = useField('email')
```

**The problem with this approach:** You're repeating validation logic in every form component. If you need the same email validation in a registration form and a profile form, you write it twice.

### 2.2 Validation object pattern

Instead of inline functions, organize them as an object. This is slightly cleaner but still scattered across components:

```ts
// Can organize validation functions in the component
const validationRules = {
  email: (email: string) => {
    if (!email) return 'Email is required'
    return email.includes('@') ? true : 'Invalid email'
  },
  
  username: (username: string) => {
    if (!username) return 'Username required'
    if (username.length < 3) return 'Min 3 chars'
    if (!/^[a-z0-9_]+$/i.test(username)) return 'Only letters, numbers, underscore'
    return true
  },
}

const { handleSubmit, errors } = useForm({
  validationSchema: validationRules, // Pass the whole object
})
```

**Still a problem:** You're still repeating these rules across multiple forms. Time to move to the next section.
<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { ref } from 'vue'

// Validation functions (manually defined)
const validateEmail = (email: string) => {
  if (!email) return 'Email is required'
  if (!email.includes('@')) return 'Invalid email format'
  if (email.length < 5) return 'Email too short'
  return true // Valid
}

const validatePassword = (password: string) => {
  if (!password) return 'Password is required'
  if (password.length < 8) return 'Min 8 characters'
  if (!/[A-Z]/.test(password)) return 'Must contain uppercase letter'
  if (!/[0-9]/.test(password)) return 'Must contain number'
  return true // Valid
}

// Initialize form with validation rules
const { handleSubmit, errors } = useForm({
  validationSchema: {
    email: validateEmail,
    password: validatePassword,
  },
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

<style scoped>
.error { color: red; font-size: 0.875rem; }
</style>
```

### 2.2 Validation object pattern
```ts
// Can organize validation functions
const validationRules = {
  email: (email: string) => {
    if (!email) return 'Email is required'
    return email.includes('@') ? true : 'Invalid email'
  },
  
  username: (username: string) => {
    if (!username) return 'Username required'
    if (username.length < 3) return 'Min 3 chars'
    if (!/^[a-z0-9_]+$/i.test(username)) return 'Only letters, numbers, underscore'
    return true
  },
}

const { handleSubmit, errors } = useForm({
  validationSchema: validationRules,
})
```

## 3) Custom Validators Without Yup

The previous section showed that repeating validation logic is painful. This section shows a better approach: **extract validators to a shared module** so you can import them into any form.

### 3.1 Reusable validator functions

Instead of writing `email` validation in every component, create a `validators.ts` file with all your common validators. This way they're DRY (Don't Repeat Yourself) and testable.

**Key insight:** Validators are just functions that take a value and return `true` or an error message. Nothing special. You can organize them however you want.

```ts
// validators.ts
// These are pure functions that can be reused anywhere

export const required = (fieldName: string) => (value: string) => {
  return value ? true : `${fieldName} is required`
}

export const minLength = (fieldName: string, min: number) => (value: string) => {
  return value.length >= min ? true : `${fieldName} must be at least ${min} chars`
}

export const pattern = (fieldName: string, regex: RegExp, message: string) => (value: string) => {
  return regex.test(value) ? true : message
}

export const email = (value: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? true : 'Invalid email'
}
```

Now these validators are **portable**—you can import them into any form component.

### 3.2 Using custom validators

Now when you need to validate a form, import the validators and use them. This is much cleaner than writing validation logic inside every component:

```ts
<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { required, minLength, pattern, email } from '@/validators'

// Use imported validators to build your form's validation schema
const { handleSubmit, errors } = useForm({
  validationSchema: {
    // Reuse the email validator here
    email: (value) => {
      if (!value) return 'Email required'
      return email(value) // Imported from validators.ts
    },
    
    // Write inline for form-specific logic
    password: (value) => {
      if (!value) return 'Password required'
      if (value.length < 8) return 'Min 8 chars'
      if (!/[A-Z]/.test(value)) return 'Must have uppercase'
      if (!/[0-9]/.test(value)) return 'Must have number'
      return true
    },
    
    // Combine multiple validators
    username: (value) => {
      if (!value) return 'Username required'
      const minCheck = minLength('Username', 3)(value)
      if (minCheck !== true) return minCheck
      const patternCheck = pattern('Username', /^[a-z0-9_]+$/i, 'Only letters, numbers, underscore')(value)
      return patternCheck
    },
  },
})

const { value: email } = useField('email')
const { value: password } = useField('password')
const { value: username } = useField('username')

const onSubmit = handleSubmit((values) => {
  console.log('Valid form:', values)
})
</script>

<template>
  <form @submit="onSubmit">
    <div>
      <label for="email">Email</label>
      <input id="email" v-model="email" type="email">
      <span v-if="errors.email" class="error">{{ errors.email }}</span>
    </div>

    <div>
      <label for="password">Password</label>
      <input id="password" v-model="password" type="password">
      <span v-if="errors.password" class="error">{{ errors.password }}</span>
    </div>

    <div>
      <label for="username">Username</label>
      <input id="username" v-model="username">
      <span v-if="errors.username" class="error">{{ errors.username }}</span>
    </div>

    <button type="submit">Submit</button>
  </form>
</template>
```

**Better, but still verbose.** You're combining multiple validators and still writing the composition logic inline for each field. This is where the next section helps.
<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { required, minLength, pattern, email } from '@/validators'

const { handleSubmit, errors } = useForm({
  validationSchema: {
    email: (value) => {
      if (!value) return 'Email required'
      return email(value) // Use reusable validator
    },
    
    password: (value) => {
      if (!value) return 'Password required'
      if (value.length < 8) return 'Min 8 chars'
      if (!/[A-Z]/.test(value)) return 'Must have uppercase'
      if (!/[0-9]/.test(value)) return 'Must have number'
      return true
    },
    
    username: (value) => {
      if (!value) return 'Username required'
      const minCheck = minLength('Username', 3)(value)
      if (minCheck !== true) return minCheck
      const patternCheck = pattern('Username', /^[a-z0-9_]+$/i, 'Only letters, numbers, underscore')(value)
      return patternCheck
    },
  },
})

const { value: email } = useField('email')
const { value: password } = useField('password')
const { value: username } = useField('username')

const onSubmit = handleSubmit((values) => {
  console.log('Valid form:', values)
})
</script>

<template>
  <form @submit="onSubmit">
    <div>
      <label for="email">Email</label>
      <input id="email" v-model="email" type="email">
      <span v-if="errors.email" class="error">{{ errors.email }}</span>
    </div>

    <div>
      <label for="password">Password</label>
      <input id="password" v-model="password" type="password">
      <span v-if="errors.password" class="error">{{ errors.password }}</span>
    </div>

    <div>
      <label for="username">Username</label>
      <input id="username" v-model="username">
      <span v-if="errors.username" class="error">{{ errors.username }}</span>
    </div>

    <button type="submit">Submit</button>
  </form>
</template>
```

### 3.3 Global Rules with defineRule

We solved repetition by extracting validators to a file. But you still had to compose them in every form. **`defineRule()` registers validators globally** so you can reference them by name in ANY form, just like built-in HTML5 validators.

**How it works:**
1. In `main.ts` (or a setup file), call `defineRule()` to register validators
2. VeeValidate stores them globally
3. In any component's `validationSchema`, reference them by string name
4. VeeValidate automatically finds and runs them

This is the "middle ground" between fully manual validation and full Yup schemas.

#### 3.3.1 Define global rules (main.ts)

Register all your common validators in one place on app startup:

```ts
import { defineRule } from 'vee-validate'

// Email validation rule
// After this, you can use 'email' rule in any form
defineRule('email', (value: string) => {
  if (!value) return 'Email is required'
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? true : 'Invalid email format'
})

// Strong password rule
// Use it in forms with: password: 'strongPassword'
defineRule('strongPassword', (value: string) => {
  if (!value) return 'Password is required'
  if (value.length < 8) return 'Min 8 characters'
  if (!/[A-Z]/.test(value)) return 'Must contain uppercase letter'
  if (!/[0-9]/.test(value)) return 'Must contain number'
  return true
})

// Username rule
defineRule('username', (value: string) => {
  if (!value) return 'Username is required'
  if (value.length < 3) return 'Min 3 characters'
  if (!/^[a-z0-9_]+$/i.test(value)) return 'Only letters, numbers, underscore'
  return true
})
```

#### 3.3.2 Use global rules in forms

Now in any component, reference the rules by name as strings. Much cleaner!

```ts
<script setup lang="ts">
import { useForm, useField } from 'vee-validate'

// VeeValidate finds these rule names globally
// No need to import anything or write validation logic
const { handleSubmit, errors } = useForm({
  validationSchema: {
    email: 'email',              // Use global 'email' rule
    password: 'strongPassword',  // Use global 'strongPassword' rule
    username: 'username',        // Use global 'username' rule
  },
})

const { value: email } = useField('email')
const { value: password } = useField('password')
const { value: username } = useField('username')

const onSubmit = handleSubmit((values) => {
  console.log('Valid form:', values)
})
</script>

<template>
  <form @submit="onSubmit">
    <div>
      <label for="email">Email</label>
      <input id="email" v-model="email" type="email">
      <span v-if="errors.email" class="error">{{ errors.email }}</span>
    </div>

    <div>
      <label for="password">Password</label>
      <input id="password" v-model="password" type="password">
      <span v-if="errors.password" class="error">{{ errors.password }}</span>
    </div>

    <div>
      <label for="username">Username</label>
      <input id="username" v-model="username">
      <span v-if="errors.username" class="error">{{ errors.username }}</span>
    </div>

    <button type="submit">Submit</button>
  </form>
</template>

<style scoped>
.error { color: red; font-size: 0.875rem; }
</style>
```

**Compare to section 3.2:** Much simpler! No imports needed, no composition logic. Just reference rule names as strings.

#### 3.3.3 Parameterized global rules

Sometimes you need validators with options (like "min 3 chars", "max 20 chars"). `defineRule` supports parameters:

```ts
import { defineRule } from 'vee-validate'

// Rule that accepts a min length parameter
defineRule('minLength', (value: string, [min]: [number]) => {
  if (!value) return true // Use 'required' separately
  return value.length >= min ? true : `Min ${min} characters`
})

// Rule that accepts a max length parameter
defineRule('maxLength', (value: string, [max]: [number]) => {
  if (!value) return true
  return value.length <= max ? true : `Max ${max} characters`
})

// Use with parameters in validationSchema
const { handleSubmit, errors } = useForm({
  validationSchema: {
    username: (value) => {
      const minCheck = defineRule('minLength')(value, [3])
      if (minCheck !== true) return minCheck
      return defineRule('maxLength')(value, [20])
    },
    bio: (value) => defineRule('maxLength')(value, [500]),
  },
})
```

#### 3.3.4 When to use defineRule vs Yup

| Scenario                       | Use defineRule                | Use Yup            |
| ------------------------------ | ----------------------------- | ------------------ |
| Simple 1-2 field form          | ✅ Faster setup                | Over-engineered    |
| Complex nested forms           | ❌ Gets messy                  | ✅ Clean schema     |
| Reusable validators across app | ✅ Define once, use everywhere | ✅ Also works       |
| Need async validation          | ✅ Supported                   | ✅ Preferred        |
| Team familiar with schemas     | ❌ No                          | ✅ Yes              |
| Switching validators later     | ✅ Easy to refactor            | ✅ Easy to refactor |

> 💡 **TIP:** Start with `defineRule` for simple forms. Migrate to Yup when validation logic grows complex or you need schema composition.

**At this point, you've learned three approaches:**
1. Manual functions (Sections 2-3.2) — Verbose, repetitive
2. Global rules via `defineRule` (Section 3.3) — Clean, reusable, still imperative
3. Yup schemas (Next section) — Most concise, most powerful for complex forms

**Which should you use?** Start with `defineRule` for most projects. Only add Yup when you need schema composition or working with teams that prefer declarative validation.

## 4) Introducing Yup - Schema-Based Validation (Much Cleaner!)

By now, you understand the progression:
- **Section 2:** Manual functions (repetitive)
- **Section 3:** Global `defineRule` (better, but still imperative)
- **Section 4:** Yup schemas (declarative, composable, powerful)

Yup is a **schema validation library**. Instead of writing validation functions, you **describe what the data should look like** and Yup validates against that description. It's more concise and easier to compose.

### Why move to Yup?

Look at this problem from section 3.3:
```ts
// Multiple validators combined for one field
username: (value) => {
  const minCheck = defineRule('minLength')(value, [3])
  if (minCheck !== true) return minCheck
  return defineRule('maxLength')(value, [20])
}
```

With Yup, it becomes:
```ts
username: yup
  .string()
  .min(3, 'Min 3 characters')
  .max(20, 'Max 20 characters')
```

**Much more readable!** You're describing the shape of valid data, not imperating how to validate it.

### 4.1 Same form with Yup schema

Let's build the same form from sections 2-3, but with Yup. Watch how much cleaner it becomes:

```ts
<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

// Define a SCHEMA - a description of what valid data looks like
// No functions, just chainable methods
const validationSchema = yup.object({
  // email field: must be a string, required, and valid email format
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email'),
  
  // password field: must be a string with multiple constraints
  password: yup
    .string()
    .required('Password required')
    .min(8, 'Min 8 characters')
    .matches(/[A-Z]/, 'Must contain uppercase')
    .matches(/[0-9]/, 'Must contain number'),
  
  // username field: multiple constraints chained together
  username: yup
    .string()
    .required('Username required')
    .min(3, 'Min 3 characters')
    .matches(/^[a-z0-9_]+$/i, 'Only letters, numbers, underscore'),
})

// Pass the schema to useForm - much simpler than before
const { handleSubmit, errors } = useForm({
  validationSchema,
})

const { value: email } = useField('email')
const { value: password } = useField('password')
const { value: username } = useField('username')

const onSubmit = handleSubmit((values) => {
  console.log('Valid form:', values)
})
</script>

<template>
  <form @submit="onSubmit">
    <div>
      <label for="email">Email</label>
      <input id="email" v-model="email" type="email">
      <span v-if="errors.email" class="error">{{ errors.email }}</span>
    </div>

    <div>
      <label for="password">Password</label>
      <input id="password" v-model="password" type="password">
      <span v-if="errors.password" class="error">{{ errors.password }}</span>
    </div>

    <div>
      <label for="username">Username</label>
      <input id="username" v-model="username">
      <span v-if="errors.username" class="error">{{ errors.username }}</span>
    </div>

    <button type="submit">Submit</button>
  </form>
</template>
```

### 4.2 Comparison: Manual vs Yup

| Aspect         | Manual (Section 2)      | defineRule (Section 3.3) | Yup Schema            |
| -------------- | ----------------------- | ------------------------ | --------------------- |
| Lines of code  | ~50                     | ~30                      | ~15                   |
| Error messages | Hard-coded in functions | Defined with rules       | Declarative in chain  |
| Reusability    | Must extract to file    | Global, reusable         | Reusable schemas      |
| Readability    | Imperative, verbose     | Better                   | Declarative, clean    |
| Composition    | Manual combining        | Limited                  | Chainable, composable |
| Type inference | Manual                  | Manual                   | Automatic with TS     |

> 💡 **Why the lesson structure:** Now you understand why each step exists. You've seen the problem (verbose functions), the middle ground (global rules), and the solution (Yup). This makes Yup feel like a natural evolution, not just "another tool."

## 5) Form Component Wrapper with Yup

### 5.1 Reusable FormField component
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

### 5.2 Using the wrapper
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

## 5.3) Component-Based API with v-slot

So far, we've used **composables** (`useForm`, `useField`). VeeValidate also provides a **component-based API** using `<Form>` and `<Field>` components with **v-slot**. This is an alternative approach that feels more declarative.

### Why two approaches?

**Composables** (sections 2-5.2):
- More control and flexibility
- Better for complex logic
- More explicit data flow
- Easier to understand what's happening

**Components with v-slot** (this section):
- More concise for simple forms
- Less boilerplate
- More Vue-like pattern
- Automatic context binding

**Use composables** for most projects. Use components when you want more declarative, Vue-template-based forms.

### 5.3.1 Basic component-based form

```ts
<script setup lang="ts">
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'

const validationSchema = yup.object({
  email: yup.string().email().required('Email required'),
  password: yup.string().min(8).required('Password required'),
})

// With components, you don't need useForm!
// Just pass schema to <Form>
const onSubmit = (values) => {
  console.log('Form submitted:', values)
}
</script>

<template>
  <!-- <Form> component wraps the form, provides validation context -->
  <Form @submit="onSubmit" :validation-schema="validationSchema">
    <!-- v-slot="{ errors }" gives you access to errors -->
    <template v-slot="{ errors, isSubmitting }">
      <div>
        <!-- <Field> component wraps inputs, manages field state -->
        <!-- v-slot="{ field, errors }" gives you the field binding and errors -->
        <Field name="email" v-slot="{ field, errors }">
          <div>
            <label>Email</label>
            <!-- v-bind="field" binds value, @input, etc. automatically -->
            <input
              v-bind="field"
              type="email"
              placeholder="Enter email"
            >
            <!-- Show errors from this specific field -->
            <span v-if="errors.length" class="error">{{ errors[0] }}</span>
          </div>
        </Field>

        <Field name="password" v-slot="{ field }">
          <div>
            <label>Password</label>
            <input
              v-bind="field"
              type="password"
              placeholder="Enter password"
            >
            <!-- Alternatively, use <ErrorMessage> component -->
            <ErrorMessage name="password" as="span" class="error" />
          </div>
        </Field>

        <button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Submitting...' : 'Submit' }}
        </button>
      </div>
    </template>
  </Form>
</template>

<style scoped>
.error { color: red; font-size: 0.875rem; }
</style>
```

**Key differences from composable approach:**
- No `useForm()` call needed
- No `useField()` calls
- Pass validation to `<Form>` via `:validation-schema`
- `v-slot` gives you reactive properties
- `v-bind="field"` binds all properties automatically

### 5.3.2 Understanding v-slot slot scope

The `v-slot="{ ... }"` syntax is Vue's scoped slot feature. It gives you access to data provided by the component.

**What `<Form>` provides in its slot scope:**
```ts
{
  errors: {},           // Object with field errors
  isSubmitting: false,  // Is form currently submitting?
  values: {},           // Current form values
  meta: {...},          // Metadata (valid, dirty, touched)
  handleSubmit: fn,     // Submit handler (if you need it)
}
```

**What `<Field>` provides in its slot scope:**
```ts
{
  field: {
    name: 'email',      // Field name
    value: '',          // Current value
    onBlur: fn,         // Blur handler
    onInput: fn,        // Input handler
    onChange: fn,       // Change handler
  },
  errors: [],           // Errors for this field
  meta: {...},          // Field metadata
}
```

The `v-bind="field"` is a shortcut that binds all the properties at once.

### 5.3.3 ErrorMessage component

Instead of manually showing errors in the slot, you can use `<ErrorMessage>`:

```ts
<Field name="email">
  <!-- Option 1: Show errors in v-slot -->
  <template v-slot="{ field, errors }">
    <input v-bind="field" />
    <span v-if="errors.length">{{ errors[0] }}</span>
  </template>
</Field>

<!-- Option 2: Use ErrorMessage component (cleaner!) -->
<Field name="email" v-slot="{ field }">
  <input v-bind="field" />
  <ErrorMessage name="email" as="span" class="error" />
</Field>

<!-- Option 3: ErrorMessage standalone (works outside Field too) -->
<Field name="email" v-slot="{ field }">
  <input v-bind="field" />
</Field>
<ErrorMessage name="email" />
```

### 5.3.4 Comparison: Composables vs Components

| Aspect               | Composables (useForm)           | Components (<Form>, <Field>)       |
| -------------------- | ------------------------------- | ---------------------------------- |
| **Setup complexity** | Import composables, destructure | Import components, use in template |
| **Boilerplate**      | More setup code                 | Less code                          |
| **Flexibility**      | Full control                    | Less flexible                      |
| **Form submission**  | Handle manually                 | Automatic via `@submit`            |
| **Error display**    | Manual v-if checks              | ErrorMessage component             |
| **Learning curve**   | Steeper (understand hooks)      | Easier (Vue patterns)              |
| **Best for**         | Complex logic, custom patterns  | Simple forms, quick builds         |
| **Type safety**      | Good (composable types)         | Good (props typing)                |

### 5.3.5 Component API with custom wrapper

You can still create reusable field components with the component API:

```ts
<!-- FormField.vue -->
<script setup lang="ts">
import { Field, ErrorMessage } from 'vee-validate'

interface Props {
  name: string
  label?: string
  type?: string
  placeholder?: string
}

defineProps<Props>()
</script>

<template>
  <Field :name="name" v-slot="{ field }">
    <div class="form-group">
      <label v-if="label" :for="name">{{ label }}</label>
      <input
        v-bind="field"
        :id="name"
        :type="type || 'text'"
        :placeholder="placeholder"
      >
      <ErrorMessage :name="name" as="span" class="error" />
    </div>
  </Field>
</template>

<style scoped>
.form-group { margin-bottom: 1rem; }
input { width: 100%; padding: 0.5rem; }
.error { color: red; font-size: 0.875rem; }
</style>
```

Using the wrapper:

```ts
<script setup lang="ts">
import { Form } from 'vee-validate'
import * as yup from 'yup'
import FormField from './FormField.vue'

const schema = yup.object({
  name: yup.string().required('Name required'),
  email: yup.string().email().required('Email required'),
})

const onSubmit = (values) => console.log(values)
</script>

<template>
  <Form @submit="onSubmit" :validation-schema="schema">
    <FormField name="name" label="Name" />
    <FormField name="email" type="email" label="Email" />
    <button type="submit">Submit</button>
  </Form>
</template>
```

Much cleaner! The component API shines when you build reusable field components.

### 5.3.6 Component API with Yup schema

The component API works seamlessly with Yup:

```ts
<script setup lang="ts">
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'

const schema = yup.object({
  email: yup
    .string()
    .email('Invalid email')
    .required('Email required'),
  
  password: yup
    .string()
    .min(8, 'Min 8 characters')
    .matches(/[A-Z]/, 'Must have uppercase')
    .matches(/[0-9]/, 'Must have number')
    .required('Password required'),
  
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password'),
})

const onSubmit = (values) => {
  console.log('Valid form:', values)
}
</script>

<template>
  <Form @submit="onSubmit" :validation-schema="schema">
    <div>
      <Field name="email" v-slot="{ field }">
        <input v-bind="field" type="email" placeholder="Email" />
        <ErrorMessage name="email" />
      </Field>

      <Field name="password" v-slot="{ field }">
        <input v-bind="field" type="password" placeholder="Password" />
        <ErrorMessage name="password" />
      </Field>

      <Field name="confirmPassword" v-slot="{ field }">
        <input v-bind="field" type="password" placeholder="Confirm password" />
        <ErrorMessage name="confirmPassword" />
      </Field>

      <button type="submit">Sign Up</button>
    </div>
  </Form>
</template>
```

### 5.3.7 Which API should you use?

**Use composables** if you:
- Need complex form logic
- Want explicit control over validation
- Are building a form with many custom interactions
- Prefer hooks patterns

**Use components** if you:
- Building simple, straightforward forms
- Want less boilerplate
- Prefer Vue template patterns
- Are creating a library of reusable field components

**Pro tip:** You can **mix both**! Some fields can use `useField()` for complex logic, others can use `<Field>` for simplicity.

```ts
<!-- Mix composable and component API in same form -->
<Form :validation-schema="schema">
  <!-- Simple field with component API -->
  <Field name="email" v-slot="{ field }">
    <input v-bind="field" />
  </Field>

  <!-- Complex field with composable API -->
  <div>
    <input v-model="customField.value" />
    <span>{{ customField.errors[0] }}</span>
  </div>
</Form>

<script setup>
// Composable API for complex field
const customField = useField('custom')
</script>
```



### 6.1 Step-by-step validation
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

## 7) Async Validation (Server-Side Checks)

### 7.1 Email uniqueness check
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

## 8) Custom Validators with Yup

### 8.1 Define custom rules
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

### 8.2 Reusable validation schema
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

### 8.3 Global custom rules with defineRule

#### 8.3.1 Define global rule once
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

#### 8.3.2 Using global rules in schemas
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

#### 8.3.3 Parameterized global rules
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

#### 8.3.4 Combining Yup rules with defineRule
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

## 9) Integration with Pinia

### 9.1 Form state in store
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

### 9.2 Using store in component
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

## 10) TypeScript Support

### 10.1 Typed form values
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

## 11) Common Patterns

### 11.1 Dynamic field validation
```ts
const { validateField, setFieldError } = useForm({ validationSchema })

// Validate on demand
await validateField('email')

// Manually set error
setFieldError('email', 'Email already exists')
```

### 11.2 Show errors on blur
```ts
<input
  v-model="email"
  @blur="validateField('email')"
  placeholder="Email"
>
<span v-if="errors.email">{{ errors.email }}</span>
```

### 11.3 Display all errors
```ts
<div v-if="Object.keys(errors).length">
  <p v-for="(error, field) in errors" :key="field">
    <strong>{{ field }}:</strong> {{ error }}
  </p>
</div>
```

## 12) Best Practices

- **Start manual, add Yup gradually**: Begin with VeeValidate alone, add Yup when complexity grows
- **Centralize schemas**: Define validation in a separate `schemas/` folder
- **Reuse field wrappers**: Build `FormField` component once, use everywhere
- **Validate on submit**: Avoid over-validating on every keystroke
- **Show progress**: Use step indicators in multi-step forms
- **Type everything**: Use TypeScript for schema and form values
- **Test async validators**: Mock API calls in unit tests

> ⚠️ CRITICAL: Never trust client-side validation alone. Always validate on the server as well.

## 13) Practice Ideas

- Build a simple form without Yup to understand VeeValidate basics
- Add Yup to that form and see how much code reduces
- Create a multi-step wizard with per-step validation
- Implement a dynamic form builder that adds/removes fields
- Build a form with conditional validation (field depends on another)
- Practice async validation with mock API calls
