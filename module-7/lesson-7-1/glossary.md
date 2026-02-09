# Glossary - Unit Testing Fundamentals

## Unit Testing

**Definition**: Testing a single, isolated piece of code (function, method, etc.) to verify it works correctly.

**Example**: Testing a `calculateTotal()` function in isolation with various inputs.

---

## Test Suite / Describe Block

**Definition**: A collection of related tests grouped together using `describe()`.

**Example**:
```ts
describe('Calculator', () => {
  // All calculator tests go here
});
```

---

## Test Case / It Block

**Definition**: A single test that verifies one specific behavior using `it()`.

**Example**:
```ts
it('should add two numbers correctly', () => {
  expect(add(2, 3)).toBe(5);
});
```

---

## Assertion

**Definition**: A statement that checks whether a value meets an expected condition. Tests fail if assertions are false.

**Example**: `expect(result).toBe(5)` asserts that `result` equals 5.

---

## Vitest

**Definition**: A blazing-fast unit testing framework built for Vite projects with first-class Vue 3 support.

---

## Test Runner

**Definition**: A tool that finds and executes test files, collects results, and reports pass/fail status.

**Example**: Vitest is the test runner in this lesson.

---

## Watch Mode

**Definition**: A development mode where the test runner automatically re-runs tests when source or test files change.

**Command**: `npm run test`

---

## Coverage

**Definition**: A metric showing how much of your code is exercised by tests, typically measured as percentage of lines, branches, functions, and statements tested.

---

## Pure Function

**Definition**: A function that:
1. Always returns the same output for the same input
2. Has no side effects (doesn't modify external state)

**Example**:
```ts
// Pure - same input always gives same output
function add(a, b) { return a + b; }

// Not pure - depends on external state
let total = 0;
function addToTotal(num) { total += num; }  // Modifies external variable
```

---

## Arrange-Act-Assert (AAA)

**Definition**: A pattern for structuring unit tests:
1. **Arrange**: Set up test data and conditions
2. **Act**: Execute the function being tested
3. **Assert**: Verify the result matches expectations

---

## Mock / Stub

**Definition**: A fake implementation of a function or object used in tests to isolate the code being tested.

---

## Positive Test Case

**Definition**: A test that verifies the function works correctly with valid inputs.

**Example**: Testing that `add(2, 3)` returns 5.

---

## Negative Test Case

**Definition**: A test that verifies the function handles invalid inputs or errors correctly.

**Example**: Testing that `divide(10, 0)` throws an error.

---

## Edge Case

**Definition**: Boundary conditions or unusual inputs that should be tested (empty arrays, zero, null, very large numbers, etc.).

---

## Test Coverage / Coverage Report

**Definition**: A report showing what percentage of your code is executed by your tests.

**Metrics**:
- **Statement Coverage**: % of code statements executed
- **Branch Coverage**: % of conditional branches executed
- **Function Coverage**: % of functions called
- **Line Coverage**: % of lines executed

---

## Isolate / Isolation

**Definition**: Testing a unit of code independently without depending on external code, databases, APIs, etc.

---

## Regression Testing

**Definition**: Running existing tests after code changes to ensure new changes don't break previously working functionality.

---

## Test Fixtures

**Definition**: Pre-defined data used for testing to ensure consistent test environments.

**Example**:
```ts
const mockUser = { id: 1, name: 'John', email: 'john@example.com' };
```

---

## Failing Test

**Definition**: A test that runs but the assertion(s) fail, indicating the code doesn't meet expected behavior.

---

## Passing Test

**Definition**: A test that runs and all assertions succeed, indicating the code works as expected.

---

## Test Organization

**Definition**: The structure and naming conventions used to organize test files and describe blocks for readability and maintainability.

---

## Globals

**Definition**: Functions like `describe`, `it`, `expect`, `beforeEach`, etc. available without importing in Vitest with `globals: true`.

---

## jsdom

**Definition**: A JavaScript implementation of DOM APIs, used to simulate browser environment in Node.js tests.

---

## TDD (Test-Driven Development)

**Definition**: A development approach where you write tests first, then write code to make those tests pass.
