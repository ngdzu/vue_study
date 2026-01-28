# Lesson 1.3 — Conditional Rendering & List Rendering

## Learning Goals
- Master conditional rendering with `v-if`, `v-else-if`, `v-else`, and `v-show`
- Understand when to use `v-if` vs `v-show` for performance
- Render dynamic lists efficiently with `v-for`
- Implement proper key management for list reconciliation
- Combine `v-if` and `v-for` correctly (and avoid common pitfalls)
- Handle edge cases: empty lists, filtering, and nested iterations

## Prerequisites
- Completed Lesson 1.1 (Vue 3 Setup & Project Structure)
- Completed Lesson 1.2 (Reactive Data & Data Binding)
- Understanding of JavaScript arrays and array methods (`map`, `filter`, `find`)

## What You Will Build
A dynamic todo list with filtering, conditional states (empty/loading/error), and efficient list rendering with proper key management.

---

## Conditional Rendering: v-if vs v-show

Vue provides two main directives for conditional rendering: `v-if` and `v-show`. They behave differently and have different performance characteristics.

### v-if — Conditional Mounting

`v-if` **completely removes or adds elements** to the DOM based on the condition. It's "real" conditional rendering.

```vue
<script setup lang="ts">
import { ref } from 'vue'

const isLoggedIn = ref(false)
const userRole = ref<'admin' | 'user' | 'guest'>('guest')
</script>

<template>
  <div>
    <button @click="isLoggedIn = !isLoggedIn">Toggle Login</button>
    
    <!-- Element is added/removed from DOM -->
    <div v-if="isLoggedIn">
      Welcome back!
    </div>
    
    <!-- v-else must immediately follow v-if -->
    <div v-else>
      Please log in
    </div>
  </div>
</template>
```

**How it works**:
- When `isLoggedIn` is `false`, the welcome message **does not exist in the DOM**
- When it becomes `true`, Vue creates and mounts the element
- Expensive initial render, but saves memory when hidden

### v-else-if — Chained Conditions

```vue
<template>
  <div v-if="userRole === 'admin'">
    <h2>Admin Dashboard</h2>
    <AdminPanel />
  </div>
  <div v-else-if="userRole === 'user'">
    <h2>User Dashboard</h2>
    <UserPanel />
  </div>
  <div v-else>
    <h2>Guest Access</h2>
    <p>Please register or log in</p>
  </div>
</template>
```

> ⚠️ CRITICAL: `v-else` and `v-else-if` must **immediately follow** a `v-if` or `v-else-if` element. No other elements in between!

### v-show — Display Toggle

`v-show` **always renders the element** but toggles its CSS `display` property.

```vue
<script setup lang="ts">
import { ref } from 'vue'
const showDetails = ref(false)
</script>

<template>
  <button @click="showDetails = !showDetails">Toggle Details</button>
  
  <!-- Element stays in DOM, display: none when false -->
  <div v-show="showDetails">
    <p>These details are always in the DOM...</p>
    <p>...but hidden with CSS when showDetails is false</p>
  </div>
</template>
```

**How it works**:
- Element is **always mounted** in the DOM
- Vue sets `display: none` when condition is `false`
- Cheap toggling, but uses memory even when hidden

### When to Use v-if vs v-show

| Scenario                         | Use This | Reason                                        |
| -------------------------------- | -------- | --------------------------------------------- |
| Toggles rarely                   | `v-if`   | Avoid rendering cost for rarely-shown content |
| Toggles frequently               | `v-show` | Avoid mounting/unmounting overhead            |
| Heavy component (chart, video)   | `v-if`   | Save resources when not needed                |
| Simple toggle (dropdown menu)    | `v-show` | Fast toggling without DOM changes             |
| Conditional on route/auth        | `v-if`   | No point keeping in DOM when unavailable      |
| Tab panels (user switches often) | `v-show` | Preserve state, fast switching                |

```vue
<script setup lang="ts">
import { ref } from 'vue'

// User toggles this frequently → v-show
const showSettings = ref(false)

// User rarely an admin → v-if
const isAdmin = ref(false)

// Heavy component → v-if
const showChart = ref(false)
</script>

<template>
  <!-- Frequent toggle → v-show -->
  <div v-show="showSettings" class="settings-panel">
    <SettingsForm />
  </div>
  
  <!-- Rare condition → v-if -->
  <AdminPanel v-if="isAdmin" />
  
  <!-- Heavy component → v-if -->
  <ExpensiveChart v-if="showChart" />
</template>
```

