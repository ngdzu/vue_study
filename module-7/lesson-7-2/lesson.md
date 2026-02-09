# Lesson 7.2: Component Testing

## Overview

Component testing verifies that Vue components render correctly, handle user interactions, and communicate with parent components through props and events. This lesson teaches you to test Vue 3 components using **@vue/test-utils** alongside Vitest.

By the end of this lesson, you'll be able to:
- Mount and render Vue components in tests
- Test component props and validation
- Simulate user interactions
- Test custom events and emits
- Test conditional rendering
- Test slot content
- Test component lifecycle

---

## What is Component Testing?

Component testing verifies that a Vue component:
- Renders correctly with given props
- Handles user interactions (clicks, input)
- Emits correct events
- Displays conditional content
- Works with slots
- Manages its state properly

### Why Test Components?

1. **UI Verification**: Ensure components render as expected
2. **Interaction Testing**: Verify click handlers, input handlers work
3. **Props Validation**: Check prop defaults and types work
4. **Event Communication**: Test parent-child communication
5. **State Management**: Verify reactive updates work correctly

---

## @vue/test-utils Basics

### What is @vue/test-utils?

A testing library specifically for Vue components that provides:
- Component mounting and rendering
- User interaction simulation
- Prop and event assertion
- Slot testing
- DOM query capabilities

### Installation

```bash
npm install -D @vue/test-utils
```

No separate configuration needed—it works with Vitest automatically.

---

## Mounting Components

### Basic Mount

```ts
import { mount } from '@vue/test-utils';
import MyComponent from './MyComponent.vue';

const wrapper = mount(MyComponent);
```

The returned `wrapper` is a component instance you can interact with and inspect.

### Mount with Props

```ts
const wrapper = mount(MyComponent, {
  props: {
    title: 'Hello',
    count: 5,
  },
});
```

### Mount with Slots

```ts
const wrapper = mount(MyComponent, {
  slots: {
    default: 'Slot content',
    header: '<h1>Header</h1>',
  },
});
```

### Mount with Global Plugins

```ts
const wrapper = mount(MyComponent, {
  global: {
    plugins: [createPinia(), router],
  },
});
```

---

## Testing Component Rendering

### Check if Element Exists

```ts
const wrapper = mount(MyComponent);

// Check if element exists
expect(wrapper.find('.button').exists()).toBe(true);
expect(wrapper.findComponent(ChildComponent).exists()).toBe(true);
```

### Check Element Content

```ts
const wrapper = mount(MyComponent);

// Text content
expect(wrapper.text()).toContain('Hello');
expect(wrapper.find('h1').text()).toBe('Title');

// HTML content
expect(wrapper.html()).toContain('<span>test</span>');
```

### Check HTML Attributes

```ts
const wrapper = mount(MyComponent);

expect(wrapper.find('button').attributes('disabled')).toBeDefined();
expect(wrapper.find('input').attributes('type')).toBe('text');
expect(wrapper.find('a').attributes('href')).toBe('/page');
```

### Check CSS Classes

```ts
const wrapper = mount(MyComponent);

expect(wrapper.find('div').classes()).toContain('active');
expect(wrapper.find('button').classes('primary')).toBe(true);
```

---

## Testing Props

### Verify Props Rendering

```ts
// Component.vue
const props = defineProps({
  message: String,
  count: Number,
});

// Test
const wrapper = mount(Component, {
  props: {
    message: 'Hello World',
    count: 42,
  },
});

expect(wrapper.text()).toContain('Hello World');
expect(wrapper.text()).toContain('42');
```

### Test Prop Defaults

```ts
const wrapper = mount(Component);
expect(wrapper.text()).toContain('Default Message'); // If default was set
```

### Update Props

```ts
const wrapper = mount(Component, {
  props: { count: 5 },
});

expect(wrapper.text()).toContain('5');

// Update prop
await wrapper.setProps({ count: 10 });

expect(wrapper.text()).toContain('10');
```

---

## Testing User Interactions

### Simulate Clicks

```ts
const wrapper = mount(Counter);

// Get button and click
await wrapper.find('button').trigger('click');

// Verify result
expect(wrapper.text()).toContain('Count: 1');
```

### Simulate Input

```ts
const wrapper = mount(SearchForm);

// Find input and set value
const input = wrapper.find('input');
await input.setValue('search term');

// Input is now updated
expect(input.element.value).toBe('search term');
```

### Simulate Form Submission

```ts
const wrapper = mount(LoginForm);

// Fill form
await wrapper.find('input[type="email"]').setValue('user@example.com');
await wrapper.find('input[type="password"]').setValue('password123');

// Submit
await wrapper.find('form').trigger('submit');

// Verify behavior
expect(wrapper.emitted()).toHaveProperty('login');
```

---

## Testing Events (Emits)

### Check if Event Was Emitted

```ts
// Component.vue
const emit = defineEmits(['click']);

const handleClick = () => {
  emit('click', { id: 1 });
};

// Test
const wrapper = mount(Component);
await wrapper.find('button').trigger('click');

expect(wrapper.emitted('click')).toBeTruthy();
```

### Check Event Payload

```ts
const wrapper = mount(DeleteButton);
await wrapper.find('button').trigger('click');

// Get emitted events
const emitted = wrapper.emitted('delete');
expect(emitted).toHaveLength(1);  // Emitted once

// Check payload
expect(emitted[0]).toEqual([{ id: 1 }]);
```

### Multiple Event Calls

```ts
const wrapper = mount(Counter);

// Click button 3 times
await wrapper.find('button').trigger('click');
await wrapper.find('button').trigger('click');
await wrapper.find('button').trigger('click');

// Check it was called 3 times
const emitted = wrapper.emitted('increment');
expect(emitted).toHaveLength(3);
expect(emitted[2]).toEqual([]);  // Third call payload
```

