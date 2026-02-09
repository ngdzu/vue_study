<template>
  <form @submit.prevent="handleSubmit" class="task-form">
    <div class="form-group">
      <label for="title">Task Title *</label>
      <input
        id="title"
        v-model="form.title"
        type="text"
        placeholder="Enter task title"
        class="form-input"
        required
      />
      <span v-if="errors.title" class="error">{{ errors.title }}</span>
    </div>

    <div class="form-group">
      <label for="category">Category *</label>
      <input
        id="category"
        v-model="form.category"
        type="text"
        placeholder="e.g., Work, Personal, Learning"
        class="form-input"
        required
      />
      <span v-if="errors.category" class="error">{{ errors.category }}</span>
    </div>

    <div class="form-group">
      <label for="description">Description</label>
      <textarea
        id="description"
        v-model="form.description"
        placeholder="Enter task description (optional)"
        class="form-input"
        rows="3"
      ></textarea>
    </div>

    <div class="form-group">
      <label for="duration">Estimated Duration (seconds) *</label>
      <input
        id="duration"
        v-model.number="form.estimatedDuration"
        type="number"
        min="0"
        placeholder="3600 (1 hour)"
        class="form-input"
        required
      />
      <span v-if="errors.estimatedDuration" class="error">{{ errors.estimatedDuration }}</span>
    </div>

    <div class="form-actions">
      <button type="submit" class="btn btn-primary">
        {{ isEditing ? 'Update Task' : 'Create Task' }}
      </button>
      <button v-if="isEditing" type="button" @click="handleCancel" class="btn btn-secondary">
        Cancel
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useValidation } from '@/composables/useValidation';

const props = withDefaults(
  defineProps<{
    initialData?: {
      title: string;
      category: string;
      description?: string;
      estimatedDuration: number;
    };
  }>(),
  {
    initialData: () => ({
      title: '',
      category: '',
      description: '',
      estimatedDuration: 3600
    })
  }
);

const emit = defineEmits<{
  submit: [data: typeof form];
  cancel: [];
}>();

const { validateTaskForm } = useValidation();

const form = reactive({
  title: props.initialData?.title || '',
  category: props.initialData?.category || '',
  description: props.initialData?.description || '',
  estimatedDuration: props.initialData?.estimatedDuration || 3600
});

const errors = reactive<Record<string, string>>({});
const isEditing = ref(!!props.initialData?.title);

const handleSubmit = () => {
  const validation = validateTaskForm({
    title: form.title,
    category: form.category,
    estimatedDuration: form.estimatedDuration
  });

  if (validation.valid) {
    emit('submit', { ...form });
    // Reset form
    form.title = '';
    form.category = '';
    form.description = '';
    form.estimatedDuration = 3600;
    Object.keys(errors).forEach(key => {
      delete errors[key];
    });
  } else {
    Object.assign(errors, validation.errors);
  }
};

const handleCancel = () => {
  emit('cancel');
};
</script>

<style scoped>
.task-form {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #2196f3;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
}

.error {
  display: block;
  color: #f44336;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #2196f3;
  color: white;
}

.btn-primary:hover {
  background: #0b7dda;
}

.btn-secondary {
  background: #e0e0e0;
  color: #333;
}

.btn-secondary:hover {
  background: #d0d0d0;
}
</style>
