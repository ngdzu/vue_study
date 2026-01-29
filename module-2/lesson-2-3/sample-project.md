# Sample Project — useApi Composable with Loading/Error States

Purpose: Build a production-ready API composable with caching, retry logic, and proper state management.

## Requirements

Build a reusable `useApi` composable that:

- **Fetches data** from any API endpoint
- **Manages state**: loading, error, and data states
- **Implements caching**: Cache responses for configurable duration
- **Retry logic**: Automatically retry failed requests
- **Abort handling**: Cancel ongoing requests on unmount or new requests
- **Type-safe**: Full TypeScript support with generics
- **Flexible configuration**: Accept options for cache, retries, etc.

## Suggested File Layout

```
src/
  composables/
    useApi.ts             # Main composable implementation
    __tests__/
      useApi.spec.ts      # Unit tests
  components/
    UserList.vue          # Example usage: Display users
    PostList.vue          # Example usage: Display posts
  App.vue
```

## Implementation Steps

### Step 1: Create the Basic Structure

```ts
// src/composables/useApi.ts
import { ref, readonly, onUnmounted } from 'vue'

interface UseApiOptions {
  cache?: boolean
  cacheTime?: number
  retries?: number
  retryDelay?: number
  immediate?: boolean
}

export function useApi<T>(
  url: string,
  options: UseApiOptions = {}
) {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)
  
  // TODO: Implement execute function
  // TODO: Implement caching
  // TODO: Implement retry logic
  // TODO: Implement cleanup
  
  return {
    data: readonly(data),
    error: readonly(error),
    loading: readonly(loading),
    execute: async () => {}
  }
}
```

### Step 2: Implement Caching

```ts
// Global cache shared across all useApi instances
const cache = new Map<string, { data: any; timestamp: number }>()

export function useApi<T>(url: string, options: UseApiOptions = {}) {
  const {
    cache: useCache = true,
    cacheTime = 5 * 60 * 1000 // Default: 5 minutes
  } = options
  
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)
  
  const execute = async () => {
    // Check cache first
    if (useCache && cache.has(url)) {
      const cached = cache.get(url)!
      const age = Date.now() - cached.timestamp
      
      if (age < cacheTime) {
        data.value = cached.data
        return cached.data
      } else {
        // Cache expired, remove it
        cache.delete(url)
      }
    }
    
    // TODO: Implement fetch logic
  }
  
  const invalidateCache = () => {
    cache.delete(url)
  }
  
  return {
    data: readonly(data),
    error: readonly(error),
    loading: readonly(loading),
    execute,
    invalidateCache
  }
}
```

### Step 3: Implement Retry Logic and AbortController

```ts
export function useApi<T>(url: string, options: UseApiOptions = {}) {
  const {
    cache: useCache = true,
    cacheTime = 5 * 60 * 1000,
    retries = 3,
    retryDelay = 1000,
    immediate = false
  } = options
  
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)
  const controller = ref<AbortController | null>(null)
  
  const execute = async () => {
    // Check cache
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
    
    // Retry loop
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
        // Don't retry if aborted
        if (e.name === 'AbortError') {
          loading.value = false
          throw e
        }
        
        lastError = e as Error
        
        // Wait before retry (except on last attempt)
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
  
  // Auto-execute on mount
  if (immediate) {
    execute()
  }
  
  // Cleanup on unmount
  onUnmounted(() => {
    controller.value?.abort()
  })
  
  const invalidateCache = () => {
    cache.delete(url)
  }
  
  return {
    data: readonly(data),
    error: readonly(error),
    loading: readonly(loading),
    execute,
    invalidateCache
  }
}
```

### Step 4: Add Type Safety

```ts
// Full type-safe implementation
import { ref, readonly, onUnmounted, Ref } from 'vue'

interface UseApiOptions {
  cache?: boolean
  cacheTime?: number
  retries?: number
  retryDelay?: number
  immediate?: boolean
}

interface UseApiReturn<T> {
  data: Readonly<Ref<T | null>>
  error: Readonly<Ref<Error | null>>
  loading: Readonly<Ref<boolean>>
  execute: () => Promise<T | undefined>
  invalidateCache: () => void
}

const cache = new Map<string, { data: any; timestamp: number }>()

export function useApi<T = any>(
  url: string,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  // ... (implementation from Step 3)
}
```

### Step 5: Create Example Component