---

## Testing Conditional Rendering

### v-if / v-show

```ts
// Component.vue
<div v-if="showMessage">Message content</div>

// Test
const wrapper = mount(Component);
expect(wrapper.find('.message').exists()).toBe(false);

await wrapper.setData({ showMessage: true });
expect(wrapper.find('.message').exists()).toBe(true);
```

### Testing State Changes

```ts
const wrapper = mount(StatusBadge);

// Initially shows "Pending"
expect(wrapper.text()).toContain('Pending');

// User clicks approve
await wrapper.find('.approve-btn').trigger('click');

// Now shows "Approved"
expect(wrapper.text()).toContain('Approved');
```

---

## Testing Slots

### Default Slot

```ts
// Component.vue
<div class="card">
  <slot></slot>
</div>

// Test
const wrapper = mount(Card, {
  slots: {
    default: 'Slot Content Here',
  },
});

expect(wrapper.text()).toContain('Slot Content Here');
```

### Named Slots

```ts
const wrapper = mount(LayoutComponent, {
  slots: {
    header: '<h1>Header</h1>',
    sidebar: '<nav>Navigation</nav>',
    default: '<main>Main Content</main>',
  },
});

expect(wrapper.find('h1').exists()).toBe(true);
expect(wrapper.find('nav').exists()).toBe(true);
expect(wrapper.text()).toContain('Main Content');
```

### Scoped Slots

```ts
const wrapper = mount(ListComponent, {
  slots: {
    default: '<template #default="{ item }">{{ item.name }}</template>',
  },
});

// Verify slot receives data correctly
expect(wrapper.text()).toContain('Item Name');
```

---

## Complete Component Test Example

```ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TodoItem from './TodoItem.vue';

describe('TodoItem', () => {
  it('should render todo item with text', () => {
    const wrapper = mount(TodoItem, {
      props: {
        todo: { id: 1, text: 'Buy groceries', done: false },
      },
    });

    expect(wrapper.text()).toContain('Buy groceries');
  });

  it('should mark item as completed when checkbox clicked', async () => {
    const wrapper = mount(TodoItem, {
      props: {
        todo: { id: 1, text: 'Buy groceries', done: false },
      },
    });

    // Initially not checked
    const checkbox = wrapper.find('input[type="checkbox"]');
    expect(checkbox.element.checked).toBe(false);

    // Click checkbox
    await checkbox.trigger('change');

    // Should emit update event
    expect(wrapper.emitted('update')).toBeTruthy();
  });

  it('should emit delete event when delete button clicked', async () => {
    const wrapper = mount(TodoItem, {
      props: {
        todo: { id: 1, text: 'Buy groceries', done: false },
      },
    });

    await wrapper.find('.delete-btn').trigger('click');

    const emitted = wrapper.emitted('delete');
    expect(emitted).toHaveLength(1);
    expect(emitted[0]).toEqual([1]);  // Item id
  });

  it('should apply completed class when todo is done', async () => {
    const wrapper = mount(TodoItem, {
      props: {
        todo: { id: 1, text: 'Buy groceries', done: false },
      },
    });

    expect(wrapper.classes()).not.toContain('completed');

    await wrapper.setProps({
      todo: { id: 1, text: 'Buy groceries', done: true },
    });

    expect(wrapper.classes()).toContain('completed');
  });
});
```

---

## Best Practices for Component Testing

### 1. Test User Behavior, Not Implementation

❌ **Bad**: Testing component internals
```ts
it('should set count to 1', () => {
  wrapper.vm.count = 1;
  expect(wrapper.vm.count).toBe(1);
});
```

✅ **Good**: Testing visible behavior
```ts
it('should increment count when button clicked', async () => {
  await wrapper.find('button').trigger('click');
  expect(wrapper.text()).toContain('Count: 1');
});
```

### 2. Test Props Validation

```ts
it('should render with default props', () => {
  const wrapper = mount(Component);
  // Verify defaults work
});

it('should accept custom props', () => {
  const wrapper = mount(Component, {
    props: { title: 'Custom' },
  });
  expect(wrapper.text()).toContain('Custom');
});
```

### 3. Test All Event Paths

```ts
describe('DeleteButton', () => {
  it('should emit delete when confirm clicked', async () => {
    const wrapper = mount(DeleteButton);
    await wrapper.find('.confirm-btn').trigger('click');
    expect(wrapper.emitted('delete')).toBeTruthy();
  });

  it('should not emit delete when cancel clicked', async () => {
    const wrapper = mount(DeleteButton);
    await wrapper.find('.cancel-btn').trigger('click');
    expect(wrapper.emitted('delete')).toBeFalsy();
  });
});
```

### 4. Test Error States

```ts
it('should show error message when invalid', async () => {
  const wrapper = mount(Form);
  await wrapper.find('input').setValue('');
  await wrapper.find('form').trigger('submit');
  
  expect(wrapper.text()).toContain('Required field');
});
```

---

## Key Takeaways

1. ✅ Use `mount()` to render components in tests
2. ✅ Test props passing and rendering
3. ✅ Simulate user interactions with `trigger()` and `setValue()`
4. ✅ Test event emissions with `emitted()`
5. ✅ Test conditional rendering by checking element existence
6. ✅ Test slots with the `slots` option
7. ✅ Test user behavior, not implementation details
8. ✅ Use `async/await` for interactions that trigger reactivity

---

## Next Steps

- Complete the exercises in [exercises.md](exercises.md)
- Build the sample project in [sample-project.md](sample-project.md)
- Take the quiz in [quiz.md](quiz.md) to assess your understanding
- Review [glossary.md](glossary.md) for any unfamiliar terms
