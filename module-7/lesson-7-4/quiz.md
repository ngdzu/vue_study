# Quiz: E2E Testing with Cypress

**Instructions**: Answer the following questions. Aim for 80%+.

---

## Question 1
What does E2E testing verify?
- A) Single functions only
- B) Complete user workflows in real browser
- C) Component props
- D) TypeScript types

**Answer**: B

---

## Question 2
Which command navigates in Cypress?
- A) `cy.navigate()`
- B) `cy.visit()`
- C) `cy.go()`
- D) Both B and C

**Answer**: D

---

## Question 3
How do you find an element by test ID?
- A) `cy.get('.test-id')`
- B) `cy.get('[data-testid="name"]')`
- C) `cy.testid('name')`
- D) `cy.find('#test-id')`

**Answer**: B

---

## Question 4
What does `cy.type()` do?
- A) Changes element type
- B) Types text into input field
- C) Checks type errors
- D) Creates new element

**Answer**: B

---

## Question 5
How do you assert element contains text?
- A) `cy.contains('text').should('exist')`
- B) `cy.get('.el').should('contain', 'text')`
- C) Both A and B
- D) `cy.assert('text')`

**Answer**: C

---

## Question 6
Why should you use data test IDs?
- A) They're required
- B) More reliable than CSS selectors
- C) Faster tests
- D) Better styling

**Answer**: B

---

## Question 7
What timeout option does in Cypress?
- A) Stops the test
- B) How long to wait for element
- C) Time limit for test
- D) Browser timeout

**Answer**: B

---

## Question 8
How do you wait for an element to appear?
- A) `cy.wait(1000)`
- B) `cy.get('.el', { timeout: 5000 }).should('be.visible')`
- C) Both A and B
- D) Tests wait automatically

**Answer**: B

---

## Question 9
What is a flaky test?
- A) A test that always fails
- B) A test that sometimes fails due to timing
- C) A test that's well-written
- D) A test without assertions

**Answer**: B

---

## Question 10
What should E2E tests focus on?
- A) Implementation details
- B) Complete user workflows
- C) Component internals
- D) Function outputs

**Answer**: B
