<template>
  <div v-if="stats" class="task-stats">
    <div class="stat-card">
      <div class="stat-label">Total Tasks</div>
      <div class="stat-value">{{ stats.total }}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Completed</div>
      <div class="stat-value">{{ stats.completed }}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Active</div>
      <div class="stat-value">{{ stats.active }}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Total Time</div>
      <div class="stat-value">{{ formattedTime }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTaskStore } from '@/stores/taskStore';
import { formatDuration } from '@/utils/taskHelpers';

const taskStore = useTaskStore();
const stats = computed(() => taskStore.stats);
const formattedTime = computed(() => formatDuration(stats.value.totalDuration));
</script>

<style scoped>
.task-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  padding: 1.5rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.stat-card {
  background: white;
  padding: 1rem;
  border-radius: 6px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-label {
  font-size: 0.875rem;
  color: #666;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.875rem;
  font-weight: bold;
  color: #333;
}
</style>
