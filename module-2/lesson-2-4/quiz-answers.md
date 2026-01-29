# Quiz Answers — Lesson 2.4 (Slots & Template Slots)

1) **What is a slot in Vue?**

A slot is a placeholder in a child component where parent components can inject custom content. Slots enable content distribution and component composition, making components flexible and reusable.

---

2) **What's the difference between a default slot and a named slot?**

- **Default slot**: Unnamed slot (`<slot></slot>`) that accepts any content passed directly to the component
- **Named slot**: Has a specific name (`<slot name="header">`) and must be targeted explicitly with `<template #header>`

---

3) **Write a component with a default slot that has fallback content "No content provided".**

```ts
<template>
  <div class="container">
    <slot>No content provided</slot>
  </div>
</template>
```

---

4) **How do you pass content to a named slot called "header"?**

```ts
<MyComponent>
  <template #header>
    <h1>This goes to the header slot</h1>
  </template>
</MyComponent>
```

---

5) **What is a scoped slot?**

A scoped slot is a slot that passes data from the child component back to the parent. The parent can use this data to customize how the content is rendered.

```ts
// Child passes data
<slot :user="user" :index="index"></slot>

// Parent receives and uses data
<template #default="{ user, index }">
  {{ index }}: {{ user.name }}
</template>
```

---

6) **Write a List component that provides `item` and `index` through a scoped slot.**

```ts
<script setup lang="ts">
defineProps<{
  items: any[]
}>()
</script>

<template>
  <ul>
    <li v-for="(item, index) in items" :key="index">
      <slot :item="item" :index="index"></slot>
    </li>
  </ul>
</template>
```

---

7) **How do you access slot props in the parent component?**

Use the `#slotName="slotProps"` syntax:

```ts
// Access all props
<template #default="slotProps">
  {{ slotProps.item }}
</template>

// Destructure specific props
<template #default="{ item, index }">
  {{ index }}: {{ item.name }}
</template>
```

---

8) **What is the purpose of the `useSlots()` function?**

`useSlots()` returns an object containing information about which slots have content. It's used to conditionally render slot containers.

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

9) **How do you check if a slot has content before rendering its container?**

```ts
<script setup lang="ts">
import { useSlots } from 'vue'

const slots = useSlots()
</script>

<template>
  <!-- Only render if slot has content -->
  <div v-if="slots.footer" class="footer">
    <slot name="footer"></slot>
  </div>
</template>
```

---

10) **What's wrong with this code?**
    ```ts
    <div class="header">
      <slot name="header"></slot>
    </div>
    ```

The `div.header` will always render, even if no header content is provided, resulting in an empty container. Fix it:

```ts
<div v-if="$slots.header" class="header">
  <slot name="header"></slot>
</div>
```

---

11) **Write the shorthand syntax for `v-slot:footer`.**

```ts
<template #footer>
  Footer content
</template>
```

---

12) **Can you have multiple default slots in a component?**

No, you can only have one default (unnamed) slot per component. Use named slots if you need multiple content areas.

---

13) **What is a renderless component?**

A renderless component provides logic through scoped slots without rendering any UI itself. It separates logic from presentation.

```ts
<script setup lang="ts">
const { data, loading } = useFetch('/api/data')
</script>

<template>
  <slot :data="data" :loading="loading"></slot>
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

14) **How do scoped slots differ from props?**

- **Props**: Parent passes data DOWN to child (parent → child)
- **Scoped slots**: Child passes data UP to parent's template (child → parent template)

Scoped slots allow the parent to control rendering while using the child's data.

---

15) **Write code to create a Card with header, body, and footer slots.**

```ts
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

---

16) **What are dynamic slot names and when would you use them?**

Dynamic slot names are determined at runtime based on component state or props.

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

Use when you need conditional slot rendering based on component configuration.

---

17) **How do you provide a fallback for a named slot?**

Place content between the `<slot>` tags:

