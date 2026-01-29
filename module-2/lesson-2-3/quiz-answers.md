# Quiz Answers — Lesson 2.3 (Building Reusable Composables)

1) **What is a composable in Vue 3?**

A composable is a function that uses Vue's Composition API to encapsulate and reuse stateful logic. It allows you to extract reactive state and behaviors into reusable functions that can be shared across components.

---

2) **What naming convention should composables follow?**

Composables should follow the `use*` naming convention (e.g., `useCounter`, `useFetch`, `useMouse`). This makes it clear that the function is a composable and follows Vue conventions.

---

3) **Why should composables return `readonly()` refs instead of regular refs?**

Returning `readonly()` refs prevents consumers from directly mutating the state, enforcing proper encapsulation. Changes should only be made through the composable's provided methods.

```ts
// ✅ GOOD: State can only be changed via methods
export function useCounter() {
  const count = ref(0)
  return {
    count: readonly(count),
    increment: () => count.value++
  }
}

// ❌ BAD: State can be mutated directly
export function useCounter() {
  const count = ref(0)
  return { count } // Can do: count.value = 999
}
```

---

4) **What's the difference between a composable and a regular utility function?**

- **Composable**: Uses Composition API features (`ref`, `reactive`, `computed`, `watch`, lifecycle hooks). Returns reactive state.
- **Utility function**: Pure function with no state or side effects. Returns computed values.

```ts
// Composable (stateful)
function useCounter() {
  const count = ref(0)
  const increment = () => count.value++
  return { count, increment }
}

// Utility (stateless)
function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`
}
```

---

5) **Write a basic `useCounter` composable that returns count, increment, and decrement.**

```ts
import { ref, readonly } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue
  
  return {
    count: readonly(count),
    increment,
    decrement,
    reset
  }
}
```

---

6) **What are the three main state properties in a `useFetch` composable?**

1. `data` - The fetched data (null initially)
2. `error` - Any error that occurred (null if no error)
3. `loading` - Boolean indicating if request is in progress

```ts
const { data, error, loading } = useFetch('/api/users')
```

---

7) **Why is it important to use `AbortController` in a fetch composable?**

`AbortController` allows you to cancel ongoing requests when:
- The component unmounts (prevents setting state on unmounted component)
- A new request starts (cancels the previous one)
- The user navigates away

This prevents memory leaks, race conditions, and unnecessary network usage.

```ts
const controller = new AbortController()

fetch(url, { signal: controller.signal })

// Later: cancel the request
controller.abort()
```

---

8) **What happens if you forget to call `onUnmounted` cleanup in a composable?**

You'll create memory leaks! Resources like:
- Event listeners continue listening
- Timers continue running
- Network requests continue
- Subscriptions stay active

This causes performance degradation and unexpected behavior.

---

9) **How do you make a composable type-safe with TypeScript?**

Use generics and explicit return types:

```ts
import { Ref, ref, readonly } from 'vue'

interface UseApiReturn<T> {
  data: Readonly<Ref<T | null>>
  error: Readonly<Ref<Error | null>>
  loading: Readonly<Ref<boolean>>
  execute: () => Promise<void>
}

export function useApi<T>(url: string): UseApiReturn<T> {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)
  
  const execute = async () => {
    // ...
  }
  
  return {
    data: readonly(data),
    error: readonly(error),
    loading: readonly(loading),
    execute
  }
}
```

---

10) **Write code to create a `useLocalStorage` composable that syncs to localStorage.**

```ts
import { ref, watch } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T) {
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
  
  const remove = () => {
    localStorage.removeItem(key)
    data.value = defaultValue
  }
  
  return { data, remove }
}
```

---

11) **What is the purpose of the `immediate` option in a `useFetch` composable?**

The `immediate` option controls whether the fetch should execute automatically when the composable is called, or wait for manual execution.

```ts
// Auto-fetch on mount
const { data } = useFetch('/api/users', { immediate: true })

// Wait for manual trigger
const { data, execute } = useFetch('/api/users', { immediate: false })
// Later: await execute()
```

---

12) **How do you implement caching in a composable?**

Use a `Map` to store fetched data with timestamps:

```ts
const cache = new Map<string, { data: any; timestamp: number }>()

