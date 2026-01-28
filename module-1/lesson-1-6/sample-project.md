# Sample Project: Modal Dialog with Event Communication

## Project Overview

Build a modal dialog system and a modal launcher component that demonstrate event emission, event listening, and complex component communication patterns.

**Estimated Time**: 45-60 minutes

---

## Learning Objectives

- Create components that emit custom events
- Listen to multiple events from child components
- Implement v-model for modal state
- Handle event payloads with TypeScript
- Build reusable dialog patterns
- Implement confirm/cancel workflows

---

## Requirements

### 1. Modal Component

Create a reusable modal dialog component:

**Props:**
- `modelValue` (boolean) - Whether modal is open
- `title` (string, required) - Modal title
- `confirmText` (string, default: 'Confirm') - Confirm button text
- `cancelText` (string, default: 'Cancel') - Cancel button text
- `showCancel` (boolean, default: true) - Whether to show cancel button
- `isLoading` (boolean, default: false) - Show loading state on confirm button

**Events:**
- `update:modelValue` - Emitted when modal should close
- `confirm` - Emitted when confirm button clicked
- `cancel` - Emitted when cancel button clicked (or backdrop clicked)

**Behavior:**
- Display overlay when open
- Show title and content via slots
- Confirm/cancel buttons with proper styling
- Close on backdrop click (if not loading)
- Show loading spinner on confirm button when loading
- Prevent body scroll when open
- Smooth transitions/animations

### 2. Modal Content Slot Pattern

The modal should support:
- **Default slot** - Main body content
- **Footer slot** (optional) - Custom footer actions

### 3. Demo Page

Create a demo with multiple modal scenarios:

**Modal Types:**
1. Simple confirmation dialog
2. Form submission modal
3. Destructive action confirmation (delete)
4. Multi-step modal workflow

**Features:**
- Button to open each modal type
- Form inside modal
- Loading simulation on submit
- Display confirmation results

---

## Implementation Guide

### File Structure

```
src/
├── components/
│   ├── Modal.vue
│   └── ModalButton.vue
├── App.vue
└── main.ts
```

### Step 1: Create Modal Component

```ts
<!-- components/Modal.vue -->
<script setup lang="ts">
import { watch } from 'vue'

interface Props {
  modelValue: boolean
  title: string
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  showCancel: true,
  isLoading: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

// Prevent body scroll when modal open
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('update:modelValue', false)
  emit('cancel')
}

const handleBackdropClick = () => {
  if (!props.isLoading) {
    handleCancel()
  }
}
</script>

<template>
  <Transition name="modal">
    <div v-if="modelValue" class="modal-overlay" @click="handleBackdropClick">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">{{ title }}</h2>
          <button
            class="modal-close"
            :disabled="isLoading"
            @click="handleCancel"
          >
            ×
          </button>
        </div>

        <div class="modal-body">
          <slot />
        </div>

        <div class="modal-footer">
          <slot name="footer">
            <button
              v-if="showCancel"
              class="modal-btn modal-btn--cancel"
              :disabled="isLoading"
              @click="handleCancel"
            >
              {{ cancelText }}
            </button>
            <button
              class="modal-btn modal-btn--confirm"
              :disabled="isLoading"
              @click="handleConfirm"
            >
              <span v-if="isLoading" class="spinner">⏳</span>
              {{ confirmText }}
            </button>
          </slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #718096;
  padding: 0;
  width: 32px;
  height: 32px;
}

.modal-close:hover:not(:disabled) {
  color: #2d3748;
}

.modal-close:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.modal-btn {
  padding: 10px 20px;
  border: 1px solid #cbd5e0;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.modal-btn--cancel {
  background: white;
  color: #2d3748;
}

.modal-btn--cancel:hover:not(:disabled) {
  background: #f7fafc;
}

.modal-btn--confirm {
  background: #3490dc;
  color: white;
  border-color: #3490dc;
}

.modal-btn--confirm:hover:not(:disabled) {
  background: #2779bd;
}

.spinner {
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal {
  animation: slideUp 0.3s ease;
}

.modal-leave-active .modal {
  animation: slideDown 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(20px);
    opacity: 0;
  }
}
</style>
```

### Step 2: Create Demo Page

