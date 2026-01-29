# Exercises, Validation, and Grading — Lesson 2.5

## Exercise A: BaseTextarea Component

Goal: Create a textarea wrapper with proper attribute forwarding.

**Requirements**
- Props: `label`, `error`, `hint`, `required`, `maxLength`, `rows`
- Show character count if `maxLength` provided
- Auto-resize based on content (optional)
- Forward all HTML attributes to `<textarea>`
- Accessible error/hint messages

**Grading** (25 points)
- Props and forwarding (10 pts)
- Character counter (5 pts)
- Auto-resize (5 pts)
- Accessibility (5 pts)

---

## Exercise B: BaseCheckbox Component

Goal: Create a checkbox wrapper with label support.

**Requirements**
- Props: `label`, `description`, `error`, `modelValue`
- Support `v-model`
- Forward all attributes to `<input type="checkbox">`
- Proper label-input association
- Indeterminate state support

**Grading** (20 points)
- v-model binding (8 pts)
- Attribute forwarding (6 pts)
- Accessibility (6 pts)

---

## Exercise C: Multi-root Component with Attrs

Goal: Build a component with multiple root elements that properly handles attributes.

**Requirements**
- Create a `Stat` component with icon, label, and value
- Three root elements (no wrapper)
- Use `inheritAttrs: false`
- Apply attrs to the value element
- TypeScript types

**Grading** (20 points)
- Multi-root structure (8 pts)
- Attribute handling (8 pts)
- TypeScript (4 pts)

---

## Exercise D: Props Destructuring Practice

Goal: Practice correct props destructuring patterns.

**Requirements**
- Fix broken reactivity in provided components
- Use `toRefs` correctly
- Create computed props from destructured values
- Demonstrate when destructuring is safe

**Grading** (15 points)
- Correct use of `toRefs` (8 pts)
- Computed props (4 pts)
- Understanding safe destructuring (3 pts)

---

## Exercise E: Configurable Icon Button

Goal: Build a button that accepts both icon and text with all HTML button attributes.

**Requirements**
- Props: `icon`, `iconPosition` ('left' | 'right'), `variant`, `size`
- Slot for button text
- Forward all attributes
- Loading state with spinner
- Accessible (icon has aria-label if no text)

**Grading** (20 points)
- Icon positioning (6 pts)
- Attribute forwarding (6 pts)
- Accessibility (4 pts)
- Loading state (4 pts)

---

## Summary

Total: 100 points

Focus on:
- Proper `inheritAttrs: false` usage
- `v-bind="$attrs"` for manual forwarding
- Maintaining reactivity with `toRefs`
- Creating accessible wrapper components
- TypeScript type safety
