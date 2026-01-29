# Exercises, Validation, and Grading — Lesson 2.3

## Exercise A: useLocalStorage Composable

Goal: Create a composable that syncs reactive state with localStorage.

**Requirements**
- Create a `useLocalStorage` composable
- Accept a `key` (string) and `defaultValue` (generic type T)
- Return reactive `data` ref and `remove` function
- Automatically sync changes to localStorage
- Support deep watching for object/array changes
- Handle JSON serialization/deserialization
- Listen for `storage` events for cross-tab synchronization
- Handle errors gracefully (invalid JSON, quota exceeded)

**Implementation**

```ts
// src/composables/useLocalStorage.ts
import { ref, watch, onMounted, onUnmounted } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T) {
  // TODO: Read from localStorage or use defaultValue
  // TODO: Watch for changes and sync to localStorage
  // TODO: Listen for storage events (cross-tab sync)
  // TODO: Implement remove function
  // TODO: Handle errors
}
```

**Validation (Manual)**
- Data persists across page refreshes
- Changes sync to localStorage automatically
- Cross-tab sync works (open two tabs, change in one, updates in other)
- Objects and arrays are properly serialized
- `remove()` clears data from localStorage and resets to default
- No errors in console

**Grading Points** (25 points)
- Correct localStorage read/write (5 pts)
- Deep watching for objects/arrays (5 pts)
- Cross-tab synchronization (5 pts)
- Proper error handling (5 pts)
- TypeScript types (5 pts)

---

## Exercise B: useWindowSize Composable

Goal: Create a composable that tracks window dimensions reactively.

**Requirements**
- Create a `useWindowSize` composable
- Return `width` and `height` refs
- Update on window resize
- Debounce resize events (only update after 200ms of no resizing)
- Provide computed property for viewport type (mobile/tablet/desktop)
- Clean up event listener on unmount
- Support custom breakpoints

**Implementation**

```ts
// src/composables/useWindowSize.ts
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Breakpoints {
  mobile: number
  tablet: number
}

export function useWindowSize(breakpoints: Breakpoints = {
  mobile: 768,
  tablet: 1024
}) {
  const width = ref(0)
  const height = ref(0)
  
  // TODO: Implement resize handler with debouncing
  // TODO: Calculate viewport type
  // TODO: Setup event listener on mount
  // TODO: Cleanup on unmount
  
  const viewportType = computed(() => {
    // TODO: Return 'mobile', 'tablet', or 'desktop'
  })
  
  return { width, height, viewportType }
}
```

**Validation (Manual)**
- Displays correct width/height on mount
- Updates when window is resized
- Debouncing works (not updating on every pixel)
- Viewport type is correct (mobile < 768, tablet 768-1024, desktop > 1024)
- No event listener leaks (check DevTools)

**Grading Points** (25 points)
- Correct dimension tracking (5 pts)
- Debounced resize handling (5 pts)
- Viewport type calculation (5 pts)
- Proper cleanup (5 pts)
- TypeScript types and custom breakpoints (5 pts)

---

## Exercise C: useDebounce Composable

Goal: Create a composable for debouncing values.

**Requirements**
- Create a `useDebounce` composable
- Accept a `value` ref and `delay` (in ms)
- Return a `debouncedValue` ref
- Update `debouncedValue` only after `delay` ms of no changes
- Clean up pending timeouts on unmount
- Support dynamic delay changes

**Implementation**

```ts
// src/composables/useDebounce.ts
import { ref, watch, onUnmounted } from 'vue'

export function useDebounce<T>(value: Ref<T>, delay: number) {
  const debouncedValue = ref<T>(value.value)
  
  // TODO: Watch value and debounce updates
  // TODO: Clear timeout on unmount
  
  return debouncedValue
}
```

**Usage Example**

```ts
<script setup lang="ts">
import { ref } from 'vue'
import { useDebounce } from '@/composables/useDebounce'

const searchQuery = ref('')
const debouncedQuery = useDebounce(searchQuery, 500)

// Watch debouncedQuery to trigger search
watch(debouncedQuery, (query) => {
  console.log('Searching for:', query)
  // Trigger API call
})
</script>

<template>
  <input v-model="searchQuery" placeholder="Search..." />
  <p>Debounced: {{ debouncedQuery }}</p>
</template>
```

**Validation (Manual)**
- Debounced value updates after delay
- Multiple rapid changes don't trigger multiple updates
- Works with different data types (string, number, object)
- No memory leaks on unmount

**Grading Points** (20 points)
- Correct debounce logic (10 pts)
- Proper cleanup (5 pts)
- TypeScript generics (5 pts)

---

## Exercise D: useThrottle Composable

Goal: Create a composable for throttling function calls.

