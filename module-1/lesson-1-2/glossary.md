# Glossary — Lesson 1.2 Terms & Definitions

Quick reference for technical terms used in this lesson.

---

## Core Concepts

### Reactivity
**Definition**: A programming pattern where the system automatically updates when data changes, without manual DOM manipulation.

**In Vue**: When you change reactive data, Vue automatically re-renders components that depend on that data.

**Example**:
```ts
const count = ref(0)
count.value++ // Vue automatically updates the DOM
```

**Non-reactive (vanilla JS)**:
```js
let count = 0
count++ // DOM stays the same, you must manually update it
document.getElementById('count').textContent = count
```

---

### ES6 Proxy
**Definition**: A built-in JavaScript object that wraps another object and intercepts operations on it (reading, writing, deleting properties).

**How it works**:
```js
const target = { count: 0 }

const handler = {
  get(target, property) {
    console.log(`Reading ${property}`)
    return target[property]
  },
  set(target, property, value) {
    console.log(`Writing ${property} = ${value}`)
    target[property] = value
    return true
  }
}

const proxy = new Proxy(target, handler)

proxy.count // Logs: "Reading count"
proxy.count = 5 // Logs: "Writing count = 5"
```

**Why Vue uses Proxies**: To detect when data is accessed (dependency tracking) and when it's modified (trigger updates).

---

### Reactive Proxy
**Definition**: Vue's wrapper around your data using ES6 Proxy to make it reactive.

**How Vue creates it**:
```ts
import { ref, reactive } from 'vue'

// Vue wraps your data in a Proxy
const count = ref(0) // Creates Proxy for primitive
const state = reactive({ count: 0 }) // Creates Proxy for object
```

**What happens internally**:
- When you read `count.value`, the Proxy intercepts and tracks the dependency
- When you write `count.value = 5`, the Proxy intercepts and triggers component updates

---

### Dependency Tracking
**Definition**: Vue's mechanism of recording which reactive data a component depends on, so it knows what to re-render when data changes.

**How it works**:
```ts
const count = ref(0)
const doubled = computed(() => {
  console.log('Computing...')
  return count.value * 2  // Vue "sees" count being read here
})

// First access
console.log(doubled.value) // Logs "Computing...", returns 0

// Second access (without count changing)
console.log(doubled.value) // Uses cache, no log, returns 0

// Change count
count.value = 5

// Third access (count changed)
console.log(doubled.value) // Logs "Computing...", returns 10
```

**Behind the scenes**: When `doubled` computed runs, Vue's Proxy intercepts the `count.value` read and records: "doubled depends on count". Later, when `count` changes, Vue knows to recompute `doubled`.

**Why it matters**: Enables automatic, efficient updates without you manually specifying dependencies (except in `watch()`).

---

### Build Setup vs Non-Build Setup
**Definition**: How Vue is loaded and processed.

**Build setup** (recommended):
- Vue is loaded via a build tool (Vite, webpack, etc.)
- Templates are compiled **at build time** before deployment
- No compilation delay in the browser
- Modern, professional approach

**Non-build setup** (learning only):
- Vue is loaded directly from a CDN (like `<script src="https://...vue.js"></script>`)
- Templates are compiled **in the browser** (300ms-1s delay)
- Users may see raw Vue syntax before compilation completes
- Simple for learning, but slow for production

**Example non-build HTML**:
```html
<script src="https://unpkg.com/vue@3"></script>
<div id="app">
  {{ message }} <!-- Raw syntax briefly visible -->
</div>
```

**Why v-cloak matters**: Only in non-build setups does the user experience a "flash" of uncompiled syntax. Build setups compile everything beforehand, so v-cloak is unnecessary.

---

### Destructuring
**Definition**: JavaScript syntax to extract properties from objects or items from arrays into standalone variables using pattern matching.

