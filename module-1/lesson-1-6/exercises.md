# Exercises - Lesson 1.6: Events & Emits

Complete these 5 exercises to practice event emission and component communication.

**Total Points**: 130

---

## Exercise 1: Dropdown with Emit (25 points)

Create a custom dropdown component that communicates selection via events.

### Requirements

**Component: `Dropdown.vue`**

**Props:**
- `modelValue`: string (selected value)
- `options`: Array of { value: string; label: string }
- `label`: string (dropdown label)
- `isDisabled`: boolean (default: false)

**Events:**
- `update:modelValue` - Emitted when selection changes
- `open` - Emitted when dropdown opens
- `close` - Emitted when dropdown closes

**Features:**
- Display button with selected option label
- Toggle dropdown on button click
- Show all options in dropdown menu
- Select option updates v-model
- Close on selection
- Close on outside click
- Keyboard navigation (arrow keys, Enter, Escape)

### Grading (25 points)

- [ ] 4 pts: v-model works correctly
- [ ] 5 pts: Dropdown opens/closes
- [ ] 4 pts: Options display and selection works
- [ ] 4 pts: Emit 'open' and 'close' events
- [ ] 4 pts: Keyboard navigation works
- [ ] 4 pts: Demo page with example

---

## Exercise 2: Form with Validation Events (30 points)

Build a form component that emits validation and submission events.

### Requirements

**Component: `ValidationForm.vue`**

**Props:**
- `submitText`: string (default: 'Submit')
- `cancelText`: string (default: 'Cancel')

**Events:**
- `submit` - Emitted with form data when valid
- `cancel` - Emitted when cancel clicked
- `field-error` - Emitted with field name and error message
- `field-valid` - Emitted with field name when field becomes valid

**Features:**
- Text input for name (required, min 2 chars)
- Email input (required, valid email)
- Message textarea (required, min 10 chars)
- Real-time field validation
- Emit error/valid events as user types
- Show validation status for each field
- Submit only if all fields valid
- Emit complete form data on submit

### Grading (30 points)

- [ ] 6 pts: All fields with validation rules
- [ ] 5 pts: Emit field-error events
- [ ] 5 pts: Emit field-valid events
- [ ] 5 pts: Submit only with valid data
- [ ] 4 pts: Emit submit with form data
- [ ] 5 pts: Demo showing validation feedback

---

## Exercise 3: Accordion Component (25 points)

Create an accordion that emits events for expand/collapse actions.

### Requirements

**Component: `Accordion.vue`**

**Props:**
- `items`: Array of { id: string; title: string; content: string }
- `allowMultiple`: boolean (default: false) - Allow multiple open
- `expanded`: string[] (array of open item IDs)

**Events:**
- `update:expanded` - Emitted when open items change
- `expand` - Emitted with item ID when expanding
- `collapse` - Emitted with item ID when collapsing

**Features:**
- Display accordion items with titles
- Click to expand/collapse
- Show content when expanded
- Emit expand/collapse events
- Single or multiple open items
- Smooth animations

### Grading (25 points)

- [ ] 5 pts: Items render correctly
- [ ] 5 pts: Expand/collapse works
- [ ] 5 pts: Emit 'expand' and 'collapse' events
- [ ] 5 pts: Multiple open mode works
- [ ] 3 pts: Animations smooth
- [ ] 2 pts: Demo page

---

## Exercise 4: Tabs Component (25 points)

Build a tab component using v-model and events for tab switching.

### Requirements

**Component: `Tabs.vue`**

**Props:**
- `modelValue`: string (active tab ID)
- `tabs`: Array of { id: string; label: string; content: string }

**Events:**
- `update:modelValue` - Emitted when active tab changes
- `change` - Emitted with old and new tab IDs

**Features:**
- Display tab buttons
- Show active tab content
- Switch tabs with buttons or v-model
- Emit change event with details
- Highlight active tab
- Keyboard navigation (arrow keys)

