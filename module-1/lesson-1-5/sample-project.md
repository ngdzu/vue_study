# Sample Project: Reusable Button & Card Component Library

## Project Overview

Build a small component library with reusable `AppButton` and `AppCard` components that demonstrate proper prop usage, validation, and composition patterns.

**Estimated Time**: 45-60 minutes

---

## Learning Objectives

- Create components with well-defined prop interfaces
- Implement variant-based styling with props
- Use TypeScript for type-safe props
- Compose components together
- Handle default values and required props
- Apply proper naming conventions

---

## Requirements

### 1. AppButton Component

Create a flexible button component with the following features:

**Props:**
- `label` (string, optional) - Button text content
- `variant` ('primary' | 'secondary' | 'danger', default: 'primary') - Visual style
- `size` ('small' | 'medium' | 'large', default: 'medium') - Button size
- `isDisabled` (boolean, default: false) - Disabled state
- `isLoading` (boolean, default: false) - Loading state with spinner
- `icon` (string, optional) - Icon name/class to display

**Behavior:**
- Display different styles based on variant
- Scale appropriately based on size
- Show loading spinner when `isLoading` is true
- Disable clicks when `isDisabled` or `isLoading`
- Support both label prop and slot content
- Display icon if provided

**Validation:**
- `variant` must be one of: 'primary', 'secondary', 'danger'
- `size` must be one of: 'small', 'medium', 'large'

### 2. AppCard Component

Create a card component for displaying content:

**Props:**
- `title` (string, required) - Card title
- `subtitle` (string, optional) - Card subtitle
- `imageUrl` (string, optional) - Header image URL
- `imageAlt` (string, default: 'Card image') - Image alt text
- `isElevated` (boolean, default: false) - Add shadow effect
- `isPadded` (boolean, default: true) - Add padding to content

**Behavior:**
- Display title prominently
- Show subtitle if provided
- Display header image if `imageUrl` provided
- Apply elevation shadow if `isElevated`
- Apply content padding if `isPadded`
- Use slot for card body content

### 3. Demo Page

Create a demo page that showcases all component variants:

**Features:**
- Display all button variants (primary, secondary, danger)
- Display all button sizes (small, medium, large)
- Show buttons in loading and disabled states
- Display multiple cards with different configurations
- Demonstrate component composition (buttons inside cards)

---

## Implementation Guide

### File Structure

```
src/
├── components/
│   ├── AppButton.vue
│   └── AppCard.vue
├── App.vue
└── main.ts
```

### Step 1: Create AppButton Component

```ts
<!-- components/AppButton.vue -->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label?: string
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
  isDisabled?: boolean
  isLoading?: boolean
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium',
  isDisabled: false,
  isLoading: false
})

const buttonClasses = computed(() => {
  return [
    'app-button',
    `app-button--${props.variant}`,
    `app-button--${props.size}`,
    {
      'app-button--loading': props.isLoading,
      'app-button--disabled': props.isDisabled
    }
  ]
})

const isClickDisabled = computed(() => {
  return props.isDisabled || props.isLoading
})
</script>

<template>
  <button 
    :class="buttonClasses"
    :disabled="isClickDisabled"
  >
    <span v-if="isLoading" class="spinner">⏳</span>
    <span v-if="icon" class="icon">{{ icon }}</span>
    <span v-if="label">{{ label }}</span>
    <slot v-else />
  </button>
</template>

<style scoped>
.app-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.app-button:hover:not(.app-button--disabled):not(.app-button--loading) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.app-button:active:not(.app-button--disabled):not(.app-button--loading) {
  transform: translateY(0);
}

/* Variants */
.app-button--primary {
  background-color: #3490dc;
  color: white;
}

.app-button--primary:hover:not(.app-button--disabled):not(.app-button--loading) {
  background-color: #2779bd;
}

.app-button--secondary {
  background-color: #6c757d;
  color: white;
}

.app-button--secondary:hover:not(.app-button--disabled):not(.app-button--loading) {
  background-color: #5a6268;
}

.app-button--danger {
  background-color: #e3342f;
  color: white;
}

.app-button--danger:hover:not(.app-button--disabled):not(.app-button--loading) {
  background-color: #cc1f1a;
}

/* Sizes */
.app-button--small {
  padding: 6px 12px;
  font-size: 12px;
}

.app-button--medium {
  padding: 10px 20px;
  font-size: 14px;
}

.app-button--large {
  padding: 14px 28px;
  font-size: 16px;
}

/* States */
.app-button--disabled,
.app-button--loading {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
```

