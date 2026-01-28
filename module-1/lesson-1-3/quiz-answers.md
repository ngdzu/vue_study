# Quiz Answers — Lesson 1.3 (Conditional Rendering & List Rendering)

## 1) What is the main difference between `v-if` and `v-show`?

**Answer**: `v-if` completely removes or adds elements to the DOM based on the condition (true conditional rendering), while `v-show` always renders the element but toggles its CSS `display` property. `v-if` is "lazy" on initial render, while `v-show` always renders.

---

## 2) When would you prefer `v-show` over `v-if`? Give a specific example.

**Answer**: Use `v-show` when the element toggles frequently and is simple/lightweight. 

**Example**: A dropdown menu, settings panel, or tooltip that users open/close repeatedly. Using `v-show` avoids the cost of repeatedly mounting/unmounting the element.

```vue
<!-- Good use case for v-show -->
<div v-show="showDropdown" class="dropdown-menu">
  <ul>...</ul>
</div>
```

---

## 3) What happens to the DOM when an element with `v-if="false"` is rendered?

**Answer**: The element **does not exist in the DOM at all**. It's not rendered, not hidden—it's completely absent. When the condition becomes true, Vue creates and mounts the element.

---

## 4) What's wrong with this code?

```vue
<div v-if="showSection">
  <h2>Title</h2>
</div>
<p>Some text</p>  <!-- ❌ Problem: Element between v-if and v-else -->
<div v-else>
  <p>Alternative content</p>
</div>
```

**Answer**: `v-else` must **immediately follow** the `v-if` element with no other elements in between. The `<p>Some text</p>` breaks the chain, so `v-else` won't work correctly.

**Fixed**:
```vue
<div v-if="showSection">
  <h2>Title</h2>
</div>
<div v-else>
  <p>Alternative content</p>
</div>
<p>Some text</p>  <!-- ✅ Moved outside the conditional chain -->
```

---

## 5) What is the purpose of the `<template>` tag in Vue?

**Answer**: `<template>` is an invisible wrapper that groups multiple elements for directives like `v-if` or `v-for` without adding an extra DOM node. It doesn't render to the actual DOM.

```vue
<template v-if="showSection">
  <h2>Title</h2>
  <p>Content</p>
</template>
<!-- Renders as: <h2>Title</h2><p>Content</p> (no wrapper div) -->
```

---

## 6) Why is the `:key` attribute important in `v-for` lists?

**Answer**: Keys help Vue identify which items have changed, been added, or removed during list updates. They enable efficient DOM reconciliation by tracking element identity, preventing bugs where state (like form inputs) gets mismatched when items are reordered or removed.

---

## 7) What makes a good key value for list items? What makes a bad key?

**Good keys**:
- Database IDs: `user.id`
- Unique identifiers: UUIDs, slugs
- Stable values that don't change for the same item

**Bad keys**:
- Array indices (when list is dynamic): `:key="index"`
- Non-unique values: `:key="user.role"` (multiple users can have same role)
- Random values: `:key="Math.random()"` (changes every render)
- Undefined/null values

---

## 8) What's the output of this code?

```vue
<span v-for="n in 5">{{ n }}</span>
```

**Answer**: `1 2 3 4 5`

> Note: `v-for="n in 5"` starts at **1**, not 0.

---

## 9) Write the correct syntax to iterate over an array with both item and index:

**Answer**:
```vue
<div v-for="(item, index) in items" :key="index">
  {{ index }}: {{ item }}
</div>
```

> Note: Item comes **first**, then index: `(item, index)` not `(index, item)`.

---

## 10) What's wrong with using the array index as a key in a dynamic list?

**Answer**: Indices change when items are added, removed, or reordered. This defeats the purpose of keys because Vue can't track which actual item corresponds to which DOM element. It can cause bugs where form state (checkboxes, inputs) gets attached to the wrong item.

**Only acceptable when**: List is static (never changes order, items never added/removed) and items have no state.

---

## 11) Why should you never use `v-if` and `v-for` on the same element?

**Answer**: When both are on the same element, `v-if` is evaluated **for every item** in the list on every render, which is inefficient. It's a Vue anti-pattern.

**Solution**: Use a computed property to filter the list first:

```vue
<!-- ❌ WRONG -->
<li v-for="todo in todos" v-if="!todo.done" :key="todo.id">

<!-- ✅ CORRECT -->
<li v-for="todo in activeTodos" :key="todo.id">

<script setup>
const activeTodos = computed(() => todos.value.filter(t => !t.done))
</script>
```

