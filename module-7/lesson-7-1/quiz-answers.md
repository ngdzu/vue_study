# Quiz Answers: Unit Testing Fundamentals

## Question 1
**What is the primary purpose of unit testing?**

**Correct Answer**: B) To verify that individual pieces of code work correctly in isolation

**Explanation**: Unit testing focuses on testing small, isolated units of code (functions, methods) to ensure they work correctly. While tests may provide other benefits, the primary purpose is verification of individual code units. Tests don't make code faster, and other types of testing remain important.

---

## Question 2
**What does the AAA pattern stand for in testing?**

**Correct Answer**: B) Arrange, Act, Assert

**Explanation**: The AAA pattern is a structured approach:
1. **Arrange**: Set up test data and conditions
2. **Act**: Execute the code being tested
3. **Assert**: Verify the results match expectations

This pattern provides a clear, consistent structure for writing tests.

---

## Question 3
**In the Arrange-Act-Assert pattern, which step should come first?**

**Correct Answer**: B) Arrange

**Explanation**: The Arrange step must come first because you need to set up your test data and conditions before executing the code. The order is always Arrange → Act → Assert.

---

## Question 4
**What is Vitest?**

**Correct Answer**: C) A unit testing framework for Vite projects

**Explanation**: Vitest is specifically designed as a unit test framework that integrates well with Vite and Vue 3. It provides a Jest-like API with excellent performance.

---

## Question 5
**Which assertion checks if a value equals another using strict equality (===)?**

**Correct Answer**: B) `toBe()`

**Explanation**: 
- `toBe()` checks for strict equality using `===`
- `toEqual()` does deep equality comparison for objects
- Example: `expect(result).toBe(5)`

---

## Question 6
**What assertion would you use to check if a function throws an error?**

**Correct Answer**: D) Both A and B

**Explanation**: Both `toThrow()` and `toThrowError()` work for testing error throwing. `toThrow()` is more concise. Examples:
```ts
expect(() => riskyFunction()).toThrow();
expect(() => riskyFunction()).toThrow('error message');
```

---

## Question 7
**Which assertion checks if an array contains a specific value?**

**Correct Answer**: C) `toContain()`

**Explanation**: 
- `toContain()` checks if an array includes a value
- Example: `expect([1, 2, 3]).toContain(2)` passes
- `toHaveLength()` checks array length instead

---

## Question 8
**What is the `describe()` function used for?**

**Correct Answer**: B) Group related tests together

**Explanation**: `describe()` blocks organize and group related tests, improving test readability and organization:
```ts
describe('UserService', () => {
  // All UserService tests here
});
```

---

## Question 9
**What does watch mode do in Vitest?**

**Correct Answer**: B) Automatically re-runs tests when files change

**Explanation**: Watch mode monitors source and test files for changes and automatically re-runs relevant tests, enabling rapid development and feedback.

---

## Question 10
**Which npm script would you use to run tests in watch mode?**

**Correct Answer**: B) `npm run test`

**Explanation**: When Vitest is configured in `package.json`, `npm run test` starts watch mode by default. Other options:
- `npm run test:coverage` generates coverage reports
- `npm run test:ui` opens interactive dashboard

---

## Question 11
**What is an edge case in testing?**

**Correct Answer**: C) A boundary condition or unusual input that should be tested

**Explanation**: Edge cases are inputs at the boundaries or extremes:
- Empty arrays/strings
- Zero, negative numbers
- Very large values
- Null/undefined
- Single elements

These are important to test as they often reveal bugs.

---

## Question 12
**Which is an example of a negative test case?**

**Correct Answer**: B) Testing that `divide(10, 0)` throws an error

**Explanation**: 
- **Positive tests**: Verify functions work correctly with valid inputs
- **Negative tests**: Verify functions handle invalid inputs/errors correctly

Testing error handling is a negative test case.

---

## Question 13
**What is test isolation?**

**Correct Answer**: B) Testing code independently without external dependencies

**Explanation**: Isolated tests:
- Don't depend on other tests
- Don't require external services (databases, APIs)
- Can run in any order
- Each test sets up its own data

This makes tests reliable and maintainable.

---

## Question 14
**What does `beforeEach()` do?**

**Correct Answer**: B) Runs before each individual test

**Explanation**: Test lifecycle hooks:
- `beforeEach()` - Runs before each test
- `afterEach()` - Runs after each test
- `beforeAll()` - Runs once before all tests
- `afterAll()` - Runs once after all tests

Use `beforeEach()` for setup needed for every test.

---

## Question 15
**What is code coverage?**

**Correct Answer**: B) The percentage of code executed by tests

**Explanation**: Coverage metrics show:
- **Statement coverage**: % of code lines executed
- **Branch coverage**: % of conditional branches tested
- **Function coverage**: % of functions called
- **Line coverage**: % of lines executed

Higher coverage generally indicates more thorough testing.

---

## Question 16
**Which assertion would check if a string contains a substring?**

**Correct Answer**: C) Both A and B work

**Explanation**: Both work for strings:
```ts
expect('hello world').toContain('world');  // Works
expect('hello world').toMatch(/world/);     // Works
```
However, `toContain()` is simpler for substring checks, while `toMatch()` is better for patterns.

---

## Question 17
**What does a passing test indicate?**

**Correct Answer**: B) The code meets all expected behaviors

**Explanation**: A passing test means:
- The code executed as expected
- All assertions were true
- The behavior matches the test specification

However, it doesn't guarantee the code is bug-free or well-designed—only that it meets the tested requirements.

---

## Question 18
**When should you test error handling?**

**Correct Answer**: B) For all functions that can throw errors or have error states

**Explanation**: Error handling tests are critical for:
- Functions that validate input
- Functions that perform operations that can fail
- Functions with error recovery logic

Testing errors is as important as testing success paths.

---

## Question 19
**What is a pure function in the context of testing?**

**Correct Answer**: B) A function that always returns the same output for the same input and has no side effects

**Explanation**: Pure functions are easier to test because:
- Same input always produces same output
- No external state dependencies
- No side effects (modifications to external variables)

Example of pure function:
```ts
const add = (a, b) => a + b;  // Pure - same input always gives same output
```

---

## Question 20
**Which is the best test name?**

**Correct Answer**: C) `should calculate total price when items are added to cart`

**Explanation**: Good test names should:
- Describe what is being tested
- Describe the expected behavior
- Be specific and clear
- Use "should" or "must" for clarity

Bad test names:
- `test1` - Too vague
- `test_case_5` - Unclear
- Overly long names - Hard to read
