# Quiz: Integration Testing

**Instructions**: Answer the following questions. Aim for 80%+.

---

## Question 1
What is the main difference between unit tests and integration tests?
- A) Integration tests are faster
- B) Integration tests test multiple components working together
- C) Unit tests don't use Vitest
- D) Integration tests don't check assertions

**Answer**: B

---

## Question 2
When should you use a fresh Pinia store for each test?
- A) Never, reuse the same store
- B) Before each test to isolate state
- C) Only for unit tests
- D) Only for E2E tests

**Answer**: B

---

## Question 3
How do you mock a fetch API call in tests?
- A) Prevent fetch from running
- B) Replace fetch with a fake function using `vi.fn()`
- C) Skip the test
- D) Use real API calls

**Answer**: B

---

## Question 4
What should integration tests focus on?
- A) Implementation details
- B) Complete user workflows
- C) Internal state variables
- D) Component file sizes

**Answer**: B

---

## Question 5
How do you test all three states (loading, success, error)?
- A) Run test three times
- B) Write three separate tests
- C) Mock API to return different responses for each test
- D) Use `vi.skip()`

**Answer**: C

---

## Question 6
When mocking an API that takes 100ms, how do you wait for it?
- A) Don't wait, tests run instantly
- B) Use `setTimeout` manually
- C) Use `await wrapper.vm.$nextTick()` and wait for promise
- D) Add `sleep(1000)` to test

**Answer**: C

---

## Question 7
What is a realistic scenario in testing?
- A) Testing with empty strings only
- B) Testing code in conditions similar to actual usage
- C) Testing only successful paths
- D) Testing with no data

**Answer**: B

---

## Question 8
Should integration tests mock all dependencies?
- A) Yes, always mock everything
- B) No, use real components where possible
- C) Only mock external APIs
- D) Both B and C

**Answer**: D

---

## Question 9
How do you test a form submission workflow?
- A) Skip form testing
- B) Fill fields, trigger submit, verify success/error state
- C) Only check if form exists
- D) Never test forms

**Answer**: B

---

## Question 10
What does `setActivePinia(createPinia())` do?
- A) Starts the app
- B) Creates a fresh Pinia store for testing
- C) Saves store to disk
- D) Clears store cache

**Answer**: B
