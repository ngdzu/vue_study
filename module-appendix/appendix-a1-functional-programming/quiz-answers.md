# Quiz Answers — Appendix A.1: Functional Programming

Detailed answers with explanations for all quiz questions.

---

## Knowledge Check Answers

**1. What does `map()` do?**
**Answer: b) Transforms each element and returns a new array**

Explanation: `map()` applies a function to each element and returns a new array with the transformed elements. The original array is unchanged.

```ts
const numbers = [1, 2, 3]
const doubled = numbers.map(n => n * 2)  // [2, 4, 6]
```

---

**2. Which method accumulates values into a single result?**
**Answer: c) `reduce()`**

Explanation: `reduce()` processes each element and accumulates a single final value (could be a number, object, string, etc.).

```ts
const numbers = [1, 2, 3, 4]
const sum = numbers.reduce((acc, n) => acc + n, 0)  // 10
```

---

**3. What is a pure function?**
**Answer: a) A function that always returns the same output for the same input with no side effects**

Explanation: Pure functions are predictable and don't modify external state.

```ts
// ✅ PURE
const add = (a, b) => a + b

// ❌ IMPURE
let total = 0
const add = (n) => { total += n; return total }
```

---

**4. What does `filter()` return if no elements match?**
**Answer: c) An empty array `[]`**

Explanation: `filter()` always returns an array, even if no elements match the condition.

```ts
const numbers = [1, 2, 3]
const result = numbers.filter(n => n > 10)  // []
```

---

**5. What is the result?**
```ts
const numbers = [1, 2, 3, 4, 5]
const result = numbers.map(n => n > 2).filter(n => n)
```
**Answer: a) `[true, true, true]`**

Explanation: 
- `map(n => n > 2)` returns `[false, false, true, true, true]`
- `filter(n => n)` keeps truthy values: `[true, true, true]`

---

**6. What is the difference between `find()` and `filter()`?**
**Answer: a) `find()` returns the first match; `filter()` returns all matches**

Explanation:
```ts
const users = [{id: 1}, {id: 2}, {id: 3}]

users.find(u => u.id > 1)    // {id: 2} (first match)
users.filter(u => u.id > 1)  // [{id: 2}, {id: 3}] (all matches)
```

---

**7. What does `flatMap()` do?**
**Answer: a) Maps elements and flattens one level**

Explanation: `flatMap()` combines the functionality of `map()` and `flat()`.

```ts
const words = ['hello', 'world']
words.flatMap(w => w.split(''))  // ['h','e','l','l','o','w','o','r','l','d']
```

---

**8. When should you use `reduce()`?**
**Answer: c) To accumulate elements into a single value**

Explanation: Use `reduce()` to:
- Calculate totals/sums
- Build objects from arrays
- Count occurrences
- Concatenate strings

```ts
const items = [{price: 10}, {price: 20}]
const total = items.reduce((sum, i) => sum + i.price, 0)  // 30
```

---

**9. What is immutability?**
**Answer: b) Not modifying original data; creating new data instead**

Explanation: Immutability means creating new data structures instead of mutating existing ones.

```ts
// ❌ MUTABLE
const items = [1, 2, 3]
items[0] = 99  // Changed original

// ✅ IMMUTABLE
const items = [1, 2, 3]
const updated = items.map((n, i) => i === 0 ? 99 : n)  // New array
```

---

**10. What is `hasInactive`?**
```ts
const users = [
  { id: 1, name: 'Alice', active: true },
  { id: 2, name: 'Bob', active: false }
]
const hasInactive = users.some(u => !u.active)
```
**Answer: a) `true`**

Explanation: `some()` returns true if any element matches the condition. Bob is inactive, so the result is `true`.

---

**11. Which method checks if ALL elements match a condition?**
**Answer: b) `every()`**

Explanation:
```ts
const nums = [2, 4, 6]
nums.every(n => n % 2 === 0)  // true (all even)

const nums = [1, 2, 3]
nums.every(n => n > 0)        // true (all positive)

const nums = [1, 2, 3]
nums.every(n => n > 2)        // false (not all > 2)
```

