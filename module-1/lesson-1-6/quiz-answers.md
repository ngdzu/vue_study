# Quiz Answers - Lesson 1.6: Events & Emits

Detailed explanations for all quiz questions.

---

## 1. What is a custom event?
**Answer: b) An event emitted by a component to communicate with its parent**

Custom events are user-defined events that allow child components to notify parents of actions or state changes.

```ts
const emit = defineEmits<{
  (e: 'close'): void
}>()

emit('close')  // Send message to parent
```

---

## 2. How do you declare events in Composition API?
**Answer: b) `const emit = defineEmits<{ /* ... */ }>()`**

`defineEmits` is the standard way to declare custom events with TypeScript support.

```ts
const emit = defineEmits<{
  (e: 'submit', data: FormData): void
  (e: 'cancel'): void
}>()
```

---

## 3. What does `emit()` do?
**Answer: b) Sends a custom event to the parent component**

Emit triggers a custom event that the parent can listen to.

```ts
const handleSave = () => {
  emit('save')  // Tell parent something happened
}
```

---

## 4. How do you listen to a custom event?
**Answer: a) `<Component @event-name="handler" />`**

The `@` directive (shorthand for `v-on`) listens to custom events.

```ts
<ChildComponent @close="handleClose" />
```

---

## 5. What is the purpose of v-model?
**Answer: b) Create two-way data binding**

v-model creates bidirectional binding between parent and child components.

```ts
<Counter v-model="count" />
<!-- Expands to: :modelValue="count" @update:modelValue="count = $event" -->
```

---

## 6. For v-model to work, what must the prop be named?
**Answer: c) `modelValue`**

v-model uses `modelValue` as the special prop name.

```ts
const props = defineProps<{
  modelValue: string
}>()
```

---

## 7. What event must be emitted for v-model to work?
**Answer: c) `update:modelValue`**

v-model expects this specific event name to work correctly.

```ts
emit('update:modelValue', newValue)
```

---

## 8. What does `@click.prevent` do?
**Answer: b) Prevents the default action (like form submission)**

The `.prevent` modifier calls `preventDefault()` on the event.

```ts
<form @submit.prevent="handleSubmit">
  <!-- Form won't reload the page -->
</form>
```

---

## 9. What does `@click.stop` do?
**Answer: c) Stops event propagation up the DOM**

The `.stop` modifier prevents event bubbling to parent elements.

```ts
<div @click="handleDiv">
  <button @click.stop="handleButton">
    <!-- Won't bubble to parent div -->
  </button>
</div>
```

---

## 10. How do you listen to the Enter key?
**Answer: c) `@keyup.enter="handleEnter"`**

Key modifiers specify which key should trigger the handler.

```ts
<input @keyup.enter="handleSubmit" />
```

---

## 11. In an inline event handler, what is `$event`?
**Answer: b) The event object or event payload**

`$event` provides access to the event details or custom event data.

```ts
<input @input="text = $event.target.value" />
<Modal @close="handleClose($event)" />
```

---

## 12. How do you emit an event with a payload?
**Answer: b) `emit('event', payload)`**

Pass data as arguments after the event name.

```ts
emit('submit', { name: 'Alice', email: 'alice@example.com' })
```

---

## 13. What is event bubbling?
**Answer: b) Events propagating up through parent elements**

Events naturally flow up the DOM tree from child to parent.

```
Button (event fires)
  ↓
Container (receives event)
  ↓
Parent (receives event)
```

---

## 14. How do you prevent event bubbling?
**Answer: c) `@event.stop`**

The `.stop` modifier stops propagation to parent listeners.

```ts
@click.stop="handleClick"
```

---

## 15. Can you have multiple v-models on one component?
**Answer: b) Yes, with different names (e.g., v-model:title)**

Multiple v-models use update modifiers for different properties.

```ts
<Modal v-model="isOpen" v-model:title="title" />
```

---

## 16. What naming convention should custom events use?
**Answer: c) kebab-case**

Custom events follow kebab-case naming for consistency with HTML.

```ts
// In script
emit('item-selected')
emit('modal-closed')

// In template
@item-selected="handler"
@modal-closed="handler"
```

---

## 17. What does `@click.once` do?
**Answer: b) Triggers the handler once, then removes it**

The handler only fires on the first occurrence, then automatically unattaches.

```ts
<button @click.once="handleClick">Click me once</button>
```

---

## 18. How do you emit multiple pieces of data?
**Answer: c) Both a and b are correct**

You can pass multiple arguments or an object with all data.

