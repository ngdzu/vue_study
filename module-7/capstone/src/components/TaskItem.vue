<template>
  <div class="task-item" :class="{ completed: task.completed }">
    <div class="task-content">
      <input
        type="checkbox"
        :checked="task.completed"
        @change="$emit('toggle', task.id)"
        class="task-checkbox"
        :aria-label="`Toggle task: ${task.title}`"
      />
      <div class="task-info">
        <h4 class="task-title">{{ task.title }}</h4>
        <p v-if="task.description" class="task-description">{{ task.description }}</p>
        <div class="task-meta">
          <span class="category-badge">{{ task.category }}</span>
          <span class="duration-badge">⏱ {{ formatDuration(task.duration) }}</span>
        </div>
      </div>
    </div>
    <div class="task-actions">
      <button @click="$emit('edit', task.id)" class="btn-icon" title="Edit task">
        ✎
      </button>
      <button @click="$emit('delete', task.id)" class="btn-icon btn-delete" title="Delete task">
        ✕
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDuration } from '@/utils/taskHelpers';
import type { Task } from '@/utils/taskHelpers';

defineProps<{
  task: Task;
}>();

defineEmits<{
  toggle: [id: number];
  edit: [id: number];
  delete: [id: number];
}>();
</script>

<style scoped>
.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  transition: all 0.2s;
}

.task-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.task-item.completed {
  background: #f5f5f5;
  opacity: 0.7;
}

.task-item.completed .task-title {
  text-decoration: line-through;
  color: #999;
}

.task-content {
  display: flex;
  gap: 1rem;
  flex: 1;
}

.task-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-top: 0.25rem;
}

.task-info {
  flex: 1;
}

.task-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.task-description {
  margin: 0.25rem 0;
  font-size: 0.875rem;
  color: #666;
}

.task-meta {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}

.category-badge,
.duration-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 3px;
}

.task-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #f0f0f0;
  border-radius: 4px;
}

.btn-delete:hover {
  background: #ffebee;
  color: #f44336;
}
</style>
