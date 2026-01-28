# Exercises - Lesson 1.5: Component Basics & Props

Complete these 5 exercises to practice component creation and prop usage.

**Total Points**: 130

---

## Exercise 1: Alert Component Library (25 points)

Create a flexible alert component with multiple variants.

### Requirements

**Component: `AppAlert.vue`**

**Props:**
- `variant`: 'info' | 'success' | 'warning' | 'error' (default: 'info')
- `title`: string (required)
- `message`: string (optional)
- `isDismissible`: boolean (default: false)
- `icon`: string (optional) - emoji or icon class

**Features:**
- Different colors for each variant
- Show close button if `isDismissible`
- Emit 'close' event when dismissed
- Use slot for custom content if `message` not provided
- Display icon if provided

**Demo page** showing all variants with dismissible and non-dismissible versions.

### Grading (25 points)

- [ ] 5 pts: All props defined with correct types
- [ ] 5 pts: All variants have distinct styling
- [ ] 4 pts: Dismissible functionality works
- [ ] 4 pts: Close event is emitted
- [ ] 3 pts: Icon displays when provided
- [ ] 4 pts: Demo page shows all variants

### Validation

```ts
// Test cases
<AppAlert variant="success" title="Success!" message="Operation completed" />
<AppAlert variant="error" title="Error" :is-dismissible="true" />
<AppAlert variant="warning" title="Warning" icon="⚠️">
  <p>Custom content via slot</p>
</AppAlert>
```

---

## Exercise 2: Product Card Component (30 points)

Build a product card for an e-commerce site.

### Requirements

**Component: `ProductCard.vue`**

**Props:**
- `product`: Object with structure:
  ```ts
  {
    id: string
    name: string
    price: number
    imageUrl: string
    rating: number  // 0-5
    inStock: boolean
    discount?: number  // percentage (0-100)
  }
  ```
- `showActions`: boolean (default: true)
- `size`: 'small' | 'medium' | 'large' (default: 'medium')

**Features:**
- Display product image, name, price
- Show star rating (use ⭐ emoji)
- Display "Out of Stock" badge if not in stock
- Show discount badge if discount exists
- Calculate and show discounted price
- Show Add to Cart button if `showActions` is true
- Emit 'add-to-cart' event with product id

**Demo page** with multiple products in different states.

### Grading (30 points)

- [ ] 6 pts: Product interface defined correctly
- [ ] 5 pts: All product info displayed
- [ ] 4 pts: Star rating renders correctly
- [ ] 4 pts: Discount calculation is accurate
- [ ] 4 pts: Out of stock handling
- [ ] 4 pts: Add to cart event emitted
- [ ] 3 pts: Size prop affects card dimensions

### Validation

```ts
const product = {
  id: '1',
  name: 'Laptop',
  price: 999,
  imageUrl: '/laptop.jpg',
  rating: 4.5,
  inStock: true,
  discount: 20
}

// Should display:
// - Original price: $999
// - Discounted price: $799.20
// - 4.5 stars (⭐⭐⭐⭐½)
// - 20% off badge
```

---

## Exercise 3: Form Input Component (25 points)

Create a reusable form input with validation display.

### Requirements

**Component: `AppInput.vue`**

**Props:**
- `modelValue`: string (for v-model support)
- `label`: string (required)
- `type`: 'text' | 'email' | 'password' | 'number' (default: 'text')
- `placeholder`: string (optional)
- `error`: string (optional) - error message to display
- `isRequired`: boolean (default: false)
- `isDisabled`: boolean (default: false)

**Features:**
- Display label with required indicator if `isRequired`
- Show error message in red if `error` prop is set
- Emit 'update:modelValue' for two-way binding
- Apply error styling when error exists
- Disable input when `isDisabled`

**Demo form** with multiple inputs, some with errors.

### Grading (25 points)

- [ ] 5 pts: All props defined correctly
- [ ] 5 pts: v-model works (update:modelValue emitted)
- [ ] 4 pts: Error display and styling
- [ ] 4 pts: Required indicator shown
- [ ] 4 pts: Disabled state works
- [ ] 3 pts: Demo form with validation examples

### Validation

```ts
// Test v-model
<script setup lang="ts">
import { ref } from 'vue'
const email = ref('')
</script>

<template>
  <AppInput
    v-model="email"
    label="Email"
    type="email"
    :is-required="true"
    :error="emailError"
  />
</template>
```

---

## Exercise 4: Multi-Variant Badge Component (25 points)

Build a badge component for labels and status indicators.

### Requirements

**Component: `AppBadge.vue`**

**Props:**
- `label`: string (required)
- `variant`: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
- `size`: 'small' | 'medium' | 'large' (default: 'medium')
- `isPill`: boolean (default: false) - rounded pill shape
- `isDot`: boolean (default: false) - show colored dot before text

**Features:**
- Different colors for each variant
- Size affects padding and font size
- Pill shape has full border-radius
- Dot indicator appears before label
- Support for icon via slot

