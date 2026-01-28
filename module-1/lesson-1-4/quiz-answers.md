# Quiz Answers — Lesson 1.4 (Methods, Computed, & Watchers)

## 1) What is the main difference between a method and a computed property?

**Answer**: Methods run every time they're called with no caching, while computed properties cache their results and only recalculate when their dependencies change. Methods are for actions/logic with parameters, computed properties are for derived state.

---

## 2) When called multiple times in a template, how many times does a method execute vs a computed property?

**Answer**:
- **Method**: Executes **every time** it's called (once per call in the template)
- **Computed property**: Executes **once per render** (result is cached and reused)

```vue
<template>
  <p>{{ expensiveMethod() }}</p>  <!-- Executes -->
  <p>{{ expensiveMethod() }}</p>  <!-- Executes again -->
  
  <p>{{ expensiveComputed }}</p>  <!-- Executes -->
  <p>{{ expensiveComputed }}</p>  <!-- Returns cached value -->
</template>
```

---

## 3) What happens if you call a method with the same arguments twice in the same render?

**Answer**: The method executes **twice**. Methods don't cache results—they run every time they're called, regardless of arguments.

```vue
<template>
  <p>{{ formatPrice(100) }}</p>  <!-- Executes -->
  <p>{{ formatPrice(100) }}</p>  <!-- Executes again with same args -->
</template>
```

---

## 4) Can computed properties accept parameters? If not, what's the alternative?

**Answer**: No, computed properties cannot accept parameters directly. 

**Alternative**: Use a method, or return a function from the computed property:

```ts
// Option 1: Use a method
function formatPrice(price: number) {
  return `$${price.toFixed(2)}`
}

// Option 2: Computed returning a function (advanced)
const formatPrice = computed(() => {
  return (price: number) => `$${price.toFixed(2)}`
})

// Usage: {{ formatPrice(100) }}
```

---

## 5) Write a writable computed property that converts temperature between Celsius and Fahrenheit.

**Answer**:
```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const celsius = ref(0)

const fahrenheit = computed({
  get() {
    return (celsius.value * 9/5) + 32
  },
  set(value: number) {
    celsius.value = (value - 32) * 5/9
  }
})
</script>

<template>
  <input v-model.number="celsius" /> °C
  <input v-model.number="fahrenheit" /> °F
</template>
```

---

## 6) What's wrong with this code?

```vue
<template>
  <p>{{ calculateTotal() }}</p>
  <p>Total: {{ calculateTotal() }}</p>
  <p>Tax: {{ calculateTotal() * 0.1 }}</p>
</template>
```

**Answer**: The method `calculateTotal()` is called **three times** in the template, executing the same calculation three times per render. This is inefficient.

**Fix**: Use a computed property:

```vue
<script setup>
const total = computed(() => calculateTotal())
// Or better: put the calculation logic directly in computed
</script>

<template>
  <p>{{ total }}</p>
  <p>Total: {{ total }}</p>
  <p>Tax: {{ total * 0.1 }}</p>
</template>
```

---

## 7) What is dependency tracking in computed properties?

**Answer**: Dependency tracking is Vue's automatic detection of which reactive values a computed property uses. When any dependency changes, Vue knows to recalculate the computed property.

```ts
const fullName = computed(() => {
  // Vue tracks that this depends on firstName and lastName
  return `${firstName.value} ${lastName.value}`
})

// When firstName or lastName changes, fullName recalculates
// Other reactive changes don't trigger recalculation
```

---

## 8) What's the difference between `watch()` and `watchEffect()`?

**Answer**:

| Feature             | `watch()`                    | `watchEffect()`          |
| ------------------- | ---------------------------- | ------------------------ |
| Dependencies        | Explicitly specified         | Auto-tracked             |
| Immediate execution | Optional (`immediate: true`) | Always runs immediately  |
| Old values          | Yes (2nd parameter)          | No                       |
| Laziness            | Lazy by default              | Eager (runs on creation) |

```ts
// watch() - explicit source
watch(userId, (newId, oldId) => {
  console.log(`Changed from ${oldId} to ${newId}`)
})

// watchEffect() - auto-tracked
watchEffect(() => {
  console.log(`User: ${firstName.value} ${lastName.value}`)
  // Automatically tracks firstName and lastName
})
```

---

## 9) When would you use `immediate: true` in a watcher?

**Answer**: When you want the watcher to run **immediately on creation** in addition to when the watched value changes. Common for:
- Loading initial data based on a prop/ref
- Running setup logic that should also run on changes
- Avoiding code duplication (one function for init + changes)

