# Exercises, Validation, and Grading — Lesson 1.3

## Exercise A: Filterable Product List

Goal: Practice `v-for`, `:key`, computed filtering, and conditional rendering.

**Requirements**
- Create a product list component with at least 10 products
- Each product has: `id`, `name`, `category`, `price`, `inStock`
- Implement category filtering (All, Electronics, Clothing, Food, etc.)
- Show product count for each filter
- Display "Out of Stock" badge for unavailable products
- Show empty state when filter returns no results
- Use proper keys for list items
- All filtering done via computed properties (not in template)

**Product Data Structure**
```ts
interface Product {
  id: number
  name: string
  category: 'electronics' | 'clothing' | 'food' | 'home'
  price: number
  inStock: boolean
}

const products = ref<Product[]>([
  { id: 1, name: 'Laptop', category: 'electronics', price: 999, inStock: true },
  { id: 2, name: 'T-Shirt', category: 'clothing', price: 29, inStock: false },
  // ... add at least 8 more products
])
```

**Validation (Manual)**
- Clicking filter buttons shows correct products
- Product count per category is accurate
- Out of stock items have visual indicator
- Empty filter state shows appropriate message
- No console warnings about missing keys
- Keys are unique (verify in Vue DevTools)
- UI updates immediately when filter changes

**Grading Points** (20 points)
- Product data structure with 10+ items (3 pts)
- Correct filter implementation with computed (5 pts)
- Proper `:key` on all list items (3 pts)
- Category count display (2 pts)
- Out of stock indicator (2 pts)
- Empty state handling (2 pts)
- Clean, organized code (3 pts)

---

## Exercise B: Nested Category List

Goal: Practice nested `v-for`, unique keys at multiple levels, and template grouping.

**Requirements**
- Create a hierarchical category structure (categories → subcategories → items)
- Each level needs proper unique keys
- Implement expand/collapse for categories (use `v-if` or `v-show`)
- Show item count per category
- Handle empty categories gracefully
- Use `<template>` tags where appropriate to avoid extra DOM nodes

**Data Structure**
```ts
interface Item {
  id: number
  name: string
}

interface Subcategory {
  id: number
  name: string
  items: Item[]
}

interface Category {
  id: number
  name: string
  expanded: boolean
  subcategories: Subcategory[]
}

const categories = ref<Category[]>([
  {
    id: 1,
    name: 'Technology',
    expanded: true,
    subcategories: [
      {
        id: 101,
        name: 'Computers',
        items: [
          { id: 1001, name: 'Laptop' },
          { id: 1002, name: 'Desktop' }
        ]
      },
      {
        id: 102,
        name: 'Phones',
        items: [
          { id: 1003, name: 'iPhone' },
          { id: 1004, name: 'Samsung' }
        ]
      }
    ]
  },
  // Add at least 2 more categories
])
```

**Validation (Manual)**
- All three levels render correctly
- Each level has unique keys (verify in DevTools)
- Expand/collapse works for categories
- Item counts are accurate
- Empty categories show appropriate message
- No console errors or warnings
- `<template>` used where appropriate

**Grading Points** (25 points)
- Correct data structure with 3+ categories (5 pts)
- Nested v-for with proper keys (8 pts)
- Expand/collapse functionality (4 pts)
- Item count computation (3 pts)
- Empty category handling (2 pts)
- Proper use of `<template>` (3 pts)

---

## Exercise C: Multi-State Data Fetching

Goal: Practice loading, error, success, and empty states with conditional rendering.

**Requirements**
- Simulate API call with `setTimeout` (2 second delay)
- Implement all four states: loading, error, empty, success
- Add a "Retry" button in error state
- Show loading spinner (can be text or CSS animation)
- Use `v-if`/`v-else-if`/`v-else` chain correctly
- Make error state triggerable (e.g., checkbox to "force error")

**Implementation Guide**
```ts
import { ref, onMounted } from 'vue'

interface User {
  id: number
  name: string
  email: string
}

const users = ref<User[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const forceError = ref(false) // Toggle to test error state

async function fetchUsers() {
  try {
    isLoading.value = true
    error.value = null
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simulate error if checkbox checked
    if (forceError.value) {
      throw new Error('Simulated network error')
    }
    
    // Mock data (or make empty to test empty state)
    users.value = [
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' }
    ]
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'An error occurred'
    users.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchUsers()
})
```

**Template Requirements**
- Loading state: Show "Loading users..." or spinner
- Error state: Show error message + Retry button
- Empty state: Show "No users found"
- Success state: Show user list
- Checkbox to toggle `forceError` (for testing)

**Validation (Manual)**
- Initial load shows loading state for 2 seconds
- Success state shows user list
- Checking "force error" box + retry shows error state
- Unchecking + retry shows success
- Setting `users.value = []` in success shows empty state
- Retry button calls `fetchUsers()` again
- State transitions are logical (no flickering)

**Grading Points** (20 points)
- Loading state implementation (4 pts)
- Error state with retry button (5 pts)
- Empty state handling (3 pts)
- Success state with user list (3 pts)
- Correct `v-if`/`v-else-if`/`v-else` usage (3 pts)
- Force error toggle works (2 pts)

---

## Exercise D: Dynamic Todo List (Extension)

Goal: Build on the sample project with additional features.

**Requirements**

Implement the basic todo list from the sample project, then add:

1. **Edit Mode**: Double-click a todo to edit its text
   - Show input field when editing
   - Save on Enter, cancel on Escape
   - Validate non-empty text

