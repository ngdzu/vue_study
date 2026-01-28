<script setup lang="ts">
import { useTasks } from '../composables/useTasks'

const { tasksCompletedToday, tasksDueSoon, totalTasks, completionPercentage } = useTasks()
</script>

<template>
  <div class="card stats-widget">
    <h2>📊 Quick Stats</h2>
    <div class="stats-grid">
      <div class="stat-card">
        <p class="label">Completed Today</p>
        <p class="value">{{ tasksCompletedToday }}</p>
      </div>
      <div class="stat-card">
        <p class="label">Due Soon</p>
        <p class="value">{{ tasksDueSoon }}</p>
      </div>
      <div class="stat-card">
        <p class="label">Total Tasks</p>
        <p class="value">{{ totalTasks }}</p>
      </div>
      <div class="stat-card">
        <p class="label">Completion</p>
        <p class="value">{{ completionPercentage }}%</p>
      </div>
    </div>
    <div class="progress-bar">
      <div class="progress" :style="{ width: completionPercentage + '%' }"></div>
    </div>
  </div>
</template>

<style scoped>
.stats-widget {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stats-widget h2 {
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.stat-card {
  background: var(--bg-secondary);
  padding: 16px;
  border-radius: 6px;
  text-align: center;
}

.stat-card .label {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 0;
}

.stat-card .value {
  font-size: 28px;
  font-weight: 600;
  margin: 4px 0 0 0;
}

.progress-bar {
  background: var(--color-gray-200);
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
}

.progress {
  background: var(--color-success);
  height: 100%;
  transition: width 0.3s ease;
}
</style>
