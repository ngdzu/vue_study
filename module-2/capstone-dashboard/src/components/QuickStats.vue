<template>
  <div class="quick-stats">
    <StatCard
      label="Tasks Completed"
      :value="taskStats.completed"
      color="#10b981"
      trend="up"
    />
    <StatCard
      label="Active Projects"
      :value="taskStats.projects"
      color="#667eea"
      trend="up"
    />
    <StatCard
      label="Team Members"
      :value="taskStats.team"
      color="#00d4ff"
      trend="neutral"
    />
    <StatCard
      label="Productivity Score"
      :value="taskStats.score"
      unit="%"
      color="#f59e0b"
      trend="up"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import StatCard from './StatCard.vue'

const taskStats = reactive({
  completed: 24,
  projects: 5,
  team: 8,
  score: 87
})
</script>

<style scoped>
.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .quick-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .quick-stats {
    grid-template-columns: 1fr;
  }
}
</style>
