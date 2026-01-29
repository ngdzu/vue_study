# Lesson 2.3 — Building Reusable Composables

## Learning Goals

By the end of this lesson, you will be able to:

- ✅ Understand composable patterns and when to extract logic
- ✅ Create reusable composables with proper state management
- ✅ Implement common composable patterns: `useCounter`, `useFetch`, `useAsync`
- ✅ Handle loading, error, and success states in composables
- ✅ Design composables with proper cleanup and lifecycle management
- ✅ Write type-safe composables with TypeScript
- ✅ Test composables in isolation
- ✅ Follow best practices for composable design

## Prerequisites

Before starting this lesson, you should:

- ✅ Understand the Composition API (`ref`, `computed`, `watch`)
- ✅ Be comfortable with lifecycle hooks (`onMounted`, `onUnmounted`)
- ✅ Know async/await and Promise patterns
- ✅ Have completed Module 2, Lessons 2.1 and 2.2

## What You Will Build

In this lesson, you will:

1. **Create a `useCounter` composable** with increment, decrement, and reset
2. **Build a `useFetch` composable** with loading/error states
3. **Implement a `useApi` composable** with caching and retry logic
4. **Design a `useLocalStorage` composable** for persistent state
5. **Write unit tests** for your composables

---

## What is a Composable?

A **composable** is a function that uses Composition API features to encapsulate and reuse stateful logic. Composables follow a naming convention: **`use*`** (e.g., `useCounter`, `useMouse`, `useFetch`).

### Why Use Composables?

**Without composables** (duplicated logic):

```ts
// Component A
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
const increment = () => count.value++
const decrement = () => count.value--
const reset = () => count.value = 0
</script>

// Component B - same logic duplicated!
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
const increment = () => count.value++
const decrement = () => count.value--
const reset = () => count.value = 0
</script>
```

**With composables** (logic extracted):

```ts
// composables/useCounter.ts
import { ref } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue
  
  return { count, increment, decrement, reset }
}

// Component A
<script setup lang="ts">
import { useCounter } from '@/composables/useCounter'
const { count, increment, decrement, reset } = useCounter(0)
</script>

// Component B - same logic, no duplication!
<script setup lang="ts">
import { useCounter } from '@/composables/useCounter'
const { count, increment, decrement, reset } = useCounter(10)
</script>
```

> 💡 **IMPORTANT**: Composables enable **logic reuse** without component inheritance or mixins!

---

## Composable Pattern #1: useCounter

Let's build a complete counter composable with validation and limits.

### Basic Implementation

```ts
// composables/useCounter.ts
import { ref, computed, readonly } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue
  
  return {
    count: readonly(count),  // Prevent external mutation
    increment,
    decrement,
    reset
  }
}
```

> ⚠️ **CRITICAL**: Use `readonly()` to prevent consumers from directly mutating state!

### Advanced: Validation and Limits

```ts
// composables/useCounter.ts
import { ref, computed, readonly } from 'vue'

interface UseCounterOptions {
  min?: number
  max?: number
  step?: number
}

export function useCounter(
  initialValue = 0,
  options: UseCounterOptions = {}
) {
  const { min = -Infinity, max = Infinity, step = 1 } = options
  
  const count = ref(initialValue)
  
  // Computed properties for state
  const isAtMax = computed(() => count.value >= max)
  const isAtMin = computed(() => count.value <= min)
  
  const increment = () => {
    if (count.value + step <= max) {
      count.value += step
    }
  }
  
  const decrement = () => {
    if (count.value - step >= min) {
      count.value -= step
    }
  }
  
  const reset = () => {
    count.value = initialValue
  }
  
  const set = (value: number) => {
    if (value >= min && value <= max) {
      count.value = value
    }
  }
  
  return {
    count: readonly(count),
    isAtMax,
    isAtMin,
    increment,
    decrement,
    reset,
    set
  }
}
```

### Usage Example