---

**12. What does this code do?**
```ts
const items = [10, 20, 30]
const sum = items.reduce((acc, n) => acc + n, 0)
```
**Answer: b) Adds all numbers and returns 60**

Explanation: `reduce()` with initial value 0 accumulates:
- acc=0, n=10 → 10
- acc=10, n=20 → 30
- acc=30, n=30 → 60

---

**13. Which is the correct functional style?**
**Answer: b) `const updated = arr.map(n => n).concat([20])`**

Explanation: Functional style creates new arrays instead of mutating originals.

```ts
// ❌ IMPERATIVE (mutating)
arr[0] = 10
arr.push(20)

// ✅ FUNCTIONAL (immutable)
const updated = arr.map(n => n).concat([20])
```

---

**14. What will this return?**
```ts
const words = ['hello', 'world']
const chars = words.flatMap(w => w.split(''))
```
**Answer: c) `['h','e','l','l','o','w','o','r','l','d']`**

Explanation: `flatMap()` splits each word into characters and flattens the result into a single array.

---

**15. Complete this code:**
```ts
const items = [
  { name: 'Apple', price: 5 },
  { name: 'Banana', price: 3 }
]
const total = items.reduce((_____, item) => _____ + item.price, _____)
```
**Answer: a) `reduce((sum, item) => sum + item.price, 0)`**

Explanation: The accumulator (sum) starts at 0 and adds each item's price.

---

## Practical Exercises

**16. Transform to functional style:**

**Original (imperative)**:
```ts
const numbers = [1, 2, 3, 4, 5]
const result = []
for (let n of numbers) {
  if (n > 2) {
    result.push(n * 2)
  }
}
```

**Answer (functional)**:
```ts
const result = numbers
  .filter(n => n > 2)
  .map(n => n * 2)
// [6, 8, 10]
```

---

**17. Count letter occurrences with reduce():**

**Answer**:
```ts
const letters = ['a', 'b', 'a', 'c', 'b', 'a']

const count = letters.reduce((acc, letter) => {
  acc[letter] = (acc[letter] || 0) + 1
  return acc
}, {})

console.log(count)  // { a: 3, b: 2, c: 1 }
```

**Explanation**: For each letter, increment its count or initialize to 1.

---

**18. Get names of active users over 30:**

**Answer**:
```ts
const users = [
  { name: 'Alice', age: 25, active: true },
  { name: 'Bob', age: 35, active: false },
  { name: 'Charlie', age: 32, active: true }
]

const result = users
  .filter(u => u.active)      // Only active
  .filter(u => u.age > 30)    // Only over 30
  .map(u => u.name)           // Extract names

console.log(result)  // ['Charlie']
```

---

**19. Extract all tags with flatMap():**

**Answer**:
```ts
const posts = [
  { id: 1, tags: ['vue', 'javascript'] },
  { id: 2, tags: ['react', 'javascript'] }
]

const allTags = posts.flatMap(post => post.tags)

console.log(allTags)  // ['vue', 'javascript', 'react', 'javascript']
```

---

**20. Which method for each scenario?**

**Answers**:
- **Find if a user with email 'test@example.com' exists?** → `find()` or `some()`
  ```ts
  users.find(u => u.email === 'test@example.com')
  users.some(u => u.email === 'test@example.com')
  ```

- **Get all users with role 'admin'?** → `filter()`
  ```ts
  users.filter(u => u.role === 'admin')
  ```

- **Sum up all prices in a cart?** → `reduce()`
  ```ts
  cart.reduce((total, item) => total + item.price, 0)
  ```

- **Get the first item matching a search?** → `find()`
  ```ts
  items.find(item => item.name.includes(search))
  ```

- **Check if all form fields are valid?** → `every()`
  ```ts
  fields.every(field => field.valid)
  ```

---

## Grading Rubric

- **Knowledge Check (Q1-15)**: 15 points (1 point each)
- **Practical Exercises (Q16-20)**: 5 points (1 point each)

**Pass**: 16/20 (80%)

---
