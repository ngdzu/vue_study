# Exercises: Component Testing

Complete these exercises to practice component testing with @vue/test-utils.

## Exercise 1: Setup @vue/test-utils (10 minutes)

**Objective**: Install and configure component testing library.

### Steps

1. **Install @vue/test-utils**
   ```bash
   npm install -D @vue/test-utils
   ```

2. **Create a simple test component** `src/components/HelloWorld.vue`:
   ```vue
   <template>
     <div class="hello">
       <h1>{{ message }}</h1>
       <p>Count: {{ count }}</p>
     </div>
   </template>

   <script setup lang="ts">
   withDefaults(
     defineProps<{
       message?: string;
       count?: number;
     }>(),
     { message: 'Hello', count: 0 }
   );
   </script>
   ```

3. **Create a test file** `src/components/HelloWorld.test.ts`:
   ```ts
   import { describe, it, expect } from 'vitest';
   import { mount } from '@vue/test-utils';
   import HelloWorld from './HelloWorld.vue';

   describe('HelloWorld', () => {
     it('should render with default props', () => {
       const wrapper = mount(HelloWorld);
       expect(wrapper.text()).toContain('Hello');
       expect(wrapper.text()).toContain('Count: 0');
     });

     it('should render with custom props', () => {
       const wrapper = mount(HelloWorld, {
         props: { message: 'Hi', count: 5 }
       });
       expect(wrapper.text()).toContain('Hi');
       expect(wrapper.text()).toContain('Count: 5');
     });
   });
   ```

4. **Run tests**: `npm run test -- HelloWorld.test.ts`

✅ **Grading**: Both tests pass successfully

---

## Exercise 2: Test Props and Rendering (20 minutes)

**Objective**: Test component props, defaults, and rendered output.

### Steps

1. **Create component** `src/components/Card.vue`:
   ```vue
   <template>
     <div :class="['card', `card-${variant}`]">
       <h2>{{ title }}</h2>
       <p>{{ description }}</p>
       <div v-if="showFooter" class="card-footer">
         <slot name="footer">Default Footer</slot>
       </div>
     </div>
   </template>

   <script setup lang="ts">
   withDefaults(
     defineProps<{
       title: string;
       description?: string;
       variant?: 'primary' | 'secondary';
       showFooter?: boolean;
     }>(),
     { variant: 'primary', description: '', showFooter: false }
   );
   </script>
   ```

2. **Write tests** `src/components/Card.test.ts` covering:
   - ✅ Renders with title prop
   - ✅ Renders with optional description
   - ✅ Applies correct variant class
   - ✅ Shows footer when showFooter is true
   - ✅ Hides footer when showFooter is false
   - ✅ Uses default slot content in footer

✅ **Grading**:
- All props are tested
- Conditional rendering (v-if) is tested
- Tests verify CSS classes and content

---

## Exercise 3: Test User Interactions (20 minutes)

**Objective**: Test clicks, form input, and user-triggered state changes.

### Steps

1. **Create component** `src/components/Counter.vue`:
   ```vue
   <template>
     <div class="counter">
       <p>Count: {{ count }}</p>
       <button class="increment-btn" @click="increment">Increment</button>
       <button class="decrement-btn" @click="decrement">Decrement</button>
       <button class="reset-btn" @click="reset">Reset</button>
     </div>
   </template>

   <script setup lang="ts">
   import { ref } from 'vue';
   const count = ref(0);
   const increment = () => count.value++;
   const decrement = () => count.value--;
   const reset = () => count.value = 0;
   </script>
   ```

2. **Write tests** `src/components/Counter.test.ts` covering:
   - ✅ Initial count is 0
   - ✅ Increment button increases count
   - ✅ Decrement button decreases count
   - ✅ Multiple clicks work correctly
   - ✅ Reset button sets count to 0
   - ✅ Text updates after each interaction

✅ **Grading**:
- All user interactions are tested
- Tests use `trigger()` for clicks
- Tests use `async/await` for reactivity
- Text content is verified after each action

---

## Exercise 4: Test Component Events (20 minutes)

**Objective**: Test custom events and emits.

### Steps

1. **Create component** `src/components/DeleteButton.vue`:
   ```vue
   <template>
     <button @click="handleClick" :disabled="isLoading">
       <span v-if="isLoading">Loading...</span>
       <span v-else>Delete</span>
     </button>
   </template>

   <script setup lang="ts">
   import { ref } from 'vue';
   defineProps<{ itemId: number }>();
   const emit = defineEmits<{ delete: [id: number] }>();
   const isLoading = ref(false);

   const handleClick = async () => {
     isLoading.value = true;
     try {
       // Simulate async operation
       await new Promise(r => setTimeout(r, 100));
       emit('delete', itemId);
     } finally {
       isLoading.value = false;
     }
   };
   </script>
   ```

