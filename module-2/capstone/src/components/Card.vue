<template>
  <div :class="['card', `card-${variant}`]">
    <!-- Lesson 2.4: Named slot for header -->
    <div v-if="$slots.header" class="card-header">
      <slot name="header" />
    </div>

    <!-- Lesson 2.4: Default slot for body content -->
    <div class="card-body">
      <slot />
    </div>

    <!-- Lesson 2.4: Named slot for footer -->
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
  /**
   * Card Component - Demonstrates Slots (Lesson 2.4)
   *
   * Key Concepts:
   * - Named slots for flexible layout (Lesson 2.4)
   * - Conditional rendering with $slots (Lesson 2.4)
   * - Default slot fallback (Lesson 2.4)
   *
   * Features:
   * - Multiple variants: default, elevated, outlined
   * - Flexible header, body, and footer sections
   * - Responsive design
   */

  import type { CardVariant } from '../types'

  withDefaults(
    defineProps<{
      variant?: CardVariant
    }>(),
    {
      variant: 'default',
    }
  )
</script>

<style scoped>
  .card {
    background-color: var(--color-surface);
    border-radius: var(--radius-lg);
    overflow: hidden;
    transition: all var(--transition-base);
  }

  .card-default {
    border: 1px solid var(--color-border);
  }

  .card-elevated {
    box-shadow: var(--shadow-lg);
  }

  .card-elevated:hover {
    box-shadow: var(--shadow-xl);
    transform: translateY(-2px);
  }

  .card-outlined {
    border: 2px solid var(--color-border);
  }

  .card-header {
    padding: var(--spacing-6);
    border-bottom: 1px solid var(--color-border);
    font-weight: 600;
  }

  .card-body {
    padding: var(--spacing-6);
  }

  .card-footer {
    padding: var(--spacing-6);
    border-top: 1px solid var(--color-border);
    background-color: color-mix(in srgb, var(--color-border) 20%, transparent);
  }
</style>