```ts
<!-- App.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import Modal from './components/Modal.vue'

// Dialog states
const showConfirm = ref(false)
const showForm = ref(false)
const showDelete = ref(false)

// Form state
const formData = ref({
  name: '',
  email: ''
})

const isSubmitting = ref(false)
const lastResult = ref<any>(null)

// Handlers
const handleConfirm = () => {
  alert('Confirmed!')
  showConfirm.value = false
}

const handleFormSubmit = async () => {
  isSubmitting.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  lastResult.value = {
    action: 'Form submitted',
    data: { ...formData.value }
  }
  
  isSubmitting.value = false
  showForm.value = false
  formData.value = { name: '', email: '' }
}

const handleDelete = () => {
  lastResult.value = {
    action: 'Item deleted',
    timestamp: new Date().toLocaleString()
  }
  showDelete.value = false
}
</script>

<template>
  <div class="demo">
    <h1>Modal Dialog Demo</h1>

    <!-- Results Display -->
    <div v-if="lastResult" class="result">
      <h3>Last Action:</h3>
      <pre>{{ JSON.stringify(lastResult, null, 2) }}</pre>
    </div>

    <!-- Button Grid -->
    <div class="buttons">
      <button class="demo-btn" @click="showConfirm = true">
        Simple Confirmation
      </button>
      <button class="demo-btn" @click="showForm = true">
        Form Modal
      </button>
      <button class="demo-btn demo-btn--danger" @click="showDelete = true">
        Destructive Action
      </button>
    </div>

    <!-- Simple Confirmation Modal -->
    <Modal
      v-model="showConfirm"
      title="Confirm Action"
      confirm-text="Yes, Continue"
      cancel-text="No, Cancel"
      @confirm="handleConfirm"
    >
      <p>Are you sure you want to proceed with this action?</p>
    </Modal>

    <!-- Form Modal -->
    <Modal
      v-model="showForm"
      title="Enter Your Information"
      confirm-text="Submit"
      :is-loading="isSubmitting"
      @confirm="handleFormSubmit"
    >
      <form @submit.prevent="handleFormSubmit" class="form">
        <div class="form-group">
          <label for="name">Name:</label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            required
            :disabled="isSubmitting"
          />
        </div>

        <div class="form-group">
          <label for="email">Email:</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            required
            :disabled="isSubmitting"
          />
        </div>
      </form>
    </Modal>

    <!-- Delete Modal -->
    <Modal
      v-model="showDelete"
      title="Delete Item?"
      confirm-text="Delete"
      cancel-text="Keep It"
      @confirm="handleDelete"
    >
      <p class="warning">
        ⚠️ This action cannot be undone. Are you sure you want to delete this item?
      </p>
    </Modal>
  </div>
</template>

<style scoped>
.demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: system-ui, -apple-system, sans-serif;
}

h1 {
  font-size: 32px;
  margin-bottom: 32px;
  color: #2d3748;
}

.result {
  background: #edf2f7;
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 32px;
}

.result h3 {
  margin: 0 0 12px 0;
  color: #2d3748;
}

.result pre {
  background: white;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  margin: 0;
  font-size: 12px;
}

.buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 40px;
}

.demo-btn {
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  border-radius: 4px;
  background: #3490dc;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.demo-btn:hover {
  background: #2779bd;
}

.demo-btn--danger {
  background: #e3342f;
}

.demo-btn--danger:hover {
  background: #cc1f1a;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 500;
  margin-bottom: 4px;
  color: #2d3748;
}

.form-group input {
  padding: 8px 12px;
  border: 1px solid #cbd5e0;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:focus {
  outline: none;
  border-color: #3490dc;
  box-shadow: 0 0 0 3px rgba(52, 144, 220, 0.1);
}

.form-group input:disabled {
  background: #f7fafc;
  opacity: 0.6;
}

.warning {
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 4px;
  padding: 12px;
  color: #c53030;
  margin: 0;
}
</style>
```

---

## Validation Checklist

### Modal Component
- [ ] Opens/closes with v-model
- [ ] Displays title
- [ ] Has confirm and cancel buttons
- [ ] Emits 'confirm' when confirm button clicked
- [ ] Emits 'cancel' when cancel/backdrop clicked
- [ ] Shows loading state on confirm button
- [ ] Disables buttons when loading
- [ ] Body scroll prevented when open
- [ ] Slot content displays in body
- [ ] Smooth transitions/animations

### Event Communication
- [ ] Parent listens to 'update:modelValue'
- [ ] Parent listens to 'confirm'
- [ ] Parent listens to 'cancel'
- [ ] Events are typed with TypeScript
- [ ] Events have no payload leakage
- [ ] Modal closes on confirm/cancel

### Demo Page
- [ ] Simple confirmation modal works
- [ ] Form modal with data collection works
- [ ] Delete modal with warning works
- [ ] Last action result displays
- [ ] Loading state works on form submit
- [ ] Form data clears after submit

---

## Extension Challenges

1. **Header Actions**: Add action buttons to modal header

2. **Keyboard Navigation**: Close on Escape, confirm on Enter

3. **Nested Modals**: Support showing modals from within modals

4. **Animation Customization**: Allow different enter/leave animations

5. **Focus Management**: Trap focus inside modal, restore after close

6. **Responsive Modal**: Adjust sizing for mobile

7. **Custom Transitions**: Add more sophisticated animations

8. **Alert Component**: Extract confirmation dialog as `<Alert>` component

---

## Common Issues & Solutions

### Issue: Modal stays open after confirm
**Problem**: @confirm handler doesn't close modal

**Solution**: Emit `update:modelValue` with false:
```ts
const handleConfirm = () => {
  emit('update:modelValue', false)
  emit('confirm')
}
```

### Issue: Body scrollable when modal open
**Problem**: Scroll prevention doesn't work

**Solution**: Use watch to toggle body overflow:
```ts
watch(() => props.modelValue, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
})
```

### Issue: Clicking backdrop doesn't close
**Problem**: @click.stop prevents propagation

**Solution**: Handle backdrop in overlay handler, not modal:
```ts
@click.stop on modal div  <!-- Stops propagation -->
@click on overlay        <!-- Handles backdrop -->
```

### Issue: Form submission in modal doesn't work
**Problem**: Form submit event not properly handled

**Solution**: Prevent default and handle in component:
```ts
<form @submit.prevent="handleSubmit">
```

---

## Learning Outcomes

After completing this project, you should be able to:

✅ Create components that emit multiple events  
✅ Listen to custom events from child components  
✅ Use v-model for two-way binding  
✅ Handle event payloads with TypeScript  
✅ Implement complex UI patterns (modals)  
✅ Manage component state with events  
✅ Build reusable dialog systems  
✅ Implement loading states with events

---

## Next Steps

1. Complete the [Quiz](./quiz.md) to test your understanding
2. Work through the [Exercises](./exercises.md) for additional practice
3. Build the [Module 1 Capstone Project](../capstone/README.md)
