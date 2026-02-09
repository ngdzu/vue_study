# Exercises: Integration Testing

Complete these exercises to practice integration testing.

## Exercise 1: Test Component Composition (20 minutes)

**Objective**: Test multiple components working together.

Create a ParentComponent that passes props to ChildComponent and handles emitted events. Write tests verifying communication works correctly.

✅ **Grading**: Components communicate correctly through props and events

---

## Exercise 2: Test Pinia Store Integration (20 minutes)

**Objective**: Test components with Pinia store state management.

Create components that read from and write to a Pinia store. Test that store state updates are reflected in UI.

✅ **Grading**: Store integration works, state persists across components

---

## Exercise 3: Test API Mocking (20 minutes)

**Objective**: Mock API calls and test loading/success/error states.

Create a component that fetches data from an API. Mock the fetch and test all three states (loading, success, error).

✅ **Grading**: API is mocked, all states tested

---

## Exercise 4: Test User Workflow (25 minutes)

**Objective**: Test a complete user journey across multiple components.

Create a form that validates input, submits data, shows loading state, and displays success/error messages. Write integration test for full workflow.

✅ **Grading**: Complete workflow tested, async operations handled

---

## Exercise 5: Test Composable Integration (20 minutes)

**Objective**: Test composable functions within components.

Create a composable and use it in a component. Test that composable state and methods work correctly from the component.

✅ **Grading**: Composable properly integrated and tested

---

## Challenge: Build the Sample Project

Complete the [Todo App Integration Tests](sample-project.md) project.

**Estimated Time**: 90-120 minutes

✅ **Grading**: All integration tests pass, all workflows covered
