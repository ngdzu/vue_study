# Sample Project: String Utility Library Tests

## Overview

Build a comprehensive test suite for a string utility library. This project teaches you to write tests for various utility functions covering multiple scenarios and edge cases.

## Project Structure

```
src/
  utils/
    strings.ts           # Utility functions to test
    strings.test.ts      # Your test file
```

## Utility Functions to Test

```ts
// src/utils/strings.ts

/**
 * Convert a string to title case (capitalize first letter of each word)
 */
export function toTitleCase(str: string): string {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Reverse a string
 */
export function reverseString(str: string): string {
  return str.split('').reverse().join('');
}

/**
 * Check if a string is a palindrome (ignores spaces and case)
 */
export function isPalindrome(str: string): boolean {
  const cleaned = str.replace(/\s+/g, '').toLowerCase();
  return cleaned === reverseString(cleaned);
}

/**
 * Count vowels in a string
 */
export function countVowels(str: string): number {
  return (str.match(/[aeiouAEIOU]/g) || []).length;
}

/**
 * Truncate a string to a max length and add ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (maxLength < 3) throw new Error('maxLength must be at least 3');
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Remove extra whitespace
 */
export function removeExtraSpaces(str: string): string {
  return str.trim().replace(/\s+/g, ' ');
}
```

## Test Requirements

Write comprehensive tests covering:

### 1. `toTitleCase()`
- Regular sentence with multiple words
- Single word
- Words already in different cases
- Empty string
- Strings with multiple spaces between words

### 2. `reverseString()`
- Regular string
- Single character
- Empty string
- String with spaces
- String with special characters

### 3. `isPalindrome()`
- Valid palindrome ("racecar")
- Valid palindrome with spaces ("race car")
- Non-palindrome
- Empty string
- Single character
- Case insensitivity ("RaceCar")

### 4. `countVowels()`
- String with multiple vowels
- String with no vowels
- String with only vowels
- Empty string
- Case handling (uppercase and lowercase)

### 5. `truncate()`
- String longer than max length
- String shorter than max length
- String equal to max length
- Error: maxLength < 3
- Exact length scenarios

### 6. `removeExtraSpaces()`
- Multiple spaces between words
- Leading/trailing spaces
- Tabs and newlines
- Single space (correct)
- Empty string

## Getting Started

1. Create the utility file with the functions above
2. Create a test file following the structure:

```ts
import { describe, it, expect } from 'vitest';
import { toTitleCase, reverseString, /* ... */ } from './strings';

describe('String Utilities', () => {
  describe('toTitleCase', () => {
    // Write your tests here
  });

  // More describe blocks for other functions
});
```

3. Run tests in watch mode: `npm run test`
4. Ensure all tests pass

## Grading Criteria

✅ All tests pass  
✅ Every function has at least 3 different test cases  
✅ Edge cases are covered (empty strings, special inputs)  
✅ Error handling is tested where applicable  
✅ Test names clearly describe what is being tested  
✅ Tests use proper AAA pattern  
✅ Code coverage > 90% for the utility file

## Bonus Challenges

1. **Add more utility functions** to strings.ts and test them (e.g., `capitalize()`, `slugify()`, `camelCase()`)
2. **Test error handling** - Add validation and test error scenarios
3. **Performance test** - Add a test for a function that should complete within a time limit
4. **Test with multiple data providers** - Use parameterized tests (if Vitest supports)
