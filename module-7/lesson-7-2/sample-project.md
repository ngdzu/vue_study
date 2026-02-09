# Sample Project: Button Component Test Suite

## Overview

Create a comprehensive test suite for a reusable Button component. This teaches you to test component props, event emissions, conditional rendering, and accessibility.

## Component Specification

Create `src/components/Button.vue`:

```vue
<template>
  <button
    :class="[
      'btn',
      `btn-${variant}`,
      { 'btn-disabled': disabled },
      { 'btn-loading': isLoading },
    ]"
    :disabled="disabled || isLoading"
    @click="handleClick"
  >
    <span v-if="isLoading" class="spinner"></span>
    <span>{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
defineProps({
  label: {
    type: String,
    required: true,
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (v: string) => ['primary', 'secondary', 'danger'].includes(v),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  click: [];
}>();

const handleClick = () => {
  emit('click');
};
</script>

<style scoped>
.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #545b62;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background-color: #c82333;
}

.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-loading {
  opacity: 0.7;
  cursor: wait;
}

.spinner {
  display: inline-block;
  width: 1em;
  height: 1em;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.6s linear infinite;
  margin-right: 0.5em;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
```

## Test Requirements

Create `src/components/Button.test.ts` with comprehensive tests:

### 1. Rendering Tests
- ✅ Renders with required label prop
- ✅ Displays text correctly
- ✅ Renders as button element

### 2. Props Tests
- ✅ Supports all variant types (primary, secondary, danger)
- ✅ Applies correct CSS class based on variant
- ✅ Disabled prop prevents clicks
- ✅ isLoading prop shows spinner
- ✅ Invalid variant is rejected

### 3. Event Tests
- ✅ Emits click event when clicked
- ✅ Does not emit click when disabled
- ✅ Does not emit click when loading
- ✅ Click event is emitted only once per click

### 4. CSS Class Tests
- ✅ Has 'btn' class always
- ✅ Has variant class (btn-primary, etc.)
- ✅ Has 'btn-disabled' class when disabled
- ✅ Has 'btn-loading' class when loading
- ✅ Multiple classes applied together correctly

### 5. Attribute Tests
- ✅ Button is disabled when disabled prop is true
- ✅ Button is disabled when isLoading is true
- ✅ Button is enabled by default

### 6. Content Tests
- ✅ Shows spinner when loading
- ✅ Shows label text
- ✅ Spinner disappears when not loading

### 7. Props Updates
- ✅ Variant change applies new class
- ✅ Disabled state can be toggled
- ✅ Loading state can be toggled

## Test Structure Example

```ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Button from './Button.vue';

describe('Button', () => {
  describe('Rendering', () => {
    it('should render with label prop', () => {
      const wrapper = mount(Button, {
        props: { label: 'Click Me' }
      });
      expect(wrapper.text()).toContain('Click Me');
    });
    // More rendering tests
  });

  describe('Variants', () => {
    it('should apply primary variant by default', () => {
      const wrapper = mount(Button, {
        props: { label: 'Button' }
      });
      expect(wrapper.classes()).toContain('btn-primary');
    });
    // More variant tests
  });

  describe('Disabled State', () => {
    it('should prevent click when disabled', async () => {
      const wrapper = mount(Button, {
        props: { label: 'Button', disabled: true }
      });
      await wrapper.find('button').trigger('click');
      expect(wrapper.emitted('click')).toBeFalsy();
    });
    // More disabled tests
  });

  describe('Loading State', () => {
    it('should show spinner when loading', () => {
      const wrapper = mount(Button, {
        props: { label: 'Button', isLoading: true }
      });
      expect(wrapper.find('.spinner').exists()).toBe(true);
    });
    // More loading tests
  });

  describe('Events', () => {
    it('should emit click event when clicked', async () => {
      const wrapper = mount(Button, {
        props: { label: 'Button' }
      });
      await wrapper.find('button').trigger('click');
      expect(wrapper.emitted('click')).toBeTruthy();
    });
    // More event tests
  });
});
```

## Grading Criteria

✅ All tests pass  
✅ Every aspect of Button component is tested  
✅ Tests cover props, events, rendering, and styling  
✅ Edge cases are covered (disabled + loading, etc.)  
✅ Test names clearly describe what is tested  
✅ Tests use proper @vue/test-utils API  
✅ Code coverage > 95% for Button.vue

## Bonus Challenges

1. **Async Testing**: Add async click handler and test promise resolution
2. **Slot Support**: Add support for icon slot in button and test it
3. **Keyboard Testing**: Test keyboard accessibility (Enter key support)
4. **Accessibility**: Test ARIA attributes (aria-label, aria-disabled, etc.)
