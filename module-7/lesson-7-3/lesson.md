# Lesson 7.3: Integration Testing

## Overview

Integration testing verifies that multiple components and services work together correctly. Unlike unit tests that test components in isolation, integration tests test real user workflows across multiple components, stores, and API calls.

By the end of this lesson, you'll be able to:
- Test multiple components together
- Test component interaction with Pinia stores
- Mock and test API calls
- Test complex user workflows
- Handle async operations and loading states
- Test error scenarios and recovery

---

## What is Integration Testing?

Integration testing verifies that different parts of your application work together correctly:
- Multiple components rendering together
- Components communicating through parent-child relationships
- Components reading from and updating shared state (Pinia store)
- Async operations (API calls, timers)
- Complex user workflows

### Integration vs Unit Testing

| Aspect     | Unit Test                 | Integration Test             |
| ---------- | ------------------------- | ---------------------------- |
| Scope      | Single function/component | Multiple components/services |
| Isolation  | Fully isolated            | Uses real dependencies       |
| Speed      | Very fast                 | Slower                       |
| Confidence | Basic                     | Higher                       |
| Complexity | Simple                    | More complex                 |

---

## Testing Component Composition

### Test Parent-Child Communication

```ts
// Parent sends props to child, child emits events
const wrapper = mount(ParentComponent);

// Verify child receives props
const childWrapper = wrapper.findComponent(ChildComponent);
expect(childWrapper.props('title')).toBe('Expected');

// Trigger child event
await childWrapper.find('button').trigger('click');

// Verify parent updated
expect(wrapper.vm.items).toHaveLength(1);
```

### Test Multiple Components Together

```ts
describe('TodoList Feature', () => {
  it('should add and display todo items', async () => {
    const wrapper = mount(TodoApp);

    // Add first item
    await wrapper.find('input').setValue('Buy groceries');
    await wrapper.find('button.add-btn').trigger('click');

    // Verify item appears
    expect(wrapper.find('.todo-item').exists()).toBe(true);
    expect(wrapper.text()).toContain('Buy groceries');

    // Add second item
    await wrapper.find('input').setValue('Call doctor');
    await wrapper.find('button.add-btn').trigger('click');

    // Verify both items display
    expect(wrapper.findAll('.todo-item')).toHaveLength(2);
  });
});
```

---

## Testing Pinia Store Integration

### Mock Store in Tests

```ts
import { createPinia, setActivePinia } from 'pinia';

describe('Component with Pinia', () => {
  beforeEach(() => {
    // Create fresh store for each test
    setActivePinia(createPinia());
  });

  it('should read from and write to store', async () => {
    const wrapper = mount(CounterComponent, {
      global: { plugins: [createPinia()] }
    });

    // Verify initial store state
    expect(wrapper.text()).toContain('Count: 0');

    // Trigger action
    await wrapper.find('button').trigger('click');

    // Verify store updated
    expect(wrapper.text()).toContain('Count: 1');
  });
});
```

### Test Store State Updates

```ts
import { useCounterStore } from '@/stores/counter';

describe('Counter Store Integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should persist state across components', async () => {
    // Mount component 1
    const component1 = mount(Counter, {
      global: { plugins: [createPinia()] }
    });

    // Increment
    await component1.find('button').trigger('click');

    // Get store
    const store = useCounterStore();
    expect(store.count).toBe(1);

    // Mount component 2 with same store
    const component2 = mount(Counter, {
      global: { plugins: [store.$pinia] }
    });

    // Should show incremented value
    expect(component2.text()).toContain('Count: 1');
  });
});
```

---

## Testing API Calls

### Mock API with vitest

```ts
import { vi } from 'vitest';
import { mount } from '@vue/test-utils';
import UserList from './UserList.vue';

describe('UserList with API', () => {
  it('should fetch and display users', async () => {
    // Mock fetch
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { id: 1, name: 'John' },
          { id: 2, name: 'Jane' }
        ])
      })
    );

    const wrapper = mount(UserList);

    // Wait for component to load data
    await wrapper.vm.$nextTick();

    // Verify users display
    expect(wrapper.text()).toContain('John');
    expect(wrapper.text()).toContain('Jane');

    // Verify fetch was called
    expect(global.fetch).toHaveBeenCalledWith('/api/users');
  });

  it('should handle API errors gracefully', async () => {
    global.fetch = vi.fn(() =>
      Promise.reject(new Error('Network error'))
    );

    const wrapper = mount(UserList);
    await wrapper.vm.$nextTick();

    // Should show error message
    expect(wrapper.text()).toContain('Error loading users');
  });
});
```

### Mock Axios

```ts
import axios from 'axios';
import { vi } from 'vitest';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Integration', () => {
  it('should handle successful response', async () => {
    mockedAxios.get.mockResolvedValue({
      data: { users: [{ id: 1, name: 'John' }] }
    });

    const wrapper = mount(UserComponent);
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('John');
  });

  it('should handle error response', async () => {
    mockedAxios.get.mockRejectedValue(
      new Error('API Error')
    );

    const wrapper = mount(UserComponent);
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Error');
  });
});
```