```ts
const userId = ref(1)

// Runs immediately AND when userId changes
watch(userId, async (id) => {
  await fetchUser(id)
}, { immediate: true })
```

---

## 10) What's the purpose of the `deep: true` option in watch()?

**Answer**: `deep: true` makes the watcher trigger on changes to **any nested property** of an object, not just when the object reference changes.

```ts
const user = ref({
  profile: {
    name: 'Alice',
    settings: { theme: 'dark' }
  }
})

// Without deep: only triggers if user.value = {...}
watch(user, () => console.log('User replaced'))

// With deep: triggers on ANY nested property change
watch(user, () => console.log('User or nested property changed'), { deep: true })

// Better: watch specific property (no deep needed)
watch(() => user.value.profile.settings.theme, theme => {
  console.log('Theme changed:', theme)
})
```

---

## 11) Write code to watch a specific nested property without using `deep: true`.

**Answer**:
```ts
const user = ref({
  profile: {
    name: 'Alice',
    email: 'alice@example.com'
  }
})

// Watch specific nested property using a getter function
watch(
  () => user.value.profile.email,
  (newEmail, oldEmail) => {
    console.log(`Email changed from ${oldEmail} to ${newEmail}`)
  }
)
```

---

## 12) What does the cleanup function in `watchEffect()` do?

**Answer**: The cleanup function runs **before the next execution** and **on component unmount**. It's used to clean up side effects like timers, event listeners, or pending requests.

```ts
watchEffect((onCleanup) => {
  const timer = setTimeout(() => {
    console.log('Timer finished')
  }, 1000)
  
  // Cleanup: runs before next execution and on unmount
  onCleanup(() => {
    clearTimeout(timer)
    console.log('Timer cleared')
  })
})
```

---

## 13) Explain debouncing and write code to debounce a search input watcher.

**Answer**: Debouncing delays function execution until a certain time has passed since the last invocation. For search, it means waiting until the user stops typing before executing the search.

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'

const searchQuery = ref('')
const searchResults = ref<string[]>([])

let debounceTimer: number | null = null

watch(searchQuery, (query) => {
  // Clear previous timer
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  
  // Wait 300ms after user stops typing
  debounceTimer = setTimeout(async () => {
    if (!query) {
      searchResults.value = []
      return
    }
    
    // Perform search
    const response = await fetch(`/api/search?q=${query}`)
    searchResults.value = await response.json()
  }, 300)
})
</script>
```

---

## 14) What are the three flush timing options for watchers and when would you use each?

**Answer**:

1. **`'pre'` (default)**: Runs **before** component updates
   - Use for: Most watchers, general side effects
   
2. **`'post'`**: Runs **after** component updates (DOM is updated)
   - Use for: Accessing updated DOM, measuring elements, focus management
   
3. **`'sync'`**: Runs **synchronously** on every change
   - Use for: Rarely (can hurt performance), critical synchronous operations

```ts
// Pre-flush (default)
watch(count, () => {
  console.log('Before DOM update')
})

// Post-flush (access updated DOM)
watch(count, () => {
  const el = document.querySelector('.counter')
  console.log('DOM updated:', el?.textContent)
}, { flush: 'post' })

// Sync (use sparingly)
watch(count, () => {
  console.log('Runs immediately/synchronously')
}, { flush: 'sync' })
```

---

## 15) What's wrong with this code?

```ts
const total = computed(() => {
  fetch('/api/total').then(r => r.json())
  return items.value.reduce((sum, i) => sum + i, 0)
})
```

**Answer**: Computed properties should be **pure functions** without side effects. This computed property:
1. Makes an API call (side effect)
2. The API call result is unused
3. Violates the purpose of computed properties

**Fix**: Use a watcher for the API call:

```ts
const total = computed(() => {
  return items.value.reduce((sum, i) => sum + i, 0)
})

watch(total, async (totalValue) => {
  await fetch('/api/total', {
    method: 'POST',
    body: JSON.stringify({ total: totalValue })
  })
})
```

---

## 16) Should you use a watcher or computed property to derive state from other state?

**Answer**: **Always use a computed property** to derive state from other state. Watchers are for side effects, not for creating derived state.

```ts
// ❌ BAD: Watcher for derived state
const items = ref([1, 2, 3])
const total = ref(0)

watch(items, () => {
  total.value = items.value.reduce((sum, i) => sum + i, 0)
}, { deep: true })

