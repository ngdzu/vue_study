# Quiz Answers: Integration Testing

## Question 1
**What is the main difference between unit tests and integration tests?**

**Correct Answer**: B) Integration tests test multiple components working together

**Explanation**: Unit tests test single units in isolation, while integration tests verify that multiple components, services, and systems work together correctly.

---

## Question 2
**When should you use a fresh Pinia store for each test?**

**Correct Answer**: B) Before each test to isolate state

**Explanation**: Using `beforeEach(() => setActivePinia(createPinia()))` ensures each test starts with clean state, preventing tests from affecting each other.

---

## Question 3
**How do you mock a fetch API call in tests?**

**Correct Answer**: B) Replace fetch with a fake function using `vi.fn()`

**Explanation**: 
```ts
global.fetch = vi.fn(() =>
  Promise.resolve({ ok: true, json: () => Promise.resolve(data) })
);
```

---

## Question 4
**What should integration tests focus on?**

**Correct Answer**: B) Complete user workflows

**Explanation**: Integration tests should test realistic user journeys: click button → API call → loading state → display results, not just isolated implementation details.

---

## Question 5
**How do you test all three states (loading, success, error)?**

**Correct Answer**: C) Mock API to return different responses for each test

**Explanation**: Write separate tests, mocking different responses:
- Test 1: Mock successful response
- Test 2: Mock error response
- Test 3: Test loading state during promise

---

## Question 6
**When mocking an API that takes 100ms, how do you wait for it?**

**Correct Answer**: C) Use `await wrapper.vm.$nextTick()` and wait for promise

**Explanation**: You need to wait for:
1. The promise to resolve
2. Vue reactivity to update

```ts
await wrapper.find('form').trigger('submit');
await new Promise(r => setTimeout(r, 150));
await wrapper.vm.$nextTick();
```

---

## Question 7
**What is a realistic scenario in testing?**

**Correct Answer**: B) Testing code in conditions similar to actual usage

**Explanation**: Use realistic test data and simulate actual user workflows, not just testing with empty strings or minimal data.

---

## Question 8
**Should integration tests mock all dependencies?**

**Correct Answer**: D) Both B and C

**Explanation**: 
- Use real components (B) to test actual interaction
- Mock external APIs (C) to avoid network calls

---

## Question 9
**How do you test a form submission workflow?**

**Correct Answer**: B) Fill fields, trigger submit, verify success/error state

**Explanation**: Complete workflow:
1. Fill input fields
2. Trigger form submission
3. Verify loading state appears
4. Wait for async operation
5. Verify success/error message

---

## Question 10
**What does `setActivePinia(createPinia())` do?**

**Correct Answer**: B) Creates a fresh Pinia store for testing

**Explanation**: This ensures each test has a clean, isolated Pinia store instance with no shared state from other tests.
