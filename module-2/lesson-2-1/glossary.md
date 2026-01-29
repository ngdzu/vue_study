# Glossary — Lesson 2.1 Terms & Definitions

Quick reference for technical terms used in this lesson.

---

## Core Concepts

### Lifecycle
**Definition**: The series of phases a component goes through from creation to destruction.

**In Vue**: Every component has a lifecycle: setup → mount → update → unmount.

**Example**:
```ts
// Component lifecycle phases
1. Setup (reactive state initialized)
2. Mount (component added to DOM)
3. Update (reactive changes trigger re-renders)
4. Unmount (component removed from DOM)
```

---

### Lifecycle Hook
**Definition**: A function that runs at a specific phase of the component lifecycle.

**In Vue**: Lifecycle hooks let you execute code at precise moments (e.g., after mounting, before unmounting).

**Example**:
```ts
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  console.log('Component is in the DOM')
})

onUnmounted(() => {
  console.log('Component removed from DOM')
})
```

---

### Memory Leak
**Definition**: When a program allocates memory but fails to release it, causing memory usage to grow over time.

**Common causes in Vue**:
- Event listeners not removed
- Timers (setInterval, setTimeout) not cleared
- WebSocket connections not closed
- Subscriptions not cancelled

**Example of a memory leak**:
```ts
// ❌ WRONG: Event listener never removed
onMounted(() => {
  window.addEventListener('resize', handleResize)
})
// Missing cleanup → memory leak!
```

**Fixed version**:
```ts
// ✅ CORRECT: Cleanup prevents memory leak
onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
```

---

### Cleanup
**Definition**: The process of releasing resources (timers, listeners, connections) before a component is destroyed.

**Why it matters**: Prevents memory leaks and unexpected behavior.

**Example**:
```ts
const intervalId = ref<number | null>(null)

onMounted(() => {
  intervalId.value = setInterval(() => {
    console.log('Tick')
  }, 1000)
})

onUnmounted(() => {
  if (intervalId.value !== null) {
    clearInterval(intervalId.value) // Cleanup!
  }
})
```

---

### Template Ref
**Definition**: A reference to a DOM element or child component instance from the template.

**In Vue**: Use `ref` attribute in template and `ref()` in script to access elements.

**Example**:
```ts
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  inputRef.value?.focus() // Access DOM element
})
</script>

<template>
  <input ref="inputRef" type="text">
</template>
```

> ⚠️ **CRITICAL**: Template refs are `null` until `onMounted`!

---

### AbortController
**Definition**: Web API for cancelling asynchronous operations (like fetch requests).

**Why use it**: Prevents race conditions when components unmount before fetch completes.

**Example**:
```ts
const controller = ref<AbortController | null>(null)

onMounted(async () => {
  controller.value = new AbortController()
  
  try {
    const response = await fetch('/api/data', {
      signal: controller.value.signal
    })
    const data = await response.json()
  } catch (err: any) {
    if (err.name !== 'AbortError') {
      console.error(err)
    }
  }
})

onUnmounted(() => {
  controller.value?.abort() // Cancel fetch if still pending
})
```

---

### Side Effect
**Definition**: Any operation that affects external state outside the function (DOM manipulation, API calls, timers, etc.).

**Examples of side effects**:
- Fetching data from an API
- Setting up event listeners
- Starting timers
- Modifying the DOM directly
- Writing to localStorage

**In lifecycle hooks**:
```ts
onMounted(() => {
  // Side effect: API call
  fetch('/api/data').then(response => { /* ... */ })
  
  // Side effect: Event listener
  window.addEventListener('scroll', handleScroll)
})
```

---

### Race Condition
**Definition**: When the order of asynchronous operations affects the outcome, leading to unpredictable results.

**Example scenario**:
```ts
// User navigates away before fetch completes
// Without cleanup, the response still updates state!

onMounted(async () => {
  const response = await fetch('/api/slow-endpoint')
  // Component might be unmounted by now!
  data.value = await response.json() // ❌ Updates unmounted component
})
```

**Fixed with AbortController**:
```ts
const controller = ref<AbortController | null>(null)

onMounted(async () => {
  controller.value = new AbortController()
  
  try {
    const response = await fetch('/api/slow-endpoint', {
      signal: controller.value.signal
    })
    data.value = await response.json()
  } catch (err: any) {
    if (err.name === 'AbortError') {
      console.log('Fetch cancelled')
    }
  }
})

onUnmounted(() => {
  controller.value?.abort() // Prevents race condition
})
```

---

### Hydration (SSR Context)
**Definition**: The process of attaching Vue's reactivity system to server-rendered HTML on the client.

**Why it matters for lifecycle**: Some hooks (`onMounted`, `onUnmounted`) only run on the client, not during server-side rendering.

**Example**:
```ts
onMounted(() => {
  // This ONLY runs in the browser, not on the server
  console.log('Client-side only')
})
```

---

### Component Instance
**Definition**: The runtime object representing a mounted component with its state, methods, and lifecycle.

**Accessing in Composition API**:
```ts
import { getCurrentInstance, onMounted } from 'vue'

onMounted(() => {
  const instance = getCurrentInstance()
  console.log(instance) // Component instance object
})
```

> 💡 **IMPORTANT**: `getCurrentInstance()` only works inside `setup()` or lifecycle hooks!

