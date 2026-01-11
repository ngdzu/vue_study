# Lesson 1.2 — Reactive Data & Data Binding

## Learning Goals
- Master `ref()` and `reactive()` for reactive state management
- Understand Vue's reactivity system and proxy-based tracking
- Use `computed()` properties for derived state
- Implement watchers for side effects with `watch()` and `watchEffect()`
- Leverage two-way binding with `v-model`
- Know when to use each reactivity primitive

## Prerequisites
- Completed Lesson 1.1 (Vue 3 Setup & Project Structure)
- Understanding of JavaScript references, objects, and primitives
- Basic TypeScript knowledge

## What You Will Build
A real-time form validator that demonstrates all major reactivity patterns: reactive primitives, computed values, watchers, and two-way binding.

---

## Vue's Reactivity System

Vue 3 uses **ES6 Proxies** to track dependencies and trigger updates automatically. When you modify reactive data, Vue knows which components depend on it and re-renders them efficiently.

### The Core Concept
```ts
// Regular JavaScript (not reactive)
let count = 0
count++ // DOM won't update

// Vue reactive primitive
import { ref } from 'vue'
const count = ref(0)
count.value++ // Vue detects change, updates DOM
```

**Key insight**: Vue wraps your data in a reactive proxy that intercepts reads (dependency tracking) and writes (triggering updates).

---

## ref() — Reactive Primitives

Use `ref()` for primitive values (strings, numbers, booleans) and when you need `.value` access in script.

### Basic Usage
```vue
<script setup lang="ts">
import { ref } from 'vue'

// Primitives
const count = ref(0)
const message = ref('Hello')
const isActive = ref(true)

// Arrays and objects work too
const items = ref<string[]>([])
const user = ref({ name: 'Alice', age: 30 })

// Modify via .value in script
count.value++
message.value = 'World'
items.value.push('new item')
user.value.name = 'Bob'
</script>

<template>
  <!-- No .value needed in templates -->
  <p>Count: {{ count }}</p>
  <p>Message: {{ message }}</p>
  <p>User: {{ user.name }}</p>
</template>
```

**Important**: 
- `.value` is required in `<script>`, but **not** in `<template>`
- Vue auto-unwraps refs in templates for convenience
- TypeScript infers types: `ref(0)` → `Ref<number>`

### Typed Refs
```ts
import { ref, Ref } from 'vue'

// Explicit typing
const count: Ref<number> = ref(0)

// Generic syntax (when initial value is null/undefined)
const user = ref<User | null>(null)

interface User {
  id: number
  name: string
  email: string
}
```

---

## reactive() — Reactive Objects

Use `reactive()` for objects when you want to access properties directly without `.value`.

### Basic Usage
```ts
<script setup lang="ts">
import { reactive } from 'vue'

const state = reactive({
  count: 0,
  message: 'Hello',
  user: {
    name: 'Alice',
    age: 30
  }
})

// No .value needed
state.count++
state.user.name = 'Bob'
</script>

<template>
  <p>Count: {{ state.count }}</p>
  <p>Name: {{ state.user.name }}</p>
</template>
```

### reactive() vs ref() for Objects

**Option 1: ref() with object**
```ts
const user = ref({ name: 'Alice', age: 30 })
user.value.name = 'Bob' // Need .value to access object
```

**Option 2: reactive() with object**
```ts
const user = reactive({ name: 'Alice', age: 30 })
user.name = 'Bob' // Direct access, no .value
```

**Recommendation**: Use `ref()` for primitives; use `reactive()` for complex objects. Prefer consistency in your codebase.

### Limitations of reactive()

**Cannot reassign reactive objects**:
```ts
let state = reactive({ count: 0 })
state = { count: 1 } // ❌ Breaks reactivity!

// Solution: use ref() if you need reassignment
const state = ref({ count: 0 })
state.value = { count: 1 } // ✅ Works
```

**Destructuring breaks reactivity**:
```ts
const state = reactive({ count: 0, name: 'Alice' })
let { count, name } = state // ❌ count and name are not reactive

// Solution: use toRefs()
import { toRefs } from 'vue'
const { count, name } = toRefs(state) // ✅ Preserves reactivity
```

---

## computed() — Derived State

Use `computed()` for values derived from other reactive data. Computed properties are **cached** and only recompute when dependencies change.

