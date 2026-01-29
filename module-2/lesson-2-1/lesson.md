# Lesson 2.1 — Component Lifecycle & Hooks

## Learning Goals
- Understand the Vue component lifecycle phases
- Master lifecycle hooks: `onMounted`, `onUpdated`, `onUnmounted`, `onBeforeUnmount`
- Implement proper cleanup patterns for resources
- Handle data fetching with lifecycle management
- Avoid memory leaks and resource management issues
- Know when to use each lifecycle hook

## Prerequisites
- Completed Module 1 (Vue Foundations)
- Understanding of async/await and Promises
- Basic knowledge of event listeners and timers

## What You Will Build
A data fetching component with proper lifecycle management that demonstrates mounting, updating, cleanup, and resource management patterns.

---

## Component Lifecycle Overview

Every Vue component goes through a series of phases from creation to destruction. Vue provides **lifecycle hooks** to run code at specific stages.

### The Four Main Phases

```
1. Creation → Setup (Composition API setup() runs here)
2. Mounting → Component added to DOM
3. Updating → Reactive data changes trigger re-renders
4. Unmounting → Component removed from DOM
```

> ⚠️ **CRITICAL**: Always clean up resources in unmount hooks to prevent memory leaks!

---

## Setup Phase (Before Mount)

In Composition API, the `<script setup>` code runs **before** the component is mounted to the DOM.

```ts
<script setup lang="ts">
import { ref } from 'vue'

// This code runs BEFORE mounting
console.log('Setup phase - component not in DOM yet')

const count = ref(0)
const data = ref(null)

// ❌ WRONG: DOM is not available yet
// document.querySelector('#my-element') // Returns null!
</script>
```

> 💡 **IMPORTANT**: Don't access DOM elements or component refs during setup - they don't exist yet!

---

## onMounted Hook

Runs **once** after the component is added to the DOM. Perfect for:
- Data fetching
- Setting up event listeners
- Accessing DOM elements
- Initializing third-party libraries

### Basic Usage

```ts
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const data = ref(null)
const loading = ref(false)

onMounted(async () => {
  console.log('Component is now in the DOM!')
  
  loading.value = true
  try {
    const response = await fetch('/api/data')
    data.value = await response.json()
  } catch (error) {
    console.error('Failed to fetch data:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="data">{{ data }}</div>
</template>
```

### Accessing DOM Elements

```ts
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  // Now the DOM element exists
  inputRef.value?.focus()
})
</script>

<template>
  <input ref="inputRef" type="text" placeholder="Auto-focused">
</template>
```

> ⚠️ **CRITICAL**: Template refs are `null` during setup, only available in `onMounted` and later!

---

## onBeforeUnmount & onUnmounted Hooks

Clean up resources when component is removed from DOM.

### onBeforeUnmount
Runs **before** the component is removed (DOM still accessible).

```ts
import { onBeforeUnmount } from 'vue'

onBeforeUnmount(() => {
  console.log('About to be removed from DOM')
  // Save state, show confirmation, etc.
})
```

### onUnmounted
Runs **after** the component is removed (DOM no longer accessible).

```ts
import { onUnmounted } from 'vue'

onUnmounted(() => {
  console.log('Component fully removed')
  // Final cleanup if needed
})
```

### Critical: Cleanup Patterns

**Event Listeners**
```ts
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

let resizeHandler: (() => void) | null = null

onMounted(() => {
  resizeHandler = () => {
    console.log('Window resized')
  }
  window.addEventListener('resize', resizeHandler)
})

onUnmounted(() => {
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }
})
</script>
```

**Timers**
```ts
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const timer = ref<number | null>(null)

onMounted(() => {
  timer.value = window.setInterval(() => {
    console.log('Tick')
  }, 1000)
})

onUnmounted(() => {
  if (timer.value !== null) {
    clearInterval(timer.value)
  }
})
</script>
```

