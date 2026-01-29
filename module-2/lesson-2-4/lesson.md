# Lesson 2.4 — Slots & Template Slots

## Learning Goals

By the end of this lesson, you will be able to:

- ✅ Understand what slots are and why they're essential for component composition
- ✅ Use default slots for simple content projection
- ✅ Implement named slots for complex layouts
- ✅ Master scoped slots to pass data to parent components
- ✅ Provide fallback content for slots
- ✅ Build flexible, reusable layout components
- ✅ Avoid component nesting nightmares with proper slot usage
- ✅ Apply slot best practices for maintainable components

## Prerequisites

Before starting this lesson, you should:

- ✅ Understand Vue component basics and props
- ✅ Be comfortable with the Composition API
- ✅ Know how to use `v-for` and `v-if` directives
- ✅ Have completed Module 2, Lessons 2.1-2.3

## What You Will Build

In this lesson, you will:

1. **Create a flexible Card component** with header, body, and footer slots
2. **Build a List component** with scoped slots for custom item rendering
3. **Design a Modal component** with named slots and close functionality
4. **Implement a Layout system** with multiple slot zones
5. **Create a Table component** with column slot customization

---

## What Are Slots?

**Slots** are Vue's mechanism for **content distribution**. They allow parent components to pass template content into child components, enabling flexible and reusable component design.

### Without Slots (Inflexible)

```ts
// Button.vue - hardcoded content
<template>
  <button class="btn">Click Me</button>
</template>
```

Every button says "Click Me" - not very useful!

### With Slots (Flexible)

```ts
// Button.vue - flexible with slots
<template>
  <button class="btn">
    <slot></slot>
  </button>
</template>

// Parent component - customize content
<template>
  <Button>Submit</Button>
  <Button>Cancel</Button>
  <Button>Delete</Button>
</template>
```

Now we can customize the button content from the parent!

> 💡 **IMPORTANT**: Slots enable component composition without tight coupling!

---

## Default Slots (Basic)

The simplest form of slots is the **default slot** - a single unnamed slot.

### Child Component with Default Slot

```ts
// Card.vue
<script setup lang="ts">
</script>

<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
}
</style>
```

### Parent Component Using the Slot

```ts
<script setup lang="ts">
import Card from './Card.vue'
</script>

<template>
  <Card>
    <h2>My Card Title</h2>
    <p>This is the card content.</p>
  </Card>
  
  <Card>
    <img src="/image.jpg" alt="Image" />
    <p>Different content!</p>
  </Card>
</template>
```

### How It Works

1. Parent passes content between `<Card>` tags
2. Vue renders that content where `<slot>` is in the child
3. Each instance can have different content

---

## Slot Fallback Content

Slots can have **fallback content** that displays when no content is provided.

### Child Component with Fallback

```ts
// Button.vue
<template>
  <button class="btn">
    <slot>Click Me</slot>
  </button>
</template>
```

### Usage

```ts
// With custom content - fallback ignored
<Button>Submit</Button>
// Renders: <button>Submit</button>

// Without content - fallback used
<Button />
// Renders: <button>Click Me</button>
```

> ⚠️ **CRITICAL**: Fallback content only displays if the slot receives NO content!

---

## Named Slots

**Named slots** allow multiple slots in a single component, each with a unique name.

### Child Component with Named Slots

```ts
// Card.vue
<template>
  <div class="card">
    <div class="card-header">
      <slot name="header"></slot>
    </div>
    
    <div class="card-body">
      <slot></slot> <!-- Default slot -->
    </div>
    
    <div class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.card-header {
  background: #f5f5f5;
  padding: 1rem;
  border-bottom: 1px solid #ddd;
}

.card-body {
  padding: 1rem;
}

.card-footer {
  background: #f5f5f5;
  padding: 1rem;
  border-top: 1px solid #ddd;
}
</style>
```

### Parent Component Using Named Slots

```ts
<script setup lang="ts">
import Card from './Card.vue'
</script>

<template>
  <Card>
    <template #header>
      <h2>Card Title</h2>
    </template>
    
    <!-- Default slot (no name needed) -->
    <p>This is the main content of the card.</p>
    <p>It goes in the default slot.</p>
    
    <template #footer>
      <button>Save</button>
      <button>Cancel</button>
    </template>
  </Card>
</template>
```

### Named Slot Syntax

```ts
// Verbose syntax
<template v-slot:header>Content</template>

// Shorthand syntax (recommended)
<template #header>Content</template>

// Default slot
<template #default>Content</template>
```

> 💡 **IMPORTANT**: Use `#slotName` shorthand for cleaner code!

---

## Scoped Slots

**Scoped slots** allow child components to pass data back to parent templates. This enables the parent to customize rendering while using child data.

### Basic Scoped Slot Example

```ts
// List.vue
<script setup lang="ts">
defineProps<{
  items: any[]
}>()
</script>

<template>
  <ul class="list">
    <li v-for="(item, index) in items" :key="index">
      <slot :item="item" :index="index"></slot>
    </li>
  </ul>
</template>
```