### Basic Usage
```ts
<script setup lang="ts">
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

// Computed property (cached)
const fullName = computed(() => {
  console.log('Computing full name...')
  return `${firstName.value} ${lastName.value}`
})

// Access like a ref
console.log(fullName.value) // Logs once
console.log(fullName.value) // Uses cached value, no log
</script>

<template>
  <!-- No .value in templates -->
  <p>Full name: {{ fullName }}</p>
</template>
```

### Computed vs Method

**Computed (cached)**:
```ts
const fullName = computed(() => `${firstName.value} ${lastName.value}`)
// Recomputes only when firstName or lastName changes
```

**Method (not cached)**:
```ts
const getFullName = () => `${firstName.value} ${lastName.value}`
// Runs every time it's called
```

**When to use computed**:
- Expensive calculations (filtering, sorting, transformations)
- Values used multiple times in template
- Dependencies are reactive data

### Writable Computed Properties

```ts
const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed({
  get() {
    return `${firstName.value} ${lastName.value}`
  },
  set(newValue: string) {
    const [first, last] = newValue.split(' ')
    firstName.value = first
    lastName.value = last
  }
})

// Read
console.log(fullName.value) // "John Doe"

// Write
fullName.value = 'Jane Smith' // Sets firstName and lastName
```

### Practical Example: Form Validation

```ts
<script setup lang="ts">
import { ref, computed } from 'vue'

const email = ref('')
const password = ref('')

const isEmailValid = computed(() => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
})

const isPasswordStrong = computed(() => {
  return password.value.length >= 8 && /[A-Z]/.test(password.value)
})

const isFormValid = computed(() => {
  return isEmailValid.value && isPasswordStrong.value
})
</script>

<template>
  <form>
    <input v-model="email" type="email" placeholder="Email">
    <span v-if="email && !isEmailValid" class="error">Invalid email</span>
    
    <input v-model="password" type="password" placeholder="Password">
    <span v-if="password && !isPasswordStrong" class="error">
      Password must be 8+ chars with uppercase
    </span>
    
    <button :disabled="!isFormValid">Submit</button>
  </form>
</template>
```

---

## watch() — Reactive Side Effects

Use `watch()` to perform side effects when reactive data changes (API calls, localStorage, logging, etc.).

### Basic Usage

```ts
import { ref, watch } from 'vue'

const count = ref(0)

// Watch a single ref
watch(count, (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`)
})

count.value++ // Logs: "Count changed from 0 to 1"
```

### Watching Multiple Sources

```ts
const firstName = ref('John')
const lastName = ref('Doe')

// Watch multiple refs
watch([firstName, lastName], ([newFirst, newLast], [oldFirst, oldLast]) => {
  console.log(`Name changed: ${newFirst} ${newLast}`)
})
```

### Watching Reactive Objects

```ts
const state = reactive({ count: 0, name: 'Alice' })

// Watch entire object (deep by default for reactive)
watch(state, (newState) => {
  console.log('State changed:', newState)
})

// Watch specific property
watch(() => state.count, (newCount) => {
  console.log('Count changed:', newCount)
})
```

### Watch Options

```ts
watch(source, callback, {
  immediate: true,  // Run callback immediately on mount
  deep: true,       // Watch nested properties (default for reactive)
  flush: 'post'     // Callback timing: 'pre' | 'post' | 'sync'
})
```

**Example with options**:
```ts
const user = ref({ name: 'Alice', profile: { age: 30 } })

watch(user, (newUser) => {
  localStorage.setItem('user', JSON.stringify(newUser))
}, { 
  deep: true,      // Watch nested properties
  immediate: true  // Save to localStorage on mount
})
```

### Practical Example: Debounced Search

```ts
<script setup lang="ts">
import { ref, watch } from 'vue'

const searchQuery = ref('')
const searchResults = ref<string[]>([])
const isLoading = ref(false)

let debounceTimer: number

watch(searchQuery, (newQuery) => {
  clearTimeout(debounceTimer)
  
  if (!newQuery) {
    searchResults.value = []
    return
  }
  
  isLoading.value = true
  
  debounceTimer = setTimeout(async () => {
    // Simulate API call
    const results = await fetch(`/api/search?q=${newQuery}`)
    searchResults.value = await results.json()
    isLoading.value = false
  }, 300)
})
</script>

<template>
  <input v-model="searchQuery" placeholder="Search...">
  <div v-if="isLoading">Loading...</div>
  <ul v-else>
    <li v-for="result in searchResults" :key="result">{{ result }}</li>
  </ul>
