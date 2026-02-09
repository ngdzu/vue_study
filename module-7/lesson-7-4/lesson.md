# Lesson 7.4: E2E Testing with Cypress

## Overview

End-to-end (E2E) testing verifies complete user workflows by testing the application from a real browser's perspective. Unlike unit and integration tests, E2E tests interact with the fully rendered application.

By the end of this lesson, you'll be able to:
- Set up Cypress for Vue applications
- Write E2E tests for user workflows
- Use Cypress selectors and commands
- Test forms, navigation, and interactions
- Debug failing tests
- Integrate Cypress with CI/CD

---

## What is E2E Testing?

E2E testing:
- Tests the entire application stack
- Uses a real browser (Chrome, Firefox, etc.)
- Interacts like a real user would
- Tests workflows across multiple pages
- Catches issues units and integration tests miss

### E2E vs Other Testing Types

| Type        | Scope               | Speed     | Confidence | Browser |
| ----------- | ------------------- | --------- | ---------- | ------- |
| Unit        | Single unit         | Very fast | Basic      | No      |
| Integration | Multiple components | Fast      | Medium     | No      |
| E2E         | Full app            | Slow      | Very high  | Yes     |

---

## Cypress Setup

### Installation

```bash
npm install -D cypress
```

### First Run

```bash
npm run cypress:open
```

This opens Cypress UI where you can create and run tests.

### Configure Cypress

Create `cypress.config.ts`:

```ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    viewportWidth: 1280,
    viewportHeight: 720,
  },
});
```

### Add npm Scripts

```json
{
  "scripts": {
    "cypress:open": "cypress open",
    "cypress:run": "cypress run",
    "cypress:run:chrome": "cypress run --browser chrome"
  }
}
```

---

## Writing E2E Tests

### Test Structure

```ts
// cypress/e2e/todo.cy.ts
describe('Todo App', () => {
  beforeEach(() => {
    cy.visit('/');  // Visit your app
  });

  it('should add a todo', () => {
    cy.get('input[placeholder="Add todo"]')
      .type('Buy groceries');
    cy.get('button:contains("Add")').click();
    cy.contains('Buy groceries').should('be.visible');
  });
});
```

### Common Cypress Commands

```ts
// Navigation
cy.visit('/');
cy.visit('/about');
cy.go('back');
cy.reload();

// Selectors
cy.get('button');           // CSS selector
cy.get('[data-testid="btn"]'); // Test ID
cy.contains('Click me');    // Text content

// Interactions
cy.get('input').type('text');
cy.get('button').click();
cy.get('form').submit();
cy.get('select').select('option');

// Assertions
cy.get('h1').should('contain', 'Title');
cy.get('.error').should('be.visible');
cy.get('input').should('have.value', 'text');
cy.get('button').should('be.disabled');

// Waiting
cy.get('.loader').should('not.exist');
cy.contains('Loaded').should('be.visible');
cy.wait(2000);
```

---

## Example: E2E Test

```ts
describe('User Signup Flow', () => {
  it('should sign up successfully', () => {
    // Visit signup page
    cy.visit('/signup');

    // Verify page loaded
    cy.get('h1').should('contain', 'Create Account');

    // Fill form
    cy.get('input[name="email"]')
      .type('user@example.com');
    cy.get('input[name="password"]')
      .type('SecurePassword123');
    cy.get('input[name="confirmPassword"]')
      .type('SecurePassword123');

    // Submit
    cy.get('button[type="submit"]').click();

    // Verify success
    cy.contains('Account created successfully')
      .should('be.visible');
    
    // Navigate to login
    cy.contains('Log in').click();
    cy.get('h1').should('contain', 'Login');
  });

  it('should show validation errors', () => {
    cy.visit('/signup');

    // Try empty submission
    cy.get('button[type="submit"]').click();

    // Verify errors show
    cy.contains('Email is required').should('be.visible');
    cy.contains('Password is required').should('be.visible');
  });
});
```

---

## Best Practices

### 1. Use Data Test IDs

```html
<!-- Component -->
<button data-testid="submit-btn">Submit</button>
```

```ts
// Test
cy.get('[data-testid="submit-btn"]').click();
```

### 2. Wait for Elements

```ts
// ❌ Bad - flaky, doesn't wait
cy.get('.modal').should('exist');

// ✅ Good - waits for element
cy.get('.modal', { timeout: 5000 }).should('be.visible');
```

### 3. Test Complete Workflows

```ts
it('should complete purchase flow', () => {
  // Add item
  cy.get('[data-testid="add-btn"]').click();
  cy.contains('Item added').should('be.visible');

  // View cart
  cy.get('[data-testid="cart-link"]').click();
  cy.get('[data-testid="cart-items"]').should('exist');

  // Checkout
  cy.get('[data-testid="checkout-btn"]').click();
  cy.get('form[data-testid="checkout-form"]').should('be.visible');

  // Complete
  cy.get('input[name="email"]').type('user@example.com');
  cy.get('[data-testid="submit"]').click();
  cy.contains('Order confirmed').should('be.visible');
});
```

---

## Key Takeaways

1. ✅ E2E tests verify complete user workflows in real browser
2. ✅ Use `cy.visit()` to navigate
3. ✅ Use `cy.get()` and `cy.contains()` to find elements
4. ✅ Use data test IDs for reliable selectors
5. ✅ Chain commands for natural readability
6. ✅ Test user behavior, not implementation
7. ✅ Wait for async operations to complete
8. ✅ Keep tests focused on single workflows

---

## Next Steps

- Complete the exercises in [exercises.md](exercises.md)
- Build the sample project in [sample-project.md](sample-project.md)
- Take the quiz in [quiz.md](quiz.md)