**Examples (vanilla JS)**:
```ts
// Object destructuring
const user = { name: 'Alice', age: 30 }
const { name, age } = user

// Array destructuring
const list = ['a', 'b', 'c']
const [first, second] = list
```

**Vue caveat (reactivity loss)**:
```ts
const state = reactive({ count: 0, name: 'Alice' })
// ❌ Loses reactivity: plain values are created
const { count, name } = state
// count++ here will NOT update Vue
```

**Preserving reactivity**:
```ts
import { toRefs, toRef } from 'vue'

// ✅ Convert each property into a Ref
const { count, name } = toRefs(state) // Ref<number>, Ref<string>

// ✅ Single property as Ref
const countRef = toRef(state, 'count')
countRef.value++ // Updates Vue
```

**Do not destructure `.value`**:
```ts
const count = ref(0)
// ❌ Avoid: creates a non-reactive copy
const { value } = count
// ✅ Use count.value directly or pass the Ref around
```

**Function parameters tip**:
```ts
// ❌ Destructuring reactive objects in params loses reactivity
function useThing({ count }: { count: number }) { /* ... */ }

// ✅ Accept Refs or use toRefs before destructuring
function useThing(count: Ref<number>) { /* ... */ }
// or
const { count } = toRefs(state)
useThing(count)
```

**TypeScript note**: `toRefs(state)` returns a record of `Ref<T>`s; e.g., `count: Ref<number>`, `name: Ref<string>`.


**How it works**:
```ts
const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed(() => {
  // Vue tracks: "fullName depends on firstName and lastName"
  return `${firstName.value} ${lastName.value}`
})

firstName.value = 'Jane' // Vue knows to recompute fullName
```

**Behind the scenes**: When `fullName` runs, Vue's Proxy intercepts `firstName.value` and `lastName.value` reads, recording the dependencies.

---

### Side Effect
**Definition**: An operation that affects something outside its scope (API calls, localStorage, console.log, DOM manipulation, etc.).

**Examples of side effects**:
```ts
// ✅ Side effect: localStorage
watch(user, (newUser) => {
  localStorage.setItem('user', JSON.stringify(newUser))
})

// ✅ Side effect: API call
watch(searchQuery, async (query) => {
  const results = await fetch(`/api/search?q=${query}`)
  // ...
})

// ✅ Side effect: logging
watchEffect(() => {
  console.log('Count is', count.value)
})
```

**Not a side effect** (pure computation):
```ts
// Just deriving data, no external effects
const doubled = computed(() => count.value * 2)
```

---

### Derived State
**Definition**: Data that is computed from other data, rather than stored directly.

**Examples**:
```ts
const firstName = ref('John')
const lastName = ref('Doe')

// Derived state: computed from firstName + lastName
const fullName = computed(() => `${firstName.value} ${lastName.value}`)

const items = ref([{ price: 10 }, { price: 20 }])

// Derived state: computed from items array
const total = computed(() => 
  items.value.reduce((sum, item) => sum + item.price, 0)
)
```

**Why use computed for derived state**: Automatic caching and dependency tracking.

---

### Two-Way Binding
**Definition**: Synchronizing data in both directions: UI changes update data, data changes update UI.

**Without two-way binding**:
```ts
<input :value="message" @input="message = $event.target.value">
```

**With v-model (two-way binding)**:
```ts
<input v-model="message">
```

Both do the same thing, but `v-model` is more concise.

---

### Ref (Reference)
**Definition**: Vue's reactive wrapper for a single value (primitive or object). Access the value via `.value` in script.

**Syntax**:
```ts
import { ref } from 'vue'

const count = ref(0)         // Ref<number>
const name = ref('Alice')    // Ref<string>
const user = ref({ id: 1 })  // Ref<{ id: number }>

// Read/write via .value
console.log(count.value) // 0
count.value = 5
```

**In templates** (no .value needed):
```vue
<p>{{ count }}</p> <!-- Auto-unwrapped -->
```

---