</template>
```

---

## watchEffect() — Auto-tracking Side Effects

`watchEffect()` automatically tracks all reactive dependencies used inside the callback.

### Basic Usage

```ts
import { ref, watchEffect } from 'vue'

const count = ref(0)
const multiplier = ref(2)

// Automatically tracks count and multiplier
watchEffect(() => {
  console.log(`Result: ${count.value * multiplier.value}`)
})

count.value++ // Logs: "Result: 2"
multiplier.value = 3 // Logs: "Result: 3"
```

### watch() vs watchEffect()

**watch()**: Explicit dependencies
```ts
watch([count, multiplier], () => {
  console.log('Changed')
})
```

**watchEffect()**: Auto-tracking
```ts
watchEffect(() => {
  console.log(count.value * multiplier.value) // Tracks both automatically
})
```

**When to use watchEffect()**:
- Multiple dependencies
- Dependencies determined dynamically
- Simple logging/debugging

**When to use watch()**:
- Need old and new values
- Specific dependency control
- Async operations with cleanup

### Cleanup in watchEffect

```ts
watchEffect((onCleanup) => {
  const timer = setTimeout(() => {
    console.log('Delayed effect')
  }, 1000)
  
  // Cleanup function (runs before next effect or on unmount)
  onCleanup(() => {
    clearTimeout(timer)
  })
})
```

---

## v-model — Two-Way Binding

`v-model` creates two-way data binding on form inputs, syncing data between component state and UI.

### Basic Form Inputs

```ts
<script setup lang="ts">
import { ref } from 'vue'

const message = ref('')
const checked = ref(false)
const selected = ref('')
const multiSelect = ref<string[]>([])
</script>

<template>
  <!-- Text input -->
  <input v-model="message" type="text">
  <p>Message: {{ message }}</p>
  
  <!-- Checkbox -->
  <input v-model="checked" type="checkbox">
  <p>Checked: {{ checked }}</p>
  
  <!-- Select -->
  <select v-model="selected">
    <option value="">Choose...</option>
    <option value="a">Option A</option>
    <option value="b">Option B</option>
  </select>
  
  <!-- Multi-select -->
  <select v-model="multiSelect" multiple>
    <option value="a">A</option>
    <option value="b">B</option>
    <option value="c">C</option>
  </select>
</template>
```

### v-model Modifiers

```ts
<!-- .lazy: sync on 'change' instead of 'input' -->
<input v-model.lazy="message">

<!-- .number: auto-convert to number -->
<input v-model.number="age" type="number">

<!-- .trim: auto-trim whitespace -->
<input v-model.trim="username">
```

### How v-model Works Under the Hood

```ts
<!-- This -->
<input v-model="message">

<!-- Is syntactic sugar for -->
<input 
  :value="message" 
  @input="message = ($event.target as HTMLInputElement).value"
>
```

### Custom v-model (Component)

```ts
<!-- ParentComponent.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import CustomInput from './CustomInput.vue'

const value = ref('')
</script>

<template>
  <CustomInput v-model="value" />
</template>
```

```ts
<!-- CustomInput.vue -->
<script setup lang="ts">
defineProps<{ modelValue: string }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <input 
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  >
</template>
```

---

## Vue Directives & Template Syntax

Vue uses special HTML attributes called **directives** to add reactive behavior to templates. All directives start with `v-` and are Vue-specific (not standard HTML).

### v-bind — Bind Attributes (Shorthand: `:`)

**Purpose**: Dynamically bind JavaScript expressions to HTML attributes.

```vue
<script setup lang="ts">
import { ref } from 'vue'
const imageUrl = ref('/logo.png')
const isDisabled = ref(true)
const className = ref('active')
</script>

<template>
  <!-- Full syntax -->
  <img v-bind:src="imageUrl" v-bind:alt="'Logo'">
  
  <!-- Shorthand (preferred) -->
  <img :src="imageUrl" alt="Logo">
  <button :disabled="isDisabled">Click</button>
  <div :class="className">Content</div>
  
  <!-- Dynamic attribute name -->
  <div :[attributeName]="value"></div>
</template>
```

**Common use cases**:
- `:src`, `:href`, `:alt` for dynamic content
- `:class`, `:style` for dynamic styling
- `:disabled`, `:required` for form states
- `:id`, `:data-*` for dynamic identifiers

### v-on — Event Listeners (Shorthand: `@`)

**Purpose**: Attach event listeners to elements.

```ts
<script setup lang="ts">
const handleClick = () => console.log('Clicked')
const handleInput = (event: Event) => {
  console.log((event.target as HTMLInputElement).value)
}
</script>

