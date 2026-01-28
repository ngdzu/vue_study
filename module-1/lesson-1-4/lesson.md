# Lesson 1.4 — Methods, Computed, & Watchers

## Learning Goals
- Understand the differences between methods, computed properties, and watchers
- Know when to use each pattern for optimal performance
- Master dependency tracking in computed properties
- Implement watchers for side effects and async operations
- Use event handlers and method bindings effectively
- Apply debouncing and throttling to watchers
- Avoid common anti-patterns and performance pitfalls

## Prerequisites
- Completed Lesson 1.1 (Vue 3 Setup & Project Structure)
- Completed Lesson 1.2 (Reactive Data & Data Binding)
- Completed Lesson 1.3 (Conditional Rendering & List Rendering)
- Understanding of JavaScript functions, arrays, and asynchronous code

## What You Will Build
A search and sort UI component with debounced search, computed filtering and sorting, and watchers for API calls and analytics tracking.

---

## The Three Reactive Patterns

Vue provides three ways to work with reactive data and perform logic:

1. **Methods**: Functions called explicitly (from templates or other code)
2. **Computed Properties**: Cached derived state that auto-updates when dependencies change
3. **Watchers**: Side-effect handlers that run when specific data changes

Each has distinct use cases and performance characteristics.

---

## Methods

Methods are regular JavaScript functions defined in your component. They run **every time** they're called—no caching, no automatic dependency tracking.

### Basic Methods

```vue
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}

function decrement() {
  count.value--
}

function reset() {
  count.value = 0
}
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
    <button @click="reset">Reset</button>
  </div>
</template>
```

### Event Handling with Methods

```vue
<script setup lang="ts">
import { ref } from 'vue'

const message = ref('')

// Method with parameters
function greet(name: string) {
  message.value = `Hello, ${name}!`
}

// Method with event object
function handleClick(event: MouseEvent) {
  console.log('Clicked at', event.clientX, event.clientY)
}

// Method with both event and custom args
function handleSubmit(event: Event, customData: string) {
  event.preventDefault()
  console.log('Submitted with:', customData)
}
</script>

<template>
  <div>
    <button @click="greet('Alice')">Greet Alice</button>
    <button @click="handleClick">Click Me</button>
    
    <!-- Inline handler with $event -->
    <form @submit="handleSubmit($event, 'custom-data')">
      <button type="submit">Submit</button>
    </form>
  </div>
</template>
```

### Methods in Templates

```vue
<script setup lang="ts">
import { ref } from 'vue'

const price = ref(99.99)

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
}

function calculateTax(price: number): number {
  return price * 0.1
}
</script>

<template>
  <div>
    <p>Price: {{ formatCurrency(price) }}</p>
    <p>Tax: {{ formatCurrency(calculateTax(price)) }}</p>
    <p>Total: {{ formatCurrency(price + calculateTax(price)) }}</p>
  </div>
</template>
```

> ⚠️ CRITICAL: Methods in templates run **on every render**. If called multiple times in the template, they execute multiple times. Use computed properties for expensive calculations!

### When to Use Methods

✅ **Good use cases**:
- Event handlers (click, submit, input)
- Actions that modify state
- One-time calculations triggered by user actions
- Functions that accept parameters
- API calls triggered by user interaction
- Non-reactive utility functions

❌ **Bad use cases**:
- Expensive calculations in templates (use computed instead)
- Formatting displayed data (use computed instead)
- Tracking reactive dependencies (use computed instead)

---

## Computed Properties

Computed properties are **cached reactive values** that automatically update when their dependencies change. They're perfect for derived state.

### Basic Computed Properties

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

// Computed property: cached and reactive
const fullName = computed(() => {
  console.log('Computing fullName') // Only runs when firstName or lastName change
  return `${firstName.value} ${lastName.value}`
})
</script>

<template>
  <div>
    <p>Full name: {{ fullName }}</p>
    <p>Full name again: {{ fullName }}</p> <!-- Doesn't recompute! -->
    <input v-model="firstName" placeholder="First name" />
    <input v-model="lastName" placeholder="Last name" />
  </div>
