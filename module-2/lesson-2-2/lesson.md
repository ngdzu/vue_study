# Lesson 2.2: Composition API Fundamentals

## Learning Goals

By the end of this lesson, you will be able to:

- ✅ Understand the motivation and benefits of the Composition API
- ✅ Use the `setup()` function and `<script setup>` syntax
- ✅ Convert Options API components to Composition API
- ✅ Organize reactive logic using the Composition API
- ✅ Understand the concept of composables and their purpose
- ✅ Extract and reuse logic across components
- ✅ Apply best practices for code organization with Composition API

## Prerequisites

Before starting this lesson, you should:

- ✅ Understand Vue 3 basics and the Options API
- ✅ Be comfortable with reactive data and computed properties
- ✅ Have experience with component lifecycle hooks
- ✅ Understand JavaScript ES6+ features (destructuring, arrow functions)
- ✅ Have completed Module 2, Lesson 2.1 (Reactivity Deep Dive)

## What You Will Build

In this lesson, you will:

1. **Refactor an Options API component** to use the Composition API
2. **Create your first composable** for reusable logic (e.g., `useMouse`, `useLocalStorage`)
3. **Build a practical example** demonstrating the benefits of logic extraction
4. **Organize complex component logic** using the Composition API patterns

---

## Why the Composition API?

The **Composition API** was introduced in Vue 3 as an alternative to the Options API. It's not a replacement—both APIs are fully supported and can even be used together. However, the Composition API offers several advantages for organizing and reusing logic.

### The Options API Challenge

The Options API organizes code by **component options** (`data`, `methods`, `computed`, `watch`, etc.):

```ts
export default {
  data() {
    return {
      user: null,
      loading: false,
      error: null
    }
  },
  computed: {
    fullName() {
      return this.user ? `${this.user.firstName} ${this.user.lastName}` : ''
    }
  },
  methods: {
    async fetchUser(id) {
      this.loading = true
      try {
        const response = await fetch(`/api/users/${id}`)
        this.user = await response.json()
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    }
  },
  mounted() {
    this.fetchUser(this.$route.params.id)
  }
}
```

**Problems with this approach:**

1. **Logic is fragmented**: Code for a single feature is scattered across multiple options
2. **Hard to extract and reuse**: Moving logic to other components requires careful copying
3. **Type inference limitations**: TypeScript support is more complex
4. **Readability decreases**: As components grow, related code becomes separated

### The Composition API Solution

The Composition API organizes code by **logical concerns**:

```ts
import { ref, computed, onMounted } from 'vue'

export default {
  setup() {
    // User feature - all logic in one place
    const user = ref(null)
    const loading = ref(false)
    const error = ref(null)
    
    const fullName = computed(() => 
      user.value ? `${user.value.firstName} ${user.value.lastName}` : ''
    )
    
    async function fetchUser(id) {
      loading.value = true
      try {
        const response = await fetch(`/api/users/${id}`)
        user.value = await response.json()
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }
    
    onMounted(() => {
      fetchUser(route.params.id)
    })
    
    return { user, loading, error, fullName, fetchUser }
  }
}
```

> 💡 **IMPORTANT**: The Composition API groups related code together, making it easier to understand, maintain, and extract into reusable functions.

---

## The `setup()` Function

The `setup()` function is the **entry point** for using the Composition API.

### Basic Structure

```ts
import { ref, computed } from 'vue'

export default {
  setup() {
    // 1. Declare reactive state
    const count = ref(0)
    
    // 2. Define computed properties
    const doubleCount = computed(() => count.value * 2)
    
    // 3. Define methods
    function increment() {
      count.value++
    }
    
    // 4. Return what you want to expose to the template
    return {
      count,
      doubleCount,
      increment
    }
  }
}
```

**Template usage:**

```ts
<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>
```

### `setup()` Execution Timing

