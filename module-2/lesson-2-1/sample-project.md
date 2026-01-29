# Sample Project — Data Fetching Component with Lifecycle Management

Purpose: Demonstrate proper use of lifecycle hooks for data fetching, cleanup, and resource management.

## Requirements

Build a user list component that fetches data from an API with proper lifecycle management:

- **Features**: Fetch user data on mount, loading states, error handling
- **Lifecycle**: Proper setup in `onMounted`, cleanup in `onUnmounted`
- **Resource management**: Abort ongoing requests if component unmounts
- **Auto-refresh**: Optional timer that refetches data every 30 seconds
- **Manual refresh**: Button to trigger immediate refetch
- **Proper cleanup**: Cancel timers and requests on unmount

## Suggested File Layout

```
src/
  components/
    UserList.vue          # Main component with lifecycle management
    UserCard.vue          # Display individual user (optional)
  composables/
    useFetch.ts           # Reusable fetch composable (optional advanced)
  App.vue
```

## Implementation Steps

### 1. Setup Reactive State

```ts
import { ref } from 'vue'

interface User {
  id: number
  name: string
  email: string
  company: { name: string }
}

const users = ref<User[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
```

### 2. Create Fetch Function

```ts
const controller = ref<AbortController | null>(null)

async function fetchUsers() {
  loading.value = true
  error.value = null
  
  // Cancel previous request if still pending
  controller.value?.abort()
  controller.value = new AbortController()

  try {
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/users',
      { signal: controller.value.signal }
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    users.value = await response.json()
  } catch (err: any) {
    if (err.name !== 'AbortError') {
      error.value = err.message
    }
  } finally {
    loading.value = false
  }
}
```

### 3. Lifecycle Hooks

```ts
import { onMounted, onUnmounted } from 'vue'

const intervalId = ref<number | null>(null)

onMounted(() => {
  // Initial fetch
  fetchUsers()
  
  // Auto-refresh every 30 seconds
  intervalId.value = window.setInterval(() => {
    fetchUsers()
  }, 30000)
})

onUnmounted(() => {
  // Cancel ongoing request
  controller.value?.abort()
  
  // Clear interval timer
  if (intervalId.value !== null) {
    clearInterval(intervalId.value)
  }
})
```

### 4. Template

```ts
<template>
  <div class="user-list">
    <div class="header">
      <h2>Users</h2>
      <button 
        @click="fetchUsers" 
        :disabled="loading"
        class="refresh-btn"
      >
        {{ loading ? 'Refreshing...' : 'Refresh' }}
      </button>
    </div>

    <div v-if="loading && users.length === 0" class="loading">
      Loading users...
    </div>

    <div v-else-if="error" class="error">
      Error: {{ error }}
      <button @click="fetchUsers">Retry</button>
    </div>

    <ul v-else class="users">
      <li v-for="user in users" :key="user.id" class="user-card">
        <h3>{{ user.name }}</h3>
        <p>{{ user.email }}</p>
        <p class="company">{{ user.company.name }}</p>
      </li>
    </ul>
  </div>
</template>
```

### 5. Basic Styling

```ts
<style scoped>
.user-list {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.refresh-btn {
  padding: 0.5rem 1rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
}

.error {
  color: #f56c6c;
}

.users {
  list-style: none;
  padding: 0;
}

.user-card {
  padding: 1rem;
  margin-bottom: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.user-card h3 {
  margin: 0 0 0.5rem 0;
}

.company {
  color: #666;
  font-size: 0.9rem;
}
</style>
```

## Complete Component Code

```ts
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface User {
  id: number
  name: string
  email: string
  company: { name: string }
}

const users = ref<User[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const controller = ref<AbortController | null>(null)
const intervalId = ref<number | null>(null)

async function fetchUsers() {
  loading.value = true
  error.value = null
  
  controller.value?.abort()
  controller.value = new AbortController()

  try {
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/users',
      { signal: controller.value.signal }
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    users.value = await response.json()
  } catch (err: any) {
    if (err.name !== 'AbortError') {
      error.value = err.message
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUsers()
  
  intervalId.value = window.setInterval(() => {
    fetchUsers()
  }, 30000)
})

onUnmounted(() => {
  controller.value?.abort()
  
  if (intervalId.value !== null) {
    clearInterval(intervalId.value)
  }
})
</script>

<template>
  <div class="user-list">
    <div class="header">
      <h2>Users</h2>
      <button 
        @click="fetchUsers" 
        :disabled="loading"
        class="refresh-btn"
      >
        {{ loading ? 'Refreshing...' : 'Refresh' }}
      </button>
    </div>

    <div v-if="loading && users.length === 0" class="loading">
      Loading users...
    </div>

    <div v-else-if="error" class="error">
      Error: {{ error }}
      <button @click="fetchUsers">Retry</button>
    </div>

    <ul v-else class="users">
      <li v-for="user in users" :key="user.id" class="user-card">
        <h3>{{ user.name }}</h3>
        <p>{{ user.email }}</p>
        <p class="company">{{ user.company.name }}</p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.user-list {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.refresh-btn {
  padding: 0.5rem 1rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
}

.error {
  color: #f56c6c;
}

.users {
  list-style: none;
  padding: 0;
}

.user-card {
  padding: 1rem;
  margin-bottom: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.user-card h3 {
  margin: 0 0 0.5rem 0;
}

.company {
  color: #666;
  font-size: 0.9rem;
}
</style>
```

## Testing Checklist

- [ ] Component fetches data on mount
- [ ] Loading indicator shows during fetch
- [ ] Users display after successful fetch
- [ ] Error message shows if fetch fails
- [ ] Refresh button triggers new fetch
- [ ] Refresh button disabled during loading
- [ ] Auto-refresh works every 30 seconds
- [ ] Ongoing request cancels when unmounting component
- [ ] Timer clears when unmounting component
- [ ] No memory leaks (check DevTools memory profile)

## Advanced: Extract to Composable

```ts
// composables/useFetch.ts
import { ref, onUnmounted } from 'vue'

export function useFetch<T>(url: string) {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const controller = ref<AbortController | null>(null)

  async function execute() {
    loading.value = true
    error.value = null
    
    controller.value?.abort()
    controller.value = new AbortController()

    try {
      const response = await fetch(url, {
        signal: controller.value.signal
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      data.value = await response.json()
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        error.value = err.message
      }
    } finally {
      loading.value = false
    }
  }

  onUnmounted(() => {
    controller.value?.abort()
  })

  return { data, loading, error, execute }
}
```

**Usage**:
```ts
<script setup lang="ts">
import { useFetch } from './composables/useFetch'

const { data: users, loading, error, execute } = useFetch<User[]>(
  'https://jsonplaceholder.typicode.com/users'
)

onMounted(() => {
  execute()
})
</script>
```

## Key Learnings

- ✅ Always clean up timers in `onUnmounted`
- ✅ Cancel ongoing fetch requests with `AbortController`
- ✅ Handle loading, error, and success states
- ✅ Prevent memory leaks with proper cleanup
- ✅ Template refs are only available in `onMounted` and later
- ✅ Extract reusable logic into composables