### Step 2: Create AppCard Component

```ts
<!-- components/AppCard.vue -->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  subtitle?: string
  imageUrl?: string
  imageAlt?: string
  isElevated?: boolean
  isPadded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  imageAlt: 'Card image',
  isElevated: false,
  isPadded: true
})

const cardClasses = computed(() => {
  return [
    'app-card',
    {
      'app-card--elevated': props.isElevated,
      'app-card--padded': props.isPadded
    }
  ]
})
</script>

<template>
  <div :class="cardClasses">
    <img 
      v-if="imageUrl" 
      :src="imageUrl" 
      :alt="imageAlt"
      class="app-card__image"
    />
    
    <div class="app-card__header">
      <h3 class="app-card__title">{{ title }}</h3>
      <p v-if="subtitle" class="app-card__subtitle">{{ subtitle }}</p>
    </div>
    
    <div class="app-card__body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.app-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.app-card--elevated {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.app-card--elevated:hover {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.15);
}

.app-card__image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.app-card__header {
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.app-card__title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #2d3748;
}

.app-card__subtitle {
  margin: 4px 0 0 0;
  font-size: 14px;
  color: #718096;
}

.app-card__body {
  padding: 0;
}

.app-card--padded .app-card__body {
  padding: 16px;
}
</style>
```

### Step 3: Create Demo Page

```ts
<!-- App.vue -->
<script setup lang="ts">
import AppButton from './components/AppButton.vue'
import AppCard from './components/AppCard.vue'
</script>

<template>
  <div class="app">
    <h1>Component Library Demo</h1>
    
    <!-- Button Variants -->
    <section>
      <h2>Button Variants</h2>
      <div class="demo-row">
        <AppButton variant="primary" label="Primary" />
        <AppButton variant="secondary" label="Secondary" />
        <AppButton variant="danger" label="Danger" />
      </div>
    </section>
    
    <!-- Button Sizes -->
    <section>
      <h2>Button Sizes</h2>
      <div class="demo-row">
        <AppButton size="small" label="Small" />
        <AppButton size="medium" label="Medium" />
        <AppButton size="large" label="Large" />
      </div>
    </section>
    
    <!-- Button States -->
    <section>
      <h2>Button States</h2>
      <div class="demo-row">
        <AppButton label="Normal" />
        <AppButton label="Disabled" :is-disabled="true" />
        <AppButton label="Loading" :is-loading="true" />
        <AppButton label="With Icon" icon="📧" />
      </div>
    </section>
    
    <!-- Cards -->
    <section>
      <h2>Cards</h2>
      <div class="cards-grid">
        <!-- Basic Card -->
        <AppCard title="Basic Card" subtitle="Simple card with no image">
          <p>This is a basic card with default settings.</p>
          <AppButton label="Learn More" />
        </AppCard>
        
        <!-- Card with Image -->
        <AppCard 
          title="Card with Image"
          subtitle="Includes header image"
          image-url="https://via.placeholder.com/400x200"
          :is-elevated="true"
        >
          <p>This card has an image and elevation shadow.</p>
          <div style="display: flex; gap: 8px; margin-top: 12px;">
            <AppButton label="Save" size="small" />
            <AppButton label="Cancel" variant="secondary" size="small" />
          </div>
        </AppCard>
        
        <!-- Elevated Card -->
        <AppCard 
          title="Elevated Card"
          subtitle="With shadow effect"
          :is-elevated="true"
        >
          <p>This card has the elevated prop enabled for a shadow effect.</p>
          <AppButton label="Action" variant="primary" />
        </AppCard>
        
        <!-- No Padding Card -->
        <AppCard 
          title="No Padding"
          subtitle="Custom content spacing"
          :is-padded="false"
        >
          <div style="padding: 20px; background: #f7fafc;">
            <p style="margin: 0;">This card has no default padding.</p>
          </div>
        </AppCard>
      </div>
    </section>
  </div>
</template>

<style scoped>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: system-ui, -apple-system, sans-serif;
}

h1 {
  font-size: 32px;
  margin-bottom: 40px;
  color: #2d3748;
}

h2 {
  font-size: 24px;
  margin: 32px 0 16px 0;
  color: #4a5568;
}

section {
  margin-bottom: 40px;
}

.demo-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}
</style>
```