---

## 12) How would you correctly filter a list to show only active items?

**Answer**:
```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const items = ref([
  { id: 1, name: 'Item 1', active: true },
  { id: 2, name: 'Item 2', active: false },
  { id: 3, name: 'Item 3', active: true }
])

const activeItems = computed(() => {
  return items.value.filter(item => item.active)
})
</script>

<template>
  <div v-for="item in activeItems" :key="item.id">
    {{ item.name }}
  </div>
</template>
```

---

## 13) What happens if you iterate over an object with `v-for`? What values do you get access to?

**Answer**: You get access to `(value, key, index)` for each property:

```vue
<script setup>
const user = { name: 'Alice', age: 30, role: 'Admin' }
</script>

<template>
  <div v-for="(value, key, index) in user">
    {{ index }}: {{ key }} = {{ value }}
  </div>
</template>

<!-- Output:
  0: name = Alice
  1: age = 30
  2: role = Admin
-->
```

---

## 14) What is Vue's "in-place patch strategy" and when does it apply?

**Answer**: When rendering lists **without keys**, Vue reuses existing DOM elements in place and only updates their content (text, attributes). This is efficient for static lists, but causes bugs when items have state (form inputs, component state) or when the list order changes.

**When it applies**: Only when `:key` is not provided on `v-for` items.

---

## 15) Write code to handle an empty list state with a user-friendly message.

**Answer**:
```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const items = ref<string[]>([])
const hasItems = computed(() => items.value.length > 0)
</script>

<template>
  <div>
    <ul v-if="hasItems">
      <li v-for="(item, index) in items" :key="index">
        {{ item }}
      </li>
    </ul>
    <p v-else class="empty-state">
      No items yet. Add one to get started! 📝
    </p>
  </div>
</template>
```

---

## 16) What does this syntax do?

```vue
<li v-for="{ id, name } in users" :key="id">
```

**Answer**: It uses **destructuring** in the `v-for` expression to extract `id` and `name` properties directly from each user object, making them available as variables in the template without needing `user.id` or `user.name`.

---

## 17) How do you combine `v-if` and `v-for` correctly when you need conditional items?

**Answer**: Use a computed property to filter the list, OR put `v-if` on a `<template>` wrapper or child element, never on the same element as `v-for`.

**Option 1 (Preferred): Computed property**
```vue
<li v-for="item in filteredItems" :key="item.id">
```

**Option 2: v-if on wrapper**
```vue
<template v-for="item in items" :key="item.id">
  <li v-if="item.active">{{ item.name }}</li>
</template>
```

**Option 3: v-if inside loop**
```vue
<div v-for="item in items" :key="item.id">
  <span v-if="item.active">{{ item.name }}</span>
  <span v-else>Hidden</span>
</div>
```

---

## 18) Which array methods trigger reactivity in Vue 3? (Name at least 5)

**Answer**: In Vue 3, **ALL** array mutations trigger reactivity (thanks to Proxies):

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`
- Direct index assignment: `arr[0] = value`
- Length modification: `arr.length = 0`

---

## 19) What is `v-memo` and when should you use it?

**Answer**: `v-memo` is an advanced directive that conditionally skips re-rendering of an element if specified dependencies haven't changed.

```vue
<div v-for="item in items" :key="item.id" v-memo="[item.selected]">
  <!-- Only re-renders when item.selected changes -->
