# Glossary - Component Testing

## Wrapper

**Definition**: The object returned from `mount()` that represents the mounted component and provides methods to interact with and inspect it.

**Example**:
```ts
const wrapper = mount(MyComponent);
wrapper.find('.button');  // Query wrapper
```

---

## Mount

**Definition**: A function that renders a Vue component in a testing environment, returning a wrapper object for inspection and interaction.

**Example**: `const wrapper = mount(MyComponent, { props: {...} });`

---

## Props

**Definition**: Data passed from parent to child component, used to configure component behavior.

**Example**:
```ts
mount(MyComponent, {
  props: { title: 'Hello', count: 5 }
});
```

---

## Emit / Custom Event

**Definition**: A component sending data back to its parent component using `emit()`.

**Example**: A button component emits a `click` event with payload.

---

## Slot

**Definition**: A placeholder in a component template where parent can pass content.

**Example**: `<div><slot></slot></div>` receives content passed in.

---

## Named Slot

**Definition**: A slot with a specific name, allowing multiple slots in one component.

**Example**: `<slot name="header">` receives content from `slots: { header: ... }`

---

## Scoped Slot

**Definition**: A slot that receives data from the component to render it.

**Example**: A list component passes each item to its slot for rendering.

---

## Trigger

**Definition**: A method on wrapper to simulate user interactions like clicks or form submissions.

**Example**: `await wrapper.find('button').trigger('click');`

---

## SetValue

**Definition**: A method to set the value of an input element in tests.

**Example**: `await wrapper.find('input').setValue('text');`

---

## SetProps

**Definition**: A method to update component props in tests, triggering reactivity.

**Example**: `await wrapper.setProps({ count: 10 });`

---

## Emitted

**Definition**: A method that returns all emitted events from a component during test execution.

**Example**: `wrapper.emitted('click')` returns array of all click events emitted.

---

## Find

**Definition**: A method to query and return a DOM element matching a CSS selector.

**Example**: `wrapper.find('.button')` returns the button element.

---

## FindComponent

**Definition**: A method to find a child component by name or constructor.

**Example**: `wrapper.findComponent(ChildComponent)` returns the child component.

---

## Exists

**Definition**: A method that returns true if an element exists in the DOM.

**Example**: `expect(wrapper.find('.button').exists()).toBe(true);`

---

## Text

**Definition**: A method that returns the text content of an element.

**Example**: `expect(wrapper.text()).toContain('Hello');`

---

## Html

**Definition**: A method that returns the HTML content of an element.

**Example**: `expect(wrapper.html()).toContain('<span>');`

---

## Classes

**Definition**: A method that returns CSS classes applied to an element.

**Example**: `expect(wrapper.find('div').classes()).toContain('active');`

---

## Attributes

**Definition**: A method that returns HTML attributes of an element.

**Example**: `expect(wrapper.find('button').attributes('disabled')).toBeDefined();`

---

## @vue/test-utils

**Definition**: The official testing library for Vue components, providing mount and assertion utilities.

---

## User Interaction Testing

**Definition**: Tests that simulate real user actions like clicking, typing, form submission.

---

## Props Validation

**Definition**: Testing that component props work correctly with different values and types.

---

## Event Testing

**Definition**: Verifying that components emit correct events with correct payloads.

---

## Conditional Rendering

**Definition**: Testing that components show/hide content based on conditions (v-if, v-show).

---

## Async/Await in Tests

**Definition**: Using async/await to wait for Vue reactivity and DOM updates after interactions.

**Example**: `await wrapper.find('button').trigger('click');`

---

## Component Stub

**Definition**: A mock or simplified version of a child component used in tests to isolate the component being tested.

---

## Global Stubs

**Definition**: Configuration option to stub common components globally in all tests.

**Example**:
```ts
mount(Component, {
  global: { stubs: { ChildComponent: true } }
});
```

---

## DOM Query

**Definition**: Methods like `find()`, `findAll()`, `findComponent()` to search component DOM.

---

## Reactivity Testing

**Definition**: Verifying that component updates correctly when data changes or props update.
