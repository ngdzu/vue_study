# Quiz - Lesson 1.6: Events & Emits

Test your knowledge of Vue events and custom event communication. Answer all 30 questions.

**Passing Score**: 24/30 (80%)

---

## Questions

### 1. What is a custom event?
a) A native browser event  
b) An event emitted by a component to communicate with its parent  
c) An event that happens when data changes  
d) A keyboard event

### 2. How do you declare events in Composition API?
a) `const events = useEvents()`  
b) `const emit = defineEmits<{ /* ... */ }>()`  
c) `const emit = createEmits()`  
d) Events are automatic

### 3. What does `emit()` do?
a) Emits an HTML event  
b) Sends a custom event to the parent component  
c) Triggers a computed property  
d) Updates parent props

### 4. How do you listen to a custom event?
a) `<Component @event-name="handler" />`  
b) `<Component :on-event="handler" />`  
c) `<Component v-event="handler" />`  
d) `<Component listen:event="handler" />`

### 5. What is the purpose of v-model?
a) Validate data  
b) Create two-way data binding  
c) Display models  
d) Manage component models

### 6. For v-model to work, what must the prop be named?
a) `value`  
b) `data`  
c) `modelValue`  
d) `model`

### 7. What event must be emitted for v-model to work?
a) `update`  
b) `change`  
c) `update:modelValue`  
d) `model-updated`

### 8. What does `@click.prevent` do?
a) Prevents component from rendering  
b) Prevents the default action (like form submission)  
c) Prevents event bubbling  
d) Prevents the element from being clickable

### 9. What does `@click.stop` do?
a) Prevents the click event  
b) Prevents component updates  
c) Stops event propagation up the DOM  
d) Stops the page from rendering

### 10. How do you listen to the Enter key?
a) `@keyup="handleEnter"`  
b) `@key-enter="handleEnter"`  
c) `@keyup.enter="handleEnter"`  
d) `@enter="handleEnter"`

### 11. In an inline event handler, what is `$event`?
a) A Vue global variable  
b) The event object or event payload  
c) The component instance  
d) The DOM element

### 12. How do you emit an event with a payload?
a) `emit('event')`  
b) `emit('event', payload)`  
c) `emit({ event: 'name', data: payload })`  
d) `emit.send('event', payload)`

### 13. What is event bubbling?
a) Events creating bubbles  
b) Events propagating up through parent elements  
c) Events failing silently  
d) Events that repeat

### 14. How do you prevent event bubbling?
a) `@event="handler"`  
b) `@event.prevent`  
c) `@event.stop`  
d) `@event.bubble="false"`

### 15. Can you have multiple v-models on one component?
a) No, only one v-model allowed  
b) Yes, with different names (e.g., v-model:title)  
c) Yes, but they must have the same name  
d) Only with special syntax

### 16. What naming convention should custom events use?
a) camelCase  
b) snake_case  
c) kebab-case  
d) PascalCase

### 17. What does `@click.once` do?
a) Triggers on single click only  
b) Triggers the handler once, then removes it  
c) Prevents double-clicking  
d) Requires clicking once to activate

### 18. How do you emit multiple pieces of data?
a) `emit('event', data1, data2, data3)`  
b) `emit('event', { data1, data2, data3 })`  
c) Both a and b are correct  
d) You can only emit one piece of data

### 19. What is the difference between props and events?
a) Props go down, events go up  
b) Props are for data, events are for actions  
c) Props are read-only, events notify parents  
d) All of the above

### 20. Can a child component directly modify parent data received as a prop?
a) Yes, always  
b) No, props are read-only  
c) Only if marked as "mutable"  
d) Only with v-model

### 21. What does `@click.ctrl` do?
a) Listens for Ctrl+Click  
b) Listens for Click while Ctrl is held  
c) Both a and b  
d) Listens for a control click (right-click)

### 22. How do you create a simple two-way binding?
a) `<Component :value="data" />`  
b) `<Component :value="data" @input="data = $event" />`  
c) `<Component v-model="data" />`  
d) Both b and c work

### 23. What does the .self modifier do?
a) Listens to self-triggered events  
b) Only triggers if the event target is the element itself  
c) Triggers on the component instance  
d) Prevents self-referential events

### 24. Can you emit events with TypeScript types?
a) No, TypeScript doesn't support event types  
b) Yes, with `defineEmits<{ (e: 'event-name'): void }>()`  
c) Yes, but only with strings  
d) Only in runtime mode

### 25. What happens if you emit an event that wasn't declared?
a) It works anyway  
b) Vue throws an error in development  
c) The parent doesn't receive it  
d) It's ignored silently

### 26. How do you emit an event from within a method?
a) `emit('event-name')`  
b) `this.emit('event-name')`  
c) `this.$emit('event-name')`  
d) `$emit('event-name')`

### 27. What is the purpose of `emit('update:count', newValue)`?
a) Update a prop called 'count'  
b) Implement v-model:count pattern  
c) Update parent's count state  
d) All of the above

### 28. Can a component listen to its own emitted events?
a) Yes, always  
b) No, components can't listen to themselves  
c) Only with special syntax  
d) Only in development mode

### 29. What does the .capture modifier do?
a) Captures the event object  
b) Handles event in capture phase (going down)  
c) Captures element references  
d) Prevents event capturing

### 30. Which is correct for listening to form input?
a) `<input @change="handleChange" />`  
b) `<input @input="handleInput" />`  
c) `<input v-model="value" />`  
d) All are valid in different situations

---

## Answer Key

See [quiz-answers.md](./quiz-answers.md) for detailed explanations.
