# Glossary — Lesson 2.4 Terms & Definitions

Quick reference for technical terms used in this lesson.

---

## Core Concepts

### Slot
**Definition**: A placeholder in a child component that can be filled with content from the parent component.

**Purpose**: Enables content distribution and component composition.

**Example**:
```ts
// Child
<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

// Parent
<Card>
  <h2>Title</h2>
  <p>Content</p>
</Card>
```

---

### Content Distribution
**Definition**: The pattern of passing content from parent to child components through slots.

**Benefits**: Creates flexible, reusable components without tight coupling.

**Example**:
```ts
// Same Button component, different content
<Button>Save</Button>
<Button>Cancel</Button>
<Button>Delete</Button>
```

---

### Default Slot
**Definition**: An unnamed slot that accepts any content passed to a component.

**Syntax**: `<slot></slot>` in child, content between tags in parent.

**Example**:
```ts
// Child
<template>
  <div><slot></slot></div>
</template>

// Parent
<MyComponent>
  Any content here goes to default slot
</MyComponent>
```

---

### Named Slot
**Definition**: A slot with a specific name, allowing multiple distinct content areas.

**Syntax**: `<slot name="header">` in child, `<template #header>` in parent.

**Example**:
```ts
// Child
<template>
  <div class="card">
    <slot name="header"></slot>
    <slot name="body"></slot>
  </div>
</template>

// Parent
<Card>
  <template #header>Header Content</template>
  <template #body>Body Content</template>
</Card>
```

---

### Scoped Slot
**Definition**: A slot that passes data from child to parent, allowing parent to customize rendering with child's data.

**Key feature**: Child controls data, parent controls presentation.

**Example**:
```ts
// Child passes data
<template>
  <div v-for="item in items" :key="item.id">
    <slot :item="item"></slot>
  </div>
</template>

// Parent receives and uses data
<List :items="users">
  <template #default="{ item }">
    <div>{{ item.name }}</div>
  </template>
</List>
```

---

### Slot Props
**Definition**: Data passed from child to parent through scoped slots.

**Syntax**: `:propName="value"` on `<slot>`, destructured in parent template.

**Example**:
```ts
// Child defines slot props
<slot :user="user" :index="index" :isActive="isActive"></slot>

// Parent destructures slot props
<template #default="{ user, index, isActive }">
  {{ index }}: {{ user.name }} - {{ isActive ? 'Active' : 'Inactive' }}
</template>
```

---

### Fallback Content
**Definition**: Default content shown when no content is provided to a slot.

**Usage**: Place content between `<slot>` tags in child component.

**Example**:
```ts
<template>
  <button>
    <slot>Click Me</slot> <!-- Fallback: "Click Me" -->
  </button>
</template>

// Used without content
<Button /> <!-- Shows "Click Me" -->

// Used with content
<Button>Submit</Button> <!-- Shows "Submit" -->
```

---

## Advanced Concepts

### Renderless Component
**Definition**: A component with no visual output that only provides logic through scoped slots.

**Purpose**: Separates logic from presentation, maximizes reusability.

**Example**:
```ts
// Renderless Fetch component
<script setup lang="ts">
const { data, loading, error } = useFetch(url)
</script>

<template>
  <slot :data="data" :loading="loading" :error="error"></slot>
</template>

// Parent controls all UI
<Fetch url="/api/users">
  <template #default="{ data, loading }">
    <div v-if="loading">Loading...</div>
    <div v-else>{{ data }}</div>
  </template>
</Fetch>
```

---

### Slot Composition
**Definition**: Combining multiple slots to create complex, flexible layouts.

**Pattern**: Use named slots for different sections (header, body, footer, sidebar, etc.).

**Example**:
```ts
<template>
  <div class="layout">
    <header><slot name="header"></slot></header>
    <aside><slot name="sidebar"></slot></aside>
    <main><slot></slot></main>
    <footer><slot name="footer"></slot></footer>
  </div>
</template>
```

---

### Dynamic Slot Names
**Definition**: Determining which slot to use at runtime based on component state or props.

**Use case**: Conditional rendering based on component configuration.

**Example**:
```ts
<script setup lang="ts">
const props = defineProps<{
  mode: 'simple' | 'advanced'
}>()
</script>

<template>
  <slot :name="mode === 'simple' ? 'simple-view' : 'advanced-view'"></slot>
</template>
```

---

### $slots API
**Definition**: A built-in object containing information about which slots have content.

**Usage**: Check if slots exist before rendering their containers.

**Example**:
```ts
<script setup lang="ts">
import { useSlots } from 'vue'

const slots = useSlots()
</script>

<template>
  <div v-if="slots.header" class="header">
    <slot name="header"></slot>
  </div>
</template>
```

---

## Slot Syntax

### v-slot Directive
**Definition**: The directive for providing content to named or scoped slots.

**Shorthand**: `#` (e.g., `#header` instead of `v-slot:header`)

**Example**:
```ts
// Full syntax
<template v-slot:header="{ user }">
  {{ user.name }}
</template>

// Shorthand (recommended)
<template #header="{ user }">
  {{ user.name }}
</template>
```

---

### Slot Shorthand (#)
**Definition**: Abbreviated syntax for `v-slot:`.

**Recommendation**: Always use shorthand for cleaner code.