export function useApi<T>(url: string, cacheTime = 5 * 60 * 1000) {
  const execute = async () => {
    // Check cache
    if (cache.has(url)) {
      const { data, timestamp } = cache.get(url)!
      const age = Date.now() - timestamp
      
      if (age < cacheTime) {
        return data // Return cached data
      }
    }
    
    // Fetch and cache
    const data = await fetch(url).then(r => r.json())
    cache.set(url, { data, timestamp: Date.now() })
    return data
  }
  
  return { execute }
}
```

---

13) **What's the difference between debouncing and throttling?**

- **Debouncing**: Delays execution until after a period of inactivity. Resets timer on each call.
  - Use case: Search input (wait for user to stop typing)

- **Throttling**: Limits execution to once per time period. Ignores calls during the period.
  - Use case: Scroll events (execute at most once per second)

```ts
// Debounce: waits 500ms after last keystroke
const debouncedSearch = debounce(search, 500)

// Throttle: executes at most once per 1000ms
const throttledScroll = throttle(handleScroll, 1000)
```

---

14) **Why should composables have a single responsibility?**

Single responsibility makes composables:
- **Easier to test** (fewer dependencies)
- **More reusable** (focused purpose)
- **Easier to understand** (clear intent)
- **Easier to maintain** (changes don't affect unrelated logic)

```ts
// ✅ GOOD: Single responsibility
function useFetch(url) { /* fetching only */ }
function useLocalStorage(key) { /* storage only */ }

// ❌ BAD: Too many responsibilities
function useDataManager(url, key) {
  // Handles fetching AND storage AND caching AND validation...
}
```

---

15) **How do you test a composable in isolation?**

Use a testing framework like Vitest:

```ts
import { describe, it, expect } from 'vitest'
import { useCounter } from '../useCounter'

describe('useCounter', () => {
  it('increments count', () => {
    const { count, increment } = useCounter(0)
    
    expect(count.value).toBe(0)
    increment()
    expect(count.value).toBe(1)
  })
})
```

---

16) **What is retry logic and why is it useful in API composables?**

Retry logic automatically retries failed requests a specified number of times before giving up. This is useful for:
- Temporary network issues
- Server rate limiting
- Transient errors

```ts
async function fetchWithRetry(url: string, retries = 3) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fetch(url).then(r => r.json())
    } catch (error) {
      if (attempt === retries) throw error
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
}
```

---

17) **Write code to implement cross-tab synchronization in `useLocalStorage`.**

```ts
import { ref, watch, onMounted, onUnmounted } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const data = ref<T>(
    JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultValue))
  )
  
  // Sync to localStorage
  watch(data, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue))
  }, { deep: true })
  
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
  
  return { data }
}
```

---

18) **What's wrong with this composable?**
    ```ts
    export function useCounter() {
      const count = ref(0)
      return { count }
    }
    ```

**Problems**:
1. Returns mutable `count` - consumers can mutate directly: `count.value = 999`
2. No methods to change state (increment, decrement)
3. No initial value parameter (not flexible)

**Fixed version**:
```ts
export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  const increment = () => count.value++
  const decrement = () => count.value--
  
  return {
    count: readonly(count), // ✅ Readonly
    increment,
    decrement
  }
}
```

---

19) **How do you handle errors in a composable?**

Store errors in a reactive `error` ref and expose it:

```ts
export function useFetch<T>(url: string) {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)
  
  const execute = async () => {
    loading.value = true
    error.value = null // Reset error
    
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      data.value = await response.json()
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }
  
  return { data, error, loading, execute }
}
```

---

20) **What is the purpose of the `watch` function with `{ deep: true }` option?**

`{ deep: true }` tells Vue to watch nested properties of objects and arrays. Without it, only the reference is watched.

```ts
const user = ref({ name: 'John', age: 30 })

// ❌ Won't trigger on nested changes
watch(user, () => console.log('Changed'))
user.value.age = 31 // No trigger!

// ✅ Triggers on nested changes
watch(user, () => console.log('Changed'), { deep: true })
user.value.age = 31 // Triggers!
```

---

21) **How do you prevent duplicate requests in a `useFetch` composable?**

Use `AbortController` to cancel the previous request when a new one starts:

```ts
export function useFetch<T>(url: string) {
  const controller = ref<AbortController | null>(null)
  
  const execute = async () => {
    // Cancel previous request
    controller.value?.abort()
    
    // Create new controller
    controller.value = new AbortController()
    
    const response = await fetch(url, {
      signal: controller.value.signal
    })
    
    return response.json()
  }
  
  return { execute }
}
```

---

22) **What are the benefits of extracting logic into composables vs keeping it in components?**

**Benefits**:
- **Reusability**: Use the same logic in multiple components
- **Testability**: Test logic in isolation without mounting components
- **Organization**: Keep components focused on UI, logic separate
- **Maintainability**: Update logic in one place
- **Type safety**: Easier to type and document

---

23) **Write code to implement a `useDebounce` composable.**

```ts
import { ref, watch, onUnmounted } from 'vue'

