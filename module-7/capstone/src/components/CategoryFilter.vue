<template>
  <select v-model="selectedCategory" @change="$emit('change', selectedCategory)" class="category-filter">
    <option value="All">All Categories</option>
    <option v-for="category in categories" :key="category" :value="category">
      {{ category }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTaskStore } from '@/stores/taskStore';
import { getCategories } from '@/utils/taskHelpers';

const taskStore = useTaskStore();
const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  change: [category: string];
  'update:modelValue': [value: string];
}>();

const selectedCategory = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  }
});

const categories = computed(() => getCategories(taskStore.tasks));
</script>

<style scoped>
.category-filter {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  background: white;
}

.category-filter:hover {
  border-color: #999;
}

.category-filter:focus {
  outline: none;
  border-color: #2196f3;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
}
</style>