---

## Testing Loading and Error States

### Complete User Workflow

```ts
describe('User Form Integration', () => {
  it('should show loading state and handle success', async () => {
    // Mock delayed API call
    global.fetch = vi.fn(() =>
      new Promise(resolve =>
        setTimeout(() =>
          resolve({
            ok: true,
            json: () => Promise.resolve({ success: true })
          }), 100)
      )
    );

    const wrapper = mount(UserForm);

    // Fill form
    await wrapper.find('input[name="email"]').setValue('user@example.com');
    await wrapper.find('input[name="password"]').setValue('password123');

    // Submit
    await wrapper.find('form').trigger('submit');

    // Should show loading state
    expect(wrapper.find('.loader').exists()).toBe(true);
    expect(wrapper.find('button').attributes('disabled')).toBeDefined();

    // Wait for API response
    await new Promise(r => setTimeout(r, 150));
    await wrapper.vm.$nextTick();

    // Should show success
    expect(wrapper.text()).toContain('Success');
    expect(wrapper.find('.loader').exists()).toBe(false);
  });

  it('should show error message on failure', async () => {
    global.fetch = vi.fn(() =>
      Promise.reject(new Error('Email already exists'))
    );

    const wrapper = mount(UserForm);
    await wrapper.find('form').trigger('submit');
    await wrapper.vm.$nextTick();

    // Should show error
    expect(wrapper.text()).toContain('Email already exists');
  });
});
```

---

## Testing Complex Workflows

### Multi-step User Journey

```ts
describe('Checkout Flow', () => {
  it('should complete full purchase workflow', async () => {
    const wrapper = mount(CheckoutApp, {
      global: {
        plugins: [createPinia(), router]
      }
    });

    // Step 1: Select product
    const productCard = wrapper.find('.product-card');
    await productCard.find('button.add-to-cart').trigger('click');
    expect(wrapper.text()).toContain('Cart (1)');

    // Step 2: View cart
    await wrapper.find('a.cart-link').trigger('click');
    expect(wrapper.find('.cart-items').exists()).toBe(true);

    // Step 3: Proceed to checkout
    await wrapper.find('button.checkout-btn').trigger('click');
    expect(wrapper.find('.checkout-form').exists()).toBe(true);

    // Step 4: Fill checkout details
    await wrapper.find('input[name="email"]').setValue('user@example.com');
    await wrapper.find('input[name="address"]').setValue('123 Main St');

    // Step 5: Place order
    await wrapper.find('form').trigger('submit');
    await new Promise(r => setTimeout(r, 100));

    // Should show confirmation
    expect(wrapper.text()).toContain('Order confirmed');
  });
});
```

---

## Testing Composables in Components

```ts
import { useCounter } from '@/composables/useCounter';

describe('Component with Composable', () => {
  it('should use composable correctly', async () => {
    const wrapper = mount(CounterWithComposable);

    // Composable state is initialized
    expect(wrapper.text()).toContain('Count: 0');

    // Composable methods work
    await wrapper.find('button.increment').trigger('click');
    expect(wrapper.text()).toContain('Count: 1');

    // Composable computed properties work
    expect(wrapper.text()).toContain('Is Even: false');

    await wrapper.find('button.increment').trigger('click');
    expect(wrapper.text()).toContain('Is Even: true');
  });
});
```

---

## Best Practices for Integration Testing

### 1. Test User Workflows

❌ **Bad**: Testing isolated parts
```ts
it('should call api', () => {
  // Just checking fetch was called, not user experience
});
```

✅ **Good**: Testing complete workflows
```ts
it('should fetch and display user data when user clicks profile', async () => {
  // Full user workflow: click → loading → display
});
```

### 2. Use Realistic Test Data

```ts
// ❌ Too simple
const user = { id: 1, name: 'A' };

// ✅ Realistic
const user = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  role: 'admin',
  createdAt: new Date('2024-01-01')
};
```

### 3. Test Error Paths

```ts
describe('Error Handling', () => {
  it('should show error on failed API call', () => {});
  it('should show error on validation failure', () => {});
  it('should allow retry after error', () => {});
});
```

### 4. Avoid Mocking Too Much

Avoid mocking everything—use real components where possible:

```ts
// ❌ Over-mocking
mount(UserList, {
  global: { stubs: { UserCard: true } }
});

// ✅ Test real interaction
mount(UserList);
```

---

## Key Takeaways

1. ✅ Integration tests verify multiple components work together
2. ✅ Test real user workflows, not isolated parts
3. ✅ Mock external APIs and async operations
4. ✅ Test loading, success, and error states
5. ✅ Use Pinia with real stores or fresh instances
6. ✅ Test composable integration with components
7. ✅ Keep integration tests closer to real usage
8. ✅ Balance integration tests with unit tests

---

## Next Steps

- Complete the exercises in [exercises.md](exercises.md)
- Build the sample project in [sample-project.md](sample-project.md)
- Take the quiz in [quiz.md](quiz.md)