### Reactive Object
**Definition**: An object wrapped by Vue's `reactive()` function to make all its properties reactive.

**Syntax**:
```ts
import { reactive } from 'vue'

const state = reactive({
  count: 0,
  user: { name: 'Alice' }
})

// No .value needed
state.count++
state.user.name = 'Bob'
```

**Key difference from ref()**: No `.value` wrapper, but cannot be reassigned.

---

### Computed Property
**Definition**: A reactive value derived from other reactive data, automatically cached until dependencies change.

**Syntax**:
```ts
import { computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed(() => {
  return `${firstName.value} ${lastName.value}`
})

console.log(fullName.value) // "John Doe"
```

**Key feature**: Only recomputes when `firstName` or `lastName` changes, otherwise returns cached value.

---

### Watcher
**Definition**: A function that runs when specific reactive data changes, used for side effects.

**Syntax**:
```ts
import { watch } from 'vue'

watch(count, (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`)
})
```

**Common uses**: API calls, localStorage, logging, analytics.

---

### Deep Watch
**Definition**: Watching nested properties inside objects/arrays, not just top-level properties.

**Example**:
```ts
const user = ref({
  profile: { name: 'Alice', age: 30 }
})

// Without deep: only triggers if entire user object is replaced
watch(user, callback)

// With deep: triggers when nested properties change
watch(user, callback, { deep: true })

user.value.profile.age = 31 // Now triggers the watcher
```

**Performance note**: Deep watching large objects can be expensive.

---

### Debouncing
**Definition**: Delaying execution of a function until after a period of inactivity.

**Use case**: Wait for user to stop typing before making API call.

**Example**:
```ts
let timeout: number

watch(searchQuery, (newQuery) => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    // Only runs 300ms after user stops typing
    fetchResults(newQuery)
  }, 300)
})
```

**Why**: Prevents making 50 API calls if user types 50 characters; only makes 1 call after they stop.

---

### Unwrapping
**Definition**: Vue automatically accessing `.value` of refs in templates so you don't have to.

**Example**:
```ts
<script setup>
const count = ref(0)
</script>

<template>
  <!-- Vue unwraps automatically -->
  <p>{{ count }}</p>
  
  <!-- Instead of forcing you to write: -->
  <p>{{ count.value }}</p>
</template>
```

**Only in templates**: In `<script>`, you must use `.value` manually.

---

### Caching (Computed)
**Definition**: Storing the result of a computed property and only recalculating when dependencies change.

**Example**:
```ts
const items = ref([1, 2, 3, 4, 5])

const expensiveComputation = computed(() => {
  console.log('Computing...')
  return items.value.reduce((sum, n) => sum + n * n, 0)
})

console.log(expensiveComputation.value) // Logs "Computing...", returns 55
console.log(expensiveComputation.value) // Uses cache, no log, returns 55

items.value.push(6) // Dependencies changed
console.log(expensiveComputation.value) // Logs "Computing..." again, returns 91
```

**Benefit**: Avoids redundant calculations, improving performance.

---

### Lazy Evaluation
**Definition**: Delaying execution until the value is actually needed.

**In v-model.lazy**:
```ts
<!-- Updates on every keystroke (default) -->
<input v-model="message">

<!-- Updates only on blur/change (lazy) -->
<input v-model.lazy="message">
```

**In watch (default behavior)**:
```ts
// Doesn't run immediately, only when count changes
watch(count, callback)