</div>
```

**When to use**: Only for **large lists** (1000+ items) where you've profiled performance issues. It's an optimization for specific scenarios, not a general-purpose tool.

---

## 20) What are the three states you should typically handle when displaying data from an API?

**Answer**:
1. **Loading state**: While fetching data (show spinner/skeleton)
2. **Error state**: When fetch fails (show error message + retry button)
3. **Success state**: When data loads successfully (show the data)

Optional: **Empty state** when success but no data returned.

---

## 21) Write code to show different UI based on loading, error, and success states.

**Answer**:
```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const data = ref<any[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

async function fetchData() {
  try {
    isLoading.value = true
    error.value = null
    const response = await fetch('/api/data')
    if (!response.ok) throw new Error('Failed to fetch')
    data.value = await response.json()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'An error occurred'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchData)
</script>

<template>
  <div>
    <!-- Loading state -->
    <div v-if="isLoading">Loading...</div>
    
    <!-- Error state -->
    <div v-else-if="error">
      Error: {{ error }}
      <button @click="fetchData">Retry</button>
    </div>
    
    <!-- Empty state -->
    <div v-else-if="data.length === 0">No data found</div>
    
    <!-- Success state -->
    <ul v-else>
      <li v-for="item in data" :key="item.id">{{ item.name }}</li>
    </ul>
  </div>
</template>
```

---

## 22) Why does Vue need keys for efficient list reconciliation?

**Answer**: Keys give Vue a stable identity for each element, allowing it to:
- Track which items moved, were added, or removed
- Reuse and reorder existing DOM nodes instead of recreating them
- Preserve component state and element state (form inputs) correctly
- Minimize DOM operations for better performance

Without keys, Vue uses position-based patching which can cause bugs and inefficient updates.

---

## 23) What's wrong with this key?

```vue
<div v-for="user in users" :key="user.role">
```

**Answer**: The key is **not unique**. Multiple users can have the same role, which defeats the purpose of keys. Vue needs each item to have a **unique** key.

**Fix**: Use a unique identifier like `user.id`:
```vue
<div v-for="user in users" :key="user.id">
```

---

## 24) How would you implement a "select all" checkbox for a todo list?

**Answer**:
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
</template>
```

---

## 25) What does this computed property do?

```ts
const sortedItems = computed(() => {
  return [...items.value].sort((a, b) => a.name.localeCompare(b.name))
})
```

**Answer**: It creates a **sorted copy** of the `items` array, sorted alphabetically by the `name` property. The spread operator (`[...items.value]`) creates a shallow copy so the original array isn't mutated.

---

## 26) Why do we spread the array (`[...items.value]`) before sorting?

**Answer**: Array's `.sort()` method mutates the original array in place. By spreading first, we create a new array to sort, leaving the original `items.value` unchanged. This is a best practice to avoid unintended side effects.

```ts
// ❌ BAD: Mutates original array
const sorted = items.value.sort()

// ✅ GOOD: Creates new sorted array
const sorted = [...items.value].sort()
```

---

## 27) What happens if you mutate a reactive array directly?

```ts
const items = ref([1, 2, 3])
items.value[0] = 100  // Does this trigger reactivity?
```

**Answer**: **Yes, it triggers reactivity in Vue 3!** Thanks to Proxy-based reactivity, direct index assignment works. (This was a limitation in Vue 2, but Vue 3 fixed it.)

All of these trigger reactivity in Vue 3:
```ts
items.value[0] = 100        // ✅ Works
items.value.length = 0      // ✅ Works
items.value.push(4)         // ✅ Works
```

---

## 28) What's the difference between these two approaches?

```vue
<!-- Approach A -->
<ul v-if="items.length > 0">
  <li v-for="item in items" :key="item.id">{{ item }}</li>
</ul>

<!-- Approach B -->
<ul v-show="items.length > 0">
  <li v-for="item in items" :key="item.id">{{ item }}</li>
</ul>
```

**Answer**:
- **Approach A** (`v-if`): The entire `<ul>` and all `<li>` elements are removed from the DOM when the list is empty. Better for rarely-changing lists or when you want to save memory.

- **Approach B** (`v-show`): The `<ul>` and `<li>` elements stay in the DOM but are hidden with `display: none`. Better if the list toggles visibility frequently.

---

## 29) How do you iterate over a nested data structure (e.g., categories with items)?

**Answer**:
```vue
<script setup lang="ts">
const categories = ref([
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
      { id: 201, name: 'Carrot' }
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

> ⚠️ Each nesting level needs its own unique `:key`!

---

## 30) When filtering a list with a search query, should you filter in the template or use a computed property? Why?

**Answer**: **Use a computed property.**

**Reasons**:
1. **Performance**: Computed properties cache results and only recalculate when dependencies change. Template expressions run on every render.
2. **Readability**: Keeps template clean and declarative.
3. **Testability**: Logic is isolated and can be tested independently.
4. **Reusability**: Computed property can be used in multiple places.

```vue
<!-- ✅ GOOD: Computed property -->
<script setup>
const filteredItems = computed(() => {
  return items.value.filter(item => 
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>

<template>
  <li v-for="item in filteredItems" :key="item.id">
</template>

<!-- ❌ BAD: Filter in template -->
<template>
  <li v-for="item in items.filter(i => i.name.includes(searchQuery))" :key="item.id">
</template>
```
