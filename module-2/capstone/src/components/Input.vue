<template>
  <div class="input-wrapper">
    <!-- Lesson 2.5: Label with proper accessibility -->
    <label v-if="label" :for="inputId" class="input-label">
      {{ label }}
      <span v-if="required" class="input-required">*</span>
    </label>

    <!-- Main input with v-model binding -->
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      :placeholder="placeholder"
      :class="['input', { 'input-error': error }]"
      v-bind="$attrs"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />

    <!-- Error message -->
    <div v-if="error" class="input-error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
  /**
   * Input Component - Demonstrates Props & Two-way Binding (Lesson 2.5)
   *
   * Key Concepts:
   * - v-model binding (two-way communication)
   * - Props with defaults (Lesson 2.5)
   * - Custom events with emit (Lesson 2.5)
   * - Fallthrough attributes (Lesson 2.5)
   * - Accessibility (aria-*, for, required attributes)
   *
   * Features:
   * - Multiple input types: text, email, password, number
   * - Label support with proper accessibility
   * - Error state display
   * - Disabled state
   * - Placeholder text
   */

  import { computed } from 'vue'
  import type { InputType } from '../types'

  interface Props {
    modelValue: string
    label?: string
    type?: InputType
    placeholder?: string
    error?: string
    disabled?: boolean
    required?: boolean
    id?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    type: 'text',
    disabled: false,
    required: false,
  })

  defineEmits<{
    'update:modelValue': [value: string]
  }>()

  const inputId = computed(() => props.id || `input-${Math.random().toString(36).substr(2, 9)}`)
</script>

<style scoped>
  .input-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2);
  }

  .input-label {
    font-weight: 500;
    color: var(--color-text);
    font-size: var(--font-size-sm);
  }

  .input-required {
    color: var(--color-error);
    margin-left: var(--spacing-1);
  }

  .input {
    padding: var(--spacing-3) var(--spacing-4);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    background-color: var(--color-background);
    color: var(--color-text);
    font-family: inherit;
    font-size: var(--font-size-base);
    transition: all var(--transition-fast);
  }

  .input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 10%, transparent);
  }

  .input:disabled {
    background-color: var(--color-surface);
    color: var(--color-textSecondary);
    cursor: not-allowed;
    opacity: 0.6;
  }

  .input-error {
    border-color: var(--color-error);
  }

  .input-error:focus {
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-error) 10%, transparent);
  }

  .input-error-message {
    color: var(--color-error);
    font-size: var(--font-size-sm);
  }
</style>