---

### Mounting
**Definition**: The process of adding a component to the DOM.

**Timeline**:
1. `setup()` runs (reactive state initialized)
2. `onBeforeMount` hook
3. Vue creates DOM elements
4. Elements inserted into DOM
5. `onMounted` hook

---

### Unmounting
**Definition**: The process of removing a component from the DOM and cleaning up resources.

**Timeline**:
1. `onBeforeUnmount` hook (DOM still accessible)
2. Vue removes component from DOM
3. Cleanup internal resources
4. `onUnmounted` hook

---

### Update Cycle
**Definition**: The process of re-rendering a component when reactive data changes.

**Timeline**:
1. Reactive data changes
2. `onBeforeUpdate` hook
3. Virtual DOM diff calculated
4. Real DOM patched
5. `onUpdated` hook

---

### Event Listener
**Definition**: A function that runs in response to an event (click, resize, scroll, etc.).

**Proper lifecycle management**:
```ts
const handleResize = () => {
  console.log('Window resized')
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize) // Must cleanup!
})
```

> ⚠️ **CRITICAL**: Always remove event listeners in `onUnmounted`!

---

### Timer
**Definition**: Asynchronous code scheduled to run after a delay (`setTimeout`) or repeatedly (`setInterval`).

**Proper lifecycle management**:
```ts
const timerId = ref<number | null>(null)

onMounted(() => {
  timerId.value = setInterval(() => {
    console.log('Tick')
  }, 1000)
})

onUnmounted(() => {
  if (timerId.value !== null) {
    clearInterval(timerId.value) // Must cleanup!
  }
})
```

---

### Third-Party Library Integration
**Definition**: Using external JavaScript libraries (charts, maps, date pickers) with Vue components.

**Pattern**:
```ts
import Chart from 'chart.js/auto'

const chartRef = ref<HTMLCanvasElement | null>(null)
const chartInstance = ref<Chart | null>(null)

onMounted(() => {
  if (chartRef.value) {
    chartInstance.value = new Chart(chartRef.value, {
      type: 'bar',
      data: { /* ... */ }
    })
  }
})

onUnmounted(() => {
  chartInstance.value?.destroy() // Cleanup library
})
```

---

### DOM Access
**Definition**: Directly interacting with DOM elements (reading properties, calling methods).

**When it's safe**:
- ✅ In `onMounted` and later hooks
- ✅ In event handlers
- ❌ NOT in `setup()` or `onBeforeMount`

**Example**:
```ts
const divRef = ref<HTMLDivElement | null>(null)

onMounted(() => {
  console.log(divRef.value?.offsetHeight) // ✅ Safe
})

// ❌ WRONG: DOM not ready yet
console.log(divRef.value?.offsetHeight) // null!
```

---

### Virtual DOM
**Definition**: Vue's in-memory representation of the UI, used to efficiently update the real DOM.

**Lifecycle connection**:
- `onBeforeUpdate`: Virtual DOM diff calculated
- Real DOM patched
- `onUpdated`: Real DOM reflects changes

---

### Resource Management
**Definition**: Allocating and releasing resources (memory, connections, file handles) properly.

**Critical for**:
- Event listeners
- Timers (setInterval, setTimeout)
- WebSocket/SSE connections
- Third-party library instances
- Fetch requests

**Pattern**:
```ts
// Allocate resource
onMounted(() => {
  // Setup timer, listener, connection, etc.
})

// Release resource
onUnmounted(() => {
  // Clear timer, remove listener, close connection, etc.
})
```

---

## Quick Reference Table

| Term                | Definition                        | Example                                    |
| ------------------- | --------------------------------- | ------------------------------------------ |
| **onMounted**       | Hook after component added to DOM | Data fetching, DOM access                  |
| **onUnmounted**     | Hook before component removed     | Cleanup timers/listeners                   |
| **onUpdated**       | Hook after re-render              | Sync with external libraries               |
| **Template Ref**    | Reference to DOM element          | `ref="inputRef"`                           |
| **Memory Leak**     | Unreleased resources              | Listener not removed                       |
| **Cleanup**         | Releasing resources               | `clearInterval()`, `removeEventListener()` |
| **AbortController** | Cancel async operations           | Cancel fetch on unmount                    |
| **Race Condition**  | Order-dependent async bugs        | Fetch completes after unmount              |
| **Side Effect**     | External state changes            | API calls, DOM manipulation                |

---

## Common Patterns

### Pattern 1: Data Fetching
```ts
onMounted(async () => {
  loading.value = true
  try {
    data.value = await fetchData()
  } finally {
    loading.value = false
  }
})
```

### Pattern 2: Event Listener
```ts
const handler = () => { /* ... */ }

onMounted(() => {
  window.addEventListener('event', handler)
})

onUnmounted(() => {
  window.removeEventListener('event', handler)
})
```

### Pattern 3: Timer
```ts
const id = ref<number | null>(null)

onMounted(() => {
  id.value = setInterval(() => { /* ... */ }, 1000)
})

onUnmounted(() => {
  if (id.value !== null) clearInterval(id.value)
})
```

### Pattern 4: Third-Party Library
```ts
const instance = ref(null)

onMounted(() => {
  instance.value = new Library(element)
})

onUnmounted(() => {
  instance.value?.destroy()
})
```