> 💡 IMPORTANT: "Lazy" only means **initial render**; `v-if` IS fully reactive and will re-render when condition changes.

---

## Template Groups with v-if

Sometimes you need to conditionally render **multiple elements** together, but don't want an extra wrapper `<div>`. Use `<template>` as an invisible wrapper.

```vue
<script setup lang="ts">
import { ref } from 'vue'
const showSection = ref(true)
</script>

<template>
  <!-- <template> doesn't render to DOM -->
  <template v-if="showSection">
    <h2>Section Title</h2>
    <p>Paragraph 1</p>
    <p>Paragraph 2</p>
  </template>
  
  <!-- This would add an unnecessary div: -->
  <!-- <div v-if="showSection"> ... </div> -->
</template>
```

**Output when `showSection` is true**:
```html
<h2>Section Title</h2>
<p>Paragraph 1</p>
<p>Paragraph 2</p>
<!-- No wrapping div! -->
```

---

## List Rendering with v-for

`v-for` iterates over arrays, objects, ranges, and iterables to render dynamic lists.

### Basic Array Iteration

```vue
<script setup lang="ts">
import { ref } from 'vue'

const fruits = ref(['Apple', 'Banana', 'Cherry'])
</script>

<template>
  <ul>
    <li v-for="fruit in fruits">
      {{ fruit }}
    </li>
  </ul>
</template>
```

**Output**:
```html
<ul>
  <li>Apple</li>
  <li>Banana</li>
  <li>Cherry</li>
</ul>
```

### Array with Index

```vue
<template>
  <ul>
    <li v-for="(fruit, index) in fruits">
      {{ index + 1 }}. {{ fruit }}
    </li>
  </ul>
</template>
```

**Output**:
```html
<ul>
  <li>1. Apple</li>
  <li>2. Banana</li>
  <li>3. Cherry</li>
</ul>
```

> 💡 IMPORTANT: Use `(item, index)` syntax, not `(index, item)`. Item comes first!

### Iterating Objects

```vue
<script setup lang="ts">
import { reactive } from 'vue'

const user = reactive({
  name: 'Alice',
  age: 30,
  role: 'Developer'
})
</script>

<template>
  <ul>
    <!-- (value, key, index) -->
    <li v-for="(value, key) in user">
      {{ key }}: {{ value }}
    </li>
  </ul>
</template>
```

**Output**:
```html
<ul>
  <li>name: Alice</li>
  <li>age: 30</li>
  <li>role: Developer</li>
</ul>
```

### Range Iteration

```vue
<template>
  <!-- Renders numbers 1 through 5 -->
  <span v-for="n in 5">{{ n }} </span>
</template>
```

**Output**: `1 2 3 4 5`

> ⚠️ CRITICAL: `v-for="n in 5"` starts at **1**, not 0!

---

## The :key Attribute — Why It's Critical

When Vue re-renders a list, it needs to know which items changed, were added, or were removed. Without keys, Vue uses a "in-place patch" strategy that can cause bugs.

### The Problem Without Keys

```vue
<script setup lang="ts">
import { ref } from 'vue'

const items = ref([
  { id: 1, text: 'First' },
  { id: 2, text: 'Second' },
  { id: 3, text: 'Third' }
])

function removeFirst() {
  items.value.shift() // Remove first item
}
</script>

<template>
  <button @click="removeFirst">Remove First</button>
  
  <!-- ❌ BAD: No keys -->
  <div v-for="item in items">
    <input type="checkbox" /> {{ item.text }}
  </div>
</template>
```

**Bug**: When you remove "First", Vue reuses the existing DOM nodes and just updates the text. The **checkboxes don't move with their items**! If "First" was checked, "Second" becomes checked after removal.

### The Solution: Unique Keys

```vue
<template>
  <!-- ✅ GOOD: Unique key per item -->
  <div v-for="item in items" :key="item.id">
    <input type="checkbox" /> {{ item.text }}
  </div>
</template>
```