// Run immediately + on changes
watch(count, callback, { immediate: true })
```

---

### XSS (Cross-Site Scripting)
**Definition**: A security vulnerability where malicious scripts are injected into a web page and executed in users' browsers, allowing attackers to steal data or impersonate users.

**How it happens**:
```ts
// ❌ DANGEROUS: User input inserted as HTML
const userComment = ref('<img src=x onerror="alert(\'hacked\')">')
// <div v-html="userComment"></div> // Script will execute!
```

**Prevention**:
1. **Never use `v-html` with user-provided content** — Always sanitize or avoid it
2. **Use template interpolation** — Vue automatically escapes HTML
3. **Sanitize HTML if necessary** — Use a library like `DOMPurify`

**Safe approach**:
```ts
// ✅ SAFE: Template interpolation escapes HTML
const userComment = ref('<img src=x onerror="alert(\'hacked\')">')
// <p>{{ userComment }}</p> // Displays as text, script won't execute
```

**When `v-html` is safe**:
- Content from trusted sources (your database, API you control)
- Content you've explicitly sanitized with a library
- Never with user-generated content, external APIs, or user input

**Sanitization example** (with DOMPurify):
```ts
import DOMPurify from 'dompurify'

const userHTML = ref('<b>Bold</b><script>alert("xss")</script>')
const safeHTML = computed(() => DOMPurify.sanitize(userHTML.value))

// <div v-html="safeHTML"></div> // Safe to use
```

---

### Flush Timing
**Definition**: When a watcher callback runs relative to component updates.

**Options**:
- `flush: 'pre'` (default): Before component updates
- `flush: 'post'`: After component updates (can access updated DOM)
- `flush: 'sync'`: Synchronously (immediately)

**Example**:
```ts
watch(count, () => {
  console.log(document.getElementById('count').textContent)
}, { flush: 'post' }) // Sees updated DOM

watch(count, () => {
  console.log(document.getElementById('count').textContent)
}, { flush: 'pre' }) // Sees old DOM (default)
```

---

## Utility Functions

### toRefs()
**Definition**: Converts all properties of a reactive object into individual refs, preserving reactivity.

**Problem it solves**:
```ts
const state = reactive({ count: 0, name: 'Alice' })
const { count, name } = state // ❌ Loses reactivity
```

**Solution**:
```ts
import { toRefs } from 'vue'
const { count, name } = toRefs(state) // ✅ Both are reactive refs
```

---

### toRaw()
**Definition**: Returns the non-reactive (raw) version of a reactive object.

**Use case**: When you need to pass data to third-party libraries that shouldn't trigger reactivity.

**Example**:
```ts
import { reactive, toRaw } from 'vue'

const state = reactive({ count: 0 })
const raw = toRaw(state)

raw.count++ // Does NOT trigger reactivity
state.count++ // DOES trigger reactivity
```

---

### isRef() / isReactive()
**Definition**: Utility functions to check if something is a ref or reactive object.

**Example**:
```ts
import { ref, reactive, isRef, isReactive } from 'vue'

const count = ref(0)
const state = reactive({ count: 0 })