```ts
<template>
  <div class="header">
    <slot name="header">
      <h1>Default Header</h1>
    </slot>
  </div>
</template>
```

---

18) **What is the `$slots` API used for?**

`$slots` is an object containing all slots provided to a component. In `<script setup>`, use `useSlots()` instead.

```ts
// Options API
if (this.$slots.header) { /* ... */ }

// Composition API
import { useSlots } from 'vue'
const slots = useSlots()
if (slots.header) { /* ... */ }
```

---

19) **Write a scoped slot that passes a `close` function to the parent.**

```ts
// Child component
<script setup lang="ts">
const emit = defineEmits<{
  close: []
}>()

const close = () => {
  emit('close')
}
</script>

<template>
  <div class="modal">
    <slot name="footer" :close="close">
      <button @click="close">Close</button>
    </slot>
  </div>
</template>

// Parent usage
<Modal>
  <template #footer="{ close }">
    <button @click="close">Cancel</button>
    <button @click="save(); close()">Save</button>
  </template>
</Modal>
```

---

20) **What's the difference between these two?**
    ```ts
    <template #default="slotProps">
    <template #default="{ item, index }">
    ```

- First: Accesses all slot props as `slotProps.item`, `slotProps.index`
- Second: Destructures specific props for direct access as `item`, `index`

The second is cleaner when you know which props you need.

---

21) **How do you create a table component with customizable column rendering?**

```ts
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
  <table>
    <thead>
      <tr>
        <th v-for="col in columns" :key="col.key">
          {{ col.label }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, index) in data" :key="index">
        <td v-for="col in columns" :key="col.key">
          <!-- Dynamic slot name for each column -->
          <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
            {{ row[col.key] }}
          </slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

// Usage
<Table :columns="columns" :data="users">
  <template #cell-status="{ value }">
    <span :class="value === 'active' ? 'green' : 'red'">
      {{ value }}
    </span>
  </template>
</Table>
```

---

22) **What accessibility considerations are important for slot-based components?**

- Use semantic HTML (proper headings, lists, etc.)
- Add ARIA attributes (`aria-label`, `aria-describedby`)
- Ensure keyboard navigation works
- Maintain logical focus order
- Provide text alternatives for icon-only buttons
- Use `role` attributes when needed

```ts
<div class="modal" role="dialog" aria-labelledby="modal-title">
  <h2 id="modal-title">
    <slot name="header"></slot>
  </h2>
  <div>
    <slot></slot>
  </div>
</div>
```

---

23) **Can you pass reactive data through scoped slots?**

Yes! Scoped slot props are reactive. When the child's data changes, the parent's template automatically updates.

```ts
<script setup lang="ts">
const count = ref(0)
</script>

<template>
  <slot :count="count"></slot>
  <!-- count is reactive, parent sees updates -->
</template>
```

---

24) **How do you handle empty states in a List component using slots?**

```ts
<script setup lang="ts">
import { useSlots } from 'vue'

defineProps<{
  items: any[]
}>()

const slots = useSlots()
</script>

<template>
  <div v-if="items.length === 0 && slots.empty">
    <slot name="empty"></slot>
  </div>
  
  <div v-else>
    <div v-for="item in items" :key="item.id">
      <slot :item="item"></slot>
    </div>
  </div>
</template>

// Usage
<List :items="users">
  <template #empty>
    <p>No users found.</p>
  </template>
  
  <template #default="{ item }">
    {{ item.name }}
  </template>
</List>
```

---

25) **What's the benefit of using slots over props for complex content?**

**Slots**:
- ✅ Allow full HTML/component composition
- ✅ Parent controls styling and structure
- ✅ No need to serialize complex templates
- ✅ More flexible and powerful
- ✅ Better for varying content

**Props**:
- Better for simple values (strings, numbers, booleans)
- Better for component configuration
- Type-safe with TypeScript

Use slots when content varies significantly; use props for configuration.
