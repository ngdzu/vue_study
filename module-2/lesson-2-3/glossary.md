# Glossary — Lesson 2.3 Terms & Definitions

Quick reference for technical terms used in this lesson.

---

## Core Concepts

### Composable
**Definition**: A function that uses Vue's Composition API to encapsulate and reuse stateful logic.

**Naming Convention**: Always starts with `use*` (e.g., `useCounter`, `useFetch`, `useMouse`).

**Example**:
```ts
import { ref } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const increment = () => count.value++
  
  return { count, increment }
}
```

---

### Stateful Logic
**Definition**: Code that manages reactive state and its associated behaviors.

**In Vue**: Logic that uses `ref`, `reactive`, `computed`, `watch`, and lifecycle hooks.

**Example**:
```ts
// Stateful - manages reactive state
function useTimer() {
  const seconds = ref(0)
  const start = () => { /* ... */ }
  return { seconds, start }
}

// NOT stateful - just a utility function
function formatTime(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${seconds % 60}`
}
```

---

### Logic Extraction
**Definition**: The process of moving reusable logic out of components into separate composable functions.

**Benefits**: Reduces duplication, improves testability, enhances maintainability.

**Example**:
```ts
// Before extraction (duplicated in multiple components)
const count = ref(0)
const increment = () => count.value++

// After extraction (reusable composable)
import { useCounter } from '@/composables/useCounter'
const { count, increment } = useCounter()
```

---

### Readonly Ref
**Definition**: A ref that cannot be directly mutated from outside its original scope.

**In Vue**: Created with `readonly()` to prevent external modifications.

**Example**:
```ts
import { ref, readonly } from 'vue'

function useCounter() {
  const count = ref(0)
  
  return {
    count: readonly(count), // Cannot be mutated externally
    increment: () => count.value++ // Only mutate through methods
  }
}

// Usage
const { count, increment } = useCounter()
// count.value = 10 // ❌ Error: cannot assign to readonly
increment() // ✅ Works
```

---

### State Management Pattern
**Definition**: A structured approach to managing and updating reactive state.

**Common patterns**: Loading/error/data states, optimistic updates, caching.

**Example**:
```ts
// Loading/Error/Data pattern
const data = ref(null)
const error = ref(null)
const loading = ref(false)

async function fetchData() {
  loading.value = true
  error.value = null
  
  try {
    data.value = await fetch('/api/data')
  } catch (e) {
    error.value = e
  } finally {
    loading.value = false
  }
}
```

---

## Composable Patterns

### useCounter Pattern
**Definition**: A composable for managing numerical state with increment/decrement operations.

**Common features**: Min/max limits, step values, reset functionality.

**Example**:
```ts
function useCounter(initial = 0, options = {}) {
  const { min = -Infinity, max = Infinity, step = 1 } = options
  const count = ref(initial)
  
  const increment = () => {
    if (count.value + step <= max) count.value += step
  }
  
  return { count: readonly(count), increment }
}
```

---

### useFetch Pattern
**Definition**: A composable for handling HTTP requests with loading/error states.

**Key features**: Auto-fetch, manual refetch, abort on unmount, caching.

**Example**:
```ts
function useFetch(url, options = {}) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)
  
  const execute = async () => {
    loading.value = true
    try {
      const res = await fetch(url)
      data.value = await res.json()
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }
  
  return { data, error, loading, execute }
}
```

---

### useAsync Pattern
**Definition**: A generic composable for handling any asynchronous operation.

**Benefits**: Reusable for API calls, file uploads, heavy computations, etc.

**Example**:
```ts
function useAsync(asyncFn) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)
  
  const execute = async (...args) => {
    loading.value = true
    try {
      data.value = await asyncFn(...args)
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }
  
  return { data, error, loading, execute }
}
```

---

## Advanced Concepts

### Caching
**Definition**: Storing fetched data temporarily to avoid redundant requests.

**Implementation**: Use Map or object to store data with timestamps.

**Example**:
```ts
const cache = new Map()

