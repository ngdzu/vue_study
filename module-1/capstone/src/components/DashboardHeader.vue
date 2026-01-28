<script setup lang="ts">
import { useTime } from '../composables/useTime'

defineEmits<{
  (e: 'toggleTheme'): void
}>()

const { formattedTime, formattedDate, greeting } = useTime()
</script>

<template>
  <header class="dashboard-header">
    <div class="header-content">
      <div class="greeting-section">
        <h1>{{ greeting }}! 👋</h1>
        <p class="date-time">
          <span class="time">{{ formattedTime }}</span>
          <span class="date">{{ formattedDate }}</span>
        </p>
      </div>
      <button 
        class="btn-theme"
        @click="$emit('toggleTheme')"
      >
        🌙
      </button>
    </div>
  </header>
</template>

<style scoped>
.dashboard-header {
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  padding: 20px;
  box-shadow: var(--shadow);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.greeting-section h1 {
  font-size: 28px;
  margin-bottom: 8px;
}

.date-time {
  display: flex;
  gap: 20px;
  color: var(--text-secondary);
  font-size: 14px;
}

.time {
  font-weight: 600;
  font-family: 'Monaco', 'Courier New', monospace;
}

.btn-theme {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 10px;
}

.btn-theme:hover {
  transform: scale(1.2);
}
</style>
