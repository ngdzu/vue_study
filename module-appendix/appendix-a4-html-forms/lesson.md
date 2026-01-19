# HTML Forms: Semantics, Validation, and Accessibility

HTML forms are the foundation of web interaction. Understanding them deeply enables building accessible, performant forms with minimal JavaScript.

> 💡 IMPORTANT: ~80% of form functionality can be achieved with semantic HTML alone. JavaScript is often used for progressive enhancement, not replacement.

## 🎨 Interactive Demo

**[Open Interactive Demo](./demos/index.html)** — See all examples from this lesson in action! Try different input types, validation, checkboxes, dropdowns, and more in your browser.

## 1) Form Structure & Semantics

### 1.1 Basic form with semantic elements
```html
<form action="/submit" method="POST" novalidate>
  <fieldset>
    <legend>Contact Information</legend>
    
    <div>
      <label for="name">Full Name</label>
      <input id="name" type="text" name="name" required>
    </div>
    
    <div>
      <label for="email">Email</label>
      <input id="email" type="email" name="email" required>
    </div>
  </fieldset>
  
  <fieldset>
    <legend>Message</legend>
    <div>
      <label for="message">Your Message</label>
      <textarea id="message" name="message" rows="5" required></textarea>
    </div>
  </fieldset>
  
  <button type="submit">Send</button>
  <button type="reset">Clear</button>
</form>
```

**Key attributes**:
- `action`: URL to submit form data to
- `method`: GET or POST (POST for sensitive data)
- `novalidate`: Disable browser validation (use only if custom validation)
- `name`: Identifies the form (multiple forms on same page)

### 1.2 Form elements
```html
<!-- Input: text, email, password, number, date, etc. -->
<input type="text" name="username">

<!-- Textarea: multi-line text -->
<textarea name="bio"></textarea>

<!-- Select: dropdown list -->
<select name="category">
  <option value="">-- Choose --</option>
  <option value="bug">Bug Report</option>
  <option value="feature">Feature Request</option>
</select>

<!-- Checkbox: multiple selections -->
<input type="checkbox" name="agree" id="agree">
<label for="agree">I agree to terms</label>

<!-- Radio: single selection from group -->
<fieldset>
  <legend>Preferred contact</legend>
  <label>
    <input type="radio" name="contact" value="email"> Email
  </label>
  <label>
    <input type="radio" name="contact" value="phone"> Phone
  </label>
</fieldset>

<!-- Button types -->
<button type="submit">Submit</button>
<button type="reset">Reset</button>
<button type="button">Action</button>
```

## 2) Input Types

### 2.1 All modern input types
```html
<!-- Text inputs -->
<input type="text" placeholder="Free text">
<input type="email" placeholder="user@example.com">
<input type="password" placeholder="Secret">
<input type="search" placeholder="Search...">
<input type="url" placeholder="https://example.com">
<input type="tel" placeholder="(555) 123-4567">

<!-- Numeric inputs -->
<input type="number" min="1" max="100" step="5">
<input type="range" min="0" max="100">

<!-- Date/time inputs -->
<input type="date">
<input type="time">
<input type="datetime-local">
<input type="month">
<input type="week">

<!-- File upload -->
<input type="file" accept="image/*" multiple>

<!-- Color picker -->
<input type="color">

<!-- Hidden field (not displayed) -->
<input type="hidden" name="csrf_token" value="abc123">
```

### 2.2 Input type validation
```html
<!-- Browser validates format automatically -->
<input type="email" required>
<!-- Invalid: "notanemail" ❌ -->
<!-- Valid: "user@example.com" ✅ -->

<input type="url" required>
<!-- Invalid: "not a url" ❌ -->
<!-- Valid: "https://example.com" ✅ -->

<input type="number" min="0" max="100">
<!-- Invalid: 150 (exceeds max) ❌ -->
<!-- Valid: 50 ✅ -->

<input type="date" min="2024-01-01">
<!-- Invalid: 2023-12-01 (before min) ❌ -->
<!-- Valid: 2024-06-15 ✅ -->
```

### 2.2.1 `inputmode` (mobile keyboard hints)
```html
<!-- `inputmode` changes the keyboard layout on mobile; it does NOT validate input -->
<input
  type="tel"
  name="phone"
  inputmode="tel"
  pattern="\+?[0-9\-\s()]{7,20}"
  placeholder="+1 555-123-4567"
  required
>
```

