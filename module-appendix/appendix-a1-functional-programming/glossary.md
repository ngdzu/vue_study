# Glossary — Appendix A.1: Functional Programming

Quick reference for functional programming terms and concepts.

---

## Core Concepts

### Pure Function
**Definition**: A function that always returns the same output for the same input and has no side effects (doesn't modify external state).

**Example**:
```ts
// ✅ PURE
const add = (a: number, b: number) => a + b

// ❌ IMPURE: Depends on external variable
let multiplier = 2
const multiply = (n: number) => n * multiplier
```

---

### Immutability
**Definition**: Not changing the original data; instead, creating new data with changes.

**Example**:
```ts
// ❌ Mutating (bad)
const items = [1, 2, 3]
items[0] = 10  // Changed original

// ✅ Immutable (good)
const items = [1, 2, 3]
const updated = items.map((n, i) => i === 0 ? 10 : n)  // New array
```

---

### Higher-Order Function
**Definition**: A function that takes functions as arguments or returns a function.

**Example**:
```ts
// Takes a function as argument
const filter = (arr: number[], fn: (n: number) => boolean) => arr.filter(fn)

// Returns a function
const makeMultiplier = (factor: number) => (n: number) => n * factor
const double = makeMultiplier(2)
```

---

### Side Effect
**Definition**: When a function modifies external state (logs, API calls, mutates global variables, etc.).

**Example**:
```ts
// ❌ HAS SIDE EFFECTS
let total = 0
const add = (n: number) => {
  total += n  // Modifying external state
  return total
}

// ✅ NO SIDE EFFECTS
const add = (a: number, b: number) => a + b
```

---

## Array Methods

### map()
**Definition**: Transforms each element and returns a new array of the same length.

**Syntax**: `array.map((element, index, array) => newElement)`

**Returns**: New array with transformed elements

---

### filter()
**Definition**: Returns a new array with only elements that match a condition.

**Syntax**: `array.filter((element, index, array) => boolean)`

**Returns**: New array with matching elements

---

### reduce()
**Definition**: Accumulates array elements into a single value (number, object, string, etc.).

**Syntax**: `array.reduce((accumulator, element, index, array) => newAccumulator, initialValue)`

**Returns**: Single accumulated value

**Common uses**:
- Sum: `reduce((sum, n) => sum + n, 0)`
- Count: `reduce((count) => count + 1, 0)`
- Build object: `reduce((obj, item) => ({...obj, [item.id]: item}), {})`

---

### flatMap()
**Definition**: Maps elements then flattens one level of nesting.

**Syntax**: `array.flatMap((element, index, array) => mappedElement)`

**Returns**: New flattened array

**Difference from map()**:
```ts
const words = ['hi', 'bye']
words.map(w => w.split(''))     // [['h','i'], ['b','y','e']] — nested
words.flatMap(w => w.split('')) // ['h','i','b','y','e'] — flat
```

---

### find()
**Definition**: Returns the first element matching a condition (or undefined).

**Syntax**: `array.find((element, index, array) => boolean)`

**Returns**: Single element or undefined

---

### findIndex()
**Definition**: Returns the index of the first matching element (or -1).

**Syntax**: `array.findIndex((element, index, array) => boolean)`

**Returns**: Number (index) or -1

---

### some()
**Definition**: Returns true if any element matches a condition.

**Syntax**: `array.some((element, index, array) => boolean)`

**Returns**: Boolean

**Use case**: Check if form has errors, if list contains item, etc.

---

### every()
**Definition**: Returns true if all elements match a condition.

**Syntax**: `array.every((element, index, array) => boolean)`

**Returns**: Boolean

**Use case**: Check if form is valid, if all items are selected, etc.

---

## Patterns

### Chaining
**Definition**: Calling multiple array methods in sequence, each operating on the result of the previous.

**Example**:
```ts
items
  .filter(i => i.active)
  .map(i => i.name)
  .sort()
```

**Benefit**: Declarative and readable

---

### Accumulation
**Definition**: Using `reduce()` to build a new value from array elements.

**Common patterns**:
- Sum/total
- Count occurrences
- Build object from array
- Group items
- Concatenate strings

---

## Comparison

### Imperative vs Functional

**Imperative** (how to do it):
```ts
const result = []
for (let i = 0; i < arr.length; i++) {
  if (arr[i] > 5) {
    result.push(arr[i] * 2)
  }
}
```

**Functional** (what to do):
```ts
const result = arr.filter(n => n > 5).map(n => n * 2)
```

**Advantages of functional**:
- More readable intent
- Less code
- Easier to compose
- Better for Vue reactivity
- Naturally immutable

---