Now Vue tracks each element by `item.id` and correctly moves/removes/adds DOM nodes.

### Key Requirements

> ⚠️ CRITICAL: Always provide a unique `:key` for `v-for` when:
> - Items can be reordered
> - Items can be added/removed
> - Items have associated state (form inputs, component state)

**Good keys**:
```vue
<!-- Database IDs (best) -->
<div v-for="user in users" :key="user.id">

<!-- Unique strings -->
<div v-for="page in pages" :key="page.slug">

<!-- Computed unique values -->
<div v-for="item in items" :key="`${item.category}-${item.id}`">
```

**Bad keys**:
```vue
<!-- ❌ Index as key (defeats the purpose) -->
<div v-for="(item, index) in items" :key="index">

<!-- ❌ Non-unique values -->
<div v-for="user in users" :key="user.role">

<!-- ❌ Random values (changes every render) -->
<div v-for="item in items" :key="Math.random()">
```

> 💡 IMPORTANT: Using `index` as key is only acceptable when:
> - List is static (never reordered, added to, or removed from)
> - Items have no associated state
> - You're just displaying read-only data

---

## Combining v-for with Computed Properties

Instead of filtering/sorting in the template, use computed properties for better performance and readability.

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

interface Todo {
  id: number
  text: string
  done: boolean
}

const todos = ref<Todo[]>([
  { id: 1, text: 'Learn Vue', done: true },
  { id: 2, text: 'Build project', done: false },
  { id: 3, text: 'Deploy app', done: false }
])

const filter = ref<'all' | 'active' | 'completed'>('all')

// ✅ GOOD: Computed filtered list
const filteredTodos = computed(() => {
  if (filter.value === 'active') {
    return todos.value.filter(todo => !todo.done)
  }
  if (filter.value === 'completed') {
    return todos.value.filter(todo => todo.done)
  }
  return todos.value
})
</script>

<template>
  <div>
    <button @click="filter = 'all'">All</button>
    <button @click="filter = 'active'">Active</button>
    <button @click="filter = 'completed'">Completed</button>
    
    <ul>
      <li v-for="todo in filteredTodos" :key="todo.id">
        <input type="checkbox" v-model="todo.done" />
        {{ todo.text }}
      </li>
    </ul>
  </div>
</template>
```

**Why computed is better**:
- Vue caches the result; only recalculates when dependencies change
- Template stays clean and declarative
- Logic is testable in isolation

---

## Combining v-if and v-for

> ⚠️ CRITICAL: **Never use `v-if` and `v-for` on the same element!** It's a Vue anti-pattern and performance killer.

### ❌ WRONG: v-if and v-for on Same Element

```vue
<template>
  <!-- ❌ BAD: v-if runs for EVERY item, every render -->
  <li v-for="todo in todos" v-if="!todo.done" :key="todo.id">
    {{ todo.text }}
  </li>
</template>
```

**Problem**: Vue evaluates `v-if` **for each item** in the list, even if you want to filter them out. This is inefficient.

### ✅ CORRECT: Use Computed Property

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const todos = ref([
  { id: 1, text: 'Learn Vue', done: true },
  { id: 2, text: 'Build project', done: false }
])

const activeTodos = computed(() => {
  return todos.value.filter(todo => !todo.done)
})
</script>

<template>
  <!-- ✅ GOOD: Filter once with computed, then render -->
  <li v-for="todo in activeTodos" :key="todo.id">
    {{ todo.text }}
  </li>
</template>
```

### When You Need Conditional Inside Loop

If you need to show/hide individual list items based on item-specific conditions, use `v-if` **inside** the `v-for` loop:

```vue
<template>
  <div v-for="user in users" :key="user.id">
    <!-- Conditional rendering inside the loop -->
    <div v-if="user.isActive">
      {{ user.name }} (Active)
    </div>
    <div v-else>
      {{ user.name }} (Inactive)
    </div>
  </div>
</template>
```

Or use `<template>` to wrap the loop:

```vue
<template>
  <template v-for="user in users" :key="user.id">
    <div v-if="user.isActive">
      {{ user.name }}
    </div>
  </template>
</template>
```

---

## Nested v-for Loops

You can nest `v-for` to render multi-dimensional data structures.