> 💡 IMPORTANT: `inputmode` only influences the on-screen keyboard. Pair it with `pattern` (and `title`) if you want format hints or validation; use JavaScript filtering only when you must block specific characters.

### 2.3 Input attributes cheatsheet

| Attribute      | Works With                                                         | Purpose                                    | Example                                        |
| -------------- | ------------------------------------------------------------------ | ------------------------------------------ | ---------------------------------------------- |
| `type`         | all                                                                | Defines input kind                         | `type="email"`                                 |
| `name`         | all                                                                | Field identifier in form submission        | `name="username"`                              |
| `id`           | all                                                                | Unique element identifier (for labels)     | `id="user"`                                    |
| `value`        | all                                                                | Pre-filled or default value                | `value="John"`                                 |
| `placeholder`  | text, email, password, search, tel, url                            | Gray hint text                             | `placeholder="Enter email"`                    |
| `required`     | all                                                                | Field mandatory                            | `required`                                     |
| `disabled`     | all                                                                | Field cannot be edited/submitted           | `disabled`                                     |
| `readonly`     | all                                                                | Field displays but not editable            | `readonly`                                     |
| `minlength`    | text, email, password, search, tel, url, textarea                  | Minimum characters                         | `minlength="3"`                                |
| `maxlength`    | text, email, password, search, tel, url, textarea                  | Maximum characters                         | `maxlength="50"`                               |
| `min`          | number, date, time, datetime-local, month, week, range             | Minimum value                              | `min="0"` or `min="2024-01-01"`                |
| `max`          | number, date, time, datetime-local, month, week, range             | Maximum value                              | `max="100"` or `max="2024-12-31"`              |
| `step`         | number, date, time, datetime-local, month, week, range             | Increment/decrement value                  | `step="5"` or `step="900"`                     |
| `pattern`      | text, email, password, search, tel, url                            | Regex validation                           | `pattern="[A-Za-z0-9]+"`                       |
| `title`        | all                                                                | Tooltip on hover (especially for pattern)  | `title="Letters and numbers only"`             |
| `autocomplete` | all                                                                | Browser autocomplete hint                  | `autocomplete="email"` or `autocomplete="off"` |
| `autofocus`    | all                                                                | Focus on page load                         | `autofocus`                                    |
| `multiple`     | file, email                                                        | Allow multiple selections/values           | `multiple`                                     |
| `accept`       | file                                                               | File types allowed                         | `accept="image/*"` or `accept=".jpg,.png"`     |
| `list`         | text, email, password, search, tel, url, number, date, time, range | Links to `<datalist>` for suggestions      | `list="pet-list"`                              |
| `step`         | all numeric types                                                  | Allowed increments                         | `step="0.01"`                                  |
| `rows`         | textarea                                                           | Number of visible rows                     | `rows="5"`                                     |
| `cols`         | textarea                                                           | Number of visible columns                  | `cols="40"`                                    |
| `wrap`         | textarea                                                           | Text wrapping behavior                     | `wrap="hard"` or `wrap="soft"`                 |
| `spellcheck`   | text, textarea, email, search, tel, url                            | Enable spell check                         | `spellcheck="true"`                            |
| `inputmode`    | all                                                                | Mobile keyboard type                       | `inputmode="numeric"` or `inputmode="email"`   |
| `tabindex`     | all                                                                | Tab order (0=normal, -1=skip, 1+=explicit) | `tabindex="1"`                                 |

### 2.3.1 Input type reference

