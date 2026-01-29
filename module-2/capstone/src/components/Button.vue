<template>
  <button
    :class="[
      'btn',
      `btn-${variant}`,
      `btn-${size}`,
      { 'btn-disabled': disabled },
      $attrs.class,
    ]"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <!-- Lesson 2.4: Slot for flexible content -->
    <slot />
  </button>
</template>

<script setup lang="ts">
  /**
   * Button Component - Demonstrates Advanced Props (Lesson 2.5)
   *
   * Key Concepts:
   * - Props destructuring and defaults (Lesson 2.5)
   * - Fallthrough attributes with v-bind="$attrs" (Lesson 2.5)
   * - Slot for content composition (Lesson 2.4)
   *
   * Features:
   * - Multiple variants: primary, secondary, danger, ghost
   * - Multiple sizes: sm, md, lg
   * - Disabled state
   * - Accepts all native button attributes (aria-label, data-*, etc.)
   */

  import type { ButtonVariant, ButtonSize } from '../types'

  withDefaults(
    defineProps<{
      variant?: ButtonVariant
      size?: ButtonSize
      disabled?: boolean
    }>(),
    {
      variant: 'primary',
      size: 'md',
      disabled: false,
    }
  )
</script>

<style scoped>
  .btn {
    font-family: inherit;
    font-weight: 500;
    border: none;
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all var(--transition-fast);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
  }

  /* Sizes */
  .btn-sm {
    padding: var(--spacing-2) var(--spacing-4);
    font-size: var(--font-size-sm);
  }

  .btn-md {
    padding: var(--spacing-3) var(--spacing-6);
    font-size: var(--font-size-base);
  }

  .btn-lg {
    padding: var(--spacing-4) var(--spacing-8);
    font-size: var(--font-size-lg);
  }

  /* Variants */
  .btn-primary {
    background-color: var(--color-primary);
    color: white;
    box-shadow: var(--shadow-sm);
  }

  .btn-primary:hover:not(.btn-disabled) {
    background-color: color-mix(in srgb, var(--color-primary) 85%, black);
    box-shadow: var(--shadow-md);
  }

  .btn-primary:active:not(.btn-disabled) {
    transform: scale(0.98);
  }

  .btn-secondary {
    background-color: var(--color-secondary);
    color: white;
    box-shadow: var(--shadow-sm);
  }

  .btn-secondary:hover:not(.btn-disabled) {
    background-color: color-mix(in srgb, var(--color-secondary) 85%, black);
    box-shadow: var(--shadow-md);
  }

  .btn-danger {
    background-color: var(--color-error);
    color: white;
  }

  .btn-danger:hover:not(.btn-disabled) {
    background-color: color-mix(in srgb, var(--color-error) 85%, black);
  }

  .btn-ghost {
    background-color: transparent;
    color: var(--color-text);
    border: 2px solid var(--color-border);
  }

  .btn-ghost:hover:not(.btn-disabled) {
    background-color: var(--color-surface);
    border-color: var(--color-text);
  }

  .btn-disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>