```ts
<script setup lang="ts">
import { useCounter } from '@/composables/useCounter'

const { count, increment, decrement, isAtMax, isAtMin } = useCounter(5, {
  min: 0,
  max: 10,
  step: 1
})
</script>

<template>
  <div>
    <button @click="decrement" :disabled="isAtMin">-</button>
    <span>{{ count }}</span>
    <button @click="increment" :disabled="isAtMax">+</button>
  </div>
</template>
```

---

## Composable Pattern #2: useFetch

A composable for data fetching with loading and error states.

### Basic Implementation

```ts
// composables/useFetch.ts
import { ref, readonly } from 'vue'

export function useFetch<T>(url: string) {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)
  
  const execute = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      data.value = await response.json()
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }
  
  return {
    data: readonly(data),
    error: readonly(error),
    loading: readonly(loading),
    execute
  }
}
```

### Advanced: Auto-fetch and Abort

```ts
// composables/useFetch.ts
import { ref, readonly, onUnmounted } from 'vue'

interface UseFetchOptions {
  immediate?: boolean
  refetch?: number  // Auto-refetch interval in ms
}

export function useFetch<T>(
  url: string,
  options: UseFetchOptions = {}
) {
  const { immediate = true, refetch } = options
  
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)
  const controller = ref<AbortController | null>(null)
  
  let refetchInterval: number | null = null
  
  const execute = async () => {
    // Abort previous request
    controller.value?.abort()
    controller.value = new AbortController()
    
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(url, {
        signal: controller.value.signal
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      data.value = await response.json()
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        error.value = e as Error
      }
    } finally {
      loading.value = false
    }
  }
  
  // Auto-fetch on mount
  if (immediate) {
    execute()
  }
  
  // Setup refetch interval
  if (refetch) {
    refetchInterval = window.setInterval(execute, refetch)
  }
  
  // Cleanup on unmount
  onUnmounted(() => {
    controller.value?.abort()
    if (refetchInterval) {
      clearInterval(refetchInterval)
    }
  })
  
  return {
    data: readonly(data),
    error: readonly(error),
    loading: readonly(loading),
    execute
  }
}
```

> ⚠️ **CRITICAL**: Always clean up timers and abort controllers in `onUnmounted`!

### Usage Example

```ts
<script setup lang="ts">
import { useFetch } from '@/composables/useFetch'

interface User {
  id: number
  name: string
  email: string
}

const { data, error, loading, execute } = useFetch<User[]>(
  'https://jsonplaceholder.typicode.com/users',
  { immediate: true, refetch: 30000 } // Refetch every 30 seconds
)
</script>

<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else-if="data">
      <div v-for="user in data" :key="user.id">
        {{ user.name }} - {{ user.email }}
      </div>
    </div>
    <button @click="execute">Refresh</button>
  </div>
</template>
```

---

## Composable Pattern #3: useAsync

A generic composable for handling any async operation.

### Implementation

```ts
// composables/useAsync.ts
import { ref, readonly } from 'vue'

export function useAsync<T, Args extends any[]>(
  asyncFunction: (...args: Args) => Promise<T>
) {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)
  
  const execute = async (...args: Args) => {
    loading.value = true
    error.value = null
    
    try {
      data.value = await asyncFunction(...args)
      return data.value
    } catch (e) {
      error.value = e as Error
      throw e
    } finally {
      loading.value = false
    }
  }
  
  const reset = () => {
    data.value = null
    error.value = null
    loading.value = false
  }
  
  return {
    data: readonly(data),
    error: readonly(error),
    loading: readonly(loading),
    execute,
    reset
  }
}
```

### Usage Example

