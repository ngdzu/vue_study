<template>
  <div class="task-detail-modal" v-if="isOpen" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ task?.title }}</h2>
        <button @click="closeModal" class="close-btn">✕</button>
      </div>
      
      <div v-if="task" class="modal-body">
        <div class="detail-row">
          <label>Category:</label>
          <span>{{ task.category }}</span>
        </div>
        
        <div class="detail-row">
          <label>Status:</label>
          <span>{{ task.completed ? '✓ Completed' : '◯ Active' }}</span>
        </div>
        
        <div class="detail-row">
          <label>Time Logged:</label>
          <span>{{ formatDuration(task.duration) }}</span>
        </div>
        
        <div class="detail-row">
          <label>Estimated Duration:</label>
          <span>{{ formatDuration(task.estimatedDuration) }}</span>
        </div>
        
        <div v-if="task.description" class="detail-row">
          <label>Description:</label>
          <p class="description">{{ task.description }}</p>
        </div>
        
        <div class="detail-row">
          <label>Created:</label>
          <span>{{ formatDate(task.createdAt) }}</span>
        </div>
        
        <div v-if="task.completedAt" class="detail-row">
          <label>Completed:</label>
          <span>{{ formatDate(task.completedAt) }}</span>
        </div>
      </div>
      
      <div class="modal-footer">
        <button @click="$emit('update-time', task!.id)" class="btn btn-primary">
          Log Additional Time
        </button>
        <button @click="closeModal" class="btn btn-secondary">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTaskStore } from '@/stores/taskStore';
import { formatDuration } from '@/utils/taskHelpers';
import type { Task } from '@/utils/taskHelpers';

const props = defineProps<{
  isOpen: boolean;
  taskId?: number;
}>();

const emit = defineEmits<{
  close: [];
  'update-time': [taskId: number];
}>();

const taskStore = useTaskStore();

const task = computed(() => {
  if (props.taskId) {
    return taskStore.getTaskById(props.taskId);
  }
  return undefined;
});

const closeModal = () => {
  emit('close');
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString();
};
</script>

<style scoped>
.task-detail-modal {
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

.modal-content {
  background: white;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 1.5rem;
  max-height: 60vh;
  overflow-y: auto;
}

.detail-row {
  margin-bottom: 1rem;
}

.detail-row label {
  display: block;
  font-weight: 600;
  color: #666;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
}

.detail-row span {
  display: block;
  color: #333;
}

.description {
  margin: 0;
  color: #555;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #eee;
  justify-content: flex-end;
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
