# Exercises, Validation, and Grading — Lesson 2.4

## Exercise A: Modal Component with Slots

Goal: Build a flexible modal component with named and scoped slots.

**Requirements**
- Named slots: `header`, `default` (body), `footer`
- Scoped slot in footer providing `close` function
- `v-model` binding for open/closed state
- Overlay click to close
- ESC key to close
- Teleport to body
- Transition animation
- Prevent body scroll when open

**Validation**
- Modal opens and closes correctly
- Overlay click closes modal
- ESC key closes modal
- Body scroll prevented when modal open
- Smooth transitions
- Footer slot receives close function

**Grading** (25 points)
- Named slots implementation (8 pts)
- Scoped slot with close function (5 pts)
- v-model binding (4 pts)
- Keyboard and overlay interactions (5 pts)
- Transitions and accessibility (3 pts)

---

## Exercise B: Data Table with Custom Columns

Goal: Create a table component with scoped slots for column customization.

**Requirements**
- Accept `columns` and `data` props
- Dynamic slot names for each column (`cell-{columnKey}`)
- Header slots for custom column headers
- Default cell rendering (fallback)
- Sortable columns (click header to sort)
- Row click event
- Empty state
- TypeScript types

**Validation**
- Table renders data correctly
- Custom cell slots override default rendering
- Sorting works on column headers
- Empty state displays when no data
- Row click emits event with row data

**Grading** (30 points)
- Dynamic scoped slots (10 pts)
- Sorting functionality (8 pts)
- TypeScript types (5 pts)
- Empty state and fallbacks (4 pts)
- Events and interaction (3 pts)

---

## Exercise C: Tabs Component

Goal: Build a tabs component with dynamic slot-based content.

**Requirements**
- Accept `tabs` prop (array of tab names)
- Named slot for each tab content
- Active tab indicator
- Keyboard navigation (arrow keys)
- Lazy rendering (only render active tab content)
- URL hash synchronization (optional)
- Transition between tabs

**Implementation Hint**

```ts
// Tabs.vue
<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  tabs: string[]
  modelValue?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const activeTab = ref(props.modelValue || props.tabs[0])
</script>

<template>
  <div class="tabs">
    <div class="tab-headers">
      <button
        v-for="tab in tabs"
        :key="tab"
        :class="{ active: activeTab === tab }"
        @click="activeTab = tab; emit('update:modelValue', tab)"
      >
        {{ tab }}
      </button>
    </div>
    
    <div class="tab-content">
      <slot :name="activeTab"></slot>
    </div>
  </div>
</template>
```

**Validation**
- Tabs render correctly
- Clicking tab changes active content
- Keyboard navigation works
- Lazy rendering (inactive tabs not in DOM)
- Smooth transitions

**Grading** (25 points)
- Dynamic slot names (8 pts)
- Tab switching (5 pts)
- Keyboard navigation (5 pts)
- Lazy rendering (4 pts)
- Transitions and styling (3 pts)

---

## Exercise D: Form Layout with Slots

Goal: Create a flexible form layout component using slots.

**Requirements**
- Slots: `title`, `description`, `fields`, `actions`
- Responsive layout (stacked on mobile, side-by-side on desktop)
- Optional sections (only render if slot has content)
- Loading state overlay
- Error state display
- Form submission prevention

**Validation**
- All slots render in correct positions
- Responsive layout works
- Empty slots don't create empty containers
- Loading overlay works
- Accessible form structure

**Grading** (20 points)
- Multiple named slots (8 pts)
- Conditional rendering (5 pts)
- Responsive layout (4 pts)
- Accessibility (3 pts)

---

## Bonus Challenge: Accordion Component

Goal: Create an accordion with dynamic slots for each panel.

**Requirements**
- Accept `items` array with `{ id, title }` objects
- Scoped slot for each panel content
- Only one panel open at a time
- Expand/collapse animation
- Keyboard navigation
- ARIA attributes for accessibility

**Implementation**

```ts
<script setup lang="ts">
import { ref } from 'vue'

interface AccordionItem {
  id: string
  title: string
}

defineProps<{
  items: AccordionItem[]
}>()

const activeId = ref<string | null>(null)

const toggle = (id: string) => {
  activeId.value = activeId.value === id ? null : id
}
</script>

<template>
  <div class="accordion">
    <div
      v-for="item in items"
      :key="item.id"
      class="accordion-item"
    >
      <button
        class="accordion-header"
        @click="toggle(item.id)"
        :aria-expanded="activeId === item.id"
      >
        {{ item.title }}
      </button>
      
      <div
        v-if="activeId === item.id"
        class="accordion-content"
      >
        <slot :name="`panel-${item.id}`" :item="item"></slot>
      </div>
    </div>
  </div>
</template>
```

**Grading** (20 bonus points)
- Dynamic slot names (8 pts)
- Single panel open logic (5 pts)
- Animations (4 pts)
- Accessibility (3 pts)

---

## Summary

Total: 100 points (+ 20 bonus)

Focus on:
- Named slots for flexible layouts
- Scoped slots for data passing
- Conditional slot rendering
- Accessibility and keyboard navigation
- Smooth transitions and animations

Master these exercises to build production-ready component libraries!