</template>
```

**Key behavior**: Even though `fullName` appears twice in the template, it only computes **once per render** because the result is cached.

### Computed vs Method Performance

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const items = ref(Array.from({ length: 1000 }, (_, i) => i))

// ✅ GOOD: Computed (cached)
const expensiveComputed = computed(() => {
  console.log('Computing...') // Only runs when items change
  return items.value.reduce((sum, item) => sum + item, 0)
})

// ❌ BAD: Method (no cache)
function expensiveMethod() {
  console.log('Method called') // Runs EVERY render
  return items.value.reduce((sum, item) => sum + item, 0)
}
</script>

<template>
  <div>
    <!-- Called once per render -->
    <p>Computed: {{ expensiveComputed }}</p>
    <p>Computed again: {{ expensiveComputed }}</p>
    
    <!-- Called TWICE per render -->
    <p>Method: {{ expensiveMethod() }}</p>
    <p>Method again: {{ expensiveMethod() }}</p>
  </div>
</template>
```

**Performance difference**:
- `expensiveComputed`: Executes once, result cached
- `expensiveMethod()`: Executes twice (once per call)

### Writable Computed Properties

Computed properties can have both getter and setter:

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed({
  // Getter: Called when reading fullName
  get() {
    return `${firstName.value} ${lastName.value}`
  },
  // Setter: Called when writing to fullName
  set(value: string) {
    const parts = value.split(' ')
    firstName.value = parts[0] || ''
    lastName.value = parts[1] || ''
  }
})
</script>

<template>
  <div>
    <!-- Two-way binding works! -->
    <input v-model="fullName" placeholder="Full name" />
    <p>First: {{ firstName }}</p>
    <p>Last: {{ lastName }}</p>
  </div>
</template>
```

When you type "Jane Smith" in the input:
1. Vue calls the setter with `"Jane Smith"`
2. Setter splits it and updates `firstName` and `lastName`
3. Getter runs and recomputes `fullName`
4. Template updates

### Complex Computed Logic

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

interface Product {
  id: number
  name: string
  price: number
  category: string
  inStock: boolean
}

const products = ref<Product[]>([
  { id: 1, name: 'Laptop', price: 999, category: 'electronics', inStock: true },
  { id: 2, name: 'Phone', price: 699, category: 'electronics', inStock: false },
  { id: 3, name: 'Desk', price: 299, category: 'furniture', inStock: true }
])

const searchQuery = ref('')
const selectedCategory = ref<string>('all')
const sortBy = ref<'name' | 'price'>('name')
const sortOrder = ref<'asc' | 'desc'>('asc')

// Chained computed properties
const filteredProducts = computed(() => {
  let result = products.value
  
  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p => p.name.toLowerCase().includes(query))
  }
  
  // Filter by category
  if (selectedCategory.value !== 'all') {
    result = result.filter(p => p.category === selectedCategory.value)
  }
  
  return result
})

const sortedProducts = computed(() => {
  const sorted = [...filteredProducts.value]
  
  sorted.sort((a, b) => {
    const aVal = a[sortBy.value]
    const bVal = b[sortBy.value]
    
    let comparison = 0
    if (aVal < bVal) comparison = -1
    if (aVal > bVal) comparison = 1
    
    return sortOrder.value === 'asc' ? comparison : -comparison
  })
  
  return sorted
})

// Statistics computed from filtered data
const stats = computed(() => ({
  total: filteredProducts.value.length,
  inStock: filteredProducts.value.filter(p => p.inStock).length,
  averagePrice: filteredProducts.value.length > 0
    ? filteredProducts.value.reduce((sum, p) => sum + p.price, 0) / filteredProducts.value.length
    : 0
}))
</script>

<template>
  <div>
    <input v-model="searchQuery" placeholder="Search..." />
    
    <select v-model="selectedCategory">
      <option value="all">All Categories</option>
      <option value="electronics">Electronics</option>
      <option value="furniture">Furniture</option>
    </select>
    
    <button @click="sortBy = 'name'">Sort by Name</button>
    <button @click="sortBy = 'price'">Sort by Price</button>
    <button @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'">
      {{ sortOrder === 'asc' ? '↑' : '↓' }}
    </button>
    
    <p>Showing {{ stats.total }} products ({{ stats.inStock }} in stock)</p>
    <p>Average price: ${{ stats.averagePrice.toFixed(2) }}</p>
    
    <ul>
      <li v-for="product in sortedProducts" :key="product.id">
        {{ product.name }} - ${{ product.price }}
        <span v-if="!product.inStock">(Out of stock)</span>
      </li>
    </ul>
  </div>
</template>
```

