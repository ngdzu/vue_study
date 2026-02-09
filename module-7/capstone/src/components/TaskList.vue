<template>
  <div class="task-list">
    <div v-if="filteredTasks.length === 0" class="empty-message">
      No tasks in this category yet.
    </div>
    <transition-group v-else name="list" tag="div">
      <task-item
        v-for="task in filteredTasks"
        :key="task.id"
        :task="task"
        @toggle="handleToggle"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTaskStore } from '@/stores/taskStore';
import { filterByCategory } from '@/utils/taskHelpers';
import TaskItem from './TaskItem.vue';

const props = defineProps<{
  category: string;
}>();

const emit = defineEmits<{
  edit: [taskId: number];
  delete: [taskId: number];
}>();

const taskStore = useTaskStore();

const filteredTasks = computed(() => {
  return filterByCategory(taskStore.tasks, props.category);
});

const handleToggle = (taskId: number) => {
  taskStore.toggleTask(taskId);
};

const handleDelete = (taskId: number) => {
  taskStore.deleteTask(taskId);
  emit('delete', taskId);
};

const handleEdit = (taskId: number) => {
  emit('edit', taskId);
};
</script>

<style scoped>
.task-list {
  margin: 1.5rem 0;
}

.empty-message {
  text-align: center;
  padding: 2rem;
  color: #999;
  font-style: italic;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
