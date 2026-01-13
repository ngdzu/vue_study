# Appendix A.1 — Functional Programming Fundamentals

## What is Functional Programming?

Functional programming is a style of writing code where:
- Functions are treated like any other value (can be passed around, stored, returned)
- Data is **transformed** rather than **mutated**
- Side effects are minimized
- Functions do one thing well

**Why it matters for Vue**: Vue's reactivity system works better with immutable data patterns. Functional methods create new arrays instead of modifying existing ones.

---

## Pure Functions

A **pure function**:
- Returns the same output for the same input (deterministic)
- Has no side effects (doesn't modify external state)
- Doesn't depend on external state

**Example of pure function**:
```ts
// ✅ PURE: Same input always returns same output
const double = (n: number) => n * 2

console.log(double(5))  // 10
console.log(double(5))  // 10 (always 10)
```

**Example of impure function**:
```ts
// ❌ IMPURE: Depends on external state
let multiplier = 2

const multiplyByGlobal = (n: number) => n * multiplier

console.log(multiplyByGlobal(5))  // 10
multiplier = 3
console.log(multiplyByGlobal(5))  // 15 (different result!)
```

---

## Array Method Reference

### map() — Transform Each Element

Transforms each element and returns a **new array** of the same length.

**Syntax**:
```ts
array.map((element, index, array) => transformedElement)
```

**Simple example**:
```ts
const numbers = [1, 2, 3, 4]
const doubled = numbers.map(n => n * 2)

console.log(doubled)  // [2, 4, 6, 8]
console.log(numbers)  // [1, 2, 3, 4] (unchanged)
```

**Transform objects**:
```ts
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
]

const userNames = users.map(user => user.name)
console.log(userNames)  // ['Alice', 'Bob']
```

**Vue example** (display list):
```ts
<script setup lang="ts">
import { ref } from 'vue'

const products = ref([
  { id: 1, name: 'Laptop', price: 1000 },
  { id: 2, name: 'Phone', price: 500 }
])

// Transform for display
const displayNames = products.value.map(p => `${p.name} - $${p.price}`)
</script>

<template>
  <ul>
    <li v-for="name in displayNames" :key="name">{{ name }}</li>
  </ul>
</template>
```

---

### filter() — Select Matching Elements

Returns a **new array** with only elements that match a condition.

**Syntax**:
```ts
array.filter((element, index, array) => condition)
```

**Simple example**:
```ts
const numbers = [1, 2, 3, 4, 5, 6]
const evens = numbers.filter(n => n % 2 === 0)

console.log(evens)  // [2, 4, 6]
```

**Filter objects**:
```ts
const users = [
  { id: 1, name: 'Alice', active: true },
  { id: 2, name: 'Bob', active: false },
  { id: 3, name: 'Charlie', active: true }
]

const activeUsers = users.filter(u => u.active)
console.log(activeUsers)
// [
//   { id: 1, name: 'Alice', active: true },
//   { id: 3, name: 'Charlie', active: true }
// ]
```

**Vue example** (search/filter):
```ts
<script setup lang="ts">
import { ref, computed } from 'vue'

const products = ref([
  { id: 1, name: 'Laptop', category: 'Electronics' },
  { id: 2, name: 'Desk', category: 'Furniture' },
  { id: 3, name: 'Chair', category: 'Furniture' }
])

const searchCategory = ref('Furniture')

// Filter by category
const filtered = computed(() => 
  products.value.filter(p => p.category === searchCategory.value)
)
</script>

<template>
  <ul>
    <li v-for="product in filtered" :key="product.id">
      {{ product.name }}
    </li>
  </ul>
</template>
```

---

### reduce() — Accumulate Into Single Value

Processes each element and accumulates a **single result**.

**Syntax**:
```ts
array.reduce((accumulator, element, index, array) => newAccumulator, initialValue)
```

**Simple sum**:
```ts
const numbers = [1, 2, 3, 4]
const sum = numbers.reduce((acc, n) => acc + n, 0)

console.log(sum)  // 10
```

**Step-by-step breakdown**:
```ts
const numbers = [1, 2, 3]
const sum = numbers.reduce((acc, n) => {
  console.log(`acc=${acc}, n=${n}, new=${acc + n}`)
  return acc + n
}, 0)

// Logs:
// acc=0, n=1, new=1
// acc=1, n=2, new=3
// acc=3, n=3, new=6
// Result: 6
```

**Building objects with reduce()**:
```ts
const items = ['apple', 'banana', 'apple', 'cherry', 'banana']

const count = items.reduce((acc, item) => {
  acc[item] = (acc[item] || 0) + 1
  return acc
}, {})

console.log(count)
// { apple: 2, banana: 2, cherry: 1 }
```

**Vue example** (calculate total price):
```ts
<script setup lang="ts">
import { ref, computed } from 'vue'

const cartItems = ref([
  { id: 1, name: 'Laptop', price: 1000, quantity: 1 },
  { id: 2, name: 'Mouse', price: 50, quantity: 2 }
])

const total = computed(() =>
  cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
)
</script>

<template>
  <div>Total: ${{ total }}</div>
</template>
```

---

### flatMap() — Map and Flatten

Combines `map()` and `flat()` — transforms and flattens one level.

**Syntax**:
```ts
array.flatMap((element, index, array) => mappedElement)
```

**Simple example**:
```ts
const words = ['hello', 'world']
const chars = words.flatMap(word => word.split(''))

console.log(chars)  // ['h','e','l','l','o','w','o','r','l','d']
```

**vs regular map()**:
```ts
// With map()
const withMap = words.map(word => word.split(''))
console.log(withMap)
// [['h','e','l','l','o'], ['w','o','r','l','d']]  <- nested arrays

// With flatMap()
const withFlatMap = words.flatMap(word => word.split(''))
console.log(withFlatMap)
// ['h','e','l','l','o','w','o','r','l','d']  <- flat
```

**Extract data from nested structures**:
```ts
const users = [
  { id: 1, hobbies: ['reading', 'gaming'] },
  { id: 2, hobbies: ['cooking', 'sports'] }
]

const allHobbies = users.flatMap(u => u.hobbies)
console.log(allHobbies)
// ['reading', 'gaming', 'cooking', 'sports']
```

---

### find() — Get First Matching Element

Returns the **first element** that matches a condition (or `undefined`).

**Syntax**:
```ts
array.find((element, index, array) => condition)
```

**Simple example**:
```ts
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' }
]

const user = users.find(u => u.id === 2)
console.log(user)  // { id: 2, name: 'Bob' }

const notFound = users.find(u => u.id === 99)
console.log(notFound)  // undefined
```

**Vue example** (get current user):
```ts
<script setup lang="ts">
import { ref, computed } from 'vue'

const users = ref([...])
const currentUserId = ref(2)

const currentUser = computed(() =>
  users.value.find(u => u.id === currentUserId.value)
)
</script>

<template>
  <div v-if="currentUser">Hello, {{ currentUser.name }}</div>
  <div v-else>User not found</div>
</template>
```

---

### findIndex() — Get Index of First Match

Returns the **index** of the first matching element (or -1).

**Syntax**:
```ts
array.findIndex((element, index, array) => condition)
```

**Simple example**:
```ts
const numbers = [10, 20, 30, 40]
const index = numbers.findIndex(n => n === 30)

console.log(index)  // 2
console.log(numbers[index])  // 30
```

---

### some() — Check If Any Match

Returns `true` if **any** element matches a condition.

**Syntax**:
```ts
array.some((element, index, array) => condition)
```

**Simple example**:
```ts
const numbers = [1, 2, 3, 4, 5]
const hasEven = numbers.some(n => n % 2 === 0)

console.log(hasEven)  // true

const hasNegative = numbers.some(n => n < 0)
console.log(hasNegative)  // false
```

**Vue example** (form validation):
```ts
<script setup lang="ts">
import { ref, computed } from 'vue'

const fields = ref([
  { name: 'email', value: 'test@example.com', error: '' },
  { name: 'password', value: '', error: 'Required' }
])

const hasErrors = computed(() =>
  fields.value.some(field => field.error !== '')
)
</script>

<template>
  <button :disabled="hasErrors">Submit</button>
</template>
```

---

### every() — Check If All Match

Returns `true` if **all** elements match a condition.

**Syntax**:
```ts
array.every((element, index, array) => condition)
```

**Simple example**:
```ts
const numbers = [2, 4, 6, 8]
const allEven = numbers.every(n => n % 2 === 0)

console.log(allEven)  // true
```

**Vue example** (form validation):
```ts
<script setup lang="ts">
import { ref, computed } from 'vue'

const fields = ref([
  { name: 'email', value: 'test@example.com', valid: true },
  { name: 'password', value: 'secret123', valid: true }
])

const formValid = computed(() =>
  fields.value.every(field => field.valid)
)
</script>

<template>
  <button :disabled="!formValid">Submit</button>
</template>
```

---

## Chaining Methods

Combine multiple methods for complex transformations.

**Example**:
```ts
const users = [
  { id: 1, name: 'Alice', age: 25, active: true },
  { id: 2, name: 'Bob', age: 30, active: false },
  { id: 3, name: 'Charlie', age: 28, active: true },
  { id: 4, name: 'Diana', age: 35, active: true }
]

// Filter active users, get names, uppercase, sort
const result = users
  .filter(u => u.active)              // Keep active users
  .filter(u => u.age >= 28)           // Over 28
  .map(u => u.name.toUpperCase())     // Transform to uppercase
  .sort()                             // Alphabetical

console.log(result)
// ['CHARLIE', 'DIANA']
```

**Step-by-step**:
1. Start with all 4 users
2. Filter to active: [Alice, Charlie, Diana]
3. Filter age ≥ 28: [Charlie, Diana]
4. Map to names: ['Charlie', 'Diana']
5. Uppercase: ['CHARLIE', 'DIANA']
6. Sort: ['CHARLIE', 'DIANA']

---

## Imperative vs Functional

### Imperative (Old Style — Avoid)
```ts
const numbers = [1, 2, 3, 4, 5]
const result = []

for (let i = 0; i < numbers.length; i++) {
  if (numbers[i] > 2) {
    result.push(numbers[i] * 2)
  }
}

console.log(result)  // [6, 8, 10]
```

### Functional (Modern Style — Prefer)
```ts
const numbers = [1, 2, 3, 4, 5]
const result = numbers
  .filter(n => n > 2)
  .map(n => n * 2)

console.log(result)  // [6, 8, 10]
```

**Benefits of functional**:
- More readable intent
- Less boilerplate
- Easier to test
- Works better with Vue reactivity
- Composable and chainable

---

## Best Practices

### 1. Use Immutable Patterns

✅ Create new arrays instead of mutating:
```ts
// ✅ GOOD
const updated = items.map(item => ({...item, active: true}))

// ❌ BAD
items.forEach(item => item.active = true)
```

### 2. Keep Functions Pure

✅ Avoid side effects:
```ts
// ✅ GOOD
const getTotal = (items) => items.reduce((sum, i) => sum + i.price, 0)

// ❌ BAD
const getTotal = (items) => {
  console.log('Calculating...')  // side effect
  return items.reduce((sum, i) => sum + i.price, 0)
}
```

### 3. Choose the Right Method

- **`map()`** → Transform all elements
- **`filter()`** → Select elements
- **`reduce()`** → Accumulate to single value
- **`find()`** → Get one element
- **`some()`** → Check if any match
- **`every()`** → Check if all match

### 4. Chain When Possible

```ts
// ✅ GOOD: Clear flow
const result = items
  .filter(condition1)
  .filter(condition2)
  .map(transform)

// ❌ BAD: Multiple variables
const step1 = items.filter(condition1)
const step2 = step1.filter(condition2)
const result = step2.map(transform)
```

---

## Common Patterns in Vue

### Pattern 1: Transform for Display
```ts
const displayItems = items.value.map(item => ({
  ...item,
  display: `${item.name} - $${item.price}`
}))
```

### Pattern 2: Filter with Multiple Conditions
```ts
const filtered = items.value
  .filter(i => i.category === category.value)
  .filter(i => i.price <= maxPrice.value)
```

### Pattern 3: Calculate Aggregates
```ts
const stats = {
  total: items.value.reduce((sum, i) => sum + i.price, 0),
  count: items.value.length,
  average: items.value.reduce((sum, i) => sum + i.price, 0) / items.value.length
}
```

### Pattern 4: Build Lookup Maps
```ts
const byId = items.value.reduce((map, item) => {
  map[item.id] = item
  return map
}, {})

const user = byId[userId]
```

---

## Verification Checklist

- You can explain the difference between `map()` and `filter()`
- You can use `reduce()` to calculate totals and build objects
- You understand `flatMap()` and when to use it
- You can chain multiple methods together
- You prefer functional methods over imperative loops
- You understand pure functions and why they matter
- You can apply these in Vue components

When all boxes are checked, move on to the quiz and practice exercises.