> 💡 IMPORTANT: Computed properties can depend on other computed properties! Vue automatically tracks all dependencies.

### When to Use Computed Properties

✅ **Good use cases**:
- Derived state (filtering, sorting, transforming)
- Formatting displayed values
- Complex calculations that depend on reactive data
- Aggregating data (sums, averages, counts)
- Combining multiple reactive sources
- Any logic used multiple times in template

❌ **Bad use cases**:
- Side effects (API calls, DOM manipulation) → use watchers
- Async operations → use watchers or methods
- Functions that need parameters → use methods
- One-off calculations not used in template → use methods

---

## Watchers

Watchers are **side-effect handlers** that run when reactive data changes. Unlike computed properties (which return values), watchers **perform actions**.

### Basic watch()

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'

const count = ref(0)

// Watch a single ref
watch(count, (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`)
})

function increment() {
  count.value++
}
</script>

<template>
  <button @click="increment">Count: {{ count }}</button>
</template>
```

### Watching Multiple Sources

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

// Watch multiple refs
watch([firstName, lastName], ([newFirst, newLast], [oldFirst, oldLast]) => {
  console.log(`Name changed from ${oldFirst} ${oldLast} to ${newFirst} ${newLast}`)
})
</script>
```

### Watching Reactive Objects

```vue
<script setup lang="ts">
import { reactive, watch } from 'vue'

const user = reactive({
  name: 'Alice',
  age: 30,
  email: 'alice@example.com'
})

// Watch entire object (deep by default for reactive objects)
watch(user, (newValue) => {
  console.log('User changed:', newValue)
  // Save to localStorage
  localStorage.setItem('user', JSON.stringify(newValue))
})

// Watch specific property
watch(() => user.email, (newEmail, oldEmail) => {
  console.log(`Email changed from ${oldEmail} to ${newEmail}`)
})
</script>
```

### Deep Watching

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'

interface User {
  profile: {
    name: string
    settings: {
      theme: string
    }
  }
}

const user = ref<User>({
  profile: {
    name: 'Alice',
    settings: {
      theme: 'dark'
    }
  }
})

// Shallow watch (default) - won't trigger on nested changes
watch(user, () => {
  console.log('User replaced') // Only when user.value = {...}
})

// Deep watch - triggers on any nested property change
watch(user, () => {
  console.log('User or any nested property changed')
}, { deep: true })

// Watch specific nested property (no deep needed)
watch(() => user.value.profile.settings.theme, (newTheme) => {
  console.log('Theme changed to:', newTheme)
})
</script>
```

> ⚠️ CRITICAL: `deep: true` can be expensive for large objects. Only use when necessary. Prefer watching specific properties.

### Immediate Execution

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'

const userId = ref(1)

async function fetchUser(id: number) {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}

// Normal watch: only runs when userId changes (not on mount)
watch(userId, async (newId) => {
  await fetchUser(newId)
})

// Immediate watch: runs immediately AND when userId changes
watch(userId, async (newId) => {
  await fetchUser(newId)
}, { immediate: true })
</script>
```

### watchEffect()

`watchEffect()` automatically tracks all reactive dependencies used inside it—no need to specify what to watch.

```vue
<script setup lang="ts">
import { ref, watchEffect } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')
const age = ref(30)

// Automatically watches firstName, lastName, and age
watchEffect(() => {
  console.log(`${firstName.value} ${lastName.value} is ${age.value} years old`)
  // Runs immediately and whenever ANY of these change
})
</script>
```

**Difference from `watch()`**:
- `watchEffect()` runs **immediately** on creation
- Automatically tracks dependencies (no need to specify)
- No access to old values
- Better for side effects that depend on multiple sources

### Cleanup and Stop Watching

```vue
<script setup lang="ts">
import { ref, watch, watchEffect, onUnmounted } from 'vue'

const searchQuery = ref('')

// Watch returns a stop function
const stopWatching = watch(searchQuery, (query) => {
  console.log('Searching for:', query)
})

// Stop watching after 10 seconds
setTimeout(() => {
  stopWatching()
  console.log('Stopped watching searchQuery')
}, 10000)

// Cleanup in watchEffect
watchEffect((onCleanup) => {
  const timer = setTimeout(() => {
    console.log('Timer finished for:', searchQuery.value)
  }, 1000)
  
  // Cleanup function: runs before next execution and on unmount
  onCleanup(() => {
    clearTimeout(timer)
    console.log('Cleaned up timer')
  })
})

// Auto-stopped on component unmount
onUnmounted(() => {
  console.log('Component unmounted, all watchers stopped')
})
</script>
```

### Debounced Watchers

Common pattern for search inputs and API calls:

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'

const searchQuery = ref('')
const searchResults = ref<string[]>([])
const isSearching = ref(false)

let debounceTimer: number | null = null

watch(searchQuery, (query) => {
  // Clear previous timer
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  
  // Set new timer
  debounceTimer = setTimeout(async () => {
    if (query.length === 0) {
      searchResults.value = []
      return
    }
    
    isSearching.value = true
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      searchResults.value = await response.json()
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      isSearching.value = false
    }
  }, 300) // 300ms debounce delay
})
</script>

<template>
  <div>
    <input v-model="searchQuery" placeholder="Search..." />
    <p v-if="isSearching">Searching...</p>
    <ul v-else>
      <li v-for="result in searchResults" :key="result">
        {{ result }}
      </li>
    </ul>
  </div>
</template>
```

### Watch Flush Timing

Control when watchers run relative to component updates:

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'

const count = ref(0)

// Default: 'pre' - runs before component updates
watch(count, () => {
  console.log('Pre-flush: before DOM update')
})

// 'post' - runs after component updates (DOM is updated)
watch(count, () => {
  console.log('Post-flush: after DOM update')
  // Safe to access updated DOM here
}, { flush: 'post' })

// 'sync' - runs synchronously (use sparingly, can hurt performance)
watch(count, () => {
  console.log('Sync: runs immediately')
}, { flush: 'sync' })
</script>
```

> 💡 IMPORTANT: Use `flush: 'post'` when you need to access the updated DOM in your watcher.

### When to Use Watchers

✅ **Good use cases**:
- API calls when data changes
- Saving to localStorage/sessionStorage
- Triggering animations
- Analytics tracking
- Validation that requires async operations
- Side effects that don't return values
- Debounced/throttled operations

❌ **Bad use cases**:
- Deriving state from other state → use computed
- Formatting values for display → use computed
- Synchronous transformations → use computed
- Any logic that returns a value for the template → use computed

---

## Decision Matrix: When to Use What?

| Need                    | Use This     | Example                         |
| ----------------------- | ------------ | ------------------------------- |
| Handle user click       | **Method**   | `@click="handleClick"`          |
| Format display value    | **Computed** | `{{ formattedPrice }}`          |
| Filter/sort list        | **Computed** | `filteredItems = computed(...)` |
| Calculate derived state | **Computed** | `totalPrice = computed(...)`    |
| API call on data change | **Watcher**  | `watch(userId, fetchUser)`      |
| Save to localStorage    | **Watcher**  | `watch(state, saveState)`       |
| Debounced search        | **Watcher**  | `watch(query, search)`          |
| Accept parameters       | **Method**   | `greet(name: string)`           |
| Track analytics         | **Watcher**  | `watch(page, trackView)`        |
| One-time calculation    | **Method**   | Called from event handler       |

---

## Common Anti-Patterns

### ❌ Anti-Pattern 1: Using Methods Instead of Computed

```vue
<!-- ❌ BAD: Method called multiple times -->
<template>
  <p>{{ getFilteredItems() }}</p>
  <p>Count: {{ getFilteredItems().length }}</p>
  <p>First: {{ getFilteredItems()[0] }}</p>
</template>

<script setup>
function getFilteredItems() {
  console.log('Filtering...') // Runs 3 times!
  return items.value.filter(item => item.active)
}
</script>
```

```vue
<!-- ✅ GOOD: Computed property cached -->
<template>
  <p>{{ filteredItems }}</p>
  <p>Count: {{ filteredItems.length }}</p>
  <p>First: {{ filteredItems[0] }}</p>
</template>

<script setup>
const filteredItems = computed(() => {
  console.log('Filtering...') // Runs once per change
  return items.value.filter(item => item.active)
})
</script>
```

### ❌ Anti-Pattern 2: Using Watchers to Update Derived State

```vue
<!-- ❌ BAD: Watcher updating derived state -->
<script setup>
const items = ref([1, 2, 3])
const total = ref(0)

watch(items, () => {
  total.value = items.value.reduce((sum, item) => sum + item, 0)
}, { deep: true, immediate: true })
</script>
```

```vue
<!-- ✅ GOOD: Computed property -->
<script setup>
const items = ref([1, 2, 3])

const total = computed(() => {
  return items.value.reduce((sum, item) => sum + item, 0)
})
</script>
```

### ❌ Anti-Pattern 3: Computed Property with Side Effects

```vue
<!-- ❌ BAD: Computed with side effects -->
<script setup>
const userId = ref(1)

const userData = computed(() => {
  // DON'T DO THIS in computed!
  fetch(`/api/users/${userId.value}`)
    .then(r => r.json())
    .then(data => console.log(data))
  
  return userId.value
})
</script>
```

```vue
<!-- ✅ GOOD: Watcher for side effects -->
<script setup>
const userId = ref(1)
const userData = ref(null)

watch(userId, async (id) => {
  const response = await fetch(`/api/users/${id}`)
  userData.value = await response.json()
}, { immediate: true })
</script>
```

### ❌ Anti-Pattern 4: Unnecessary Deep Watching

```vue
<!-- ❌ BAD: Deep watch on large object -->
<script setup>
const massiveObject = ref({
  // 1000s of nested properties
})

watch(massiveObject, () => {
  console.log('Something changed')
}, { deep: true }) // Expensive!
</script>
```

```vue
<!-- ✅ GOOD: Watch specific property -->
<script setup>
const massiveObject = ref({
  settings: { theme: 'dark' }
})

watch(() => massiveObject.value.settings.theme, (theme) => {
  console.log('Theme changed to:', theme)
})
</script>
```

---

## Performance Considerations

### Computed Property Caching

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const counter = ref(0)

const expensive = computed(() => {
  console.log('Computing...')
  // Expensive operation
  let sum = 0
  for (let i = 0; i < 1000000; i++) {
    sum += i
  }
  return sum + counter.value
})
</script>

<template>
  <div>
    <!-- Computed once, used many times -->
    <p>{{ expensive }}</p>
    <p>{{ expensive }}</p>
    <p>{{ expensive }}</p>
    
    <!-- Only recomputes when counter changes -->
    <button @click="counter++">Increment (will recompute)</button>
    
    <!-- These won't trigger recomputation -->
    <button @click="console.log('test')">No recompute</button>
  </div>
</template>
```

### Avoiding Unnecessary Watchers

```vue
<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const price = ref(100)
const quantity = ref(2)

// ❌ BAD: Unnecessary watchers
const total = ref(0)
watch([price, quantity], () => {
  total.value = price.value * quantity.value
})

// ✅ GOOD: Use computed instead
const total = computed(() => price.value * quantity.value)
</script>
```

---

## Summary

### Methods
- Regular functions, no caching
- Run every time they're called
- **Use for**: Event handlers, actions, functions with parameters

### Computed Properties
- Cached, reactive derived state
- Auto-track dependencies
- **Use for**: Filtering, sorting, formatting, calculations

### Watchers
- Side-effect handlers
- Respond to data changes
- **Use for**: API calls, localStorage, analytics, async operations

### Golden Rules
1. **If it returns a value for the template** → Computed
2. **If it performs a side effect** → Watcher
3. **If it responds to user action** → Method
4. **If it's expensive and used multiple times** → Computed
5. **If it needs parameters** → Method
6. **If it's async** → Watcher or Method

---

## Next Steps

1. Build the [sample project](sample-project.md): Search + sort UI with debounced search
2. Complete the [exercises](exercises.md): Implement various patterns
3. Take the [quiz](quiz.md) to test your understanding
4. Review [glossary](glossary.md) for any unfamiliar terms

In Lesson 1.5, we'll explore component basics and props for building reusable components.