**Demo page** showing all combinations.

### Grading (25 points)

- [ ] 5 pts: All variants have distinct colors
- [ ] 4 pts: Size prop affects badge dimensions
- [ ] 4 pts: Pill shape renders correctly
- [ ] 4 pts: Dot indicator displays
- [ ] 4 pts: Slot for custom content works
- [ ] 4 pts: Comprehensive demo page

### Validation

```ts
<AppBadge label="New" variant="success" size="small" :is-pill="true" />
<AppBadge label="Beta" variant="info" :is-dot="true" />
<AppBadge variant="danger" size="large">
  <template #default>
    🔥 Hot
  </template>
</AppBadge>
```

---

## Exercise 5: Data Table Component (25 points)

Create a simple data table component with prop-based configuration.

### Requirements

**Component: `AppTable.vue`**

**Props:**
- `columns`: Array of column definitions:
  ```ts
  {
    key: string      // property key in data
    label: string    // column header text
    sortable?: boolean
    width?: string   // CSS width value
  }
  ```
- `data`: Array of objects (any structure)
- `isStriped`: boolean (default: false) - alternating row colors
- `isBordered`: boolean (default: true)
- `emptyMessage`: string (default: 'No data available')

**Features:**
- Render table headers from columns
- Render table rows from data
- Show empty message when no data
- Apply striped styling if enabled
- Apply borders if enabled
- Emit 'row-click' event with row data

### Grading (25 points)

- [ ] 6 pts: Columns and data interfaces defined
- [ ] 5 pts: Table renders correctly
- [ ] 4 pts: Empty state displays
- [ ] 4 pts: Striped and bordered options work
- [ ] 4 pts: Row click event emitted
- [ ] 2 pts: Demo with sample data

### Validation

```ts
const columns = [
  { key: 'id', label: 'ID', width: '60px' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role', width: '100px' }
]

const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'User' }
]

<AppTable 
  :columns="columns" 
  :data="users" 
  :is-striped="true"
  @row-click="handleRowClick"
/>
```

---

## Bonus Challenges (Optional)

### Bonus 1: Theme Support (10 points)
Add a `theme` prop ('light' | 'dark') to all components and adjust colors accordingly.

### Bonus 2: Accessibility (10 points)
Add proper ARIA attributes to all components (aria-label, role, aria-required, etc.).

### Bonus 3: Component Documentation (10 points)
Add JSDoc comments documenting all props, events, and usage examples for each component.

### Bonus 4: Prop Validation (10 points)
Add custom validators for all enum-type props to ensure valid values.

---

## Debugging Tips

### Issue: Props not updating
**Check:**
- Are you using `:prop` (v-bind) for dynamic values?
- Is the parent state actually changing?
- Is the prop name spelled correctly?

### Issue: TypeScript errors
**Check:**
- Did you use `withDefaults` for optional props?
- Are your types matching the interface?
- Did you import types correctly?

### Issue: Styles not working
**Check:**
- Is `<style scoped>` used?
- Are class names spelled correctly?
- Are computed classes returning proper values?

### Issue: Events not firing
**Check:**
- Did you define the event with `defineEmits`?
- Are you calling `emit()` correctly?
- Is the parent listening to the right event name?

---

## Validation Checklist

### General Requirements
- [ ] All components use `<script setup lang="ts">`
- [ ] All props have TypeScript types
- [ ] Required props are marked correctly
- [ ] Default values use factory functions for objects/arrays
- [ ] Components use scoped styles
- [ ] Component names are PascalCase
- [ ] Prop names are camelCase in script, kebab-case in templates

### Functionality
- [ ] All required features implemented
- [ ] Props affect component behavior correctly
- [ ] Events emit with correct payloads
- [ ] Demo pages show all variants/states
- [ ] No console errors or warnings

### Code Quality
- [ ] No prop mutations
- [ ] Proper use of computed for derived values
- [ ] Clean, readable code
- [ ] Consistent formatting
- [ ] Meaningful variable names

---

## Submission Requirements

For each exercise, provide:

1. **Component file(s)** - The Vue component(s)
2. **Demo file** - App.vue or demo page showing usage
3. **README** - Brief description of features implemented

**Optional**: Deploy your components to a live demo (Netlify, Vercel, etc.)

---

## Learning Outcomes

After completing these exercises, you should be confident with:

✅ Creating components with well-defined prop interfaces  
✅ Using TypeScript for type-safe components  
✅ Implementing variant-based styling patterns  
✅ Handling required and optional props  
✅ Emitting events from child components  
✅ Composing components together  
✅ Building reusable component libraries  
✅ Following Vue.js best practices and conventions

---

## Next Steps

1. Complete all exercises
2. Review [Quiz Answers](./quiz-answers.md) for any questions you missed
3. Proceed to [Lesson 1.6: Events & Emits](../lesson-1-6/README.md)