console.log(isRef(count))      // true
console.log(isReactive(state)) // true
console.log(isRef(state))      // false
```

---

## Common Patterns

### Destructuring with Reactivity Loss
**Definition**: Breaking out properties from reactive objects loses their reactivity.

**Problem**:
```ts
const state = reactive({ count: 0 })
let { count } = state // count is now a plain number
count++ // Does NOT update Vue
```

**Solution**:
```ts
const { count } = toRefs(state) // count is Ref<number>
count.value++ // Updates Vue
```

---

### Reassignment Breaking Reactivity
**Definition**: Replacing a reactive object with a new object breaks the reactive connection.

**Problem**:
```ts
let user = reactive({ name: 'Alice' })
user = { name: 'Bob' } // ❌ user is no longer reactive
```

**Solution**:
```ts
const user = ref({ name: 'Alice' })
user.value = { name: 'Bob' } // ✅ Still reactive
```

---

## Vue vs Vanilla JavaScript

### Event Handling Comparison

**Vue's `@` directive** is syntactic sugar that compiles to vanilla JavaScript event listeners. Here's how Vue syntax maps to native DOM APIs:

#### @click — Inline Expression
**Vue**:
```ts
<button @click="count++">Increment</button>
```

**Vanilla JS**:
```js
const button = document.querySelector('button')
button.addEventListener('click', () => {
  count++
})
```

#### @submit.prevent — Prevent Default
**Vue**:
```ts
<form @submit.prevent="onSubmit">Submit</form>
```

**Vanilla JS**:
```js
const form = document.querySelector('form')
form.addEventListener('submit', (event) => {
  event.preventDefault()
  onSubmit()
})
```

#### @click.stop — Stop Propagation
**Vue**:
```ts
<div @click.stop="handleClick">Click</div>
```

**Vanilla JS**:
```js
const div = document.querySelector('div')
div.addEventListener('click', (event) => {
  event.stopPropagation()
  handleClick()
})
```

#### @keyup.enter — Key Modifier
**Vue**:
```ts
<input @keyup.enter="search">
```

**Vanilla JS**:
```js
const input = document.querySelector('input')
input.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    search()
  }
})
```

#### @click.once — Fire Once
**Vue**:
```ts
<button @click.once="init">Initialize</button>
```

**Vanilla JS**:
```js
const button = document.querySelector('button')
button.addEventListener('click', init, { once: true })
// or
button.addEventListener('click', function handler() {
  init()
  button.removeEventListener('click', handler)
})
```

#### @click.ctrl — Keyboard Modifier
**Vue**:
```ts
<button @click.ctrl="onCtrlClick">Ctrl+Click</button>
```

**Vanilla JS**:
```js
const button = document.querySelector('button')
button.addEventListener('click', (event) => {
  if (event.ctrlKey) {
    onCtrlClick()
  }
})
```

#### @click.right — Right Click
**Vue**:
```ts
<button @click.right="onRightClick">Right Click</button>
```

**Vanilla JS (Option 1 — contextmenu event)**:
```js
const button = document.querySelector('button')
button.addEventListener('contextmenu', (event) => {
  event.preventDefault() // Prevent default context menu
  onRightClick()
})
```

**Vanilla JS (Option 2 — check button property)**:
```js
button.addEventListener('mousedown', (event) => {
  if (event.button === 2) { // 0=left, 1=middle, 2=right
    onRightClick()
  }
})
```

### Why Use Vue Directives?

**Advantages**:
- **Concise**: Less boilerplate code
- **Declarative**: Intent is clear in the template
- **Automatic cleanup**: Vue removes listeners when component unmounts
- **Chainable modifiers**: `.prevent.stop`, `.ctrl.shift.enter`
- **No manual querySelector**: Vue handles element references

**Vanilla JS requires**:
- Manual element selection
- Manual listener cleanup (removeEventListener on unmount)
- More verbose event handling code
- Manual modifier checks (ctrlKey, key values, etc.)

---

### :key — List Item Identification

**Vue**:
```ts
<ul>
  <li v-for="item in items" :key="item.id">{{ item.name }}</li>
</ul>
```

**How it works**: Vue uses the key to identify which item is which when the list changes, enabling efficient DOM updates and preserving component state.

**Vanilla JS**:
```js
// Vanilla JS has no built-in concept of keys; you must manually track elements
const itemMap = new Map()

function renderList(items) {
  items.forEach((item) => {
    let element = itemMap.get(item.id)
    
    // Element doesn't exist, create it
    if (!element) {
      element = document.createElement('li')
      itemMap.set(item.id, element)
      list.appendChild(element)
    }
    
    // Update element content
    element.textContent = item.name
  })
  
  // Remove items no longer in the list
  for (const [id, element] of itemMap) {
    if (!items.find(item => item.id === id)) {
      element.remove()
      itemMap.delete(id)
    }
  }
}

