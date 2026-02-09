# Quiz Answers: Component Testing

## Question 1
**What does `mount()` do in @vue/test-utils?**

**Correct Answer**: B) Renders a component in a testing environment

**Explanation**: `mount()` is the primary function in @vue/test-utils that renders a Vue component in a test environment and returns a wrapper object for interaction and inspection.

---

## Question 2
**What does the `mount()` function return?**

**Correct Answer**: B) A wrapper object used to interact with the component

**Explanation**: The wrapper object provides methods like `find()`, `trigger()`, `emitted()`, and more to interact with and test the mounted component.

---

## Question 3
**How do you pass props to a mounted component?**

**Correct Answer**: B) Using `props: { key: value }` in the options object

**Explanation**: 
```ts
mount(MyComponent, {
  props: { title: 'Hello', count: 5 }
});
```

---

## Question 4
**What method checks if a DOM element exists?**

**Correct Answer**: B) `find().exists()`

**Explanation**: The `exists()` method returns `true` or `false` indicating if an element is in the DOM.
```ts
expect(wrapper.find('.button').exists()).toBe(true);
```

---

## Question 5
**How do you simulate a button click in a test?**

**Correct Answer**: B) `await wrapper.find('button').trigger('click')`

**Explanation**: The `trigger()` method simulates user events. Use `async/await` to wait for reactivity.

---

## Question 6
**What does `emit()` do in a component?**

**Correct Answer**: B) Sends data back to parent component

**Explanation**: Custom events (emits) allow child components to communicate with parents.

---

## Question 7
**How do you check if an event was emitted?**

**Correct Answer**: A) `wrapper.emitted('eventName')`

**Explanation**: `emitted()` returns all instances an event was emitted, or undefined if never emitted.

---

## Question 8
**What does `wrapper.emitted('click')[0]` return?**

**Correct Answer**: B) The first event payload

**Explanation**: `emitted('click')` returns an array of all click events. Index `[0]` gets the first one.

---

## Question 9
**How do you set the value of an input field in a test?**

**Correct Answer**: B) `await wrapper.find('input').setValue('text')`

**Explanation**: `setValue()` sets input value and triggers reactivity. Use `async/await` to wait for updates.

---

## Question 10
**What are slots in Vue components?**

**Correct Answer**: B) Placeholders where parent can pass content

**Explanation**: Slots allow parent components to inject content into child components.

---

## Question 11
**How do you pass slot content when mounting a component?**

**Correct Answer**: A) `mount(Component, { slots: { default: 'content' } })`

**Explanation**: The `slots` option provides content for component slots during testing.

---

## Question 12
**What does `wrapper.text()` return?**

**Correct Answer**: B) Text content of component

**Explanation**: `text()` returns all text content without HTML tags.
```ts
expect(wrapper.text()).toContain('Hello');
```

---

## Question 13
**What does `wrapper.html()` return?**

**Correct Answer**: C) HTML markup of component

**Explanation**: `html()` returns the complete HTML including tags and attributes.

---

## Question 14
**How do you get CSS classes applied to an element?**

**Correct Answer**: A) `wrapper.find('.btn').classes()`

**Explanation**: The `classes()` method returns an array of class names.

---

## Question 15
**What does `wrapper.classes('active')` do?**

**Correct Answer**: B) Checks if element has active class

**Explanation**: `classes('active')` returns `true` or `false` if the class is present.

---

## Question 16
**How do you update a prop on a mounted component?**

**Correct Answer**: B) `await wrapper.setProps({ propName: value })`

**Explanation**: `setProps()` updates props and triggers reactivity. Use `async/await` for updates.

---

## Question 17
**What does `findComponent()` do?**

**Correct Answer**: A) Finds child component by name

**Explanation**: `findComponent()` finds Vue components, while `find()` finds DOM elements.

---

## Question 18
**Why should you use `async/await` in component tests?**

**Correct Answer**: B) To wait for Vue reactivity and DOM updates

**Explanation**: Vue updates are asynchronous, so `async/await` ensures all updates complete before assertions.

---

## Question 19
**What is a named slot?**

**Correct Answer**: A) A slot with a name attribute for specific content areas

**Explanation**: Named slots allow multiple content areas in a component.
```vue
<slot name="header"></slot>
<slot name="body"></slot>
```

---

## Question 20
**What should you test in a component?**

**Correct Answer**: B) User visible behavior, props, events, rendering

**Explanation**: Test what users see and interact with:
- Does it render correctly?
- Do props work?
- Do clicks and inputs work?
- Do events emit correctly?
- Does conditional content show/hide?

Not implementation details or internal variables.