2. **Priority Levels**: Add priority (low/medium/high) to each todo
   - Show with colored indicators
   - Filter by priority
   - Sort by priority

3. **Search**: Add search input to filter todos by text
   - Case-insensitive search
   - Combine with existing filters
   - Show "no results" when search + filter return empty

4. **Local Storage**: Persist todos to localStorage
   - Save on every change
   - Restore on page load
   - Handle missing/corrupted data

**Data Structure**
```ts
interface Todo {
  id: number
  text: string
  done: boolean
  priority: 'low' | 'medium' | 'high'
  createdAt: number
}
```

**Validation (Manual)**
- All basic todo features work (add, toggle, delete, filter)
- Double-click enables edit mode
- Enter saves, Escape cancels edit
- Empty edits are rejected
- Priority indicators show correctly
- Priority filter works
- Search filters correctly
- Search + category filter both apply
- Todos persist across page reloads
- Corrupted localStorage handled gracefully

**Grading Points** (35 points)
- Basic todo functionality (10 pts)
- Edit mode implementation (8 pts)
- Priority levels and filtering (7 pts)
- Search functionality (5 pts)
- localStorage persistence (5 pts)

---

## Exercise E: Performance Test (Advanced)

Goal: Understand the impact of keys on list performance.

**Requirements**

Create two identical lists side-by-side:
- List A: Uses proper unique keys (`:key="item.id"`)
- List B: Uses index as keys (`:key="index"`)

Each list has:
- 50+ items with checkboxes
- "Shuffle" button to randomly reorder items
- "Add to Top" button to insert item at beginning
- "Remove First" button to remove first item

**Test Scenario**
1. Check several checkboxes in both lists
2. Click "Shuffle" in both lists
3. Observe behavior difference

**Expected Results**
- List A: Checkboxes stay with their items (correct)
- List B: Checkboxes stay in position, items change (bug!)

**Implementation**
```ts
import { ref } from 'vue'

interface Item {
  id: number
  text: string
  checked: boolean
}

function createItems(count: number): Item[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    text: `Item ${i + 1}`,
    checked: false
  }))
}

const itemsA = ref<Item[]>(createItems(50))
const itemsB = ref<Item[]>(createItems(50))

function shuffle(items: Item[]) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[items[i], items[j]] = [items[j], items[i]]
  }
}
```

**Validation (Manual)**
- Both lists render 50 items
- Checkboxes work in both lists
- Shuffle button reorders items
- List A preserves checkbox state correctly
- List B has checkbox mismatch bug
- Add/Remove operations show difference

**Grading Points** (20 points)
- Two lists with different key strategies (5 pts)
- Shuffle functionality (4 pts)
- Add/Remove functionality (3 pts)
- Correct observation of key behavior (5 pts)
- Written explanation of observed behavior (3 pts)

---

## Common Issues & Debugging

### Issue: Items not rendering
**Check**:
- Is the array populated? (`console.log(items.value)`)
- Is `v-for` syntax correct? (`item in items`, not `items in item`)
- Are you iterating the ref `.value`? (Only needed in `<script>`, not `<template>`)

### Issue: Keys not working
**Check**:
- Is `:key` bound with colon? (`:key="item.id"`, not `key="item.id"`)
- Are keys unique? (Check in Vue DevTools)
- Are keys stable? (Don't use `Math.random()`)

### Issue: Filter not updating
**Check**:
- Is the computed property dependency correct?
- Are you mutating the original array? (Use `filter()`, not `splice()`)
- Is the filter state reactive? (`ref()` or `reactive()`)

### Issue: v-if/v-else not working
**Check**:
- Is `v-else` immediately after `v-if`? (No elements between)
- Is the condition actually boolean? (`v-if="showSection"`, not `v-if="'false'"`)

### Issue: Console warning about keys
**Message**: `Duplicate keys detected: '...'`
**Solution**: Ensure all keys in the list are unique. Check for null/undefined keys.

---

## Testing Checklist

For each exercise, verify:

- [ ] No console errors or warnings
- [ ] All `v-for` lists have `:key` attributes
- [ ] Keys are unique (verify in Vue DevTools)
- [ ] Conditional rendering works as expected
- [ ] Empty states render correctly
- [ ] UI updates immediately (reactivity works)
- [ ] Code follows Vue best practices (no `v-if` + `v-for` on same element)
- [ ] TypeScript types are correct (no `any` types)
- [ ] Component is well-organized and readable

---

## Submission Format

For each exercise, provide:

1. **Source code**: Full `.vue` component file(s)
2. **Screenshots**: Show all states (empty, loading, error, success, filtered)
3. **Self-assessment**: Check off grading points you completed
4. **Challenges faced**: What was difficult? How did you solve it?
5. **Vue DevTools screenshot**: Show component tree with keys visible

---

## Bonus Challenges

If you complete all exercises early:

1. **Virtualized List**: Implement infinite scroll or virtual scrolling for a list of 10,000+ items
2. **Drag and Drop**: Add drag-and-drop reordering to the todo list
3. **Animations**: Add transition effects when items are added/removed
4. **Accessibility**: Add proper ARIA labels and keyboard navigation
5. **Unit Tests**: Write Vitest tests for computed properties and methods

---

## Resources

- [Vue 3 Docs: List Rendering](https://vuejs.org/guide/essentials/list.html)
- [Vue 3 Docs: Conditional Rendering](https://vuejs.org/guide/essentials/conditional.html)
- [Why keys are important (blog post)](https://vuejs.org/guide/essentials/list.html#maintaining-state-with-key)
- [Vue DevTools installation](https://devtools.vuejs.org/)