> ⚠️ **CRITICAL**: The `setup()` function executes **before** the component is created. This means:
> - You cannot access `this` (component instance doesn't exist yet)
> - Props are passed as the first argument to `setup()`
> - `setup()` runs once per component instance

### Accessing Props and Context

```ts
export default {
  props: {
    userId: {
      type: Number,
      required: true
    }
  },
  setup(props, context) {
    // Access props (reactive)
    console.log(props.userId)
    
    // Access context properties
    console.log(context.attrs)    // Non-reactive attributes
    console.log(context.slots)    // Slots
    console.log(context.emit)     // Emit events
    console.log(context.expose)   // Expose public properties
    
    // Destructure context (commonly used)
    const { emit } = context
    
    function handleClick() {
      emit('user-clicked', props.userId)
    }
    
    return { handleClick }
  }
}
```

> ⚠️ **CRITICAL**: Do NOT destructure `props` directly—it will lose reactivity:
> ```ts
> // ❌ BAD: Loses reactivity
> const { userId } = props
> 
> // ✅ GOOD: Maintains reactivity
> const userId = computed(() => props.userId)
> // OR access props.userId directly
> ```

---

## `<script setup>` Syntax

Vue 3.2+ introduced **`<script setup>`**—a compile-time syntactic sugar for using the Composition API. It's more concise and provides better performance.

### Basic Comparison

**Traditional `setup()` function:**

```ts
<script lang="ts">
import { ref, computed } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const doubleCount = computed(() => count.value * 2)
    
    function increment() {
      count.value++
    }
    
    return { count, doubleCount, increment }
  }
}
</script>
```

**`<script setup>` syntax:**

```ts
<script setup lang="ts">
import { ref, computed } from 'vue'

const count = ref(0)
const doubleCount = computed(() => count.value * 2)

function increment() {
  count.value++
}
</script>
```

> 💡 **IMPORTANT**: With `<script setup>`, everything declared at the top level is automatically available to the template. No need to return anything!

### Props and Emits with `<script setup>`

**Defining props:**

```ts
<script setup lang="ts">
interface Props {
  userId: number
  userName?: string
}

const props = defineProps<Props>()

// Or with runtime validation
const props = defineProps({
  userId: {
    type: Number,
    required: true
  },
  userName: String
})

// Access props
console.log(props.userId)
</script>
```

**Defining emits:**

```ts
<script setup lang="ts">
interface Emits {
  (e: 'update', value: number): void
  (e: 'delete', id: number): void
}

const emit = defineEmits<Emits>()

// Or with runtime validation
const emit = defineEmits(['update', 'delete'])

function handleUpdate(newValue: number) {
  emit('update', newValue)
}
</script>
```

### Using Components

```ts
<script setup lang="ts">
import UserCard from './UserCard.vue'
import { ref } from 'vue'

const users = ref([
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
])
</script>

<template>
  <UserCard 
    v-for="user in users" 
    :key="user.id"
    :user="user"
  />
</template>
```

> 💡 **IMPORTANT**: Components imported in `<script setup>` are automatically available in the template without registration.

---

## Converting from Options API to Composition API

Let's walk through converting a real-world component from Options API to Composition API.

### Options API Example

```ts
<template>
  <div class="search-users">
    <input 
      v-model="searchQuery" 
      placeholder="Search users..."
      @input="handleSearch"
    />
    
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <ul v-else class="user-list">
      <li v-for="user in filteredUsers" :key="user.id">
        {{ user.name }} ({{ user.email }})
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      users: [],
      searchQuery: '',
      loading: false,
      error: null
    }
  },
  
  computed: {
    filteredUsers() {
      if (!this.searchQuery) return this.users
      
      const query = this.searchQuery.toLowerCase()
      return this.users.filter(user => 
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      )
    }
  },
  
  methods: {
    async fetchUsers() {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch('/api/users')
        this.users = await response.json()
      } catch (err) {
        this.error = 'Failed to load users'
      } finally {
        this.loading = false
      }
    },
    
    handleSearch() {
      // Debouncing or other search logic
      console.log('Searching for:', this.searchQuery)
    }
  },
  
  mounted() {
    this.fetchUsers()
  }
}
</script>
```

### Composition API Conversion (using `setup()`)

```ts
<script lang="ts">
import { ref, computed, onMounted } from 'vue'

export default {
  setup() {
    // Reactive state
    const users = ref([])
    const searchQuery = ref('')
    const loading = ref(false)
    const error = ref(null)
    
    // Computed properties
    const filteredUsers = computed(() => {
      if (!searchQuery.value) return users.value
      
      const query = searchQuery.value.toLowerCase()
      return users.value.filter(user => 
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      )
    })
    
    // Methods
    async function fetchUsers() {
      loading.value = true
      error.value = null
      
      try {
        const response = await fetch('/api/users')
        users.value = await response.json()
      } catch (err) {
        error.value = 'Failed to load users'
      } finally {
        loading.value = false
      }
    }
    
    function handleSearch() {
      console.log('Searching for:', searchQuery.value)
    }
    
    // Lifecycle hooks
    onMounted(() => {
      fetchUsers()
    })
    
    // Expose to template
    return {
      users,
      searchQuery,
      loading,
      error,
      filteredUsers,
      handleSearch
    }
  }
}
</script>
```

### Composition API with `<script setup>`

```ts
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Reactive state
const users = ref([])
const searchQuery = ref('')
const loading = ref(false)
const error = ref(null)

// Computed properties
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user => 
    user.name.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query)
  )
})

// Methods
async function fetchUsers() {
  loading.value = true
  error.value = null
  
  try {
    const response = await fetch('/api/users')
    users.value = await response.json()
  } catch (err) {
    error.value = 'Failed to load users'
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  console.log('Searching for:', searchQuery.value)
}

// Lifecycle hooks
onMounted(() => {
  fetchUsers()
})
</script>
```

> 💡 **IMPORTANT**: Notice how `<script setup>` eliminates boilerplate while maintaining the same logical organization.

---

## Lifecycle Hooks in Composition API

The Composition API provides lifecycle hooks as **functions** that you can import and use inside `setup()`.

### Lifecycle Hook Mapping

| Options API     | Composition API   | When It Runs                          |
| --------------- | ----------------- | ------------------------------------- |
| `beforeCreate`  | Not needed        | Logic goes directly in `setup()`      |
| `created`       | Not needed        | Logic goes directly in `setup()`      |
| `beforeMount`   | `onBeforeMount`   | Before component is mounted           |
| `mounted`       | `onMounted`       | After component is mounted            |
| `beforeUpdate`  | `onBeforeUpdate`  | Before reactive data updates DOM      |
| `updated`       | `onUpdated`       | After DOM has been updated            |
| `beforeUnmount` | `onBeforeUnmount` | Before component is unmounted         |
| `unmounted`     | `onUnmounted`     | After component is unmounted          |
| `errorCaptured` | `onErrorCaptured` | When error from descendant caught     |
| `activated`     | `onActivated`     | When kept-alive component activates   |
| `deactivated`   | `onDeactivated`   | When kept-alive component deactivates |

### Example Usage

```ts
<script setup lang="ts">
import { 
  ref, 
  onMounted, 
  onBeforeUnmount, 
  onUpdated 
} from 'vue'

const count = ref(0)
const intervalId = ref(null)

onMounted(() => {
  console.log('Component mounted!')
  
  // Start interval
  intervalId.value = setInterval(() => {
    count.value++
  }, 1000)
})

onUpdated(() => {
  console.log('Component updated! Count is now:', count.value)
})

onBeforeUnmount(() => {
  console.log('Cleaning up...')
  
  // Clear interval to prevent memory leaks
  if (intervalId.value) {
    clearInterval(intervalId.value)
  }
})
</script>
```

> ⚠️ **CRITICAL**: Always clean up side effects (timers, event listeners, subscriptions) in `onBeforeUnmount` to prevent memory leaks.

---

## Introduction to Composables

**Composables** are reusable functions that encapsulate stateful logic using the Composition API. They're the Composition API's answer to mixins and provide a cleaner way to share logic across components.

### What is a Composable?

A composable is a function that:

1. Uses Vue's Composition API (refs, computed, lifecycle hooks, etc.)
2. Returns reactive state and/or functions
3. Can be imported and used in any component
4. Follows the naming convention `use*` (e.g., `useMouse`, `useLocalStorage`)

### Example: `useMouse` Composable

**composables/useMouse.ts:**

```ts
import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)
  
  function update(event: MouseEvent) {
    x.value = event.pageX
    y.value = event.pageY
  }
  
  onMounted(() => {
    window.addEventListener('mousemove', update)
  })
  
  onBeforeUnmount(() => {
    window.removeEventListener('mousemove', update)
  })
  
  return { x, y }
}
```

**Using the composable:**

```ts
<script setup lang="ts">
import { useMouse } from './composables/useMouse'

const { x, y } = useMouse()
</script>

<template>
  <div>Mouse position: {{ x }}, {{ y }}</div>
</template>
```

> 💡 **IMPORTANT**: Each component that calls `useMouse()` gets its own isolated reactive state. The composable creates new refs for each instance.

### Example: `useLocalStorage` Composable

```ts
import { ref, watch } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T) {
  // Read from localStorage or use default
  const storedValue = localStorage.getItem(key)
  const data = ref<T>(
    storedValue ? JSON.parse(storedValue) : defaultValue
  )
  
  // Watch for changes and sync to localStorage
  watch(
    data,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue))
    },
    { deep: true }
  )
  
  return data
}
```

**Usage:**

```ts
<script setup lang="ts">
import { useLocalStorage } from './composables/useLocalStorage'

const username = useLocalStorage('username', 'Guest')
const settings = useLocalStorage('settings', { theme: 'dark', fontSize: 14 })
</script>

<template>
  <div>
    <input v-model="username" placeholder="Your name" />
    <p>Saved as: {{ username }}</p>
    
    <select v-model="settings.theme">
      <option value="dark">Dark</option>
      <option value="light">Light</option>
    </select>
  </div>
</template>
```

### Example: `useFetch` Composable

A practical composable for handling API requests:

```ts
import { ref } from 'vue'

interface UseFetchOptions {
  immediate?: boolean
}

export function useFetch<T>(url: string, options: UseFetchOptions = {}) {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)
  
  async function execute() {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      data.value = await response.json()
    } catch (err) {
      error.value = err as Error
    } finally {
      loading.value = false
    }
  }
  
  // Execute immediately if specified
  if (options.immediate !== false) {
    execute()
  }
  
  return { data, error, loading, execute }
}
```

**Usage:**

```ts
<script setup lang="ts">
import { useFetch } from './composables/useFetch'

interface User {
  id: number
  name: string
  email: string
}

const { data: users, error, loading, execute: refetch } = useFetch<User[]>(
  '/api/users',
  { immediate: true }
)
</script>

<template>
  <div>
    <button @click="refetch">Refresh</button>
    
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <ul v-else-if="users">
      <li v-for="user in users" :key="user.id">
        {{ user.name }}
      </li>
    </ul>
  </div>
</template>
```

---

## Benefits of Composables

### 1. **Better Code Organization**

Group related logic together instead of scattering it across options:

```ts
<script setup lang="ts">
import { useAuth } from './composables/useAuth'
import { useNotifications } from './composables/useNotifications'
import { useTheme } from './composables/useTheme'

// All auth-related logic
const { user, login, logout, isAuthenticated } = useAuth()

// All notification logic
const { notifications, addNotification, clearNotifications } = useNotifications()

// All theme logic
const { theme, toggleTheme, isDark } = useTheme()
</script>
```

### 2. **Easy Logic Reuse**

Share logic across components without mixins:

```ts
// ❌ OLD: Mixins (hard to trace, naming conflicts)
export default {
  mixins: [userMixin, formMixin]
}

// ✅ NEW: Composables (explicit, no conflicts)
const { user, fetchUser } = useUser()
const { formData, validate, submit } = useForm()
```

### 3. **Better TypeScript Support**

Composables have excellent type inference:

```ts
export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const increment = () => count.value++
  const decrement = () => count.value--
  
  return { count, increment, decrement }
}

// TypeScript knows the exact shape of the return value
const { count, increment, decrement } = useCounter(10)
```

### 4. **Flexible Composition**

Composables can use other composables:

```ts
export function useUserProfile(userId: number) {
  // Use other composables
  const { data: user, loading, error } = useFetch(`/api/users/${userId}`)
  const { saveToCache, getFromCache } = useCache()
  
  // Add custom logic
  const displayName = computed(() => 
    user.value ? `${user.value.firstName} ${user.value.lastName}` : 'Unknown'
  )
  
  return { user, loading, error, displayName }
}
```

---

## Code Organization Patterns

### Pattern 1: Grouping by Feature

Organize related logic together:

```ts
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// ======= User Feature =======
const user = ref(null)
const userLoading = ref(false)

async function fetchUser() {
  userLoading.value = true
  // ... fetch logic
}

const userDisplayName = computed(() => 
  user.value ? user.value.name : 'Guest'
)

// ======= Posts Feature =======
const posts = ref([])
const postsLoading = ref(false)

async function fetchPosts() {
  postsLoading.value = true
  // ... fetch logic
}

const publishedPosts = computed(() => 
  posts.value.filter(p => p.published)
)

// ======= Initialization =======
onMounted(() => {
  fetchUser()
  fetchPosts()
})
</script>
```

### Pattern 2: Extract to Composables

For larger features, extract to composables:

```ts
<script setup lang="ts">
import { useUser } from './composables/useUser'
import { usePosts } from './composables/usePosts'

const { user, loading: userLoading, fetchUser, displayName } = useUser()
const { posts, loading: postsLoading, fetchPosts, publishedPosts } = usePosts()

onMounted(() => {
  fetchUser()
  fetchPosts()
})
</script>
```

### Pattern 3: Composable with Options

Make composables configurable:

```ts
export function useCounter(options = {}) {
  const {
    initialValue = 0,
    min = -Infinity,
    max = Infinity,
    step = 1
  } = options
  
  const count = ref(initialValue)
  
  function increment() {
    if (count.value + step <= max) {
      count.value += step
    }
  }
  
  function decrement() {
    if (count.value - step >= min) {
      count.value -= step
    }
  }
  
  function reset() {
    count.value = initialValue
  }
  
  return { count, increment, decrement, reset }
}

// Usage
const { count, increment } = useCounter({ 
  initialValue: 10, 
  max: 20, 
  step: 2 
})
```

---

## When to Use Composition API vs Options API

### Use Composition API When:

✅ Building complex components with multiple logical concerns  
✅ You need to reuse logic across components  
✅ Working with TypeScript and need better type inference  
✅ Building a library of reusable composables  
✅ Team prefers functional programming style

### Use Options API When:

✅ Building simple components with straightforward logic  
✅ Team is more familiar with object-oriented patterns  
✅ Working on legacy projects already using Options API  
✅ Prefer the explicit structure of options-based organization

> 💡 **IMPORTANT**: You can use both APIs in the same project, and even in the same component (though this is not recommended for simplicity).

---

## Common Mistakes and How to Avoid Them

### Mistake 1: Forgetting `.value` with Refs

```ts
// ❌ BAD: Forgetting .value
const count = ref(0)
count++ // This doesn't work!

// ✅ GOOD
const count = ref(0)
count.value++
```

> ⚠️ **CRITICAL**: Always use `.value` to access or modify ref values in JavaScript. In templates, Vue automatically unwraps refs for you.

### Mistake 2: Destructuring Props

```ts
// ❌ BAD: Loses reactivity
const { userId } = props
watch(userId, ...) // Won't react to changes!

// ✅ GOOD: Keep reactivity
watch(() => props.userId, ...)
// OR
const userId = computed(() => props.userId)
```

### Mistake 3: Returning Reactive Objects Incorrectly

```ts
// ❌ BAD: Returns the proxy, not the value
function useData() {
  const data = reactive({ count: 0 })
  return data // Loses reactivity when destructured
}
const { count } = useData() // count is not reactive!

// ✅ GOOD: Return using toRefs
import { toRefs } from 'vue'

function useData() {
  const data = reactive({ count: 0 })
  return toRefs(data)
}
const { count } = useData() // count IS reactive!

// ✅ ALTERNATIVE: Return refs individually
function useData() {
  const count = ref(0)
  const name = ref('')
  return { count, name }
}
```

### Mistake 4: Not Cleaning Up Side Effects

```ts
// ❌ BAD: Memory leak!
onMounted(() => {
  setInterval(() => {
    console.log('Running...')
  }, 1000)
})

// ✅ GOOD: Clean up
const intervalId = ref(null)

onMounted(() => {
  intervalId.value = setInterval(() => {
    console.log('Running...')
  }, 1000)
})

onBeforeUnmount(() => {
  clearInterval(intervalId.value)
})
```

### Mistake 5: Using `this` in Composition API

```ts
// ❌ BAD: `this` doesn't work in setup()
setup() {
  function handleClick() {
    console.log(this.count) // Undefined!
  }
}

// ✅ GOOD: Use refs directly
const count = ref(0)

function handleClick() {
  console.log(count.value)
}
```

### Mistake 6: Creating Reactive State Outside Components

```ts
// ❌ BAD: Shared state across ALL instances
const count = ref(0) // Global!

export function useCounter() {
  return { count }
}

// ✅ GOOD: Create state inside the composable
export function useCounter() {
  const count = ref(0) // New instance per call
  return { count }
}

// ✅ OR: Explicitly share state (when intended)
const sharedCount = ref(0)

export function useSharedCounter() {
  return { count: sharedCount }
}
```

---

## Practical Example: Todo List

Let's build a complete todo list using Composition API patterns:

**composables/useTodos.ts:**

```ts
import { ref, computed } from 'vue'

export interface Todo {
  id: number
  text: string
  completed: boolean
}

export function useTodos() {
  const todos = ref<Todo[]>([])
  const filter = ref<'all' | 'active' | 'completed'>('all')
  
  const filteredTodos = computed(() => {
    switch (filter.value) {
      case 'active':
        return todos.value.filter(t => !t.completed)
      case 'completed':
        return todos.value.filter(t => t.completed)
      default:
        return todos.value
    }
  })
  
  const stats = computed(() => ({
    total: todos.value.length,
    active: todos.value.filter(t => !t.completed).length,
    completed: todos.value.filter(t => t.completed).length
  }))
  
  function addTodo(text: string) {
    todos.value.push({
      id: Date.now(),
      text,
      completed: false
    })
  }
  
  function removeTodo(id: number) {
    const index = todos.value.findIndex(t => t.id === id)
    if (index > -1) {
      todos.value.splice(index, 1)
    }
  }
  
  function toggleTodo(id: number) {
    const todo = todos.value.find(t => t.id === id)
    if (todo) {
      todo.completed = !todo.completed
    }
  }
  
  function clearCompleted() {
    todos.value = todos.value.filter(t => !t.completed)
  }
  
  return {
    todos,
    filter,
    filteredTodos,
    stats,
    addTodo,
    removeTodo,
    toggleTodo,
    clearCompleted
  }
}
```

**TodoList.vue:**

```ts
<script setup lang="ts">
import { ref } from 'vue'
import { useTodos } from './composables/useTodos'

const { 
  filteredTodos, 
  stats, 
  filter,
  addTodo, 
  removeTodo, 
  toggleTodo, 
  clearCompleted 
} = useTodos()

const newTodoText = ref('')

function handleAdd() {
  if (newTodoText.value.trim()) {
    addTodo(newTodoText.value)
    newTodoText.value = ''
  }
}
</script>

<template>
  <div class="todo-app">
    <h1>My Todo List</h1>
    
    <!-- Add todo -->
    <form @submit.prevent="handleAdd">
      <input 
        v-model="newTodoText" 
        placeholder="What needs to be done?"
      />
      <button type="submit">Add</button>
    </form>
    
    <!-- Filters -->
    <div class="filters">
      <button 
        :class="{ active: filter === 'all' }"
        @click="filter = 'all'"
      >
        All ({{ stats.total }})
      </button>
      <button 
        :class="{ active: filter === 'active' }"
        @click="filter = 'active'"
      >
        Active ({{ stats.active }})
      </button>
      <button 
        :class="{ active: filter === 'completed' }"
        @click="filter = 'completed'"
      >
        Completed ({{ stats.completed }})
      </button>
    </div>
    
    <!-- Todo list -->
    <ul class="todo-list">
      <li 
        v-for="todo in filteredTodos" 
        :key="todo.id"
        :class="{ completed: todo.completed }"
      >
        <input 
          type="checkbox" 
          :checked="todo.completed"
          @change="toggleTodo(todo.id)"
        />
        <span>{{ todo.text }}</span>
        <button @click="removeTodo(todo.id)">Delete</button>
      </li>
    </ul>
    
    <!-- Clear completed -->
    <button 
      v-if="stats.completed > 0"
      @click="clearCompleted"
    >
      Clear Completed
    </button>
  </div>
</template>
```

---

## Summary

In this lesson, you learned:

- ✅ **Why Composition API exists**: Better code organization, reusability, and TypeScript support
- ✅ **The `setup()` function**: Entry point for Composition API, executes before component creation
- ✅ **`<script setup>` syntax**: Concise, compile-time sugar with auto-exposure to templates
- ✅ **Converting from Options API**: Transforming data, methods, computed, and lifecycle hooks
- ✅ **Lifecycle hooks**: Using `onMounted`, `onBeforeUnmount`, etc. as imported functions
- ✅ **Composables**: Reusable functions that encapsulate stateful logic (e.g., `useMouse`, `useFetch`)
- ✅ **Code organization patterns**: Group by feature, extract to composables, make configurable
- ✅ **Common mistakes**: Forgetting `.value`, destructuring props, not cleaning up side effects
- ✅ **Practical patterns**: Building real-world features with composables

The Composition API is not a replacement for the Options API—it's an alternative that shines when building complex, reusable logic. As you become comfortable with composables, you'll find your code becomes more modular, testable, and maintainable.

---

## Next Steps

Continue your learning journey:

1. **Practice**: Complete [exercises.md](./exercises.md) to reinforce concepts
2. **Sample Project**: Build the sample project in [sample-project.md](./sample-project.md)
3. **Quiz**: Test your knowledge with [quiz.md](./quiz.md)
4. **Glossary**: Review key terms in [glossary.md](./glossary.md)
5. **Next Lesson**: Module 2, Lesson 2.3 - Advanced Composables and Patterns

---

**Resources:**

- [Vue 3 Composition API Documentation](https://vuejs.org/guide/extras/composition-api-faq.html)
- [VueUse - Collection of Essential Vue Composition Utilities](https://vueuse.org/)
- [Composition API RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0013-composition-api.md)
