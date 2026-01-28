# Glossary — Lesson 1.3

## Conditional Rendering Terms

### Conditional Rendering
The process of showing or hiding elements in the DOM based on dynamic conditions. In Vue, this is achieved with directives like `v-if`, `v-show`, `v-else`, and `v-else-if`.

### v-if
A Vue directive that **completely removes or adds elements** to the DOM based on a boolean condition. When the condition is false, the element doesn't exist in the DOM at all.

**Example**: `<div v-if="isLoggedIn">Welcome</div>`

### v-else
A Vue directive that must immediately follow a `v-if` or `v-else-if` element. It renders when the preceding condition is false.

**Example**: 
```vue
<div v-if="isLoggedIn">Welcome</div>
<div v-else>Please log in</div>
```

### v-else-if
A Vue directive for chained conditional logic. It must follow a `v-if` or another `v-else-if` element.

**Example**:
```vue
<div v-if="role === 'admin'">Admin Panel</div>
<div v-else-if="role === 'user'">User Panel</div>
<div v-else>Guest Panel</div>
```

### v-show
A Vue directive that **toggles the CSS `display` property** of an element. The element always exists in the DOM, but is hidden with `display: none` when the condition is false.

**Example**: `<div v-show="showDetails">Details</div>`

### Template Fragment
An invisible wrapper element (`<template>`) that groups multiple elements for conditional rendering without adding an extra DOM node.

**Example**:
```vue
<template v-if="showSection">
  <h2>Title</h2>
  <p>Content</p>
</template>
```

### Lazy Rendering
The behavior of `v-if` where elements are not rendered until the condition becomes true for the first time. This is different from `v-show`, which renders the element immediately.

### Toggle Cost
The performance cost of showing/hiding an element. `v-if` has higher toggle cost (DOM manipulation) while `v-show` has lower toggle cost (CSS change).

### Initial Render Cost
The performance cost of the first render. `v-show` has higher initial render cost because it always creates the element, while `v-if` skips rendering when condition is false.

---

## List Rendering Terms

### v-for
A Vue directive that renders a list of elements by iterating over an array, object, range, or iterable.

**Examples**:
- Array: `v-for="item in items"`
- Array with index: `v-for="(item, index) in items"`
- Object: `v-for="(value, key, index) in object"`
- Range: `v-for="n in 5"`

### List Reconciliation
The process by which Vue determines which DOM elements to reuse, update, or remove when a list changes. Efficient reconciliation requires unique keys.

### :key Attribute
A special attribute that provides a unique identifier for each element in a `v-for` list. Vue uses keys to track element identity and optimize DOM updates.

**Example**: `<div v-for="user in users" :key="user.id">`

### In-Place Patch Strategy
The default strategy Vue uses when rendering lists **without keys**. Vue reuses DOM elements in place and only updates their content, which can cause bugs when elements have state (like form inputs).