```vue
<script setup lang="ts">
import { ref } from 'vue'

interface Category {
  id: number
  name: string
  items: { id: number; name: string }[]
}

const categories = ref<Category[]>([
  {
    id: 1,
    name: 'Fruits',
    items: [
      { id: 101, name: 'Apple' },
      { id: 102, name: 'Banana' }
    ]
  },
  {
    id: 2,
    name: 'Vegetables',
    items: [
      { id: 201, name: 'Carrot' },
      { id: 202, name: 'Broccoli' }
    ]
  }
])
</script>

<template>
  <div v-for="category in categories" :key="category.id">
    <h3>{{ category.name }}</h3>
    <ul>
      <li v-for="item in category.items" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>
```

**Output**:
```html
<div>
  <h3>Fruits</h3>
  <ul>
    <li>Apple</li>
    <li>Banana</li>
  </ul>
</div>
<div>
  <h3>Vegetables</h3>
  <ul>
    <li>Carrot</li>
    <li>Broccoli</li>
  </ul>
</div>
```

> 💡 IMPORTANT: Each level of nesting needs its own unique `:key`. Don't reuse keys from parent loop!

---

## Handling Empty Lists

Always handle the case when a list is empty to improve user experience.

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const todos = ref<{ id: number; text: string }[]>([])

const hasTodos = computed(() => todos.value.length > 0)
</script>

<template>
  <div>
    <h2>My Todos</h2>
    
    <!-- Option 1: v-if/v-else -->
    <ul v-if="hasTodos">
      <li v-for="todo in todos" :key="todo.id">
        {{ todo.text }}
      </li>
    </ul>
    <p v-else class="empty-state">
      No todos yet. Add one to get started!
    </p>
    
    <!-- Option 2: Show message without hiding list -->
    <p v-if="!hasTodos" class="empty-state">
      No todos yet. Add one to get started!
    </p>
    <ul v-show="hasTodos">
      <li v-for="todo in todos" :key="todo.id">
        {{ todo.text }}
      </li>
    </ul>
  </div>
</template>
```

---

## Loading and Error States

In real applications, lists often come from APIs. Handle loading and error states explicitly.

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface User {
  id: number
  name: string
}

const users = ref<User[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

async function fetchUsers() {
  try {
    isLoading.value = true
    error.value = null
    
    const response = await fetch('/api/users')
    if (!response.ok) throw new Error('Failed to fetch users')
    
    users.value = await response.json()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'An error occurred'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div>
    <h2>Users</h2>
    
    <!-- Loading state -->
    <div v-if="isLoading" class="loading">
      Loading users...
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="error">
      {{ error }}
      <button @click="fetchUsers">Retry</button>
    </div>
    
    <!-- Empty state -->
    <div v-else-if="users.length === 0" class="empty">
      No users found
    </div>
    
    <!-- Success state -->
    <ul v-else>
      <li v-for="user in users" :key="user.id">
        {{ user.name }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.loading { color: #666; }
.error { color: red; }
.empty { color: #999; font-style: italic; }
</style>
```

**State priority** (top to bottom):
1. Loading → Show spinner/skeleton
2. Error → Show error message + retry button
3. Empty → Show "no data" message
4. Success → Show data

---

## Array Change Detection

Vue 3's reactivity system (Proxies) automatically detects array mutations. All standard methods work:

```vue
<script setup lang="ts">
import { ref } from 'vue'

const items = ref([1, 2, 3])

// ✅ All of these trigger reactivity
items.value.push(4)           // Add to end
items.value.pop()             // Remove from end
items.value.shift()           // Remove from start
items.value.unshift(0)        // Add to start
items.value.splice(1, 1)      // Remove by index
items.value.reverse()         // Reverse order
items.value.sort()            // Sort

// ✅ Replacing entire array
items.value = [5, 6, 7]

// ✅ Direct index assignment (works in Vue 3!)
items.value[0] = 100

// ✅ Changing length
items.value.length = 0  // Clear array
</script>
```

> 💡 IMPORTANT: Vue 3 detects **all** array changes thanks to Proxies. In Vue 2, direct index assignment didn't work, but Vue 3 fixed this!

---

## Performance Optimization with v-memo

For large lists that rarely change, use `v-memo` to skip re-rendering.