```ts
<script setup lang="ts">
import { useAsync } from '@/composables/useAsync'

async function loginUser(email: string, password: string) {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  return response.json()
}

const { data, error, loading, execute } = useAsync(loginUser)

const handleLogin = async () => {
  try {
    await execute('user@example.com', 'password123')
    console.log('Login successful!', data.value)
  } catch (e) {
    console.error('Login failed:', error.value)
  }
}
</script>

<template>
  <div>
    <button @click="handleLogin" :disabled="loading">
      {{ loading ? 'Logging in...' : 'Login' }}
    </button>
    <div v-if="error">Error: {{ error.message }}</div>
  </div>
</template>
```

---

## Composable Pattern #4: useLocalStorage

Sync reactive state with localStorage.

### Implementation

```ts
// composables/useLocalStorage.ts
import { ref, watch, readonly } from 'vue'

export function useLocalStorage<T>(
  key: string,
  defaultValue: T
) {
  // Read from localStorage or use default
  const storedValue = localStorage.getItem(key)
  const data = ref<T>(
    storedValue ? JSON.parse(storedValue) : defaultValue
  )
  
  // Sync to localStorage whenever data changes
  watch(
    data,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue))
    },
    { deep: true }
  )
  
  // Method to remove from localStorage
  const remove = () => {
    localStorage.removeItem(key)
    data.value = defaultValue
  }
  
  return {
    data,
    remove
  }
}
```

> 💡 **IMPORTANT**: Use `{ deep: true }` to watch nested object changes!

### Advanced: With Event Listener for Cross-tab Sync

```ts
// composables/useLocalStorage.ts
import { ref, watch, onMounted, onUnmounted } from 'vue'

export function useLocalStorage<T>(
  key: string,
  defaultValue: T
) {
  const storedValue = localStorage.getItem(key)
  const data = ref<T>(
    storedValue ? JSON.parse(storedValue) : defaultValue
  )
  
  // Sync to localStorage
  watch(
    data,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue))
    },
    { deep: true }
  )
  
  // Listen for changes from other tabs
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === key && e.newValue) {
      data.value = JSON.parse(e.newValue)
    }
  }
  
  onMounted(() => {
    window.addEventListener('storage', handleStorageChange)
  })
  
  onUnmounted(() => {
    window.removeEventListener('storage', handleStorageChange)
  })
  
  const remove = () => {
    localStorage.removeItem(key)
    data.value = defaultValue
  }
  
  return { data, remove }
}
```

### Usage Example

```ts
<script setup lang="ts">
import { useLocalStorage } from '@/composables/useLocalStorage'

interface UserSettings {
  theme: 'light' | 'dark'
  language: string
  notifications: boolean
}

const { data: settings, remove } = useLocalStorage<UserSettings>(
  'user-settings',
  {
    theme: 'light',
    language: 'en',
    notifications: true
  }
)
</script>

<template>
  <div>
    <label>
      Theme:
      <select v-model="settings.theme">
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
    
    <label>
      <input type="checkbox" v-model="settings.notifications" />
      Enable Notifications
    </label>
    
    <button @click="remove">Reset to Defaults</button>
  </div>
</template>
```

---

## Advanced Pattern: useApi with Caching

A production-ready API composable with caching and retry logic.

### Implementation