**WebSocket Connections**
```ts
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const socket = ref<WebSocket | null>(null)

onMounted(() => {
  socket.value = new WebSocket('ws://localhost:8080')
  
  socket.value.onmessage = (event) => {
    console.log('Message:', event.data)
  }
})

onUnmounted(() => {
  socket.value?.close()
})
</script>
```

> ⚠️ **CRITICAL**: Failing to clean up timers, listeners, and connections causes memory leaks!

---

## onUpdated Hook

Runs **after** the component re-renders due to reactive data changes.

```ts
<script setup lang="ts">
import { ref, onUpdated } from 'vue'

const count = ref(0)

onUpdated(() => {
  console.log('Component re-rendered!')
  // DOM reflects latest reactive state
})
</script>

<template>
  <button @click="count++">Count: {{ count }}</button>
</template>
```

> 💡 **IMPORTANT**: `onUpdated` runs on EVERY re-render. Avoid expensive operations or infinite loops!

### Common Pitfall: Infinite Update Loop

```ts
// ❌ WRONG: Modifying reactive state in onUpdated
onUpdated(() => {
  count.value++ // Causes another update → infinite loop!
})
```

**Use Cases for onUpdated**:
- Integrate with non-Vue libraries that need DOM sync
- Scroll position restoration
- Animations based on DOM changes

---

## onBeforeMount Hook

Rarely needed. Runs before initial render.

```ts
import { onBeforeMount } from 'vue'

onBeforeMount(() => {
  console.log('About to mount (DOM not ready yet)')
})
```

> 💡 **IMPORTANT**: Most setup logic belongs in `<script setup>` or `onMounted`, not `onBeforeMount`.

---

## onBeforeUpdate Hook

Runs before re-render. Useful for capturing DOM state before changes.

```ts
import { onBeforeUpdate } from 'vue'

onBeforeUpdate(() => {
  console.log('About to update (old DOM still present)')
})
```

---

## Complete Lifecycle Example

```ts
<script setup lang="ts">
import { 
  ref, 
  onBeforeMount,
  onMounted, 
  onBeforeUpdate,
  onUpdated, 
  onBeforeUnmount,
  onUnmounted 
} from 'vue'

const count = ref(0)

console.log('1. Setup phase (before everything)')

onBeforeMount(() => {
  console.log('2. Before mount (DOM not ready)')
})

onMounted(() => {
  console.log('3. Mounted (DOM ready)')
})

onBeforeUpdate(() => {
  console.log('4. Before update (old DOM)')
})

onUpdated(() => {
  console.log('5. Updated (new DOM)')
})

onBeforeUnmount(() => {
  console.log('6. Before unmount (still in DOM)')
})

onUnmounted(() => {
  console.log('7. Unmounted (removed from DOM)')
})
</script>

<template>
  <button @click="count++">Count: {{ count }}</button>
</template>
```

**Console output when button clicked:**
```
1. Setup phase (before everything)
2. Before mount (DOM not ready)
3. Mounted (DOM ready)
4. Before update (old DOM)
5. Updated (new DOM)
```

---

## Practical Pattern: Data Fetching with Lifecycle

```ts
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface User {
  id: number
  name: string
  email: string
}

const users = ref<User[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const controller = ref<AbortController | null>(null)

onMounted(async () => {
  loading.value = true
  error.value = null
  controller.value = new AbortController()

  try {
    const response = await fetch('/api/users', {
      signal: controller.value.signal
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    users.value = await response.json()
  } catch (err: any) {
    if (err.name !== 'AbortError') {
      error.value = err.message
    }
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  // Cancel ongoing request if component unmounts
  controller.value?.abort()
})
</script>

<template>
  <div v-if="loading">Loading users...</div>
  <div v-else-if="error" class="error">Error: {{ error }}</div>
  <ul v-else>
    <li v-for="user in users" :key="user.id">
      {{ user.name }} ({{ user.email }})
    </li>
  </ul>
</template>
```