---

## Validation Checklist

### AppButton Component
- [ ] Accepts `label`, `variant`, `size`, `isDisabled`, `isLoading`, `icon` props
- [ ] Default variant is 'primary'
- [ ] Default size is 'medium'
- [ ] Displays loading spinner when `isLoading` is true
- [ ] Button is disabled when `isDisabled` or `isLoading`
- [ ] Hover effects work on enabled buttons
- [ ] Supports slot content when `label` is not provided
- [ ] TypeScript types are correct

### AppCard Component
- [ ] Accepts `title` (required), `subtitle`, `imageUrl`, `imageAlt`, `isElevated`, `isPadded` props
- [ ] Title is always displayed
- [ ] Subtitle only shows when provided
- [ ] Image only shows when `imageUrl` provided
- [ ] Elevation shadow applies when `isElevated` is true
- [ ] Content padding applies when `isPadded` is true
- [ ] Slot content displays in card body
- [ ] TypeScript types are correct

### Demo Page
- [ ] All button variants displayed
- [ ] All button sizes displayed
- [ ] Button states (normal, disabled, loading, with icon) shown
- [ ] Multiple cards with different configurations
- [ ] Cards contain buttons (component composition)
- [ ] Layout is responsive

---

## Extension Challenges

1. **Icon Integration**: Add support for icon libraries (e.g., Font Awesome, Material Icons)

2. **Button Loading Text**: Add `loadingText` prop that changes button text while loading

3. **Card Actions Slot**: Add a footer slot to `AppCard` for action buttons

4. **Theme Support**: Add `theme` prop to both components ('light' | 'dark')

5. **Animation**: Add enter/leave transitions to cards

6. **Accessibility**: Add proper ARIA attributes to both components

7. **Card Click**: Make entire card clickable with `isClickable` prop

8. **Button Group**: Create `AppButtonGroup` component that manages spacing

---

## Common Issues & Solutions

### Issue: Button label not updating
**Problem**: Label prop changes but button text doesn't update

**Solution**: Ensure you're using `:label` (v-bind) for dynamic values:
```ts
<!-- ❌ Wrong -->
<AppButton label="count" />

<!-- ✅ Correct -->
<AppButton :label="`Count: ${count}`" />
```

### Issue: All cards share same image
**Problem**: Changing image in one card affects others

**Solution**: This shouldn't happen with props. Check you're not mutating shared state.

### Issue: TypeScript errors with props
**Problem**: TypeScript complains about prop types

**Solution**: Ensure you're using `withDefaults` correctly:
```ts
const props = withDefaults(defineProps<Props>(), {
  variant: 'primary'  // Must match type from Props interface
})
```

### Issue: Styles not scoped
**Problem**: Button styles affecting other elements

**Solution**: Ensure `<style scoped>` is used and class names are specific

---

## Learning Outcomes

After completing this project, you should be able to:

✅ Create reusable components with well-defined interfaces  
✅ Use TypeScript for type-safe props  
✅ Implement variant-based styling patterns  
✅ Handle default values and required props correctly  
✅ Compose components together effectively  
✅ Apply proper naming conventions (PascalCase, camelCase, kebab-case)  
✅ Create flexible components using props and slots  
✅ Build component libraries with consistent APIs

---

## Next Steps

After completing this project:

1. Complete the [Quiz](./quiz.md) to test your understanding
2. Work through the [Exercises](./exercises.md) for additional practice
3. Proceed to [Lesson 1.6: Events & Emits](../lesson-1-6/README.md)
