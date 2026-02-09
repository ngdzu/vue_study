# Lesson 7.1: Unit Testing Fundamentals

## Overview

Unit testing is the foundation of professional software development. This lesson introduces you to **Vitest**, a blazing-fast unit test framework built for Vite projects, and teaches you how to write effective tests for functions and basic components.

By the end of this lesson, you'll be able to:
- Set up Vitest in a Vue project
- Write unit tests for pure functions
- Use assertions to validate behavior
- Organize tests with test suites
- Achieve meaningful test coverage

---

## What is Unit Testing?

A **unit test** verifies that a single piece of code (a "unit") works correctly in isolation. Units typically include:
- Pure functions
- Utility helpers
- Simple components
- Composables

### Why Unit Test?

1. **Confidence**: Know your code works before shipping
2. **Documentation**: Tests show how code is meant to be used
3. **Refactoring Safety**: Change code without breaking functionality
4. **Debugging**: Tests help isolate and identify bugs
5. **Quality**: Forces you to write better, more testable code

---

## Vitest Essentials

### What is Vitest?

Vitest is a unit testing framework for JavaScript/TypeScript with:
- Native ES modules support
- Vue 3 integration
- Excellent performance
- Familiar Jest-like API
- Watch mode for development

### Setup

```bash
npm install -D vitest @vitest/ui
```

### Configuration

Create or update `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### npm Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

---

## Writing Your First Test

### Test Structure

Every test file follows this pattern:

```ts
import { describe, it, expect } from 'vitest';

describe('MyFunction', () => {
  it('should return the expected result', () => {
    // Arrange (setup)
    const input = 5;
    
    // Act (execute)
    const result = myFunction(input);
    
    // Assert (validate)
    expect(result).toBe(10);
  });
});
```

### AAA Pattern

**Arrange → Act → Assert**

1. **Arrange**: Set up test data and conditions
2. **Act**: Execute the code being tested
3. **Assert**: Verify the result matches expectations

---

## Common Assertions

### Equality Checks

```ts
expect(value).toBe(expected);           // Strict equality (===)
expect(value).toEqual(expected);        // Deep equality for objects
expect(value).toStrictEqual(expected);  // Strict deep equality
```

### Truthiness

```ts
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeDefined();
```

### Number Comparisons

```ts
expect(count).toBeGreaterThan(5);
expect(count).toBeGreaterThanOrEqual(5);
expect(count).toBeLessThan(10);
expect(count).toBeLessThanOrEqual(10);
expect(num).toBeCloseTo(3.14, 2);  // Floating point comparison
```

### String Matching

```ts
expect(message).toContain('error');
expect(message).toMatch(/error|warning/);
expect(message).toStartWith('Error:');
expect(message).toEndWith('occurred');
```

### Array/Object Checks

```ts
expect(array).toContain(value);
expect(array).toHaveLength(3);
expect(obj).toHaveProperty('name');
expect(array).toEqual([1, 2, 3]);
```

### Error Handling

```ts
expect(() => riskyFunction()).toThrow();
expect(() => riskyFunction()).toThrow(Error);
expect(() => riskyFunction()).toThrow('specific message');
```

---

## Example: Testing Utility Functions

### Function to Test

```ts
// src/utils/math.ts
export function add(a: number, b: number): number {
  return a + b;
}

export function factorial(n: number): number {
  if (n < 0) throw new Error('Factorial undefined for negative numbers');
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
}

export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
}
```

### Corresponding Tests

```ts
// src/utils/math.test.ts
import { describe, it, expect } from 'vitest';
import { add, factorial, average } from './math';

