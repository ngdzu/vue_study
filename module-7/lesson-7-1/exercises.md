# Exercises: Unit Testing Fundamentals

Complete these exercises to practice unit testing with Vitest.

## Exercise 1: Setup Vitest in Your Project (15 minutes)

**Objective**: Get Vitest running in your Vue project.

### Steps

1. **Install dependencies**
   ```bash
   npm install -D vitest @vitest/ui jsdom
   ```

2. **Create `vitest.config.ts`** in your project root:
   ```ts
   import { defineConfig } from 'vitest/config';
   import vue from '@vitejs/plugin-vue';
   import path from 'path';

   export default defineConfig({
     plugins: [vue()],
     test: {
       globals: true,
       environment: 'jsdom',
     },
     resolve: {
       alias: {
         '@': path.resolve(__dirname, './src'),
       },
     },
   });
   ```

3. **Update `package.json` scripts**:
   ```json
   {
     "scripts": {
       "test": "vitest",
       "test:ui": "vitest --ui",
       "test:coverage": "vitest --coverage"
     }
   }
   ```

4. **Verify setup** - Run `npm run test` and ensure Vitest starts without errors.

✅ **Grading**: Vitest runs successfully with `npm run test`

---

## Exercise 2: Write Tests for a Calculator (20 minutes)

**Objective**: Write unit tests for basic arithmetic operations.

### Steps

1. **Create `src/utils/calculator.ts`**:
   ```ts
   export function add(a: number, b: number): number {
     return a + b;
   }

   export function subtract(a: number, b: number): number {
     return a - b;
   }

   export function multiply(a: number, b: number): number {
     return a * b;
   }

   export function divide(a: number, b: number): number {
     if (b === 0) throw new Error('Cannot divide by zero');
     return a / b;
   }
   ```

2. **Create `src/utils/calculator.test.ts`** with tests for:
   - ✅ `add()` with positive, negative, and zero inputs
   - ✅ `subtract()` with various scenarios
   - ✅ `multiply()` including by zero
   - ✅ `divide()` including error case (divide by zero)

3. **Ensure all tests pass**: `npm run test -- calculator.test.ts`

✅ **Grading**: 
- All tests pass
- At least 3 tests per function
- Tests include edge cases and error handling

---

## Exercise 3: Test Error Handling (15 minutes)

**Objective**: Practice testing error conditions.

### Steps

1. **Create `src/utils/validation.ts`**:
   ```ts
   export function validateEmail(email: string): boolean {
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     return emailRegex.test(email);
   }

   export function validatePassword(password: string): void {
     if (password.length < 8) {
       throw new Error('Password must be at least 8 characters');
     }
     if (!/[A-Z]/.test(password)) {
       throw new Error('Password must contain uppercase letter');
     }
     if (!/\d/.test(password)) {
       throw new Error('Password must contain number');
     }
   }

   export function parseJSON(jsonString: string): Record<string, unknown> {
     return JSON.parse(jsonString);
   }
   ```

2. **Create `src/utils/validation.test.ts`** with:
   - ✅ Tests for valid and invalid email addresses
   - ✅ Tests that `validatePassword()` throws correct errors
   - ✅ Tests that `parseJSON()` throws on invalid JSON
   - ✅ Tests for edge cases (empty strings, special characters, etc.)

✅ **Grading**:
- Error handling tests use `toThrow()`
- Tests verify error messages
- Coverage includes all validation rules

---

## Exercise 4: Test Array and Object Utilities (20 minutes)

**Objective**: Test functions that work with complex data types.

### Steps

1. **Create `src/utils/arrays.ts`**:
   ```ts
   export function findMax(numbers: number[]): number {
     if (numbers.length === 0) return 0;
     return Math.max(...numbers);
   }

   export function filterDuplicates<T>(array: T[]): T[] {
     return Array.from(new Set(array));
   }

   export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
     return array.reduce((acc, item) => {
       const groupKey = String(item[key]);
       if (!acc[groupKey]) acc[groupKey] = [];
       acc[groupKey].push(item);
       return acc;
     }, {} as Record<string, T[]>);
   }

   export function flatten<T>(array: (T | T[])[]): T[] {
     return array.flat();
   }
   ```

2. **Create `src/utils/arrays.test.ts`** with tests covering:
   - ✅ `findMax()` with positive numbers, negative numbers, and empty array
   - ✅ `filterDuplicates()` with various data types
   - ✅ `groupBy()` with objects having different keys
   - ✅ `flatten()` with nested arrays of different depths
   - ✅ Tests using `toContain()`, `toHaveLength()`, `toEqual()`

✅ **Grading**:
- All assertion types are used appropriately
- Tests verify array/object structure correctly
- Edge cases handled

---

## Exercise 5: Organize Tests with Describe Blocks (15 minutes)

**Objective**: Practice organizing related tests.

### Steps

1. **Refactor one of your test files** to use nested `describe()` blocks:

   ```ts
   describe('String Utilities', () => {
     describe('toTitleCase', () => {
       it('should capitalize first letter of each word', () => {});
       it('should handle empty string', () => {});
       // More tests
     });

     describe('truncate', () => {
       it('should add ellipsis when text is too long', () => {});
       it('should throw when maxLength < 3', () => {});
       // More tests
     });
   });
   ```

2. **Use test hooks** (`beforeEach`, `afterEach`) if applicable to set up/teardown test data

✅ **Grading**:
- Tests are logically grouped
- Describe block names are clear
- Hooks are used appropriately if needed

---

## Exercise 6: Achieve Test Coverage (20 minutes)

**Objective**: Write tests to achieve high code coverage.

### Steps

1. **Run coverage report**: `npm run test:coverage`

2. **Identify untested code** in one of your utility files

3. **Write additional tests** to cover:
   - All statements (lines of code)
   - All branches (if/else paths)
   - Edge cases and error paths

4. **Goal**: Achieve > 80% coverage for at least one utility file

✅ **Grading**:
- Coverage report shows > 80% for at least one file
- Untested branches have corresponding tests added
- Coverage report can be generated successfully

---

## Challenge: Build the Sample Project

Complete the [String Utility Library Tests](sample-project.md) project following all requirements and grading criteria.

**Estimated Time**: 60-90 minutes

✅ **Grading**:
- All tests pass
- Every function has comprehensive test coverage
- Edge cases are tested
- Code coverage > 90%