```ts
// composables/useApi.ts
import { ref, readonly, onUnmounted } from 'vue'

interface UseApiOptions {
  cache?: boolean
  cacheTime?: number  // Cache duration in ms
  retries?: number
  retryDelay?: number
}

const cache = new Map<string, { data: any; timestamp: number }>()

export function useApi<T>(
  url: string,
  options: UseApiOptions = {}
) {
  const {
    cache: useCache = true,
    cacheTime = 5 * 60 * 1000, // 5 minutes
    retries = 3,
    retryDelay = 1000
  } = options
  
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)
  const controller = ref<AbortController | null>(null)
  
  const execute = async () => {
    // Check cache first
    if (useCache && cache.has(url)) {
      const cached = cache.get(url)!
      const age = Date.now() - cached.timestamp
      
      if (age < cacheTime) {
        data.value = cached.data
        return cached.data
      } else {
        cache.delete(url)
      }
    }
    
    // Abort previous request
    controller.value?.abort()
    controller.value = new AbortController()
    
    loading.value = true
    error.value = null
    
    let lastError: Error | null = null
    
    // Retry logic
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, {
          signal: controller.value.signal
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        data.value = result
        
        // Update cache
        if (useCache) {
          cache.set(url, {
            data: result,
            timestamp: Date.now()
          })
        }
        
        loading.value = false
        return result
      } catch (e: any) {
        if (e.name === 'AbortError') {
          throw e
        }
        
        lastError = e as Error
        
        // Wait before retry
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay))
        }
      }
    }
    
    // All retries failed
    error.value = lastError
    loading.value = false
    throw lastError
  }
  
  const invalidateCache = () => {
    cache.delete(url)
  }
  
  onUnmounted(() => {
    controller.value?.abort()
  })
  
  return {
    data: readonly(data),
    error: readonly(error),
    loading: readonly(loading),
    execute,
    invalidateCache
  }
}
```

### Usage Example

```ts
<script setup lang="ts">
import { useApi } from '@/composables/useApi'

interface Post {
  id: number
  title: string
  body: string
}

const { data, error, loading, execute, invalidateCache } = useApi<Post[]>(
  'https://jsonplaceholder.typicode.com/posts',
  {
    cache: true,
    cacheTime: 5 * 60 * 1000, // 5 minutes
    retries: 3,
    retryDelay: 1000
  }
)

// Fetch on mount
execute()
</script>

<template>
  <div>
    <button @click="execute" :disabled="loading">Refresh</button>
    <button @click="invalidateCache">Clear Cache</button>
    
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else-if="data">
      <div v-for="post in data" :key="post.id">
        <h3>{{ post.title }}</h3>
        <p>{{ post.body }}</p>
      </div>
    </div>
  </div>
</template>
```

---

## Composable Best Practices

### 1. Return Readonly State

```ts
// ✅ GOOD: Prevent external mutation
export function useCounter() {
  const count = ref(0)
  return {
    count: readonly(count),
    increment: () => count.value++
  }
}

// ❌ BAD: Allows external mutation
export function useCounter() {
  const count = ref(0)
  return {
    count,  // Can be mutated directly!
    increment: () => count.value++
  }
}
```

### 2. Accept Configuration Options

```ts
// ✅ GOOD: Flexible and configurable
export function useFetch<T>(url: string, options: {
  immediate?: boolean
  refetch?: number
} = {}) {
  // ...
}

// ❌ BAD: Hardcoded behavior
export function useFetch<T>(url: string) {
  // Always fetches immediately, no configuration
}
```

### 3. Proper Cleanup

```ts
// ✅ GOOD: Cleanup resources
export function useInterval(callback: () => void, delay: number) {
  let intervalId: number | null = null
  
  const start = () => {
    intervalId = window.setInterval(callback, delay)
  }
  
  onUnmounted(() => {
    if (intervalId) clearInterval(intervalId)
  })
  
  return { start }
}

// ❌ BAD: Memory leak!
export function useInterval(callback: () => void, delay: number) {
  const start = () => {
    window.setInterval(callback, delay) // Never cleared!
  }
  return { start }
}
```

### 4. Type Safety with TypeScript

```ts
// ✅ GOOD: Proper types
export function useFetch<T>(url: string): {
  data: Readonly<Ref<T | null>>
  error: Readonly<Ref<Error | null>>
  loading: Readonly<Ref<boolean>>
  execute: () => Promise<void>
} {
  // ...
}

// ❌ BAD: No types
export function useFetch(url) {
  // No type safety
}
```

### 5. Single Responsibility

```ts
// ✅ GOOD: Single purpose
export function useFetch<T>(url: string) {
  // Only handles fetching
}

export function useLocalStorage<T>(key: string) {
  // Only handles localStorage
}

// ❌ BAD: Too many responsibilities
export function useDataManager<T>(url: string, storageKey: string) {
  // Handles fetching AND localStorage AND caching AND...
  // Too complex!
}
```