> ⚠️ **CRITICAL**: Always abort fetch requests in `onUnmounted` to prevent race conditions!

---

## Practical Pattern: Timer Component

```ts
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const seconds = ref(0)
const intervalId = ref<number | null>(null)

onMounted(() => {
  intervalId.value = window.setInterval(() => {
    seconds.value++
  }, 1000)
})

onUnmounted(() => {
  if (intervalId.value !== null) {
    clearInterval(intervalId.value)
  }
})
</script>

<template>
  <div>Timer: {{ seconds }}s</div>
</template>
```

---

## Common Mistakes & Best Practices

### ❌ Mistake 1: Not Cleaning Up Event Listeners

```ts
// ❌ WRONG: Memory leak!
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
// Missing onUnmounted cleanup!
```

```ts
// ✅ CORRECT
const handleScroll = () => { /* ... */ }

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
```

### ❌ Mistake 2: Accessing DOM in Setup

```ts
// ❌ WRONG: inputRef.value is null!
<script setup lang="ts">
const inputRef = ref<HTMLInputElement | null>(null)
inputRef.value?.focus() // Error: null
</script>
```

```ts
// ✅ CORRECT: Wait for onMounted
<script setup lang="ts">
const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  inputRef.value?.focus() // Works!
})
</script>
```

### ❌ Mistake 3: Infinite Update Loop

```ts
// ❌ WRONG: Modifying state in onUpdated
onUpdated(() => {
  count.value++ // Triggers another update → infinite loop!
})
```

```ts
// ✅ CORRECT: Use watcher with proper conditions
watch(count, (newVal) => {
  if (newVal < 10) {
    // Conditional update OK
  }
})
```

---

## When to Use Each Hook

| Hook              | Use Case                                                 |
| ----------------- | -------------------------------------------------------- |
| `onBeforeMount`   | Rarely needed - most logic goes in setup or onMounted    |
| `onMounted`       | Data fetching, DOM access, event listeners, library init |
| `onBeforeUpdate`  | Capture DOM state before changes (rare)                  |
| `onUpdated`       | Sync with non-Vue libraries after render (use sparingly) |
| `onBeforeUnmount` | Save state, show confirmation dialogs                    |
| `onUnmounted`     | Clean up timers, listeners, connections, subscriptions   |

---

## SSR Considerations

Some lifecycle hooks **don't run on the server** during SSR:

- `onMounted` → Client only
- `onUpdated` → Client only  
- `onBeforeUnmount` → Client only
- `onUnmounted` → Client only

> 💡 **IMPORTANT**: For SSR apps, use `onServerPrefetch` for server-side data fetching.

---

## Testing Lifecycle Hooks

```ts
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import MyComponent from './MyComponent.vue'

describe('MyComponent lifecycle', () => {
  it('fetches data on mount', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ data: [] })
    global.fetch = fetchMock

    const wrapper = mount(MyComponent)
    await wrapper.vm.$nextTick()

    expect(fetchMock).toHaveBeenCalled()
  })

  it('cleans up on unmount', () => {
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval')
    
    const wrapper = mount(MyComponent)
    wrapper.unmount()

    expect(clearIntervalSpy).toHaveBeenCalled()
  })
})
```

---

## Summary

✅ **onMounted**: Data fetching, DOM access, setup listeners/timers  
✅ **onUnmounted**: Always clean up resources (listeners, timers, connections)  
✅ **onUpdated**: Rarely needed - avoid modifying state  
✅ **Template refs**: Only available in `onMounted` and later  
✅ **Memory leaks**: Clean up ALL subscriptions and timers  

---

## Next Steps
- Complete [sample-project.md](sample-project.md) to build a timer component with proper cleanup
- Work through [exercises.md](exercises.md) to practice lifecycle patterns
- Take the [quiz.md](quiz.md) to test your understanding
- Move on to Lesson 2.2 (Composition API Fundamentals)
