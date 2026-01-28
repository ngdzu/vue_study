# Lesson 1.6: Events & Emits

## Introduction

While props allow parents to pass data down to children, events allow children to communicate back to parents. Custom events enable bidirectional component communication and are essential for building interactive, responsive component architectures.

This lesson covers event emission, event handling, two-way binding with v-model, and best practices for component communication.

---

## Table of Contents

1. [Event Communication Basics](#event-communication-basics)
2. [Emitting Events](#emitting-events)
3. [Listening to Events](#listening-to-events)
4. [Event Payloads](#event-payloads)
5. [Event Naming Conventions](#event-naming-conventions)
6. [Two-Way Binding with v-model](#two-way-binding-with-v-model)
7. [v-on Modifiers](#v-on-modifiers)
8. [Event Flow & Bubbling](#event-flow--bubbling)
9. [Common Patterns](#common-patterns)
10. [Anti-Patterns to Avoid](#anti-patterns-to-avoid)

---

## Event Communication Basics

### Why Events?

Props flow down (parent → child), but what about child → parent communication? That's where events come in.

```
Parent (listens to event)
   ↑ (custom events)
Child (emits event)
```

**Benefits:**
- Unidirectional data flow (predictable)
- Child components stay self-contained
- Parents control how to respond
- Reusable components with flexible behavior

### The Pattern

1. Child component performs an action
2. Child emits a custom event
3. Parent listens to the event
4. Parent updates its state based on the event

```ts
<!-- Child Component -->
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'increment'): void
}>()

const handleClick = () => {
  emit('increment')  // Tell parent something happened
}
</script>

<template>
  <button @click="handleClick">+1</button>
</template>

<!-- Parent Component -->
<script setup lang="ts">
import { ref } from 'vue'
import Counter from './Counter.vue'

const count = ref(0)
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <Counter @increment="count++" />
  </div>
</template>
```

---

## Emitting Events

### Declaring Events

In Composition API with `<script setup>`, use `defineEmits`:

```ts
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', data: string): void
  (e: 'error', code: number, message: string): void
}>()
</script>
```

This declares three events:
- `close` - no payload
- `save` - payload is a string
- `error` - payload is number and string

### Alternative Syntax (Runtime Declaration)

```ts
const emit = defineEmits(['close', 'save', 'error'])
```

Less type-safe but simpler for simple cases.

### Emitting Events

```ts
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'increment'): void
}>()

// Emit without payload
const handleIncrement = () => {
  emit('increment')
}
</script>
```

### Emitting with Payloads

```ts
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'update:count', value: number): void
  (e: 'submit', data: FormData): void
}>()

// Emit with payload
const submitForm = (formData: FormData) => {
  emit('submit', formData)
}

const updateCount = (newCount: number) => {
  emit('update:count', newCount)
}
</script>
```

> ⚠️ **CRITICAL**: Always define events with `defineEmits`. This provides TypeScript checking and makes component APIs clear.

### Complex Event Payloads

```ts
<script setup lang="ts">
interface FormData {
  name: string
  email: string
  message: string
}

const emit = defineEmits<{
  (e: 'submit', data: FormData): void
}>()

const handleSubmit = (form: FormData) => {
  emit('submit', form)
}
</script>
```

---

## Listening to Events

### Using @directive

The `@` symbol is shorthand for `v-on`:

```ts
<!-- Listen to 'close' event -->
<Modal @close="handleClose" />

<!-- Equivalent to -->
<Modal v-on:close="handleClose" />
```

### Event Handler Methods

```ts
<script setup lang="ts">
import { ref } from 'vue'
import Modal from './Modal.vue'

const isOpen = ref(false)

const handleClose = () => {
  isOpen.value = false
}

const handleSave = (message: string) => {
  console.log('Saved:', message)
}
</script>

<template>
  <div>
    <Modal @close="handleClose" @save="handleSave" />
  </div>
</template>
```

### Inline Handlers

```ts
<template>
  <div>
    <!-- Inline handler -->
    <Modal @close="isOpen = false" />
    
    <!-- With expression -->
    <Modal @save="messages.push($event)" />
    
    <!-- With method call -->
    <Modal @save="handleSave($event)" />
  </div>
</template>
```

### Multiple Listeners

```ts
<template>
  <div>
    <!-- Multiple listeners for same event -->
    <Button
      @click="handleClick"
      @click="logClick"
      @click="updateCounter"
    />
  </div>
</template>
```

All three handlers will be called when clicked.

> 💡 **IMPORTANT**: `$event` is a special variable that contains the event payload in inline handlers.

---

## Event Payloads

### Single Payload

```ts
<!-- Child -->
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'update:value', newValue: string): void
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:value', target.value)
}
</script>

<template>
  <input @input="handleInput" />
</template>

<!-- Parent -->
<script setup lang="ts">
import { ref } from 'vue'

const text = ref('')

const handleUpdate = (newValue: string) => {
  text.value = newValue
}
</script>

<template>
  <TextInput @update:value="handleUpdate" />
  <p>Text: {{ text }}</p>
</template>
```

### Multiple Payloads

```ts
<!-- Child -->
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'search', query: string, filters: string[]): void
}>()

const search = () => {
  emit('search', query, selectedFilters)
}
</script>

<!-- Parent -->
<template>
  <SearchBox @search="(query, filters) => handleSearch(query, filters)" />
</template>
```

### Object Payloads

```ts
<!-- Child -->
<script setup lang="ts">
interface FormData {
  email: string
  password: string
}

const emit = defineEmits<{
  (e: 'submit', data: FormData): void
}>()

const handleSubmit = () => {
  emit('submit', { email, password })
}
</script>

<!-- Parent -->
<template>
  <LoginForm @submit="handleLogin" />
</template>

<script setup lang="ts">
const handleLogin = (data: { email: string; password: string }) => {
  console.log('Login:', data.email)
}
</script>
```

---

## Event Naming Conventions

### Naming Rules

**Child-emitted events (custom):**
- Use **kebab-case**: `@close`, `@submit`, `@update:value`
- Be specific: `@close-modal` instead of just `@close`

**Native DOM events:**
- Use **camelCase**: `@click`, `@input`, `@submit`

**Update events (for v-model):**
- Follow pattern: `@update:propName`
- Example: `@update:count`, `@update:isOpen`

```ts
<!-- ✅ Good -->
<Modal @close="handleClose" @update:title="updateTitle" />
<Button @click="handleClick" />

<!-- ❌ Bad -->
<Modal @closeModal="handleClose" />  <!-- Too specific for internal -->
<Button @onClick="handleClick" />  <!-- Native event named wrong -->
```

### Descriptive Names

```ts
// ✅ Clear intent
emit('submit')
emit('cancel')
emit('delete-item')
emit('update:isOpen')

// ❌ Vague
emit('action')
emit('change')
emit('handle')
```

---

## Two-Way Binding with v-model

### The Problem with One-Way Props

Props are read-only, so updating them requires emitting events:

```ts
<!-- Child must emit to update parent -->
<script setup lang="ts">
const props = defineProps<{ count: number }>()
const emit = defineEmits<{
  (e: 'update:count', value: number): void
}>()

const increment = () => {
  emit('update:count', props.count + 1)
}
</script>

<!-- Parent -->
<Counter :count="count" @update:count="count = $event" />
```

This is repetitive and verbose.

### v-model Solution

`v-model` is shorthand for the above pattern:

```ts
<!-- Shorthand -->
<Counter v-model="count" />

<!-- Expands to -->
<Counter :modelValue="count" @update:modelValue="count = $event" />
```

### Creating v-model Components

**Step 1: Accept `modelValue` prop**

```ts
<script setup lang="ts">
const props = defineProps<{
  modelValue: number
}>()
</script>
```

**Step 2: Emit `update:modelValue` event**

```ts
const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const increment = () => {
  emit('update:modelValue', props.modelValue + 1)
}
```

**Full Example:**

```ts
<!-- components/Counter.vue -->
<script setup lang="ts">
const props = defineProps<{ modelValue: number }>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const increment = () => {
  emit('update:modelValue', props.modelValue + 1)
}

const decrement = () => {
  emit('update:modelValue', props.modelValue - 1)
}
</script>

<template>
  <div class="counter">
    <button @click="decrement">-</button>
    <span>{{ modelValue }}</span>
    <button @click="increment">+</button>
  </div>
</template>

<!-- Usage -->
<script setup lang="ts">
import { ref } from 'vue'
import Counter from './Counter.vue'

const count = ref(0)
</script>

<template>
  <Counter v-model="count" />
  <p>Count: {{ count }}</p>
</template>
```

### Multiple v-models

```ts
<!-- Child -->
<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'update:isOpen', value: boolean): void
}>()
</script>

<template>
  <input
    :value="modelValue"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
  <checkbox
    :checked="isOpen"
    @change="emit('update:isOpen', ($event.target as HTMLInputElement).checked)"
  />
</template>

<!-- Parent -->
<template>
  <MyComponent v-model="text" v-model:isOpen="open" />
</template>
```

> ⚠️ **CRITICAL**: For v-model, the prop MUST be named `modelValue` and the event MUST be `update:modelValue`.

---

## v-on Modifiers

### Common Modifiers

**Event Modifiers:**
- `.stop` - Stop event propagation
- `.prevent` - Prevent default action
- `.capture` - Use capture phase
- `.self` - Only trigger if event target is the element itself
- `.once` - Trigger only once

```ts
<!-- Stop propagation -->
<div @click="handleClick">
  <button @click.stop="handleButtonClick">Don't bubble</button>
</div>

<!-- Prevent default -->
<form @submit.prevent="handleSubmit">
  <input type="text" />
</form>

<!-- Self only -->
<div @click.self="handleClick">
  Triggers only for this div, not children
</div>

<!-- Once -->
<button @click.once="handleClick">Click me once</button>
```

### Key Modifiers

```ts
<!-- Enter key -->
<input @keyup.enter="handleSubmit" />

<!-- Space key -->
<input @keydown.space="handleSpace" />

<!-- Escape key -->
<input @keyup.esc="handleEscape" />

<!-- Custom key code -->
<input @keyup.13="handleEnter" />  <!-- Enter is key code 13 -->
```

### System Modifier Keys

```ts
<!-- Ctrl/Cmd + Click -->
<button @click.ctrl="handleCtrlClick">Ctrl+Click</button>

<!-- Shift + Click -->
<button @click.shift="handleShiftClick">Shift+Click</button>

<!-- Alt + Click -->
<button @click.alt="handleAltClick">Alt+Click</button>

<!-- Cmd on Mac, Ctrl on Windows -->
<button @click.meta="handleMetaClick">Meta+Click</button>

<!-- Exact modifiers (no other keys) -->
<button @click.ctrl.exact="handleCtrlExactClick">Ctrl+Click (no others)</button>
```

### Mouse Button Modifiers

```ts
<!-- Left click -->
<div @click.left="handleLeft">Left click</div>

<!-- Right click -->
<div @click.right="handleRight">Right click</div>

<!-- Middle click -->
<div @click.middle="handleMiddle">Middle click</div>
```

### Chaining Modifiers

```ts
<!-- Multiple modifiers -->
<input @keyup.ctrl.enter="handleCtrlEnter" />
<button @click.shift.ctrl="handleModified">Shift+Ctrl+Click</button>
```

---

## Event Flow & Bubbling

### Event Bubbling

Events bubble up through the DOM:

```
Button (event starts here)
  ↑
Div (event bubbles here)
  ↑
Container (event reaches here)
```

```ts
<template>
  <div @click="containerClick">
    Container
    <div @click="divClick">
      Div
      <button @click="buttonClick">Button</button>
    </div>
  </div>
</template>

<!-- Clicking button triggers all three handlers -->
```

### Stopping Propagation

```ts
<!-- Stop event from bubbling -->
<button @click.stop="handleClick">Don't bubble</button>

<!-- Equivalent to -->
<button @click="(e) => {
  e.stopPropagation()
  handleClick()
}">Don't bubble</button>
```

### Vue Event vs Native Event

```ts
<script setup lang="ts">
// Custom Vue event (from child component)
const handleCustomEvent = (payload: any) => {
  // payload is whatever the child emitted
}

// Native DOM event
const handleNativeEvent = (event: Event) => {
  // event is the native DOM event
}
</script>

<template>
  <!-- Custom event (from child component) -->
  <ChildComponent @custom-event="handleCustomEvent" />
  
  <!-- Native event (from DOM element) -->
  <div @click="handleNativeEvent"></div>
</template>
```

> 💡 **IMPORTANT**: Custom events from child components don't bubble like native DOM events. They're specific to component communication.

---

## Common Patterns

### 1. Modal Dialog Pattern

```ts
<!-- Modal.vue -->
<script setup lang="ts">
defineProps<{
  isOpen: boolean
  title: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm'): void
}>()
</script>

<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <h2>{{ title }}</h2>
        <button @click="emit('close')">×</button>
      </div>
      <div class="modal-body">
        <slot />
      </div>
      <div class="modal-footer">
        <button @click="emit('close')">Cancel</button>
        <button @click="emit('confirm')">Confirm</button>
      </div>
    </div>
  </div>
</template>

<!-- Usage -->
<script setup lang="ts">
import { ref } from 'vue'
import Modal from './Modal.vue'

const showDialog = ref(false)

const handleConfirm = () => {
  console.log('Confirmed!')
  showDialog.value = false
}
</script>

<template>
  <div>
    <button @click="showDialog = true">Open Modal</button>
    <Modal
      :is-open="showDialog"
      title="Confirm Action"
      @close="showDialog = false"
      @confirm="handleConfirm"
    >
      <p>Are you sure?</p>
    </Modal>
  </div>
</template>
```

### 2. Form Input Pattern

```ts
<!-- FormInput.vue -->
<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  label: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'blur'): void
  (e: 'focus'): void
}>()
</script>

<template>
  <div class="form-group">
    <label>{{ label }}</label>
    <input
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @focus="emit('focus')"
      @blur="emit('blur')"
    />
  </div>
</template>

<!-- Usage -->
<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')

const handleFocus = () => {
  console.log('Input focused')
}

const handleBlur = () => {
  // Validate email
}
</script>

<template>
  <FormInput
    v-model="email"
    label="Email"
    @focus="handleFocus"
    @blur="handleBlur"
  />
</template>
```

### 3. List Item Selection Pattern

```ts
<!-- ListItem.vue -->
<script setup lang="ts">
defineProps<{
  item: any
  isSelected: boolean
}>()

const emit = defineEmits<{
  (e: 'select'): void
  (e: 'delete'): void
}>()
</script>

<template>
  <div class="list-item" :class="{ selected: isSelected }">
    <span>{{ item.name }}</span>
    <div class="actions">
      <button @click="emit('select')">Select</button>
      <button @click="emit('delete')">Delete</button>
    </div>
  </div>
</template>

<!-- Usage -->
<script setup lang="ts">
import { ref } from 'vue'

const items = ref([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' }
])

const selectedId = ref(null)

const handleSelect = (id: number) => {
  selectedId.value = id
}

const handleDelete = (id: number) => {
  items.value = items.value.filter(item => item.id !== id)
}
</script>

<template>
  <div>
    <ListItem
      v-for="item in items"
      :key="item.id"
      :item="item"
      :is-selected="selectedId === item.id"
      @select="handleSelect(item.id)"
      @delete="handleDelete(item.id)"
    />
  </div>
</template>
```

### 4. Dropdown Pattern

```ts
<!-- Dropdown.vue -->
<script setup lang="ts">
import { ref } from 'vue'

interface Option {
  value: any
  label: string
}

const props = defineProps<{
  modelValue: any
  options: Option[]
  label: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const isOpen = ref(false)
</script>

<template>
  <div class="dropdown">
    <label>{{ label }}</label>
    <button @click="isOpen = !isOpen" class="dropdown-trigger">
      {{ selectedLabel }}
    </button>
    <div v-if="isOpen" class="dropdown-menu">
      <button
        v-for="option in options"
        :key="option.value"
        @click="emit('update:modelValue', option.value); isOpen = false"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const selectedLabel = computed(() => {
  const option = props.options.find(opt => opt.value === props.modelValue)
  return option?.label || 'Select...'
})
</script>
```

---

## Anti-Patterns to Avoid

### ❌ 1. Mutating Props via Events

```ts
// ❌ BAD: Parent shouldn't mutate received props
const handleUpdate = (newValue: string) => {
  props.data = newValue  // Wrong!
}

// ✅ GOOD: Parent owns the state
const handleUpdate = (newValue: string) => {
  data.value = newValue
}
```

### ❌ 2. Emitting Too Much Data

```ts
// ❌ BAD: Sends entire component state
emit('update', { ...componentState })

// ✅ GOOD: Send only what changed
emit('update:count', newCount)
```

### ❌ 3. Silent Failures

```ts
// ❌ BAD: Component fails silently if not listening
const emit = defineEmits(['action'])
emit('action')

// ✅ GOOD: Document expected events
const emit = defineEmits<{
  (e: 'action'): void
  (e: 'error', message: string): void
}>()
```

### ❌ 4. Forgetting to Define Events

```ts
// ❌ BAD: No type checking or validation
emit('randomEvent')

// ✅ GOOD: All events declared
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save'): void
}>()
```

### ❌ 5. Using v-model Incorrectly

```ts
// ❌ BAD: Prop not named 'modelValue'
defineProps<{ value: string }>()
emit('update:value', newValue)

// ✅ GOOD: Correct names for v-model
defineProps<{ modelValue: string }>()
emit('update:modelValue', newValue)
```

### ❌ 6. Mixing Event Styles

```ts
// ❌ BAD: Inconsistent naming
emit('itemSelected')
emit('item-delete')
emit('ITEM_UPDATE')

// ✅ GOOD: Consistent kebab-case
emit('item-selected')
emit('item-delete')
emit('item-update')
```

---

## Decision Matrix

### When to Emit Events

| Scenario                                     | Solution                          |
| -------------------------------------------- | --------------------------------- |
| Child user interaction (click, input)        | Emit event                        |
| Form submission in child                     | Emit event with data              |
| Child needs to notify parent                 | Emit event                        |
| Parent needs to update based on child action | Listen to event                   |
| Simple value update (text input)             | Use v-model                       |
| Complex communication                        | Consider state management (Pinia) |

### Event vs v-model

| Use Case                    | Best Approach               |
| --------------------------- | --------------------------- |
| Single value binding        | v-model                     |
| Multiple updates            | Multiple emits              |
| Form-like component         | v-model                     |
| UI state (modal open/close) | v-model or emit             |
| Complex logic               | Emit event + parent handles |

---

## Performance Considerations

### 1. Event Handler Optimization

```ts
// ❌ BAD: Creates new function on each render
<button @click="() => emit('click')" />

// ✅ GOOD: Reuse handler function
const handleClick = () => {
  emit('click')
}

// ✅ ALSO GOOD: Direct emit
<button @click="() => emit('click')" />  <!-- OK for simple cases -->
```

### 2. Event Listener Cleanup

For custom event listeners on external APIs:

```ts
import { onMounted, onUnmounted } from 'vue'

const emit = defineEmits<{
  (e: 'resize', width: number, height: number): void
}>()

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)  // Clean up!
})

const handleResize = () => {
  emit('resize', window.innerWidth, window.innerHeight)
}
```

### 3. Debouncing Events

```ts
import { ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'

const emit = defineEmits<{
  (e: 'search', query: string): void
}>()

const debouncedSearch = useDebounceFn((query: string) => {
  emit('search', query)
}, 500)

const handleInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  debouncedSearch(value)
}
```

---

## Summary

### Key Takeaways

1. **Events** enable child → parent communication
2. **Emit pattern** uses `defineEmits` and `emit()`
3. **v-model** is shorthand for prop + event pair
4. **v-on modifiers** provide convenient event handling
5. **Event naming** should be consistent (kebab-case for custom)
6. **Data flow** is unidirectional but bidirectional communication is possible
7. **Composition** becomes powerful with props + events

### Events Checklist

✅ Always define events with `defineEmits`  
✅ Use TypeScript for type-safe event payloads  
✅ Name events consistently in kebab-case  
✅ Document what each event means  
✅ Emit events from user interactions  
✅ Use v-model for simple two-way binding  
✅ Listen with `@event-name` syntax  
✅ Clean up event listeners on unmount  
✅ Use v-on modifiers for common patterns  
✅ Consider performance with debouncing/throttling

---

## Next Steps

Congratulations! You've completed all core Module 1 lessons:
- ✅ Lesson 1.1: Vue 3 Setup
- ✅ Lesson 1.2: Reactive Data
- ✅ Lesson 1.3: Conditional & List Rendering
- ✅ Lesson 1.4: Methods, Computed, & Watchers
- ✅ Lesson 1.5: Component Basics & Props
- ✅ Lesson 1.6: Events & Emits

Next: [Module 1 Capstone Project](../capstone/README.md) - Build a Personal Dashboard combining all concepts.

---

## Additional Resources

- [Vue 3 Events Documentation](https://vuejs.org/guide/components/events.html)
- [v-model Guide](https://vuejs.org/guide/components/v-model.html)
- [Event Handling](https://vuejs.org/guide/essentials/event-handling.html)
- [Custom Events](https://vuejs.org/guide/components/emits.html)
