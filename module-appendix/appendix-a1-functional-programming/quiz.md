# Quiz — Appendix A.1: Functional Programming

Answer the following questions to test your understanding of functional programming and array methods.

---

## Knowledge Check

**1. What does `map()` do?**
- a) Changes the original array
- b) Transforms each element and returns a new array
- c) Returns only matching elements
- d) Reduces to a single value

**2. Which method accumulates values into a single result?**
- a) `filter()`
- b) `map()`
- c) `reduce()`
- d) `find()`

**3. What is a pure function?**
- a) A function that always returns the same output for the same input with no side effects
- b) A function that modifies global state
- c) A function that can be called multiple times safely
- d) A function without parameters

**4. What does `filter()` return if no elements match?**
- a) `null`
- b) `undefined`
- c) An empty array `[]`
- d) An error

**5. Examine this code:**
```ts
const numbers = [1, 2, 3, 4, 5]
const result = numbers.map(n => n > 2).filter(n => n)
```
**What is the result?**
- a) `[true, true, true]`
- b) `[1, 2, 3, 4, 5]`
- c) `[3, 4, 5]`
- d) `[true, false, true, true, true]`

**6. What is the difference between `find()` and `filter()`?**
- a) `find()` returns the first match; `filter()` returns all matches
- b) `find()` returns an array; `filter()` returns a single value
- c) No difference, they're identical
- d) `find()` is slower than `filter()`

**7. What does `flatMap()` do?**
- a) Maps elements and flattens one level
- b) Maps and removes duplicate elements
- c) Flattens without transforming
- d) Maps the first element only

**8. When should you use `reduce()`?**
- a) To check if any element matches
- b) To transform each element
- c) To accumulate elements into a single value
- d) To find an element by ID

**9. What is immutability?**
- a) A variable that cannot change
- b) Not modifying original data; creating new data instead
- c) A constant variable
- d) A function with no parameters

**10. Examine this code:**
```ts
const users = [
  { id: 1, name: 'Alice', active: true },
  { id: 2, name: 'Bob', active: false }
]
const hasInactive = users.some(u => !u.active)
```
**What is `hasInactive`?**
- a) `true`
- b) `false`
- c) `undefined`
- d) An array

**11. Which method checks if ALL elements match a condition?**
- a) `some()`
- b) `every()`
- c) `find()`
- d) `all()`

**12. What does this code do?**
```ts
const items = [10, 20, 30]
const sum = items.reduce((acc, n) => acc + n, 0)
```
- a) Creates an array of sums
- b) Adds all numbers and returns 60
- c) Returns the last item (30)
- d) Multiplies all numbers

**13. Which is the correct functional style?**
- a) `arr[0] = 10; arr.push(20);`
- b) `const updated = arr.map(n => n).concat([20])`
- c) Both are the same
- d) The first is always better

**14. What will this return?**
```ts
const words = ['hello', 'world']
const chars = words.flatMap(w => w.split(''))
```
- a) `[['h','e','l','l','o'], ['w','o','r','l','d']]`
- b) `['hello', 'world']`
- c) `['h','e','l','l','o','w','o','r','l','d']`
- d) `12`

**15. Complete this code to get the sum of prices:**
```ts
const items = [
  { name: 'Apple', price: 5 },
  { name: 'Banana', price: 3 }
]
const total = items.reduce((_____, item) => _____ + item.price, _____)
```
- a) `reduce((sum, item) => sum + item.price, 0)`
- b) `reduce((item, sum) => item + sum, 0)`
- c) `reduce((price, item) => price, 0)`
- d) `reduce((acc, item) => acc * item.price, 1)`

---

## Practical Exercises

**16. Transform this imperative code to functional style:**
```ts
const numbers = [1, 2, 3, 4, 5]
const result = []
for (let n of numbers) {
  if (n > 2) {
    result.push(n * 2)
  }
}
```

**17. Write a `reduce()` that counts how many times each letter appears:**
```ts
const letters = ['a', 'b', 'a', 'c', 'b', 'a']
// Expected: { a: 3, b: 2, c: 1 }
```

**18. Chain methods to get names of active users over 30:**
```ts
const users = [
  { name: 'Alice', age: 25, active: true },
  { name: 'Bob', age: 35, active: false },
  { name: 'Charlie', age: 32, active: true }
]
// Expected: ['Charlie']
```

**19. Use `flatMap()` to extract all tags from posts:**
```ts
const posts = [
  { id: 1, tags: ['vue', 'javascript'] },
  { id: 2, tags: ['react', 'javascript'] }
]
// Expected: ['vue', 'javascript', 'react', 'javascript']
```

**20. Which method would you use to:**
- Find if a user with email 'test@example.com' exists?
- Get all users with role 'admin'?
- Sum up all prices in a cart?
- Get the first item matching a search?
- Check if all form fields are valid?

---