```vue
<script setup lang="ts">
import { ref } from 'vue'

const items = ref([
  { id: 1, name: 'Item 1', selected: false },
  // ... thousands of items
])
</script>

<template>
  <!-- Only re-render when item.selected changes -->
  <div v-for="item in items" :key="item.id" v-memo="[item.selected]">
    <input type="checkbox" v-model="item.selected" />
    {{ item.name }}
  </div>
</template>
```

`v-memo="[item.selected]"` tells Vue:
- Only re-render this element when `item.selected` changes
- Skip re-rendering if other reactive data changes

> ⚠️ CRITICAL: `v-memo` is an **advanced optimization**. Only use it for large lists (1000+ items) where you've profiled performance issues.

---

## Common Patterns

### 1. Toggle All / Select All

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const items = ref([
  { id: 1, name: 'Item 1', selected: false },
  { id: 2, name: 'Item 2', selected: false },
  { id: 3, name: 'Item 3', selected: false }
])

const allSelected = computed({
  get: () => items.value.every(item => item.selected),
  set: (value: boolean) => {
    items.value.forEach(item => {
      item.selected = value
    })
  }
})
</script>

<template>
  <div>
    <label>
      <input type="checkbox" v-model="allSelected" />
      Select All
    </label>
    
    <div v-for="item in items" :key="item.id">
      <label>
        <input type="checkbox" v-model="item.selected" />
        {{ item.name }}
      </label>
    </div>
  </div>
</template>
```

### 2. Dynamic Sorting

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const items = ref([
  { id: 1, name: 'Banana', price: 2 },
  { id: 2, name: 'Apple', price: 3 },
  { id: 3, name: 'Cherry', price: 1 }
])

const sortBy = ref<'name' | 'price'>('name')
const sortOrder = ref<'asc' | 'desc'>('asc')

const sortedItems = computed(() => {
  const sorted = [...items.value].sort((a, b) => {
    const aVal = a[sortBy.value]
    const bVal = b[sortBy.value]
    
    if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
  
  return sorted
})
</script>

<template>
  <div>
    <button @click="sortBy = 'name'">Sort by Name</button>
    <button @click="sortBy = 'price'">Sort by Price</button>
    <button @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'">
      {{ sortOrder === 'asc' ? '↑' : '↓' }}
    </button>
    
    <ul>
      <li v-for="item in sortedItems" :key="item.id">
        {{ item.name }} - ${{ item.price }}
      </li>
    </ul>
  </div>
</template>
```

### 3. Search/Filter with Highlight

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const items = ref(['Apple', 'Banana', 'Cherry', 'Date'])
const searchQuery = ref('')

const filteredItems = computed(() => {
  if (!searchQuery.value) return items.value
  
  return items.value.filter(item =>
    item.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>

<template>
  <div>
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search..."
    />
    
    <ul v-if="filteredItems.length > 0">
      <li v-for="(item, index) in filteredItems" :key="index">
        {{ item }}
      </li>
    </ul>
    
    <p v-else>No results found for "{{ searchQuery }}"</p>
  </div>
</template>
```

---

## Summary

### Conditional Rendering
- Use `v-if` for conditional mounting (rarely toggled, heavy components)
- Use `v-show` for display toggling (frequently toggled, simple elements)
- Use `v-else-if` and `v-else` for chained conditions
- Use `<template>` for invisible grouping

### List Rendering
- Use `v-for` to iterate arrays, objects, ranges
- **Always** provide unique `:key` for list items with state or reordering
- Never use `v-if` and `v-for` on the same element
- Use computed properties for filtering/sorting
- Handle empty, loading, and error states explicitly

### Performance
- Computed properties cache results
- Keys enable efficient DOM reconciliation
- `v-memo` for large lists (advanced optimization)
- Array mutations are automatically detected in Vue 3

---

## Next Steps

1. Build the [sample project](sample-project.md): Dynamic todo list with filtering
2. Complete the [exercises](exercises.md): Filterable product list, nested lists
3. Take the [quiz](quiz.md) to test your understanding
4. Review [glossary](glossary.md) for any unfamiliar terms

In Lesson 1.4, we'll dive deeper into methods, computed properties, and watchers to build interactive UIs.
