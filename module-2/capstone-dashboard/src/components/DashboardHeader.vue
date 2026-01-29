<template>
  <header class="dashboard-header">
    <div class="header-content">
      <div class="header-left">
        <h1 class="header-title">📊 Dashboard</h1>
        <p class="header-subtitle">{{ greeting }}, Welcome back</p>
      </div>

      <div class="header-info">
        <div class="time-display">
          <div class="time">{{ time }}</div>
          <div class="date">{{ dayOfWeek }} • {{ dateStr }}</div>
        </div>

        <button class="theme-toggle" @click="toggleTheme" :title="`Switch to ${isDark ? 'light' : 'dark'} mode`">
          {{ isDark ? '☀️' : '🌙' }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useDashboardTime } from '../composables/useDashboardTime'
import { useTheme } from '../composables/useTheme'

const { time, greeting, dayOfWeek, dateStr } = useDashboardTime()
const { isDark, toggleTheme } = useTheme()
</script>

<style scoped>
.dashboard-header {
  background: linear-gradient(135deg,
    rgba(102, 126, 234, 0.25),
    rgba(118, 75, 162, 0.25),
    rgba(0, 212, 255, 0.15)
  );
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-glass);
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.15),
              0 0 0 1px rgba(255, 255, 255, 0.1) inset;
}

:deep(.dark) .dashboard-header {
  background: linear-gradient(135deg,
    rgba(102, 126, 234, 0.3),
    rgba(118, 75, 162, 0.3),
    rgba(0, 212, 255, 0.2)
  );
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4),
              0 0 0 1px rgba(255, 255, 255, 0.08) inset;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.header-left {
  flex: 1;
}

.header-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.header-subtitle {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.time-display {
  text-align: right;
}

.time {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
  font-family: 'Courier New', monospace;
}

.date {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.theme-toggle {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1),
              0 0 0 1px rgba(255, 255, 255, 0.1) inset;
}

.theme-toggle:hover {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(16px) saturate(200%);
  -webkit-backdrop-filter: blur(16px) saturate(200%);
  transform: scale(1.1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15),
              0 0 0 1px rgba(255, 255, 255, 0.2) inset;
}

@media (max-width: 768px) {
  .dashboard-header {
    padding: 1.5rem;
  }

  .header-content {
    flex-direction: column;
    gap: 1.5rem;
  }

  .header-title {
    font-size: 1.5rem;
  }

  .header-info {
    gap: 1rem;
    width: 100%;
    justify-content: space-between;
  }

  .time-display {
    text-align: left;
  }

  .time {
    font-size: 1.25rem;
  }
}
</style>