### Grading (25 points)

- [ ] 5 pts: Tab buttons display
- [ ] 5 pts: v-model works for active tab
- [ ] 5 pts: Content switches correctly
- [ ] 5 pts: Emit 'change' event with data
- [ ] 3 pts: Keyboard navigation
- [ ] 2 pts: Demo page

---

## Exercise 5: Shopping Cart with Events (25 points)

Build a cart component that emits events for item modifications.

### Requirements

**Component: `ShoppingCart.vue`**

**Props:**
- `items`: Array of { id: string; name: string; price: number; quantity: number }

**Events:**
- `update-quantity` - Emit with { itemId, quantity }
- `remove-item` - Emit with itemId
- `checkout` - Emit with complete cart data

**Features:**
- Display items with price, quantity
- Quantity increase/decrease buttons
- Remove item button
- Show subtotal
- Checkout button
- Emit events for all actions
- Calculate totals

### Grading (25 points)

- [ ] 4 pts: Items display with all info
- [ ] 5 pts: Quantity buttons emit events
- [ ] 5 pts: Remove button emits event
- [ ] 5 pts: Calculations correct
- [ ] 4 pts: Checkout button emits complete data
- [ ] 2 pts: Demo page

---

## Bonus Challenges (Optional)

### Bonus 1: Keyboard Event Handling (10 points)
Add keyboard navigation to Dropdown and Tabs components (arrow keys, Enter, Escape).

### Bonus 2: Event Debouncing (10 points)
Implement debounced search input that emits search events.

### Bonus 3: Custom Event Types (10 points)
Create custom event payload types for all components with full TypeScript support.

### Bonus 4: Component Events Documentation (10 points)
Write JSDoc comments documenting all events for each component with examples.

---

## Debugging Tips

### Issue: Events not firing
**Check:**
- Is `emit` called correctly?
- Are events declared in `defineEmits`?
- Is the parent listening with `@event-name`?

### Issue: v-model not updating
**Check:**
- Is prop named exactly `modelValue`?
- Is event named exactly `update:modelValue`?
- Is parent binding with `v-model` (not `:modelValue`)?

### Issue: Multiple clicks trigger event
**Check:**
- Use `@click` instead of `@click.left`
- Add `.stop` if clicking trigger element
- Check for accidental duplicate listeners

### Issue: Form submit doesn't work
**Check:**
- Use `@submit.prevent` to prevent page reload
- Ensure form validation passes
- Check emit is called with correct event name

---

## Validation Checklist

### General Requirements
- [ ] All components use `<script setup lang="ts">`
- [ ] All events declared with `defineEmits`
- [ ] Event names are kebab-case
- [ ] Events typed with TypeScript
- [ ] No prop mutations
- [ ] Demo pages show all functionality

### Event Communication
- [ ] Child emits events correctly
- [ ] Parent listens to all events
- [ ] Event payloads have correct data
- [ ] v-model components follow pattern
- [ ] Events don't cause prop mutations

### Code Quality
- [ ] Clean, readable code
- [ ] Proper error handling
- [ ] Consistent naming conventions
- [ ] Meaningful variable names
- [ ] Comments for complex logic

---

## Submission Requirements

For each exercise, provide:

1. **Component file(s)** - The Vue component(s)
2. **Demo file** - App.vue or demo page showing usage
3. **README** - Description of features and events

---

## Learning Outcomes

After completing these exercises, you should be confident with:

✅ Creating components that emit custom events  
✅ Listening to multiple events from children  
✅ Implementing v-model patterns  
✅ Handling event payloads with TypeScript  
✅ Building interactive components  
✅ Managing state through events  
✅ Following component communication best practices

---

## Next Steps

1. Complete all exercises
2. Review [Quiz Answers](./quiz-answers.md)
3. Proceed to [Module 1 Capstone Project](../capstone/README.md)