renderList(items)
```

**Why use :key?**:
- **Efficient updates**: Vue only updates changed items, not the entire list
- **Preserves state**: Form inputs, focus, component state survives reordering
- **Smooth transitions**: CSS transitions work correctly with proper keys
- **Bug prevention**: Without keys, reordering lists can cause data to sync with wrong elements

**Anti-pattern** (using array index as key):
```ts
<!-- ❌ BAD: index changes when list is reordered -->
<li v-for="(item, index) in items" :key="index">{{ item.name }}</li>
```

**Why it's wrong**: If you remove item 0 and add new items, the keys shift. Vue thinks item 1 became item 0.

**Best practice**: Use a unique identifier from your data (id, uuid).

```ts
<!-- ✅ GOOD: stable, unique identifier -->
<li v-for="item in items" :key="item.id">{{ item.name }}</li>
```

---

## Vue Directives

### v-bind (Shorthand: `:`)
**Definition**: Vue directive to dynamically bind JavaScript expressions to HTML attributes.

**Not standard HTML**: This is Vue-specific syntax, compiled away during build.

**Syntax**:
```ts
<!-- Full syntax -->
<img v-bind:src="imageUrl">

<!-- Shorthand (preferred) -->
<img :src="imageUrl">
<button :disabled="isDisabled">Click</button>
<div :class="activeClass" :style="styleObject"></div>
```

**Common uses**: `:src`, `:href`, `:class`, `:style`, `:disabled`, `:id`

---

### v-on (Shorthand: `@`)
**Definition**: Vue directive to attach event listeners to elements.

**Syntax**:
```ts
<!-- Full syntax -->
<button v-on:click="handleClick">Click</button>

<!-- Shorthand (preferred) -->
<button @click="handleClick">Click</button>
<input @input="handleInput" @keyup.enter="search">
```

**Event modifiers**: `.prevent`, `.stop`, `.once`, `.capture`, `.self`, `.passive`

**Key modifiers**: `.enter`, `.tab`, `.delete`, `.esc`, `.space`, `.up`, `.down`, `.left`, `.right`

**Mouse modifiers**: `.left`, `.right`, `.middle`, `.ctrl`, `.alt`, `.shift`, `.meta`

---

### v-model
**Definition**: Vue directive for two-way data binding on form inputs.

**Covered earlier in lesson**; see main v-model section for details.

**Syntax**: `<input v-model="value">`

**Modifiers**: `.lazy`, `.number`, `.trim`

---

### v-if / v-else-if / v-else
**Definition**: Conditionally render elements. Elements are **added/removed from DOM**.

**Syntax**:
```ts
<div v-if="condition">Shown if true</div>
<div v-else-if="otherCondition">Alternative</div>
<div v-else>Fallback</div>
```

**Behavior**: "Lazy" rendering — element not created if condition is false.

**Use case**: Infrequent toggles, conditional logic.

---

### v-show
**Definition**: Toggle element visibility using CSS `display` property.

**Syntax**:
```ts
<div v-show="isVisible">Toggles visibility</div>
```

**Behavior**: Element always in DOM, just hidden with `display: none`.

**v-if vs v-show**:
- `v-if`: Higher toggle cost (DOM manipulation)
- `v-show`: Higher initial render cost (always rendered)
- Use `v-show` for frequent toggles; `v-if` for infrequent ones

---

### v-for
**Definition**: Render a list by iterating over arrays or objects.

**Syntax**:
```ts
<!-- Array -->
<li v-for="(item, index) in items" :key="item.id">
  {{ item.name }}
</li>

<!-- Object -->
<div v-for="(value, key) in object" :key="key">
  {{ key }}: {{ value }}
</div>