### Unique Key
A value that uniquely identifies each item in a list. Good keys are stable (don't change for the same item) and unique (no two items share the same key).

**Good keys**: Database IDs, unique slugs, UUID
**Bad keys**: Array index (when list changes), non-unique values (role, category), random values

### Key Anti-Pattern
Using array indices as keys in a dynamic list (items can be added, removed, or reordered). This defeats the purpose of keys because indices change when the array changes.

```vue
<!-- ❌ Anti-pattern: Index as key in dynamic list -->
<div v-for="(item, index) in items" :key="index">
```

### Virtual DOM
An in-memory representation of the actual DOM. Vue compares the new virtual DOM with the old one (diffing) to determine minimal changes needed to update the real DOM.

### Diffing Algorithm
The algorithm Vue uses to compare the old and new virtual DOM trees and calculate the minimal set of changes needed. Keys make this algorithm efficient for lists.

---

## Performance Terms

### v-memo
An advanced Vue 3 directive that conditionally skips re-rendering of an element or component if specified dependencies haven't changed.

**Example**: `<div v-memo="[item.selected]">` only re-renders when `item.selected` changes.

### Computed Property Caching
The behavior where computed properties cache their results and only recalculate when their dependencies change. This makes computed properties more efficient than methods for filtering/sorting lists.

### Reactivity Overhead
The performance cost of Vue's reactivity system tracking dependencies and triggering updates. This overhead is why very large lists (10,000+ items) may need optimization techniques like virtual scrolling.

---

## Array Method Terms

### Array Mutation Methods
Array methods that modify the original array in place. In Vue 3, all of these trigger reactivity automatically.

**Examples**: `push()`, `pop()`, `shift()`, `unshift()`, `splice()`, `sort()`, `reverse()`

### Non-Mutating Array Methods
Array methods that return a new array without modifying the original.

**Examples**: `filter()`, `map()`, `slice()`, `concat()`, `reduce()`

### Proxy-Based Reactivity
Vue 3's reactivity system uses JavaScript Proxies to intercept property access and mutations. This enables automatic reactivity for all array operations, including direct index assignment (`arr[0] = value`).

---

## Pattern Terms

### Empty State
The UI state displayed when a list has no items. Good UX practice is to show a helpful message instead of an empty container.

**Example**: "No todos yet. Add one to get started!"

### Loading State
The UI state displayed while data is being fetched asynchronously. Usually shows a spinner or skeleton screen.

### Error State
The UI state displayed when data fetching fails. Should show an error message and optionally a retry button.

### Filter Pattern
Using a computed property to create a filtered version of a list based on user input or selection. The original list remains unchanged.

```vue
const filteredItems = computed(() => {
  return items.value.filter(item => item.category === selectedCategory.value)
})
```

### Sort Pattern
Using a computed property to create a sorted version of a list. Always create a new array (`[...items]`) to avoid mutating the original.

```vue
const sortedItems = computed(() => {
  return [...items.value].sort((a, b) => a.name.localeCompare(b.name))
})
```

### Select All Pattern
A pattern where a single checkbox controls the state of all items in a list. Typically implemented with a computed property with getter and setter.

```vue
const allSelected = computed({
  get: () => items.value.every(item => item.selected),
  set: (value) => items.value.forEach(item => item.selected = value)
})
```

---

## Anti-Patterns

### v-if + v-for on Same Element
Using both `v-if` and `v-for` on the same element is a Vue anti-pattern. Vue evaluates `v-if` for every item in the loop, which is inefficient.

```vue
<!-- ❌ WRONG -->
<li v-for="item in items" v-if="item.active" :key="item.id">

<!-- ✅ CORRECT -->
<li v-for="item in activeItems" :key="item.id">
```

**Solution**: Use a computed property to filter the list first.

### Missing Keys
Rendering a `v-for` list without `:key` attributes when items can be reordered, added, or removed. This can cause state bugs and poor performance.

### Non-Unique Keys
Using values that aren't unique across all items as keys (e.g., item type, category, status).

### Random Keys
Using random values (`Math.random()`, `Date.now()`) as keys. This defeats optimization because keys change every render.

### Direct State Mutation in Template
Performing state mutations directly in the template instead of using methods or event handlers.

```vue
<!-- ❌ WRONG -->
<button @click="count.value++">

<!-- ✅ CORRECT -->
<button @click="increment">
```

---

## Advanced Terms

### Nested v-for
Using `v-for` inside another `v-for` to render multi-dimensional data structures (e.g., categories with items).

**Example**:
```vue
<div v-for="category in categories" :key="category.id">
  <h3>{{ category.name }}</h3>
  <ul>
    <li v-for="item in category.items" :key="item.id">
      {{ item.name }}
    </li>
  </ul>
</div>
```

### Component List
Rendering a list of components with `v-for`. Each component instance needs a unique key.

```vue
<TodoItem
  v-for="todo in todos"
  :key="todo.id"
  :todo="todo"
/>
```

### Destructuring in v-for
Extracting properties directly in the `v-for` expression using JavaScript destructuring syntax.

```vue
<li v-for="{ id, name, email } in users" :key="id">
  {{ name }} - {{ email }}
</li>
```

### Iterable Protocol
JavaScript's standard interface for objects that can be iterated (arrays, Set, Map, generators). Vue's `v-for` works with any object implementing this protocol.

---

## TypeScript-Specific Terms

### Typed Array
An array with TypeScript type annotation specifying the type of its elements.

**Example**: `const users = ref<User[]>([])`

### Union Type in Filters
Using TypeScript union types to constrain filter/sort options.

**Example**: `const filter = ref<'all' | 'active' | 'completed'>('all')`

### Generic Component Props
Component props that accept generic types, useful for reusable list components.

**Example**:
```ts
interface Props<T> {
  items: T[]
  keyField: keyof T
}
```

---

## Reference

For more details on these concepts:
- [Vue 3 Documentation: Conditional Rendering](https://vuejs.org/guide/essentials/conditional.html)
- [Vue 3 Documentation: List Rendering](https://vuejs.org/guide/essentials/list.html)
- [Vue 3 Documentation: Reactivity Fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