// ✅ GOOD: Computed for derived state
const total = computed(() => {
  return items.value.reduce((sum, i) => sum + i, 0)
})
```

---

## 17) How do you stop a watcher from executing?

**Answer**: Both `watch()` and `watchEffect()` return a **stop function**. Call it to stop the watcher.

```ts
const stop = watch(source, callback)

// Later...
stop() // Watcher is now inactive

// Also works with watchEffect
const stopEffect = watchEffect(() => {
  console.log(value.value)
})

stopEffect() // Stop watching
```

Watchers are also automatically stopped when the component unmounts.

---

## 18) What's the anti-pattern in this code?

```ts
const items = ref([1, 2, 3])
const total = ref(0)

watch(items, () => {
  total.value = items.value.reduce((sum, i) => sum + i, 0)
}, { deep: true })
```

**Answer**: **Using a watcher to update derived state**. This should be a computed property.

Problems:
- Requires `{ deep: true }` (performance cost)
- Manual synchronization (bug-prone)
- `total` needs initialization
- Two sources of truth

**Correct approach**:
```ts
const items = ref([1, 2, 3])
const total = computed(() => items.value.reduce((sum, i) => sum + i, 0))
```

---

## 19) When should you use a method instead of a computed property?

**Answer**: Use methods when:
- Handling events (click, submit, input)
- The function accepts parameters
- Performing actions that modify state
- One-time calculations triggered by user action
- The result isn't needed in the template multiple times
- Non-reactive utility functions

```ts
// ✅ Methods for these cases:
function handleClick(event: MouseEvent) { ... }
function greet(name: string) { ... }
function submitForm() { ... }
function formatDate(date: Date, format: string) { ... }
```

---

## 20) What is the return value of `watch()` and `watchEffect()`?

**Answer**: Both return a **stop function** that stops the watcher when called.

```ts
const stopWatching = watch(source, callback)
const stopEffect = watchEffect(() => { ... })

// Stop watching
stopWatching()
stopEffect()
```

---

## 21) Write code to format currency using a method vs computed property. Which is better for displaying the same value multiple times?

**Answer**:

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const price = ref(99.99)

// Method: Executes every time it's called
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
}

// Computed: Caches result
const formattedPrice = computed(() => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price.value)
})
</script>

<template>
  <!-- Method: formatCurrency(price) called 3 times -->
  <p>{{ formatCurrency(price) }}</p>
  <p>Total: {{ formatCurrency(price) }}</p>
  <p>Tax: {{ formatCurrency(price * 0.1) }}</p>
  
  <!-- Computed: formattedPrice computed once, cached -->
  <p>{{ formattedPrice }}</p>
  <p>{{ formattedPrice }}</p>
  <p>{{ formattedPrice }}</p>
</template>
```

**Better**: **Computed property** when displaying the same value multiple times (caching improves performance).

---

## 22) What's the difference between these two?

```ts
// Option A
watch(user, callback)

// Option B
watch(user, callback, { deep: true })
```

**Answer**:

**Option A (shallow watch)**:
- Only triggers when `user.value` is **replaced** with a new object
- Does NOT trigger when nested properties change
- More performant

**Option B (deep watch)**:
- Triggers when user is replaced OR any nested property changes
- Recursively watches all properties
- Less performant (Vue must traverse entire object tree)

```ts
const user = ref({ name: 'Alice', age: 30 })

// Option A: won't trigger
user.value.name = 'Bob' 

// Option B: will trigger
user.value.name = 'Bob'

// Both trigger
user.value = { name: 'Charlie', age: 25 }
```

---

## 23) How do you watch multiple reactive sources at once?

**Answer**: Pass an array of sources to `watch()`:

```ts
const firstName = ref('John')
const lastName = ref('Doe')
const age = ref(30)

// Watch multiple sources
watch(
  [firstName, lastName, age],
  ([newFirst, newLast, newAge], [oldFirst, oldLast, oldAge]) => {
    console.log('Any value changed')
    console.log('First:', newFirst, 'Last:', newLast, 'Age:', newAge)
  }
)
```

---

## 24) What happens when a computed property's dependencies don't change?

**Answer**: The computed property **returns the cached value** without re-executing the getter function. This is the key performance benefit of computed properties.

```ts
const count = ref(0)

const doubled = computed(() => {
  console.log('Computing...') // Only logs when count changes
  return count.value * 2
})

// First access
console.log(doubled.value) // Logs "Computing...", then 0

// Access again (count hasn't changed)
console.log(doubled.value) // Returns cached 0, no log

// Change count
count.value = 5

// Access again
console.log(doubled.value) // Logs "Computing...", then 10
```