describe('Math Utilities', () => {
  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    it('should handle negative numbers', () => {
      expect(add(-2, 3)).toBe(1);
      expect(add(-2, -3)).toBe(-5);
    });

    it('should handle zero', () => {
      expect(add(0, 5)).toBe(5);
      expect(add(0, 0)).toBe(0);
    });
  });

  describe('factorial', () => {
    it('should calculate factorial for positive numbers', () => {
      expect(factorial(5)).toBe(120);
      expect(factorial(3)).toBe(6);
    });

    it('should return 1 for 0 and 1', () => {
      expect(factorial(0)).toBe(1);
      expect(factorial(1)).toBe(1);
    });

    it('should throw for negative numbers', () => {
      expect(() => factorial(-1)).toThrow('Factorial undefined for negative numbers');
    });
  });

  describe('average', () => {
    it('should calculate average of numbers', () => {
      expect(average([1, 2, 3, 4, 5])).toBe(3);
      expect(average([10, 20])).toBe(15);
    });

    it('should return 0 for empty array', () => {
      expect(average([])).toBe(0);
    });

    it('should handle single element', () => {
      expect(average([42])).toBe(42);
    });
  });
});
```

---

## Test Organization

### Describe Blocks

Group related tests:

```ts
describe('UserService', () => {
  describe('getUser', () => {
    it('should retrieve user by id', () => {});
    it('should return null for non-existent id', () => {});
  });

  describe('createUser', () => {
    it('should create user with valid data', () => {});
    it('should throw on invalid email', () => {});
  });
});
```

### Test Hooks

Setup and teardown:

```ts
describe('Database', () => {
  let connection;

  beforeEach(() => {
    // Run before each test
    connection = createConnection();
  });

  afterEach(() => {
    // Run after each test
    connection.close();
  });

  beforeAll(() => {
    // Run once before all tests
    initializeDatabase();
  });

  afterAll(() => {
    // Run once after all tests
    cleanupDatabase();
  });

  it('should query data', () => {
    expect(connection.query('SELECT *')).toBeDefined();
  });
});
```

---

## Testing Best Practices

### 1. Test Behavior, Not Implementation

❌ **Bad**: Tests that are too specific to implementation
```ts
it('should set value to 42', () => {
  obj.value = 42;
  expect(obj.value).toBe(42);  // Testing the obvious
});
```

✅ **Good**: Tests that verify behavior
```ts
it('should validate discount codes', () => {
  expect(isValidCode('SAVE20')).toBe(true);
  expect(isValidCode('INVALID')).toBe(false);
});
```

### 2. One Assertion Per Test (Mostly)

Tests should verify one specific behavior:

```ts
// ❌ Multiple concerns
it('should process user', () => {
  const user = createUser('John', 'john@example.com');
  expect(user.name).toBe('John');
  expect(user.email).toBe('john@example.com');
  expect(user.createdAt).toBeDefined();
});

// ✅ Focused tests
it('should create user with correct name', () => {
  const user = createUser('John', 'john@example.com');
  expect(user.name).toBe('John');
});

it('should create user with valid email', () => {
  const user = createUser('John', 'john@example.com');
  expect(user.email).toBe('john@example.com');
});
```

### 3. Use Descriptive Test Names

```ts
// ❌ Vague
it('works', () => {});

// ✅ Clear
it('should return sorted array in ascending order', () => {});
it('should throw error when email is invalid', () => {});
it('should increment counter when button clicked', () => {});
```

### 4. Test Edge Cases

```ts
describe('divide', () => {
  it('should divide positive numbers', () => {
    expect(divide(10, 2)).toBe(5);
  });

  it('should throw error when dividing by zero', () => {
    expect(() => divide(10, 0)).toThrow('Cannot divide by zero');
  });

  it('should handle negative numbers', () => {
    expect(divide(-10, 2)).toBe(-5);
    expect(divide(10, -2)).toBe(-5);
  });

  it('should handle decimal results', () => {
    expect(divide(1, 3)).toBeCloseTo(0.333, 3);
  });
});
```

### 5. Keep Tests Isolated

Each test should be independent:

```ts
// ❌ Tests depend on each other
let counter = 0;
it('should increment counter', () => {
  counter++;
  expect(counter).toBe(1);
});
it('should increment counter again', () => {
  counter++;
  expect(counter).toBe(2);  // Fails if first test doesn't run
});

// ✅ Tests are independent
it('should increment counter', () => {
  let counter = 0;
  counter++;
  expect(counter).toBe(1);
});
it('should increment counter again', () => {
  let counter = 0;
  counter++;
  expect(counter).toBe(1);  // Independent
});
```

---

## Running Tests

### Watch Mode

```bash
npm run test
```

Runs tests and watches for changes. Press:
- `a` - run all tests
- `p` - filter by filename
- `t` - filter by test name
- `q` - quit

### UI Dashboard

```bash
npm run test:ui
```

Opens an interactive test dashboard in the browser.

### Coverage Report

```bash
npm run test:coverage
```

Generates coverage report showing:
- Statements covered
- Branches covered
- Functions covered
- Lines covered

---

## Key Takeaways

1. ✅ Unit tests verify individual functions and units of code
2. ✅ Vitest provides a fast, simple testing framework
3. ✅ Use the AAA pattern: Arrange, Act, Assert
4. ✅ Write clear, descriptive test names
5. ✅ Test behavior, not implementation details
6. ✅ Use meaningful assertions to validate expectations
7. ✅ Keep tests focused and independent
8. ✅ Cover edge cases and error scenarios

---

## Next Steps

- Complete the exercises in [exercises.md](exercises.md)
- Build the sample project in [sample-project.md](sample-project.md)
- Take the quiz in [quiz.md](quiz.md) to assess your understanding
- Review [glossary.md](glossary.md) for any unfamiliar terms