<!-- Range -->
<span v-for="n in 10" :key="n">{{ n }}</span>
```

**Critical rule**: Always provide a unique `:key` attribute for efficient DOM updates.

**Anti-pattern**: Using index as key when items can be reordered.

---

### v-html
**Definition**: Insert raw HTML into an element.

**Syntax**:
```ts
<div v-html="rawHtmlString"></div>
```

**⚠️ Security warning**: Never use with user-provided content (XSS vulnerability). Only use with trusted, sanitized HTML.

**Example**:
```ts
const html = ref('<strong>Bold</strong>')
// <div v-html="html"></div> renders actual HTML
```

---

### v-text
**Definition**: Set element's text content (alternative to mustache interpolation).

**Syntax**:
```ts
<!-- These are equivalent -->
<span v-text="message"></span>
<span>{{ message }}</span>
```

**Use case**: Rarely needed; `{{ }}` is more common.

---

### v-once
**Definition**: Render element once and never update, even if data changes.

**Syntax**:
```ts
<span v-once>{{ staticMessage }}</span>
```

**Use case**: Performance optimization for static content.

---

### v-pre
**Definition**: Skip Vue template compilation for this element and children.

**Syntax**:
```ts
<span v-pre>{{ raw mustache syntax }}</span>
<!-- Displays literal "{{ raw mustache syntax }}" -->
```

**Use case**: Displaying Vue code examples, slight performance boost for static content.

---

### v-cloak
**Definition**: Hide element until Vue compilation finishes.

**Syntax**:
```ts
<style>
[v-cloak] { display: none; }
</style>

<div v-cloak>{{ message }}</div>
```

**Use case**: Prevent "flash of uncompiled content" (FOUC) in non-build setups.

---

### v-slot (Shorthand: `#`)
**Definition**: Define named slots for component content distribution.

**Syntax**:
```ts
<!-- Parent -->
<template #header>
  <h1>Title</h1>
</template>

<!-- Child -->
<slot name="header"></slot>
```

**Use case**: Composing reusable components with customizable content areas.

---

## Quick Reference Table

| Term            | Used For                         | Example                     |
| --------------- | -------------------------------- | --------------------------- |
| `ref()`         | Primitives, reassignable objects | `ref(0)`, `ref({ id: 1 })`  |
| `reactive()`    | Complex objects                  | `reactive({ user: {...} })` |
| `computed()`    | Derived state (cached)           | `computed(() => a + b)`     |
| `watch()`       | Side effects with old/new values | `watch(x, (n, o) => {})`    |
| `watchEffect()` | Side effects with auto-tracking  | `watchEffect(() => {...})`  |
| `v-model`       | Two-way binding                  | `<input v-model="x">`       |
| `toRefs()`      | Destructure reactive objects     | `toRefs(state)`             |
| `toRaw()`       | Get non-reactive version         | `toRaw(proxy)`              |

---

## Mount
**Definition**: The lifecycle phase where a component is created, rendered, and inserted into the DOM.

**Hooks**: `onBeforeMount()` runs just before insertion; `onMounted()` runs after the first render with the DOM available.

**Typical uses**: Read/measure DOM, attach event listeners, start timers/intervals, initialize subscriptions.

**SSR note**: `onMounted()` does not run on the server; it only runs in the browser after hydration. Use `onServerPrefetch()` for SSR data fetching.

**Example**:
```ts
import { onMounted } from 'vue'
onMounted(() => {
  const el = document.getElementById('box')
  // safe DOM access
})
```

---

## Unmount
**Definition**: The lifecycle phase where a component is removed from the DOM and destroyed.

**Hooks**: `onBeforeUnmount()` runs just before removal; `onUnmounted()` runs after removal.

**Cleanup checklist**:
- Remove event listeners (`removeEventListener`)
- Clear timers/intervals (`clearTimeout`, `clearInterval`)
- Unsubscribe from stores/sockets
- Stop observers (Mutation/Intersection)
- Dispose watcher/effect cleanups

**Example**:
```ts
import { onMounted, onUnmounted } from 'vue'
let id: number

onMounted(() => {
  id = setInterval(() => {/* ... */}, 1000) as unknown as number
})

onUnmounted(() => {
  clearInterval(id)
})
```

---

**Pro tip**: Bookmark this glossary and refer back when encountering unfamiliar terms in exercises or advanced lessons.
