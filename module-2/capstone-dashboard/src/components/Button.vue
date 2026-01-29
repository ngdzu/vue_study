<template>
  <button
    :class="[
      'btn',
      `btn-${variant}`,
      `btn-${size}`,
      { 'btn-full': full },
      { 'btn-disabled': disabled }
    ]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'outline' | 'gradient'
    size?: 'sm' | 'md' | 'lg'
    full?: boolean
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    full: false,
    disabled: false
  }
)

defineEmits<{
  click: []
}>()
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  border: none;
  border-radius: var(--radius-glass);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.875rem;
  white-space: nowrap;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
}

.btn-md {
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
}

.btn-lg {
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
}

.btn-full {
  width: 100%;
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:hover:not(.btn-disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.btn-secondary {
  background: rgba(102, 126, 234, 0.1);
  color: var(--color-primary);
  border: 1px solid rgba(102, 126, 234, 0.3);
}

.btn-secondary:hover:not(.btn-disabled) {
  background: rgba(102, 126, 234, 0.2);
  border-color: var(--color-primary);
}

.btn-outline {
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.btn-outline:hover:not(.btn-disabled) {
  background: rgba(102, 126, 234, 0.1);
}

.btn-gradient {
  background: linear-gradient(135deg, var(--color-accent), var(--color-primary));
  color: white;
  box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);
}

.btn-gradient:hover:not(.btn-disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 212, 255, 0.5);
}

.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-disabled:hover {
  transform: none;
}
</style>