---

## 25) When would you use `flush: 'post'` in a watcher?

**Answer**: When you need to **access the updated DOM** in your watcher callback. By default (`'pre'`), watchers run before the DOM updates.

```ts
const message = ref('Hello')

// Post-flush: DOM is updated when this runs
watch(message, () => {
  const el = document.querySelector('.message')
  console.log('Updated DOM text:', el?.textContent)
  
  // Safe to measure, focus, scroll, etc.
  el?.scrollIntoView()
}, { flush: 'post' })
```

---

## 26) What's the performance difference between calling a method 10 times in the template vs a computed property?

**Answer**:

**Method**: Executes **10 times** (once per call)
```vue
<template>
  <p>{{ expensiveCalc() }}</p>  <!-- Executes -->
  <p>{{ expensiveCalc() }}</p>  <!-- Executes -->
  <!-- ... 8 more calls -->
</template>
```

**Computed property**: Executes **once** (result cached for all 10 uses)
```vue
<template>
  <p>{{ expensiveComputed }}</p>  <!-- Executes once -->
  <p>{{ expensiveComputed }}</p>  <!-- Returns cached -->
  <!-- ... 8 more uses of cached value -->
</template>
```

**Performance impact**: For expensive calculations, computed is **10x faster** in this example.

---

## 27) Can you modify reactive state inside a computed property getter?

**Answer**: **No! Computed property getters should be pure functions.** Modifying state causes infinite loops or unpredictable behavior.

```ts
// ❌ BAD: Mutating state in computed
const doubled = computed(() => {
  count.value++ // DON'T DO THIS!
  return count.value * 2
})

// ✅ GOOD: Pure computed (no mutations)
const doubled = computed(() => {
  return count.value * 2
})

// ✅ For mutations, use a method or watcher
function increment() {
  count.value++
}
```

---

## 28) What's the best pattern for handling async operations when reactive data changes?

**Answer**: Use a **watcher** (either `watch()` or `watchEffect()`):

```ts
const userId = ref(1)
const userData = ref(null)
const isLoading = ref(false)

// Option 1: watch() with immediate
watch(userId, async (id) => {
  isLoading.value = true
  try {
    const response = await fetch(`/api/users/${id}`)
    userData.value = await response.json()
  } finally {
    isLoading.value = false
  }
}, { immediate: true })

// Option 2: watchEffect()
watchEffect(async () => {
  isLoading.value = true
  try {
    const response = await fetch(`/api/users/${userId.value}`)
    userData.value = await response.json()
  } finally {
    isLoading.value = false
  }
})
```

---

## 29) Write code to track how many times a user changes a search query using a watcher.

**Answer**:
```vue
<script setup lang="ts">
import { ref, watch } from 'vue'

const searchQuery = ref('')
const searchCount = ref(0)
const searchHistory = ref<string[]>([])

watch(searchQuery, (newQuery, oldQuery) => {
  if (newQuery !== oldQuery && newQuery.trim() !== '') {
    searchCount.value++
    searchHistory.value.push(newQuery)
    
    // Log to analytics
    console.log(`Search #${searchCount.value}: "${newQuery}"`)
    
    // Optional: send to analytics service
    // trackEvent('search', { query: newQuery, count: searchCount.value })
  }
})
</script>

<template>
  <input v-model="searchQuery" placeholder="Search..." />
  <p>Searches performed: {{ searchCount }}</p>
  <ul>
    <li v-for="(query, index) in searchHistory" :key="index">
      {{ query }}
    </li>
  </ul>
</template>
```

---

## 30) What's the difference between `watchEffect()` and a computed property?

**Answer**:

| Feature       | `watchEffect()`             | Computed Property          |
| ------------- | --------------------------- | -------------------------- |
| Purpose       | **Side effects**            | **Derived state**          |
| Returns value | No                          | Yes                        |
| When it runs  | Immediately + on changes    | Lazily (on access)         |
| Caching       | No caching                  | Cached                     |
| Usage         | Actions, API calls, logging | Template values, filtering |

```ts
// watchEffect: side effect (no return value)
watchEffect(() => {
  console.log(`Name: ${firstName.value} ${lastName.value}`)
  // Purpose: logging, tracking, etc.
})

// Computed: derived state (returns value)
const fullName = computed(() => {
  return `${firstName.value} ${lastName.value}`
  // Purpose: display in template
})
```

**Rule of thumb**: If you need a value → computed. If you need an action → watchEffect/watch.