### Parent Using Scoped Slot

```ts
<script setup lang="ts">
import List from './List.vue'

const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
]
</script>

<template>
  <List :items="users">
    <template #default="{ item, index }">
      <div>
        <strong>{{ index + 1 }}. {{ item.name }}</strong>
        <p>{{ item.email }}</p>
      </div>
    </template>
  </List>
</template>
```

### How Scoped Slots Work

1. **Child** passes data via slot props: `<slot :item="item">`
2. **Parent** receives data: `<template #default="{ item }">`
3. **Parent** renders with custom template using child's data

> ⚠️ **CRITICAL**: Scoped slots solve the "inverse control" problem - child controls data, parent controls rendering!

---

## Advanced Scoped Slot: Custom Table

Let's build a flexible table component with scoped slots.

### Table Component

```ts
// Table.vue
<script setup lang="ts">
interface Column {
  key: string
  label: string
}

defineProps<{
  columns: Column[]
  data: any[]
}>()
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th v-for="column in columns" :key="column.key">
          <slot :name="`header-${column.key}`" :column="column">
            {{ column.label }}
          </slot>
        </th>
      </tr>
    </thead>
    
    <tbody>
      <tr v-for="(row, index) in data" :key="index">
        <td v-for="column in columns" :key="column.key">
          <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
            {{ row[column.key] }}
          </slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.table th {
  background: #f5f5f5;
  font-weight: 600;
}
</style>
```

### Using the Table with Custom Cell Rendering

```ts
<script setup lang="ts">
import Table from './Table.vue'

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' }
]

const users = [
  { name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active' },
  { name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'inactive' }
]
</script>

<template>
  <Table :columns="columns" :data="users">
    <!-- Customize status column -->
    <template #cell-status="{ value }">
      <span :class="value === 'active' ? 'badge-success' : 'badge-danger'">
        {{ value }}
      </span>
    </template>
    
    <!-- Customize role column -->
    <template #cell-role="{ value }">
      <strong>{{ value }}</strong>
    </template>
    
    <!-- Customize header for email -->
    <template #header-email>
      📧 Email Address
    </template>
  </Table>
</template>

<style scoped>
.badge-success {
  background: #28a745;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.badge-danger {
  background: #dc3545;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}
</style>
```

---

## Dynamic Slot Names

You can dynamically determine which slot to use.

### Dynamic Slots Example

```ts
// Card.vue
<script setup lang="ts">
defineProps<{
  variant: 'simple' | 'detailed'
}>()
</script>

<template>
  <div class="card">
    <slot :name="variant === 'simple' ? 'simple-content' : 'detailed-content'"></slot>
  </div>
</template>

// Parent
<Card variant="simple">
  <template #simple-content>
    <p>Simple view</p>
  </template>
</Card>

<Card variant="detailed">
  <template #detailed-content>
    <div>Detailed view with more info</div>
  </template>
</Card>
```

---

## Conditional Slots with $slots

Check if a slot has content before rendering its container.

### Using $slots API

```ts
// Card.vue
<script setup lang="ts">
import { useSlots } from 'vue'

const slots = useSlots()
</script>

<template>
  <div class="card">
    <div v-if="slots.header" class="card-header">
      <slot name="header"></slot>
    </div>
    
    <div class="card-body">
      <slot></slot>
    </div>
    
    <div v-if="slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
```

Now the header and footer divs only render if content is provided!

> 💡 **IMPORTANT**: Use `useSlots()` to check if slots have content before rendering containers!

---

## Slot Props vs Component Props

**When to use each?**

### Component Props
- Data that configures behavior
- Primitive values (strings, numbers, booleans)
- Component settings

```ts
<Button variant="primary" size="large" disabled />
```

### Slots
- Complex templates/markup
- Custom rendering logic
- Content that varies significantly

```ts
<Modal>
  <template #header>
    <h2>Custom Header</h2>
  </template>
  
  <template #default>
    <p>Modal content with <strong>formatting</strong></p>
  </template>
</Modal>
```

---

## Practical Example: Modal Component

A complete modal with named and scoped slots.

### Modal Component

```ts
// Modal.vue
<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const close = () => {
  emit('update:modelValue', false)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click="close">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <slot name="header"></slot>
            <button class="close-btn" @click="close">&times;</button>
          </div>
          
          <div class="modal-body">
            <slot></slot>
          </div>
          
          <div class="modal-footer">
            <slot name="footer" :close="close">
              <button @click="close">Close</button>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 2rem;
  height: 2rem;
}

.modal-body {
  padding: 1rem;
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
```

### Using the Modal

```ts
<script setup lang="ts">
import { ref } from 'vue'
import Modal from './Modal.vue'

const showModal = ref(false)
</script>

<template>
  <button @click="showModal = true">Open Modal</button>
  
  <Modal v-model="showModal">
    <template #header>
      <h2>Confirm Action</h2>
    </template>
    
    <template #default>
      <p>Are you sure you want to delete this item?</p>
      <p>This action cannot be undone.</p>
    </template>
    
    <template #footer="{ close }">
      <button @click="close">Cancel</button>
      <button @click="handleDelete(); close()">Delete</button>
    </template>
  </Modal>
</template>
```