export function useDebounce<T>(value: Ref<T>, delay: number) {
  const debouncedValue = ref<T>(value.value)
  let timeoutId: number | null = null
  
  watch(value, (newValue) => {
    // Clear previous timeout
    if (timeoutId) clearTimeout(timeoutId)
    
    // Set new timeout
    timeoutId = window.setTimeout(() => {
      debouncedValue.value = newValue
    }, delay)
  })
  
  // Cleanup on unmount
  onUnmounted(() => {
    if (timeoutId) clearTimeout(timeoutId)
  })
  
  return debouncedValue
}
```

---

24) **How do you cancel an ongoing fetch request when a component unmounts?**

Use `AbortController` and clean up in `onUnmounted`:

```ts
import { ref, onUnmounted } from 'vue'

export function useFetch<T>(url: string) {
  const controller = ref<AbortController | null>(null)
  
  const execute = async () => {
    controller.value = new AbortController()
    
    const response = await fetch(url, {
      signal: controller.value.signal
    })
    
    return response.json()
  }
  
  // Cancel on unmount
  onUnmounted(() => {
    controller.value?.abort()
  })
  
  return { execute }
}
```

---

25) **What is the difference between `ref` and `readonly(ref)` in composable return values?**

- **`ref`**: Fully mutable, can be changed from anywhere
- **`readonly(ref)`**: Immutable, cannot be changed externally (only via composable methods)

```ts
// Using ref (mutable)
const { count } = useCounter()
count.value = 999 // ✅ Works (but bad practice)

// Using readonly (immutable)
const { count } = useCounter()
count.value = 999 // ❌ Error: cannot assign to readonly
```

---

26) **How would you implement auto-refetch at intervals in a `useFetch` composable?**

```ts
export function useFetch<T>(url: string, options: { refetch?: number } = {}) {
  const { refetch } = options
  let intervalId: number | null = null
  
  const execute = async () => {
    // Fetch logic...
  }
  
  // Setup auto-refetch
  if (refetch) {
    intervalId = window.setInterval(execute, refetch)
  }
  
  // Cleanup
  onUnmounted(() => {
    if (intervalId) clearInterval(intervalId)
  })
  
  return { execute }
}

// Usage: refetch every 30 seconds
const { data } = useFetch('/api/data', { refetch: 30000 })
```

---

27) **What is the purpose of generics in TypeScript composables?**

Generics make composables type-safe for any data type:

```ts
// Without generics (not type-safe)
function useFetch(url: string) {
  const data = ref(null) // Type: Ref<null>
  return { data }
}

// With generics (type-safe)
function useFetch<T>(url: string) {
  const data = ref<T | null>(null) // Type: Ref<T | null>
  return { data }
}

// Usage
interface User { name: string; email: string }
const { data } = useFetch<User[]>('/api/users')
// data is typed as Ref<User[] | null>
```

---

28) **How do you share state between multiple instances of the same composable?**

Define state outside the composable function:

```ts
// Shared state (singleton pattern)
const sharedCount = ref(0)

export function useSharedCounter() {
  const increment = () => sharedCount.value++
  
  return {
    count: readonly(sharedCount),
    increment
  }
}

// All instances share the same count
const counter1 = useSharedCounter()
const counter2 = useSharedCounter()

counter1.increment() // Both counters show 1
```

---

29) **What's the correct way to cleanup event listeners in a composable?**

```ts
import { onMounted, onUnmounted } from 'vue'

export function useWindowSize() {
  const width = ref(window.innerWidth)
  
  const handleResize = () => {
    width.value = window.innerWidth
  }
  
  onMounted(() => {
    window.addEventListener('resize', handleResize)
  })
  
  onUnmounted(() => {
    // ✅ CRITICAL: Remove listener to prevent memory leak
    window.removeEventListener('resize', handleResize)
  })
  
  return { width }
}
```

---

30) **Why is it important to mock `fetch` in composable tests?**

Mocking `fetch` prevents:
- **Actual network requests** during tests (slow, unreliable)
- **External dependencies** (tests fail if API is down)
- **Rate limiting** (hitting real APIs during tests)
- **Non-deterministic results** (API data changes)

```ts
import { vi } from 'vitest'

// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ id: 1, name: 'Test' })
  })
)

// Now tests are fast, reliable, and isolated
```