2. **Write tests** `src/components/DeleteButton.test.ts` covering:
   - ✅ Emits delete event with correct id
   - ✅ Shows loading state while deleting
   - ✅ Event payload contains correct itemId
   - ✅ Multiple deletes emit multiple events

✅ **Grading**:
- Event emissions are tested with `emitted()`
- Event payloads are verified
- Loading state is verified during event

---

## Exercise 5: Test Conditional Rendering (20 minutes)

**Objective**: Test v-if, v-show, and conditional content display.

### Steps

1. **Create component** `src/components/Alert.vue`:
   ```vue
   <template>
     <div v-if="show" :class="['alert', `alert-${type}`]" role="alert">
       <h3>{{ title }}</h3>
       <p>{{ message }}</p>
       <button @click="close">Close</button>
     </div>
   </template>

   <script setup lang="ts">
   import { ref } from 'vue';
   defineProps<{
     title: string;
     message: string;
     type: 'success' | 'error' | 'warning';
   }>();

   const show = ref(true);
   const close = () => show.value = false;
   </script>
   ```

2. **Write tests** `src/components/Alert.test.ts` covering:
   - ✅ Alert shows initially
   - ✅ Correct type class is applied
   - ✅ Title and message display correctly
   - ✅ Alert disappears when close clicked
   - ✅ Alert doesn't exist after closing

✅ **Grading**:
- `exists()` is used to check element presence
- Conditional rendering is tested before and after state change
- Classes are verified for different types

---

## Exercise 6: Test Input and Form Components (25 minutes)

**Objective**: Test form input components with v-model and validation.

### Steps

1. **Create component** `src/components/TextInput.vue`:
   ```vue
   <template>
     <div class="form-group">
       <label :for="id">{{ label }}</label>
       <input
         :id="id"
         :value="modelValue"
         :placeholder="placeholder"
         :disabled="disabled"
         @input="emit('update:modelValue', $event.target.value)"
       />
       <span v-if="error" class="error">{{ error }}</span>
     </div>
   </template>

   <script setup lang="ts">
   defineProps<{
     modelValue: string;
     label: string;
     placeholder?: string;
     disabled?: boolean;
     error?: string;
     id?: string;
   }>();
   const emit = defineEmits<{ 'update:modelValue': [value: string] }>();
   </script>
   ```

2. **Write tests** `src/components/TextInput.test.ts` covering:
   - ✅ Renders with label and placeholder
   - ✅ Updates value when input changed
   - ✅ Emits update:modelValue event
   - ✅ Disabled state prevents input
   - ✅ Shows error message when provided
   - ✅ Hides error when not provided

✅ **Grading**:
- Input value is set with `setValue()`
- `update:modelValue` event is emitted and verified
- Error states are tested
- Label and placeholder attributes verified

---

## Exercise 7: Test Slot Content (20 minutes)

**Objective**: Test default and named slots.

### Steps

1. **Create component** `src/components/Modal.vue`:
   ```vue
   <template>
     <div v-if="isOpen" class="modal-overlay">
       <div class="modal">
         <div class="modal-header">
           <h2><slot name="title">Modal Title</slot></h2>
           <button @click="close">×</button>
         </div>
         <div class="modal-body">
           <slot></slot>
         </div>
         <div class="modal-footer">
           <slot name="footer">
             <button @click="close">Close</button>
           </slot>
         </div>
       </div>
     </div>
   </template>

   <script setup lang="ts">
   import { ref } from 'vue';
   const isOpen = ref(true);
   const close = () => isOpen.value = false;
   </script>
   ```

2. **Write tests** covering:
   - ✅ Default slot content displays
   - ✅ Named slot content displays
   - ✅ Default slot content in footer displays
   - ✅ Modal closes when close button clicked
   - ✅ Modal doesn't exist when closed

✅ **Grading**:
- Tests use `slots` option in mount
- Default and named slots are tested
- Slot fallback content verified

---

## Challenge: Build the Sample Project

Complete the [Button Component Test Suite](sample-project.md) with comprehensive tests.

**Estimated Time**: 60-90 minutes

✅ **Grading**:
- All tests pass
- Every Button feature is tested
- Code coverage > 95%
- Tests use proper @vue/test-utils API