---

## Testing Composables

Composables should be tested in isolation.

### Setup Test Environment

```bash
npm install -D vitest @vue/test-utils
```

### Test Example: useCounter

```ts
// composables/__tests__/useCounter.spec.ts
import { describe, it, expect } from 'vitest'
import { useCounter } from '../useCounter'

describe('useCounter', () => {
  it('initializes with default value', () => {
    const { count } = useCounter()
    expect(count.value).toBe(0)
  })
  
  it('initializes with custom value', () => {
    const { count } = useCounter(10)
    expect(count.value).toBe(10)
  })
  
  it('increments count', () => {
    const { count, increment } = useCounter(5)
    increment()
    expect(count.value).toBe(6)
  })
  
  it('decrements count', () => {
    const { count, decrement } = useCounter(5)
    decrement()
    expect(count.value).toBe(4)
  })
  
  it('respects max limit', () => {
    const { count, increment } = useCounter(9, { max: 10 })
    increment()
    expect(count.value).toBe(10)
    increment() // Should not exceed max
    expect(count.value).toBe(10)
  })
  
  it('respects min limit', () => {
    const { count, decrement } = useCounter(1, { min: 0 })
    decrement()
    expect(count.value).toBe(0)
    decrement() // Should not go below min
    expect(count.value).toBe(0)
  })
  
  it('resets to initial value', () => {
    const { count, increment, reset } = useCounter(5)
    increment()
    increment()
    expect(count.value).toBe(7)
    reset()
    expect(count.value).toBe(5)
  })
})
```

### Test Example: useFetch (with mocking)

```ts
// composables/__tests__/useFetch.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useFetch } from '../useFetch'

global.fetch = vi.fn()

describe('useFetch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  
  it('fetches data successfully', async () => {
    const mockData = { id: 1, name: 'Test' }
    
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    })
    
    const { data, error, loading, execute } = useFetch('/api/test', {
      immediate: false
    })
    
    expect(loading.value).toBe(false)
    expect(data.value).toBe(null)
    
    await execute()
    
    expect(loading.value).toBe(false)
    expect(data.value).toEqual(mockData)
    expect(error.value).toBe(null)
  })
  
  it('handles fetch errors', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404
    })
    
    const { data, error, execute } = useFetch('/api/test', {
      immediate: false
    })
    
    await execute()
    
    expect(data.value).toBe(null)
    expect(error.value).toBeTruthy()
    expect(error.value?.message).toContain('404')
  })
})
```

---

## When to Extract Logic into a Composable

### ✅ Good Candidates

- **Duplicated logic** across multiple components
- **Stateful behavior** that needs to be shared
- **Complex patterns** (data fetching, form validation, etc.)
- **Side effects** that need cleanup (timers, listeners, etc.)
- **Browser APIs** (localStorage, geolocation, etc.)

### ❌ Not Good Candidates

- **Simple utilities** without state (use regular functions)
- **Component-specific logic** that won't be reused
- **One-time operations** without state or lifecycle needs

---

## Summary

In this lesson, you learned:

- ✅ What composables are and why they're useful
- ✅ Common composable patterns: `useCounter`, `useFetch`, `useAsync`
- ✅ How to handle loading, error, and success states
- ✅ Best practices for composable design (readonly, cleanup, types)
- ✅ How to test composables in isolation
- ✅ When to extract logic into a composable

**Next Steps**: Complete the exercises to build `useLocalStorage`, `useWindowSize`, and write tests for your composables. Then move on to Lesson 2.4: Slots & Template Slots.

---

## Additional Resources

- [Vue Composables Guide](https://vuejs.org/guide/reusability/composables.html)
- [VueUse - Collection of Vue Composables](https://vueuse.org/)
- [Testing Composables with Vitest](https://vitest.dev/)
