# Glossary - Lesson 1.6: Events & Emits

## Core Concepts

### Event
A signal sent from one component to another (or from user interaction) to communicate that something happened.

**Example:**
```ts
// Native event (from DOM)
<button @click="handleClick">Click</button>

// Custom event (from component)
<Modal @close="handleClose" />
```

### Custom Event
User-defined event specific to a component, distinct from native DOM events.

**Example:**
```ts
const emit = defineEmits<{
  (e: 'save'): void
}>()
```

### defineEmits
Composition API function to declare which events a component can emit.

**Example:**
```ts
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: FormData): void
}>()
```

### Emit
To send/dispatch a custom event from a child component to its parent.

**Example:**
```ts
const handleSave = () => {
  emit('save', formData)
}
```

---

## Event Communication

### Event Communication
Mechanism for child components to communicate with parent components through custom events.

**Example:**
```
Parent (listens)
   ↑
Child (emits)
```

### Event Flow
The direction and path that events travel through component hierarchy.

**Example:**
```
Button emits 'click' → List item catches it → Parent handles it
```

### Event Payload
Data passed along with an event emission.

**Example:**
```ts
emit('submit', { name: 'Alice', email: 'alice@example.com' })  // Object is payload
```

---

## Event Handling

### @directive
Shorthand for `v-on` used to listen to events in templates.

**Example:**
```ts
<button @click="handleClick" />
<Modal @close="handleClose" />
```

### v-on Directive
Full syntax for listening to events (rarely used, @ is preferred).

**Example:**
```ts
<button v-on:click="handleClick" />
```

### Event Handler
A function that runs when an event is triggered.

**Example:**
```ts
const handleClick = () => {
  console.log('Clicked!')
}
```

### Inline Handler
Handling events directly in template without separate method.

**Example:**
```ts
<button @click="count++" />
<Modal @close="isOpen = false" />
```

---

## Event Modifiers

### Event Modifier
Special suffix on `@` directive that modifies event behavior.

**Example:**
```ts
@click.stop        // Stop propagation
@keyup.enter       // Only trigger on Enter
@click.prevent     // Prevent default action
```

### .stop Modifier
Stops event propagation up the DOM tree.

**Example:**
```ts
<div @click="handleDivClick">
  <button @click.stop="handleButtonClick">
    Won't bubble to div
  </button>
</div>
```

### .prevent Modifier
Calls `preventDefault()` on the event.

**Example:**
```ts
<form @submit.prevent="handleSubmit">
  <!-- Prevents page reload on submit -->
</form>
```

### Key Modifier
Triggers handler only for specific keyboard keys.

**Example:**
```ts
@keyup.enter      // Enter key
@keydown.space    // Space key
@keyup.esc        // Escape key
```

### System Modifier
Triggers handler only with specific modifier keys held.

**Example:**
```ts
@click.ctrl       // Ctrl+Click
@click.shift      // Shift+Click
@click.alt        // Alt+Click
@click.meta       // Cmd/Meta+Click (macOS)
```

### Mouse Button Modifier
Specifies which mouse button triggered the event.

**Example:**
```ts
@click.left       // Left mouse button
@click.right      // Right mouse button
@click.middle     // Middle mouse button
```

---

## Two-Way Binding

### v-model
Directive that creates two-way binding between component and parent.

**Example:**
```ts
<Counter v-model="count" />
<!-- Equivalent to: -->
<Counter :modelValue="count" @update:modelValue="count = $event" />
```

### modelValue Prop
Special prop name used by v-model for two-way binding.

**Example:**
```ts
const props = defineProps<{
  modelValue: string  // Required for v-model
}>()
```

### update:modelValue Event
Special event emitted to update the v-model binding.

**Example:**
```ts
emit('update:modelValue', newValue)
```

### Two-Way Binding
Data binding that flows both directions (parent ↔ child).

**Example:**
```ts
<Input v-model="email" />
<!-- Parent updates child's value -->
<!-- Child updates parent's value -->
```

### Multiple v-models
Using v-model for multiple properties with different names.

**Example:**
```ts
<Modal v-model="message" v-model:isOpen="open" />
```

---

## Event Naming

### Event Name
The identifier for a custom event (usually kebab-case for custom events).

**Example:**
```ts
emit('save')
emit('update-item')
emit('form-submit')
```

### kebab-case
Naming convention with hyphens, used for custom Vue events.

**Example:**
```ts
@item-selected
@modal-close
@form-submit
```

### camelCase
Naming convention for JavaScript/TypeScript (used in script).

**Example:**
```ts
defineEmits<{
  (e: 'itemSelected'): void  // camelCase in TypeScript
}>()

// Used as kebab-case in template:
@item-selected="handler"
```

---

## Event Bubbling

### Event Bubbling
Events propagate up through parent elements.

**Example:**
```
Button clicked
  ↓
Container receives event
  ↓
Parent receives event
```