```ts
// src/components/UserList.vue
<script setup lang="ts">
import { useApi } from '@/composables/useApi'

interface User {
  id: number
  name: string
  email: string
  username: string
  phone: string
  website: string
  company: {
    name: string
  }
}

const {
  data: users,
  error,
  loading,
  execute,
  invalidateCache
} = useApi<User[]>(
  'https://jsonplaceholder.typicode.com/users',
  {
    cache: true,
    cacheTime: 5 * 60 * 1000, // 5 minutes
    retries: 3,
    retryDelay: 1000,
    immediate: true
  }
)

const handleRefresh = async () => {
  invalidateCache()
  await execute()
}
</script>

<template>
  <div class="user-list">
    <div class="header">
      <h1>Users</h1>
      <button @click="handleRefresh" :disabled="loading">
        {{ loading ? 'Loading...' : 'Refresh' }}
      </button>
    </div>
    
    <div v-if="loading && !users" class="loading">
      Loading users...
    </div>
    
    <div v-else-if="error" class="error">
      <p>Error: {{ error.message }}</p>
      <button @click="execute">Retry</button>
    </div>
    
    <div v-else-if="users" class="users">
      <div v-for="user in users" :key="user.id" class="user-card">
        <h2>{{ user.name }}</h2>
        <p><strong>Username:</strong> {{ user.username }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Phone:</strong> {{ user.phone }}</p>
        <p><strong>Website:</strong> {{ user.website }}</p>
        <p><strong>Company:</strong> {{ user.company.name }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

button {
  padding: 0.5rem 1rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error {
  color: #e74c3c;
}

.users {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.user-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  background: #f9f9f9;
}

.user-card h2 {
  margin-top: 0;
  color: #2c3e50;
}

.user-card p {
  margin: 0.5rem 0;
}
</style>
```

## Validation Criteria

### Functionality (50 points)
- ✅ Fetches data successfully (10 pts)
- ✅ Manages loading state correctly (5 pts)
- ✅ Handles errors properly (10 pts)
- ✅ Caching works (data returned from cache on subsequent calls) (10 pts)
- ✅ Retry logic works (retries on failure) (10 pts)
- ✅ AbortController cancels requests on unmount (5 pts)

### Code Quality (30 points)
- ✅ TypeScript types are complete and correct (10 pts)
- ✅ Proper cleanup in `onUnmounted` (10 pts)
- ✅ Returns readonly refs to prevent external mutation (5 pts)
- ✅ Code is well-organized and readable (5 pts)

### Testing (20 points)
- ✅ Unit tests for successful fetch (5 pts)
- ✅ Unit tests for error handling (5 pts)
- ✅ Unit tests for caching behavior (5 pts)
- ✅ Unit tests for retry logic (5 pts)

## Testing Example

```ts
// src/composables/__tests__/useApi.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useApi } from '../useApi'

global.fetch = vi.fn()

describe('useApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  
  it('fetches data successfully', async () => {
    const mockData = { id: 1, name: 'Test' }
    
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    })
    
    const { data, error, loading, execute } = useApi('/api/test', {
      immediate: false
    })
    
    expect(loading.value).toBe(false)
    expect(data.value).toBe(null)
    
    await execute()
    
    expect(loading.value).toBe(false)
    expect(data.value).toEqual(mockData)
    expect(error.value).toBe(null)
  })
  
  it('handles errors', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404
    })
    
    const { data, error, execute } = useApi('/api/test', {
      immediate: false,
      retries: 0
    })
    
    await expect(execute()).rejects.toThrow()
    
    expect(data.value).toBe(null)
    expect(error.value).toBeTruthy()
  })
  
  it('returns cached data', async () => {
    const mockData = { id: 1, name: 'Test' }
    
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    })
    
    const { data: data1, execute: execute1 } = useApi('/api/test', {
      immediate: false,
      cache: true
    })
    
    await execute1()
    expect(data1.value).toEqual(mockData)
    
    // Second call should use cache (fetch not called again)
    const { data: data2, execute: execute2 } = useApi('/api/test', {
      immediate: false,
      cache: true
    })
    
    await execute2()
    expect(data2.value).toEqual(mockData)
    expect(global.fetch).toHaveBeenCalledTimes(1) // Only called once!
  })
  
  it('retries on failure', async () => {
    ;(global.fetch as any)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      })
    
    const { data, execute } = useApi('/api/test', {
      immediate: false,
      retries: 3,
      retryDelay: 10
    })
    
    await execute()
    
    expect(data.value).toEqual({ success: true })
    expect(global.fetch).toHaveBeenCalledTimes(3) // Failed twice, succeeded third time
  })
})
```

## Extension Ideas

After completing the basic implementation, try adding:

1. **Request deduplication**: Prevent multiple simultaneous requests to the same URL
2. **Polling**: Auto-refetch at intervals
3. **Optimistic updates**: Update UI before server confirms
4. **Request queue**: Queue requests when offline, send when online
5. **Pagination support**: Handle paginated API responses
6. **GraphQL support**: Extend to support GraphQL queries

## Summary

This project demonstrates:
- Building production-ready composables
- State management patterns (loading/error/data)
- Caching and retry logic
- Proper TypeScript typing
- Cleanup and resource management
- Unit testing composables

Complete this project before moving to the exercises!