async function fetchWithCache(url) {
  if (cache.has(url)) {
    const { data, timestamp } = cache.get(url)
    const age = Date.now() - timestamp
    
    if (age < 5 * 60 * 1000) { // 5 minutes
      return data
    }
  }
  
  const data = await fetch(url).then(r => r.json())
  cache.set(url, { data, timestamp: Date.now() })
  return data
}
```

---

### Retry Logic
**Definition**: Automatically retrying failed operations a specified number of times.

**Use case**: Network requests that might fail due to temporary issues.

**Example**:
```ts
async function fetchWithRetry(url, retries = 3) {
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

### AbortController
**Definition**: A browser API for canceling asynchronous operations like fetch requests.

**Use case**: Cancel ongoing requests when component unmounts or when new request starts.

**Example**:
```ts
const controller = new AbortController()

fetch('/api/data', { signal: controller.signal })
  .then(res => res.json())
  .catch(err => {
    if (err.name === 'AbortError') {
      console.log('Request cancelled')
    }
  })

// Later: cancel the request
controller.abort()
```

---

### Cross-tab Synchronization
**Definition**: Keeping state synchronized across multiple browser tabs.

**Implementation**: Listen to the `storage` event for localStorage changes.

**Example**:
```ts
window.addEventListener('storage', (e) => {
  if (e.key === 'myKey' && e.newValue) {
    data.value = JSON.parse(e.newValue)
  }
})
```

---

## Testing Terms

### Unit Test
**Definition**: Testing individual functions or composables in isolation.

**Tools**: Vitest, Jest, Vue Test Utils.

**Example**:
```ts
import { describe, it, expect } from 'vitest'
import { useCounter } from '../useCounter'

describe('useCounter', () => {
  it('increments count', () => {
    const { count, increment } = useCounter(0)
    increment()
    expect(count.value).toBe(1)
  })
})
```

---

### Mock
**Definition**: A fake implementation of a function or API used during testing.

**Purpose**: Isolate code under test from external dependencies.

**Example**:
```ts
import { vi } from 'vitest'

// Mock fetch API
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ id: 1, name: 'Test' })
  })
)
```

---

### Test Coverage
**Definition**: Percentage of code executed by tests.

**Goal**: High coverage (80%+) for composables ensures reliability.

**Example**:
```bash
# Run tests with coverage
npm run test -- --coverage

# Output
Statements: 95%
Branches: 87%
Functions: 100%
Lines: 93%
```

---

## Best Practices

### Single Responsibility Principle
**Definition**: Each composable should have one clear purpose.

**Example**:
```ts
// ✅ GOOD: Single responsibility
function useFetch(url) { /* fetching only */ }
function useLocalStorage(key) { /* storage only */ }

// ❌ BAD: Multiple responsibilities
function useDataManager(url, key) {
  // Handles fetching AND storage AND caching...
}
```

---

### Proper Cleanup
**Definition**: Releasing resources (timers, listeners, requests) when no longer needed.

**Importance**: Prevents memory leaks and unexpected behavior.

**Example**:
```ts
import { onUnmounted } from 'vue'

function useInterval(callback, delay) {
  const id = setInterval(callback, delay)
  
  onUnmounted(() => {
    clearInterval(id) // ✅ Cleanup
  })
}
```

---

### Type Safety
**Definition**: Using TypeScript to enforce correct types and catch errors at compile time.

**Example**:
```ts
// ✅ Type-safe composable
export function useFetch<T>(url: string): {
  data: Readonly<Ref<T | null>>
  error: Readonly<Ref<Error | null>>
  loading: Readonly<Ref<boolean>>
  execute: () => Promise<void>
} {
  // ...
}
```

---

## Common Patterns

### Immediate Execution
**Definition**: Automatically running an operation when the composable is called.

**Configuration**: Usually controlled by an `immediate` option.

**Example**:
```ts
function useFetch(url, { immediate = true } = {}) {
  const execute = async () => { /* ... */ }
  
  if (immediate) {
    execute() // Run on mount
  }
  
  return { execute }
}
```

---

### Debouncing
**Definition**: Delaying function execution until after a period of inactivity.

**Use case**: Search input, window resize events.

**Example**:
```ts
function useDebounce(fn, delay) {
  let timeoutId = null
  
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}
```

---

### Throttling
**Definition**: Limiting function execution to once per time period.

**Use case**: Scroll events, expensive computations.

**Example**:
```ts
function useThrottle(fn, limit) {
  let inThrottle = false
  
  return (...args) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}
```

---

## Summary

This glossary covers:
- Core composable concepts and patterns
- State management and data fetching patterns
- Testing terminology and tools
- Best practices for composable design
- Common utility patterns (debounce, throttle, caching)

Keep this reference open while working through the lesson and exercises!