```ts
// Multiple arguments
emit('search', query, filters)

// Object (often clearer)
emit('submit', { name, email, message })
```

---

## 19. What is the difference between props and events?
**Answer: d) All of the above**

Props are one-way down, events are one-way up, creating complete bidirectional communication.

```
Parent (props) → Child
Parent ← Child (events)
```

---

## 20. Can a child component directly modify parent data received as a prop?
**Answer: b) No, props are read-only**

Props must never be mutated. Use events to ask parent to update.

```ts
// ❌ Wrong
props.count++

// ✅ Right
emit('update:count', props.count + 1)
```

---

## 21. What does `@click.ctrl` do?
**Answer: c) Both a and b**

System modifiers trigger only when the specified key is held during the event.

```ts
<button @click.ctrl="handleCtrlClick">
  Requires Ctrl key
</button>
```

---

## 22. How do you create a simple two-way binding?
**Answer: d) Both b and c work**

Both manual prop+event and v-model shorthand create two-way binding.

```ts
// Manual
<Input :value="data" @input="data = $event" />

// With v-model
<Input v-model="data" />
```

---

## 23. What does the .self modifier do?
**Answer: b) Only triggers if the event target is the element itself**

The `.self` modifier ignores events from child elements.

```ts
<div @click.self="handleClick">
  <!-- Handles div clicks, not child clicks -->
</div>
```

---

## 24. Can you emit events with TypeScript types?
**Answer: b) Yes, with `defineEmits<{ (e: 'event-name'): void }>()`**

TypeScript generics provide type safety for emitted events.

```ts
const emit = defineEmits<{
  (e: 'submit', data: FormData): void
}>()
```

---

## 25. What happens if you emit an event that wasn't declared?
**Answer: b) Vue throws an error in development**

TypeScript will catch undeclared events at compile time, and Vue warns in dev mode.

```ts
const emit = defineEmits<{
  (e: 'save'): void
}>()

emit('delete')  // ❌ Error: not declared
```

---

## 26. How do you emit an event from within a method?
**Answer: a) `emit('event-name')`**

With `<script setup>`, `emit` is automatically available in the scope.

```ts
<script setup lang="ts">
const emit = defineEmits<{ (e: 'action'): void }>()

const handleClick = () => {
  emit('action')
}
</script>
```

---

## 27. What is the purpose of `emit('update:count', newValue)`?
**Answer: d) All of the above**

This pattern implements v-model:count, allowing two-way binding of count.

```ts
<Counter v-model:count="myCount" />
```

---

## 28. Can a component listen to its own emitted events?
**Answer: b) No, components can't listen to themselves**

Custom events are for parent-child communication, not self-listening.

---

## 29. What does the .capture modifier do?
**Answer: b) Handles event in capture phase (going down)**

Normally events bubble up; capture handles them going down the tree.

```ts
@click.capture="handler"
```

---

## 30. Which is correct for listening to form input?
**Answer: d) All are valid in different situations**

Different events serve different purposes:
- `@change` - fires after user finishes editing
- `@input` - fires on every keystroke
- `v-model` - two-way binding combining both

```ts
<input @change="handleChange" />      <!-- After edit complete -->
<input @input="handleInput" />         <!-- On every character -->
<input v-model="value" />              <!-- Two-way binding -->
```

---

## Scoring Guide

- **27-30 correct (90-100%)**: Excellent! You've mastered events and emits.
- **24-26 correct (80-89%)**: Great job! You understand the core patterns.
- **20-23 correct (67-79%)**: Good progress. Review the missed topics.
- **Below 20 (< 67%)**: Review the lesson material and try again.

---

## Common Misconceptions

### 1. v-model can use any prop name
**Wrong**: v-model specifically requires `modelValue` prop.

**Correct**: Use `modelValue` for default v-model, or `v-model:propName` for others.

### 2. Custom events bubble like native events
**Wrong**: Custom Vue events are component-specific, not DOM events.

**Correct**: Custom events only communicate parent ↔ child, not through siblings.

### 3. Props can be mutated through events
**Wrong**: Props should never be mutated, only parent state.

**Correct**: Child emits event, parent receives it and updates its own state.

### 4. You need to use 'update:' prefix for all events
**Wrong**: 'update:' is only for v-model pattern.

**Correct**: Use any kebab-case name for custom events (close, submit, etc.)

### 5. Event modifiers work the same everywhere
**Wrong**: Some modifiers only work on specific events.

**Correct**: Key modifiers only work with keyboard events, mouse modifiers with mouse events.