**Requirements**
- Create a `useThrottle` composable
- Accept a callback function and limit (in ms)
- Return a throttled version of the callback
- Ensure function only executes once per `limit` period
- Support leading and trailing edge execution options

**Implementation**

```ts
// src/composables/useThrottle.ts
interface UseThrottleOptions {
  leading?: boolean
  trailing?: boolean
}

export function useThrottle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number,
  options: UseThrottleOptions = { leading: true, trailing: false }
) {
  // TODO: Implement throttling logic
}
```

**Usage Example**

```ts
<script setup lang="ts">
import { useThrottle } from '@/composables/useThrottle'

const handleScroll = useThrottle(() => {
  console.log('Scroll position:', window.scrollY)
}, 1000)

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
```

**Validation (Manual)**
- Function executes at most once per limit period
- Leading edge execution works (executes immediately on first call)
- Trailing edge execution works (executes after limit if called during throttle)
- Multiple rapid calls are properly throttled

**Grading Points** (20 points)
- Correct throttle logic (10 pts)
- Leading/trailing options (5 pts)
- TypeScript types (5 pts)

---

## Exercise E: Unit Tests for Composables

Goal: Write comprehensive unit tests for your composables.

**Requirements**
- Install Vitest: `npm install -D vitest @vue/test-utils`
- Create test files for each composable
- Test happy path (successful execution)
- Test error cases
- Test cleanup (no memory leaks)
- Achieve 80%+ code coverage

**Test Structure**

```ts
// src/composables/__tests__/useLocalStorage.spec.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { useLocalStorage } from '../useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })
  
  it('initializes with default value', () => {
    const { data } = useLocalStorage('test-key', 'default')
    expect(data.value).toBe('default')
  })
  
  it('reads existing value from localStorage', () => {
    localStorage.setItem('test-key', JSON.stringify('stored'))
    const { data } = useLocalStorage('test-key', 'default')
    expect(data.value).toBe('stored')
  })
  
  it('syncs changes to localStorage', async () => {
    const { data } = useLocalStorage('test-key', 'initial')
    data.value = 'updated'
    
    // Wait for watch to trigger
    await new Promise(resolve => setTimeout(resolve, 10))
    
    const stored = localStorage.getItem('test-key')
    expect(JSON.parse(stored!)).toBe('updated')
  })
  
  it('removes data', () => {
    const { data, remove } = useLocalStorage('test-key', 'default')
    data.value = 'changed'
    
    remove()
    
    expect(data.value).toBe('default')
    expect(localStorage.getItem('test-key')).toBeNull()
  })
})
```

**Grading Points** (30 points)
- Tests for useLocalStorage (8 pts)
- Tests for useWindowSize (7 pts)
- Tests for useDebounce (7 pts)
- Tests for useThrottle (8 pts)

---

## Bonus Challenge: useInfiniteScroll

Goal: Create a composable for infinite scrolling.

**Requirements**
- Detect when user scrolls near bottom of page
- Emit an event to load more data
- Support custom threshold (distance from bottom)
- Prevent duplicate load events
- Clean up scroll listener on unmount

**Implementation**

```ts
// src/composables/useInfiniteScroll.ts
import { ref, onMounted, onUnmounted } from 'vue'

interface UseInfiniteScrollOptions {
  threshold?: number  // Distance from bottom in pixels
  onLoadMore: () => void | Promise<void>
}

export function useInfiniteScroll(options: UseInfiniteScrollOptions) {
  const { threshold = 100, onLoadMore } = options
  const loading = ref(false)
  
  // TODO: Implement scroll detection
  // TODO: Trigger onLoadMore when near bottom
  // TODO: Prevent duplicate calls while loading
  
  return { loading }
}
```

**Usage Example**

```ts
<script setup lang="ts">
import { ref } from 'vue'
import { useInfiniteScroll } from '@/composables/useInfiniteScroll'

const items = ref([1, 2, 3, 4, 5])

const { loading } = useInfiniteScroll({
  threshold: 200,
  onLoadMore: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    items.value.push(...[6, 7, 8, 9, 10])
  }
})
</script>

<template>
  <div>
    <div v-for="item in items" :key="item">Item {{ item }}</div>
    <div v-if="loading">Loading more...</div>
  </div>
</template>
```

**Grading Points** (20 bonus points)
- Correct scroll detection (10 pts)
- Prevents duplicate loads (5 pts)
- Proper cleanup (5 pts)

---

## Summary

Total Points: 120 (100 regular + 20 bonus)

Complete all exercises to master composable patterns. Focus on:
- Proper state management
- Cleanup and resource management
- TypeScript type safety
- Unit testing

After completing these exercises, you'll be ready to build production-ready composables for any use case!