| Type             | Use Case                     | Example             | Browser Validation          |
| ---------------- | ---------------------------- | ------------------- | --------------------------- |
| `text`           | Generic text                 | username, name      | None                        |
| `email`          | Email address                | user@example.com    | Email format check          |
| `password`       | Secret text (masked)         | pwd123              | None                        |
| `number`         | Integer or decimal           | 42, 3.14            | Number format + min/max     |
| `range`          | Slider (0-100)               | price slider        | min/max/step validation     |
| `checkbox`       | Single boolean or group      | agree to terms      | None                        |
| `radio`          | Single choice from group     | gender: M/F/Other   | None                        |
| `date`           | Date picker (YYYY-MM-DD)     | 2024-01-15          | Date format + min/max       |
| `time`           | Time picker (HH:MM)          | 14:30               | Time format + min/max       |
| `datetime-local` | Date + time (no timezone)    | 2024-01-15T14:30    | Format + min/max            |
| `month`          | Month/year (YYYY-MM)         | 2024-01             | Format + min/max            |
| `week`           | Week of year (YYYY-Www)      | 2024-W03            | Format + min/max            |
| `file`           | File upload                  | document.pdf        | Accepts MIME types          |
| `color`          | Color picker (hex)           | #FF5733             | Hex color validation        |
| `search`         | Search query                 | "Vue 3 tutorial"    | None (same as text)         |
| `tel`            | Telephone number             | (555) 123-4567      | None (no strict validation) |
| `url`            | Web URL                      | https://example.com | URL format check            |
| `submit`         | Form submit button           | text: "Send"        | N/A                         |
| `reset`          | Form reset button            | text: "Clear"       | N/A                         |
| `button`         | Custom button                | text: "Click me"    | N/A                         |
| `hidden`         | Hidden field (not displayed) | csrf_token          | N/A                         |

## 3) Validation Attributes

### 3.1 Native validation
```html
<!-- Required field -->
<input type="email" required>

<!-- Pattern matching (regex) -->
<input 
  type="text" 
  pattern="[A-Za-z0-9\-]+"
  title="Username: letters, numbers, hyphens only"
>

<!-- Min/max length -->
<input type="text" minlength="3" maxlength="20">

<!-- Min/max value (numbers, dates) -->
<input type="number" min="0" max="100">
<input type="date" min="2024-01-01" max="2024-12-31">

<!-- Step (numbers, dates) -->
<input type="number" step="5"> <!-- 0, 5, 10, 15... -->
<input type="time" step="900"> <!-- 15-minute increments -->

<!-- Multiple selections (file, email) -->
<input type="file" multiple>
<input type="email" multiple> <!-- comma-separated emails -->

<!-- Disabled field -->
<input type="text" disabled>

<!-- Read-only field -->
<input type="text" readonly>
```

### 3.2 Validation feedback
```html
<form>
  <input 
    type="email" 
    required
    oninvalid="this.setCustomValidity('Please enter a valid email')"
    oninput="this.setCustomValidity('')"
  >
  <button type="submit">Submit</button>
</form>
```

> ⚠️ CRITICAL: Browser shows validation errors automatically. Don't suppress them—style them instead.

## 4) Form Submission & FormData

### 4.1 Server-side form submission
```html
<form action="/api/contact" method="POST">
  <input type="text" name="name" required>
  <input type="email" name="email" required>
  <textarea name="message" required></textarea>
  <button type="submit">Send</button>
</form>
```

### 4.2 FormData API (with JavaScript)
```ts
const form = document.querySelector('form')

form.addEventListener('submit', (e) => {
  e.preventDefault()
  
  // Collect form data
  const formData = new FormData(form)
  
  // Access individual values
  console.log(formData.get('name'))
  
  // Send via fetch
  fetch('/api/contact', {
    method: 'POST',
    body: formData, // Automatically serializes
  })
})
```

### 4.3 Accessing form values with Vue
```vue
<script setup lang="ts">
import { reactive } from 'vue'

const formData = reactive({
  name: '',
  email: '',
  message: '',
})

const handleSubmit = () => {
  console.log('Submitted:', formData)
  // Send to API
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="formData.name" type="text" required>
    <input v-model="formData.email" type="email" required>
    <textarea v-model="formData.message" required></textarea>
    <button type="submit">Send</button>
  </form>
</template>
```

## 5) Accessibility (a11y)

### 5.1 Labels and `for` attribute
```html
<!-- ✅ Proper: label associated with input -->
<label for="username">Username</label>
<input id="username" type="text" name="username">

<!-- ❌ Poor: label text not linked -->
<label>Username</label>
<input type="text" name="username">

<!-- ✅ Alt: label wraps input -->
<label>
  Username
  <input type="text" name="username">
</label>
```

**Why this matters**: Screen readers announce the label when input is focused.