<template>
  <!-- Full syntax -->
  <button v-on:click="handleClick">Click</button>
  
  <!-- Shorthand (preferred) -->
  <button @click="handleClick">Click</button>
  
  <!-- Inline expression -->
  <button @click="count++">Increment</button>
  
  <!-- Event modifiers -->
  <form @submit.prevent="onSubmit"><!-- Prevent default --></form>
  <div @click.stop="handleClick"><!-- Stop propagation --></div>
  <input @keyup.enter="search"><!-- Key modifier --></input>
  <button @click.once="init"><!-- Fire only once --></button>
  
  <!-- Mouse modifiers -->
  <button @click.ctrl="onCtrlClick">Ctrl+Click</button>
  <button @click.right="onRightClick">Right click</button>
</template>
```

**Common events**: `@click`, `@input`, `@change`, `@submit`, `@keyup`, `@keydown`, `@focus`, `@blur`

### v-if / v-else-if / v-else — Conditional Rendering

**Purpose**: Conditionally render elements. The element is **completely removed** from DOM when condition is false.

```ts
<script setup lang="ts">
import { ref } from 'vue'
const isLoggedIn = ref(false)
const userRole = ref('guest')
</script>

<template>
  <!-- Simple condition -->
  <div v-if="isLoggedIn">Welcome back!</div>
  <div v-else>Please log in</div>
  
  <!-- Multiple conditions -->
  <div v-if="userRole === 'admin'">Admin Panel</div>
  <div v-else-if="userRole === 'user'">User Dashboard</div>
  <div v-else>Guest View</div>
  
  <!-- Template wrapper (doesn't render extra element) -->
  <template v-if="isLoggedIn">
    <h1>Dashboard</h1>
    <p>Content here</p>
  </template>
</template>
```

**Performance note**: `v-if` is "lazy" — if condition is false on initial render, the element won't be rendered at all.

> 💡 IMPORTANT: 
>
> **"Lazy" only means:** False branches aren't created on initial render — but once the data changes, Vue will create them dynamically.
>
> **How this differs from v-show:** `v-show` creates ALL elements upfront and just toggles CSS visibility.
>
> **Example:**
> ```ts
> const userRole = ref('guest')  // Initial: only "Guest View" div exists
> 
> // Later:
> userRole.value = 'admin'  // ✅ Vue removes "Guest View", creates "Admin Panel"
> ```

### v-show — Conditional Display

**Purpose**: Toggle element visibility using CSS `display` property.

```ts
<template>
  <!-- Element stays in DOM, just hidden with display: none -->
  <div v-show="isVisible">This toggles visibility</div>
</template>
```

**v-if vs v-show**:
- `v-if`: Removes/adds element from DOM (higher toggle cost)
- `v-show`: Always in DOM, just hidden (higher initial render cost)
- Use `v-if` for infrequent toggles; `v-show` for frequent toggles

### v-for — List Rendering

**Purpose**: Render a list of items by iterating over an array or object.

```ts
<script setup lang="ts">
import { ref } from 'vue'
const items = ref(['Apple', 'Banana', 'Cherry'])
const users = ref([
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
])
</script>

<template>
  <!-- Array iteration -->
  <ul>
    <li v-for="(item, index) in items" :key="index">
      {{ index }}: {{ item }}
    </li>
  </ul>
  
  <!-- Object iteration -->
  <div v-for="user in users" :key="user.id">
    {{ user.name }}
  </div>
  
  <!-- Object properties -->
  <div v-for="(value, key, index) in { a: 1, b: 2 }" :key="key">
    {{ key }}: {{ value }}
  </div>
  
  <!-- Range (1 to 10) -->
  <span v-for="n in 10" :key="n">{{ n }}</span>
</template>
```

> ⚠️ CRITICAL: Always provide a unique `:key` for efficient DOM updates.

### v-html — Render Raw HTML

**Purpose**: Insert raw HTML into an element.

```vue
<script setup lang="ts">
import { ref } from 'vue'
const htmlContent = ref('<strong>Bold text</strong>')
</script>

<template>
  <!-- Renders actual HTML -->
  <div v-html="htmlContent"></div>
  <!-- Output: <div><strong>Bold text</strong></div> -->
  
  <!-- Without v-html (escaped) -->
  <div>{{ htmlContent }}</div>
  <!-- Output: <div>&lt;strong&gt;Bold text&lt;/strong&gt;</div> -->
</template>
```

**⚠️ Security warning**: Never use `v-html` with user-provided content (XSS risk).

### v-text — Set Text Content

**Purpose**: Set element's text content (same as `{{ }}` interpolation).

```vue
<template>
  <!-- These are equivalent -->
  <span v-text="message"></span>
  <span>{{ message }}</span>
</template>
```

**Use case**: Rarely needed; mustache syntax `{{ }}` is preferred.

### v-once — Render Once

**Purpose**: Render element and components only once, never update.

```vue
<template>
  <!-- This will never update, even if message changes -->
  <span v-once>{{ message }}</span>
</template>
```

**Use case**: Static content optimization.

### v-pre — Skip Compilation

**Purpose**: Skip Vue template compilation for this element and children.

```ts
<template>
  <span v-pre>{{ this will not be compiled }}</span>
</template>
```

**Comparison with/without v-pre**:

**With v-pre** (shows Vue syntax literally):
```ts
<span v-pre>{{ message }}</span>
```
Displays on screen: `{{ message }}`

\\


**Without v-pre, with mustaches** (Vue compiles):
```ts
<span>{{ message }}</span>
```
Displays on screen: the actual value of message (e.g., "Hello")

**Without v-pre, without mustaches** (just plain text):
```ts
<span>This will not be compiled</span>
```
Displays on screen: "This will not be compiled"

**Key difference**: `v-pre` lets you **show Vue code** to users (useful for documentation). Simply removing mustaches doesn't show the code structure.

**Use case**: Displaying Vue syntax examples in tutorials or code documentation without Vue interpreting them.

### v-cloak — Hide Uncompiled Template

**Purpose**: Prevent users from seeing raw Vue syntax (`{{ }}`) before Vue compiles it.

**Why this matters**: When a page loads, the browser renders HTML immediately. If Vue hasn't loaded yet, users will see the literal syntax instead of the compiled value.

**Without v-cloak** (bad):
1. Page loads → Browser displays: `{{ message }}`
2. Vue loads (500ms later) → Re-renders: `"Hello World"`
3. User sees a jarring flicker

**With v-cloak** (good):
1. Page loads → Element stays hidden (CSS: `display: none`)
2. Vue loads and compiles → Vue removes the `v-cloak` attribute
3. Element becomes visible with compiled content
4. User never sees the raw syntax

**Implementation**:
```ts
<style>
[v-cloak] { display: none; }
</style>

<template>
  <div v-cloak>
    Message: {{ message }}
  </div>
</template>
```

When Vue finishes loading, it automatically removes the `v-cloak` attribute, making the element visible.

**Use case**: Only needed in non-build setups (loading Vue from CDN). Build setups (Vite, webpack) compile templates at build time, so this isn't needed.


### v-slot — Named Slots (Shorthand: `#`)

**Purpose**: Pass template content to child component slots, allowing flexible customization of child component layout.

**What it does**: 
- Parent component defines **where** content goes using named `<slot>` tags
- Child component defines **placeholder positions** using `<slot name="...">` 
- Parent fills those placeholders with its own template using `v-slot` or `#`

**Simple example**:

Child component (defines slot placeholders):
```ts
<!-- ChildComponent.vue -->
<template>
  <div class="card">
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <slot></slot>  <!-- default slot (no name) -->
    </main>
    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<style scoped>
  .card { border: 1px solid #ccc; padding: 20px; }
  header { background: #f0f0f0; margin-bottom: 10px; }
  footer { background: #f0f0f0; margin-top: 10px; }
</style>
```

Parent component (fills the slots):
```ts
<!-- ParentComponent.vue -->
<template>
  <ChildComponent>
    <!-- Full syntax: v-slot:slotName -->
    <template v-slot:header>
      <h1>My Title</h1>
      <p>Subtitle here</p>
    </template>
    
    <!-- Default slot (no name required) -->
    <p>This goes in the main content area</p>
    
    <!-- Shorthand: #slotName (preferred) -->
    <template #footer>
      <small>© 2026 My Company</small>
    </template>
  </ChildComponent>
</template>
```

**Rendered output**:
```html
<div class="card">
  <header>
    <h1>My Title</h1>
    <p>Subtitle here</p>
  </header>
  <main>
    <p>This goes in the main content area</p>
  </main>
  <footer>
    <small>© 2026 My Company</small>
  </footer>
</div>
```

**Key concepts**:

1. **Unnamed slots** (`<slot></slot>`) receive content without a `v-slot` name
   ```ts
   <!-- Child -->
   <slot></slot>
   
   <!-- Parent (no template wrapper needed) -->
   <ChildComponent>
     Direct content here
   </ChildComponent>
   ```

2. **Named slots** require explicit names
   ```ts
   <!-- Child -->
   <slot name="header"></slot>
   
   <!-- Parent -->
   <template v-slot:header>
     Content for header
   </template>
   ```

3. **Shorthand `#`** is equivalent to `v-slot:`
   ```ts
   <!-- These are identical -->
   <template v-slot:header>Content</template>
   <template #header>Content</template>
   ```

**Real-world example** (Tab component):
```ts
<!-- TabComponent.vue (child) -->
<template>
  <div class="tabs">
    <div class="tab-headers">
      <slot name="tabs"></slot>
    </div>
    <div class="tab-content">
      <slot></slot>
    </div>
  </div>
</template>

<!-- ParentComponent.vue (parent) -->
<template>
  <TabComponent>
    <!-- Named slot for tab headers -->
    <template #tabs>
      <button class="tab" @click="active = 'home'">Home</button>
      <button class="tab" @click="active = 'about'">About</button>
      <button class="tab" @click="active = 'contact'">Contact</button>
    </template>
    
    <!-- Default slot for content -->
    <div v-if="active === 'home'">Home content</div>
    <div v-if="active === 'about'">About content</div>
    <div v-if="active === 'contact'">Contact content</div>
  </TabComponent>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref('home')
</script>
```

**Effect summary**:
- **Without slots**: Child component has fixed structure, hard to customize
- **With slots**: Child component becomes a flexible template, parent controls content placement
- Enables **component composition** and **reusability** across projects

> 💡 NOTE: A child component can have only **one default slot** (`<slot></slot>`). If you define multiple unnamed slots, the same parent content gets duplicated in each one. Use **named slots** for multiple distinct positions.

### Directive Summary Table

| Directive | Shorthand | Purpose            | Example                 |
| --------- | --------- | ------------------ | ----------------------- |
| `v-bind`  | `:`       | Bind attribute     | `:src="url"`            |
| `v-on`    | `@`       | Event listener     | `@click="handler"`      |
| `v-model` | —         | Two-way binding    | `v-model="value"`       |
| `v-if`    | —         | Conditional render | `v-if="show"`           |
| `v-show`  | —         | Toggle visibility  | `v-show="visible"`      |
| `v-for`   | —         | List rendering     | `v-for="item in items"` |
| `v-html`  | —         | Raw HTML           | `v-html="html"`         |
| `v-text`  | —         | Text content       | `v-text="text"`         |
| `v-once`  | —         | Render once        | `v-once`                |
| `v-pre`   | —         | Skip compilation   | `v-pre`                 |
| `v-cloak` | —         | Hide until ready   | `v-cloak`               |
| `v-slot`  | `#`       | Named slots        | `#header`               |

---

## Reactivity Best Practices

### 1. Choose the Right Primitive

```ts
// ✅ ref() for primitives
const count = ref(0)
const name = ref('Alice')

// ✅ reactive() for complex objects
const user = reactive({
  profile: { name: 'Alice', age: 30 },
  settings: { theme: 'dark' }
})

// ⚠️ Avoid reactive() for primitives
const count = reactive({ value: 0 }) // Unnecessary wrapper
```

### 2. Avoid Losing Reactivity

```ts
// ❌ Destructuring reactive() loses reactivity
const state = reactive({ count: 0 })
let { count } = state // count is no longer reactive

// ✅ Use toRefs()
import { toRefs } from 'vue'
const { count } = toRefs(state) // count is Ref<number>
```

### 3. Prefer computed() Over Methods for Derived State

```ts
// ❌ Method (recalculates every render)
const getTotal = () => items.value.reduce((sum, item) => sum + item.price, 0)

// ✅ Computed (cached, only recalculates when items change)
const total = computed(() => 
  items.value.reduce((sum, item) => sum + item.price, 0)
)
```

### 4. Use watch() for Side Effects Only

```ts
// ❌ Don't use watch for derived values
watch(firstName, () => {
  fullName.value = `${firstName.value} ${lastName.value}`
})

// ✅ Use computed instead
const fullName = computed(() => `${firstName.value} ${lastName.value}`)

// ✅ Use watch for side effects (API, localStorage, etc.)
watch(user, (newUser) => {
  localStorage.setItem('user', JSON.stringify(newUser))
})
```

---

## TypeScript Integration

### Typed Refs and Reactive

```ts
import { ref, reactive, computed } from 'vue'

// Ref with type inference
const count = ref(0) // Ref<number>
const name = ref('Alice') // Ref<string>

// Explicit typing
const user = ref<User | null>(null)

interface User {
  id: number
  name: string
  email: string
}

// Reactive with interface
interface State {
  count: number
  items: string[]
}

const state = reactive<State>({
  count: 0,
  items: []
})

// Computed with return type
const doubled = computed<number>(() => count.value * 2)
```

### Watch with Types

```ts
watch<number>(count, (newVal, oldVal) => {
  console.log(newVal, oldVal)
})

// Multiple sources
watch<[string, string]>([firstName, lastName], ([newFirst, newLast]) => {
  console.log(newFirst, newLast)
})
```

---

## Performance Considerations

### 1. Computed Caching

```ts
// ✅ Computed is cached
const filteredItems = computed(() => 
  items.value.filter(item => item.active)
)

// ❌ Method runs every render
const getFilteredItems = () => items.value.filter(item => item.active)
```

### 2. Deep Watching Can Be Expensive

```ts
// ⚠️ Watches entire object deeply
watch(largeObject, callback, { deep: true })

// ✅ Watch specific properties
watch(() => largeObject.specificProp, callback)
```

### 3. Debounce Expensive Operations

```ts
let timeout: number
watch(searchQuery, (newQuery) => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    // Expensive operation
  }, 300)
})
```

---

## Debugging Reactivity

### Check What's Reactive

```ts
import { isRef, isReactive, toRaw } from 'vue'

const count = ref(0)
const state = reactive({ count: 0 })

console.log(isRef(count)) // true
console.log(isReactive(state)) // true

// Get non-reactive version
const raw = toRaw(state)
```

### Track Dependencies

```ts
import { watchEffect } from 'vue'

watchEffect(() => {
  console.log('Dependencies:', count.value, name.value)
  // Logs whenever count or name changes
})
```

---

## Verification Checklist

- You understand the difference between `ref()` and `reactive()`
- You can use `computed()` for derived state
- You know when to use `watch()` vs `watchEffect()`
- You can implement two-way binding with `v-model`
- You avoid common reactivity pitfalls (destructuring, reassignment)
- You can type reactive data with TypeScript

When all boxes are checked, proceed to the sample project and exercises.
 
---

## Mounting & Unmounting

"Mount" means a component is created, rendered, and inserted into the DOM. "Unmount" means it is removed and destroyed.

### Key Hooks
```ts
import { onMounted, onUnmounted, onBeforeMount, onBeforeUnmount } from 'vue'

onBeforeMount(() => {
  // Runs right before the initial DOM insertion
})

onMounted(() => {
  // Runs after the component is first rendered and in the DOM
  // Safe place to access window/document and measure the DOM
})

onBeforeUnmount(() => {
  // Runs just before the component is removed
})

onUnmounted(() => {
  // Runs after the component is removed; do cleanup here
})
```

### Typical Uses
- Set up event listeners, subscriptions, or timers in `onMounted()`
- Clean them up in `onUnmounted()` to prevent memory leaks
- Avoid accessing `window`/`document` before `onMounted()`

### Example: Event Listener + Timer Cleanup
```ts
import { ref, onMounted, onUnmounted } from 'vue'

const width = ref(window.innerWidth)
let intervalId: number | undefined

onMounted(() => {
  const onResize = () => { width.value = window.innerWidth }
  window.addEventListener('resize', onResize)
  
  intervalId = setInterval(() => {
    // periodic work
  }, 1000) as unknown as number

  // Store cleanup so we can remove listeners/timers on unmount
  onUnmounted(() => {
    window.removeEventListener('resize', onResize)
    if (intervalId) clearInterval(intervalId)
  })
})
```

### SSR Note
- `onMounted()`/`onUnmounted()` do not run during server-side render; they run only in the browser.
- For SSR data fetching, use `onServerPrefetch()`; hydrate data on the client after mount.

---

## Verification Checklist