### Propagation
The process of events traveling through DOM hierarchy.

**Example:**
```ts
// Click on button propagates to parent divs
<div @click="handleDiv">
  <button @click="handleButton" />
</div>
```

### Event Target
The element where the event originally occurred.

**Example:**
```ts
const handleClick = (e: Event) => {
  const target = e.target  // The clicked element
}
```

### .self Modifier
Only triggers if event target is the element itself (not children).

**Example:**
```ts
<div @click.self="handleClick">
  <!-- Handles div clicks, not child clicks -->
</div>
```

---

## Advanced Patterns

### Modal Pattern
Common UI pattern where custom events communicate dialog state.

**Example:**
```ts
<Modal @close="showModal = false" @confirm="handleConfirm" />
```

### Form Input Pattern
Component emits value updates and validation events.

**Example:**
```ts
<FormInput v-model="email" @blur="validateEmail" />
```

### List Item Pattern
Items emit select/delete events handled by parent.

**Example:**
```ts
<ListItem @select="selectItem" @delete="deleteItem" />
```

### Dropdown Pattern
Dropdown emits selection changes via v-model.

**Example:**
```ts
<Dropdown v-model="selectedOption" />
```

---

## Event Flow & Bubbling

### Capture Phase
First phase of event processing, events go down the tree.

**Example:**
```ts
@click.capture="handleCapture"  // Handles during capture phase
```

### Bubbling Phase
Second phase where events bubble up the tree.

**Example:**
```ts
@click="handle"  // Default bubbling phase
```

### .once Modifier
Event handler triggers only once, then removes itself.

**Example:**
```ts
<button @click.once="handleClick">Click me once</button>
```

### Custom Event Bubbling
Custom Vue events don't bubble like native events - they're specific to component communication.

**Example:**
```ts
// This does NOT bubble like native events
const emit = defineEmits<{
  (e: 'custom-event'): void
}>()
```

---

## Anti-Patterns

### Prop Mutation via Event
Incorrectly attempting to mutate props through event handlers.

**Anti-Pattern:**
```ts
// ❌ Wrong
const handleUpdate = (value: string) => {
  props.data = value  // Mutating prop!
}
```

### Silent Failures
Events that fail without clear error messages or logging.

**Anti-Pattern:**
```ts
// ❌ Bad: No way to know event was missed
emit('randomEvent')
```

### Inconsistent Event Names
Using different naming styles for similar events.

**Anti-Pattern:**
```ts
// ❌ Inconsistent
emit('itemSelected')
emit('item-delete')
emit('ITEM_UPDATE')
```

### Incorrect v-model Setup
Using wrong prop/event names for v-model.

**Anti-Pattern:**
```ts
// ❌ Wrong: Not named modelValue
const props = defineProps<{ value: string }>()
emit('update:value', newValue)
```

---

## Best Practices

### Event Declaration
Always declare events with `defineEmits` for type safety.

**Best Practice:**
```ts
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: FormData): void
}>()
```

### Event Documentation
Document what each event means and when it's triggered.

**Best Practice:**
```ts
/**
 * Emits:
 * - close: Fired when user dismisses the modal
 * - confirm: Fired when user confirms the action
 */
```

### Specific Event Names
Use descriptive, specific names for custom events.

**Best Practice:**
```ts
emit('modal-close')
emit('form-submit')
emit('item-delete')
```

### Event Handler Organization
Group related event handlers together.

**Best Practice:**
```ts
// UI event handlers
const handleClick = () => {}
const handleSubmit = () => {}

// Data update handlers
const handleUpdate = () => {}
```

---

## TypeScript Integration

### Event Type Checking
TypeScript validates that emitted events are declared.

**Example:**
```ts
const emit = defineEmits<{
  (e: 'save'): void
}>()

emit('save')    // ✅ OK
emit('delete')  // ❌ Error: Not declared
```

### Event Payload Types
Event payloads are type-checked in TypeScript.

**Example:**
```ts
const emit = defineEmits<{
  (e: 'submit', data: FormData): void
}>()

emit('submit', { name: 'Alice' })  // ✅ OK
emit('submit', 'wrong type')       // ❌ Error
```

---

## Comparison

### Props vs Events

| Aspect     | Props              | Events         |
| ---------- | ------------------ | -------------- |
| Direction  | Parent → Child     | Child → Parent |
| Data Flow  | One-way down       | One-way up     |
| Mutability | Read-only          | Sends data     |
| Use Case   | Pass configuration | Notify parent  |

### v-model vs Events

| Aspect     | v-model             | Events        |
| ---------- | ------------------- | ------------- |
| Purpose    | Two-way binding     | Notification  |
| Prop Names | modelValue required | Any name      |
| Event Name | update:modelValue   | Custom        |
| Usage      | Form inputs         | Complex logic |