### 5.2 ARIA attributes
```html
<!-- aria-label: label for screen readers (when no visible label) -->
<button aria-label="Close menu">✕</button>

<!-- aria-describedby: additional description -->
<input 
  id="password"
  type="password"
  aria-describedby="pwd-hint"
>
<small id="pwd-hint">Min 8 characters, 1 uppercase, 1 number</small>

<!-- aria-invalid: indicate field error state -->
<input id="email" type="email" aria-invalid="true">
<span id="email-error">Invalid email format</span>

<!-- aria-required: emphasize required field -->
<input type="text" required aria-required="true">
```

### 5.3 Keyboard navigation
```html
<!-- tabindex: control tab order (use sparingly) -->
<!-- 0 = default order, 1-32768 = explicit order, -1 = not tabbable -->
<input tabindex="1" type="text">
<input tabindex="2" type="email">

<!-- Fieldset groups related inputs -->
<fieldset>
  <legend>Billing Address</legend>
  <input type="text" placeholder="Street">
  <input type="text" placeholder="City">
</fieldset>
```

## 6) Form Groups with Fieldset

### 6.1 Semantic grouping
```html
<form>
  <fieldset>
    <legend>Shipping Info</legend>
    <input type="text" placeholder="Address">
    <input type="text" placeholder="City">
  </fieldset>
  
  <fieldset>
    <legend>Billing Info</legend>
    <input type="checkbox" id="same"> 
    <label for="same">Same as shipping</label>
  </fieldset>
</form>
```

**Benefits**:
- Screen readers announce fieldset groupings
- Visually groups related fields
- Disabling fieldset disables all contained inputs

## 7) Select and Datalist

### 7.1 Select dropdown
```html
<!-- Basic select -->
<select name="country" required>
  <option value="">-- Select --</option>
  <option value="us">United States</option>
  <option value="uk">United Kingdom</option>
  <option value="ca">Canada</option>
</select>

<!-- Grouped options -->
<select name="restaurant">
  <optgroup label="Italian">
    <option>Pizza House</option>
    <option>Pasta Kingdom</option>
  </optgroup>
  <optgroup label="Chinese">
    <option>Golden Dragon</option>
  </optgroup>
</select>

<!-- Multi-select -->
<select name="skills" multiple size="4">
  <option>Vue</option>
  <option>React</option>
  <option>Angular</option>
</select>
```

### 7.2 Datalist (autocomplete)
```html
<!-- Input with suggestions -->
<input 
  type="text" 
  name="pet" 
  list="pet-list"
  placeholder="Type pet name"
>
<datalist id="pet-list">
  <option value="Cat">
  <option value="Dog">
  <option value="Parrot">
  <option value="Hamster">
</datalist>

<!-- User can type custom value or select from list -->
```

## 8) Best Practices

### 8.1 Progressive enhancement
```html
<!-- Form works without JavaScript -->
<form action="/api/submit" method="POST">
  <input type="email" name="email" required>
  <button type="submit">Subscribe</button>
</form>

<!-- JavaScript enhances with custom validation -->
<script>
const form = document.querySelector('form')
form.addEventListener('submit', async (e) => {
  e.preventDefault()
  // Custom validation, formatting, etc.
  await fetch(form.action, { method: form.method, body: new FormData(form) })
})
</script>
```

### 8.2 Inline validation feedback
```html
<style>
input:invalid { border-color: red; }
input:valid { border-color: green; }
</style>

<input type="email" required>
<!-- Browser shows red border if invalid ✅ -->
```

### 8.3 Disable submit during submission
```vue
<script setup lang="ts">
import { ref } from 'vue'

const isSubmitting = ref(false)

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    await fetch('/api/submit', { method: 'POST' })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input type="email" required>
    <button type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Sending...' : 'Send' }}
    </button>
  </form>
</template>
```

## 9) Common Patterns in Vue

### 9.1 Form with Vue and native validation
```vue
<script setup lang="ts">
import { ref } from 'vue'

const form = ref<HTMLFormElement>()
const formData = ref({ email: '', message: '' })

const handleSubmit = async () => {
  if (!form.value?.checkValidity()) {
    form.value?.reportValidity() // Show browser error messages
    return
  }

  // Submit
  await fetch('/api/contact', {
    method: 'POST',
    body: JSON.stringify(formData.value),
  })
}
</script>

<template>
  <form ref="form" @submit.prevent="handleSubmit">
    <input v-model="formData.email" type="email" required>
    <textarea v-model="formData.message" required></textarea>
    <button type="submit">Send</button>
  </form>
</template>
```