---

## Renderless Components with Scoped Slots

A **renderless component** has no UI - it only provides logic via scoped slots.

### Example: Fetch Component

```ts
// Fetch.vue
<script setup lang="ts">
import { ref, watchEffect } from 'vue'

const props = defineProps<{
  url: string
}>()

const data = ref(null)
const error = ref(null)
const loading = ref(false)

watchEffect(async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await fetch(props.url)
    data.value = await response.json()
  } catch (e) {
    error.value = e
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <slot :data="data" :error="error" :loading="loading"></slot>
</template>
```

### Using the Renderless Component

```ts
<script setup lang="ts">
import Fetch from './Fetch.vue'
</script>

<template>
  <Fetch url="/api/users">
    <template #default="{ data, error, loading }">
      <div v-if="loading">Loading...</div>
      <div v-else-if="error">Error: {{ error.message }}</div>
      <div v-else-if="data">
        <div v-for="user in data" :key="user.id">
          {{ user.name }}
        </div>
      </div>
    </template>
  </Fetch>
</template>
```

> 💡 **IMPORTANT**: Renderless components separate logic from presentation!

---

## Slot Best Practices

### 1. Use Descriptive Slot Names

```ts
// ✅ GOOD: Clear purpose
<template #user-info>
<template #action-buttons>
<template #error-message>

// ❌ BAD: Vague names
<template #slot1>
<template #content>
<template #stuff>
```

### 2. Provide Fallback Content

```ts
// ✅ GOOD: Useful fallback
<template>
  <div class="card-header">
    <slot name="header">
      <h2>{{ title }}</h2>
    </slot>
  </div>
</template>

// ❌ BAD: No fallback (empty header div)
<template>
  <div class="card-header">
    <slot name="header"></slot>
  </div>
</template>
```

### 3. Document Slot Props

```ts
/**
 * List component with customizable item rendering
 * 
 * @slot default - Scoped slot for rendering each item
 * @slot-prop {object} item - The list item
 * @slot-prop {number} index - The item's index
 */
<template>
  <div v-for="(item, index) in items" :key="index">
    <slot :item="item" :index="index"></slot>
  </div>
</template>
```

### 4. Avoid Too Many Slots

```ts
// ❌ BAD: Too many slots, hard to use
<Card>
  <template #header-left>...</template>
  <template #header-center>...</template>
  <template #header-right>...</template>
  <template #body-top>...</template>
  <template #body-content>...</template>
  <template #body-bottom>...</template>
  <template #footer-actions>...</template>
  <template #footer-info>...</template>
</Card>

// ✅ GOOD: Reasonable number of slots
<Card>
  <template #header>...</template>
  <template #default>...</template>
  <template #footer>...</template>
</Card>
```

### 5. Use TypeScript for Slot Props

```ts
// Define slot prop types
<script setup lang="ts">
interface SlotProps {
  item: {
    id: number
    name: string
  }
  index: number
}
</script>

<template>
  <div v-for="(item, index) in items" :key="item.id">
    <slot :item="item" :index="index"></slot>
  </div>
</template>
```

---

## Common Slot Patterns

### Pattern 1: Header/Body/Footer

```ts
<template>
  <div class="container">
    <header v-if="$slots.header">
      <slot name="header"></slot>
    </header>
    
    <main>
      <slot></slot>
    </main>
    
    <footer v-if="$slots.footer">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>
```

### Pattern 2: List with Custom Items

```ts
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      <slot :item="item"></slot>
    </li>
  </ul>
</template>
```

### Pattern 3: Tabs with Named Content

```ts
<template>
  <div class="tabs">
    <div class="tab-headers">
      <button v-for="tab in tabs" :key="tab">
        {{ tab }}
      </button>
    </div>
    
    <div class="tab-content">
      <slot :name="activeTab"></slot>
    </div>
  </div>
</template>
```

---

## Summary

In this lesson, you learned:

- ✅ What slots are and how they enable content distribution
- ✅ Default slots for simple content projection
- ✅ Named slots for multiple content areas
- ✅ Scoped slots for passing data to parent templates
- ✅ Fallback content for optional slots
- ✅ Conditional slot rendering with `$slots` API
- ✅ Renderless components for logic-only components
- ✅ Slot best practices and common patterns

**Next Steps**: Complete the exercises to build flexible Card, List, and Layout components using slots. Then move on to Lesson 2.5: Component Props Advanced.

---

## Additional Resources

- [Vue Slots Guide](https://vuejs.org/guide/components/slots.html)
- [Scoped Slots Explained](https://vuejs.org/guide/components/slots.html#scoped-slots)
- [Renderless Components Pattern](https://adamwathan.me/renderless-components-in-vuejs/)
