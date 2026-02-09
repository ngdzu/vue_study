# Quiz Answers: E2E Testing with Cypress

## Question 1
**What does E2E testing verify?**

**Correct Answer**: B) Complete user workflows in real browser

**Explanation**: E2E testing simulates real user interactions in a real browser, testing the entire application flow.

---

## Question 2
**Which command navigates in Cypress?**

**Correct Answer**: D) Both B and C

**Explanation**: Both work:
- `cy.visit('/page')` - Navigate to URL
- `cy.go('back')` - Navigate browser history

---

## Question 3
**How do you find an element by test ID?**

**Correct Answer**: B) `cy.get('[data-testid="name"]')`

**Explanation**: Use CSS attribute selector to find elements with data-testid attribute.

---

## Question 4
**What does `cy.type()` do?**

**Correct Answer**: B) Types text into input field

**Explanation**: `cy.get('input').type('hello')` types "hello" into the input.

---

## Question 5
**How do you assert element contains text?**

**Correct Answer**: C) Both A and B

**Explanation**: Both approaches work:
- `cy.contains('text').should('exist')`
- `cy.get('.el').should('contain', 'text')`

---

## Question 6
**Why should you use data test IDs?**

**Correct Answer**: B) More reliable than CSS selectors

**Explanation**: Data test IDs don't change with styling/structure changes, making tests more stable.

---

## Question 7
**What timeout option does in Cypress?**

**Correct Answer**: B) How long to wait for element

**Explanation**: Timeout specifies how long Cypress waits before failing an assertion.

---

## Question 8
**How do you wait for an element to appear?**

**Correct Answer**: B) `cy.get('.el', { timeout: 5000 }).should('be.visible')`

**Explanation**: This waits up to 5 seconds for the element and assertion to pass. Don't use fixed `cy.wait()`.

---

## Question 9
**What is a flaky test?**

**Correct Answer**: B) A test that sometimes fails due to timing

**Explanation**: Flaky tests fail intermittently, usually due to timing issues. Always use proper waits instead of fixed delays.

---

## Question 10
**What should E2E tests focus on?**

**Correct Answer**: B) Complete user workflows

**Explanation**: E2E tests should test realistic user journeys: click → navigate → form fill → submit → verify result.