### 9.2 Custom validation with Vue
```vue
<script setup lang="ts">
const email = ref('')

const emailError = computed(() => {
  if (!email.value) return ''
  if (!email.value.includes('@')) return 'Must contain @'
  if (email.value.length > 100) return 'Too long'
  return ''
})
</script>

<template>
  <div>
    <input v-model="email" type="email">
    <span v-if="emailError" class="error">{{ emailError }}</span>
  </div>
</template>
```

## 10) Form Events

### 10.1 Available events for form elements

| Event         | Fires When                                      | Bubbles | Cancelable | Common Use                                     |
| ------------- | ----------------------------------------------- | ------- | ---------- | ---------------------------------------------- |
| `input`       | Value changes (typing, pasting, slider drag)    | Yes     | No         | Real-time validation, character counter        |
| `change`      | Value changes AND element loses focus           | Yes     | No         | Save data after editing complete               |
| `beforeinput` | Before input is modified                        | Yes     | Yes        | Prevent certain characters, format input       |
| `focus`       | Element receives focus                          | No      | No         | Show hints, highlight field                    |
| `blur`        | Element loses focus                             | No      | No         | Validate field, save draft                     |
| `focusin`     | Element receives focus (bubbles unlike `focus`) | Yes     | No         | Delegated focus handling                       |
| `focusout`    | Element loses focus (bubbles unlike `blur`)     | Yes     | No         | Delegated blur handling                        |
| `submit`      | Form is submitted (on `<form>`, not inputs)     | Yes     | Yes        | Validate, send via fetch, prevent default      |
| `reset`       | Form reset button clicked                       | Yes     | Yes        | Confirm before clearing, prevent default       |
| `invalid`     | Input fails validation on submit                | No      | Yes        | Custom error messages, prevent default message |
| `keydown`     | Key is pressed down                             | Yes     | Yes        | Keyboard shortcuts, prevent certain keys       |
| `keyup`       | Key is released                                 | Yes     | Yes        | Trigger search, check input after key release  |
| `click`       | Element is clicked                              | Yes     | Yes        | Toggle checkboxes, show/hide fields            |
| `dblclick`    | Element is double-clicked                       | Yes     | Yes        | Select all text                                |
| `select`      | Text is selected (text inputs/textarea)         | Yes     | No         | Copy selected text, show formatting toolbar    |
| `cut`         | Content is cut (Ctrl+X)                         | Yes     | Yes        | Track changes, prevent cutting                 |
| `copy`        | Content is copied (Ctrl+C)                      | Yes     | Yes        | Track copying, modify clipboard                |
| `paste`       | Content is pasted (Ctrl+V)                      | Yes     | Yes        | Format pasted text, prevent pasting            |
| `mouseenter`  | Mouse enters element (does not bubble)          | No      | No         | Show tooltips                                  |
| `mouseleave`  | Mouse leaves element (does not bubble)          | No      | No         | Hide tooltips                                  |

> 💡 IMPORTANT: Most commonly used for forms: `input`, `change`, `submit`, `blur`, `focus`.

### 10.2 Event examples

```ts
// Real-time validation with 'input'
input.addEventListener('input', (e) => {
  console.log('Current value:', e.target.value)
  // Validate as user types
})

// Save on 'change' (after editing complete)
input.addEventListener('change', (e) => {
  console.log('Final value:', e.target.value)
  // Save to localStorage, send to API
})

// Prevent form submission with 'submit'
form.addEventListener('submit', (e) => {
  e.preventDefault()
  // Custom validation, send via fetch
})

// Show hint on 'focus'
input.addEventListener('focus', () => {
  hint.style.display = 'block'
})

// Validate on 'blur'
input.addEventListener('blur', () => {
  if (!input.value) {
    showError('This field is required')
  }
})

// Custom error message with 'invalid'
input.addEventListener('invalid', (e) => {
  e.preventDefault() // Prevent default browser message
  showCustomError('Please enter a valid email')
})
```

## 11) Practice Ideas

- Build a multi-step form with fieldsets for each section
- Create a form with datalist autocomplete
- Implement conditional field visibility based on radio selection
- Build an accessible form with proper ARIA labels
- Create a form that works without JavaScript (progressive enhancement)