**Example**:
```ts
// ✅ GOOD: Clean and concise
<template #header>Header</template>
<template #footer>Footer</template>

// ❌ VERBOSE: Unnecessarily long
<template v-slot:header>Header</template>
<template v-slot:footer>Footer</template>
```

---

### Destructuring Slot Props
**Definition**: Extracting specific properties from slot props object.

**Syntax**: `{ prop1, prop2 }` in template definition.

**Example**:
```ts
// Without destructuring
<template #default="slotProps">
  {{ slotProps.item.name }}
</template>

// With destructuring (cleaner)
<template #default="{ item, index }">
  {{ index }}: {{ item.name }}
</template>
```

---

## Component Patterns

### Card Pattern
**Definition**: A component with header, body, and footer slots for flexible content structure.

**Common slots**: `header`, `default` (body), `footer`

**Example**:
```ts
<Card>
  <template #header>
    <h2>User Profile</h2>
  </template>
  
  <p>User information goes here</p>
  
  <template #footer>
    <button>Edit</button>
    <button>Delete</button>
  </template>
</Card>
```

---

### List Pattern
**Definition**: A component that iterates over data and provides scoped slots for item rendering.

**Key feature**: Parent customizes item appearance, child manages iteration.

**Example**:
```ts
<List :items="users">
  <template #default="{ item, index }">
    <div class="user-card">
      {{ index + 1 }}. {{ item.name }}
    </div>
  </template>
</List>
```

---

### Modal/Dialog Pattern
**Definition**: An overlay component with slots for header, content, and actions.

**Features**: Named slots + scoped slot for close function.

**Example**:
```ts
<Modal v-model="show">
  <template #header>Confirm</template>
  <template #default>Are you sure?</template>
  <template #footer="{ close }">
    <button @click="close">Cancel</button>
    <button @click="confirm(); close()">OK</button>
  </template>
</Modal>
```

---

### Table Pattern
**Definition**: A table component with scoped slots for customizing cell rendering.

**Slot naming**: Dynamic slots based on column keys (e.g., `cell-name`, `cell-email`).

**Example**:
```ts
<Table :data="users" :columns="columns">
  <template #cell-status="{ value }">
    <span :class="value === 'active' ? 'green' : 'red'">
      {{ value }}
    </span>
  </template>
</Table>
```

---

## Best Practices

### Slot Documentation
**Definition**: Documenting available slots and their props in component comments.

**Format**: JSDoc-style comments above component definition.

**Example**:
```ts
/**
 * Card component with flexible layout
 * 
 * @slot header - Card header content
 * @slot default - Main card body content
 * @slot footer - Card footer content (optional)
 */
<template>
  <div class="card">
    <slot name="header"></slot>
    <slot></slot>
    <slot name="footer"></slot>
  </div>
</template>
```

---

### Conditional Slot Rendering
**Definition**: Only rendering slot containers when the slot has content.

**Implementation**: Use `useSlots()` or `$slots` to check before rendering.

**Example**:
```ts
<script setup lang="ts">
import { useSlots } from 'vue'
const slots = useSlots()
</script>

<template>
  <!-- Only render header div if header slot has content -->
  <div v-if="slots.header" class="header">
    <slot name="header"></slot>
  </div>
</template>
```

---

### Single Responsibility Slots
**Definition**: Each slot should have a clear, focused purpose.

**Avoid**: Generic slots like "content1", "content2" - use descriptive names.

**Example**:
```ts
// ✅ GOOD: Clear purpose
<slot name="user-info"></slot>
<slot name="action-buttons"></slot>
<slot name="error-message"></slot>

// ❌ BAD: Unclear purpose
<slot name="area1"></slot>
<slot name="area2"></slot>
<slot name="extra"></slot>
```

---

## Common Terminology

### Content Projection
**Definition**: Another term for passing content through slots from parent to child.

**Origin**: Angular terminology, same concept as Vue slots.

---

### Slot Outlet
**Definition**: The location where slot content is rendered in the child template.

**Represented by**: `<slot>` element in child component.

---

### Slot Content
**Definition**: The actual content provided by the parent component.

**Location**: Between component tags or in `<template>` elements.

---

### Template Fragment
**Definition**: A portion of template wrapped in `<template>` tags for slot targeting.

**Purpose**: Group content for specific named or scoped slots.

**Example**:
```ts
<template #header>
  <h1>Title</h1>
  <p>Subtitle</p>
</template>
```

---

## Performance Considerations

### Slot Caching
**Definition**: Vue automatically caches slot functions to avoid unnecessary re-renders.

**Benefit**: Slots are performant even with complex content.

---

### Conditional Slot Overhead
**Definition**: Using `v-if` on slot containers prevents rendering when slots are empty.

**Best practice**: Always check `$slots` before rendering containers with styles/classes.

**Example**:
```ts
<!-- ❌ BAD: Empty div still renders -->
<div class="footer">
  <slot name="footer"></slot>
</div>

<!-- ✅ GOOD: No empty div -->
<div v-if="$slots.footer" class="footer">
  <slot name="footer"></slot>
</div>
```

---

## Summary

This glossary covers:
- Core slot concepts (default, named, scoped)
- Advanced patterns (renderless, composition, dynamic)
- Slot syntax and APIs (`v-slot`, `#`, `$slots`)
- Common component patterns (card, list, table, modal)
- Best practices for slot design and documentation

Keep this reference open while working through the lesson and exercises!
