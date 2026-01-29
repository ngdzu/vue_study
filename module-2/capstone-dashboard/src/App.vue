<template>
  <div class="app-container">
    <!-- Main content -->
    <div class="app-content">
      <!-- Header -->
      <DashboardHeader />

      <!-- Main grid layout -->
      <div class="dashboard-grid">
        <!-- Left column -->
        <div class="left-column">
          <QuickStats />
          <UserProfile />
        </div>

        <!-- Right column -->
        <div class="right-column">
          <TasksOverview />
          <WeatherWidget />
        </div>

        <!-- Full width -->
        <div class="full-width">
          <NotificationsWidget />
        </div>

        <div class="full-width">
          <QuickActions />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useTheme } from './composables/useTheme'
import DashboardHeader from './components/DashboardHeader.vue'
import QuickStats from './components/QuickStats.vue'
import UserProfile from './components/UserProfile.vue'
import TasksOverview from './components/TasksOverview.vue'
import WeatherWidget from './components/WeatherWidget.vue'
import NotificationsWidget from './components/NotificationsWidget.vue'
import QuickActions from './components/QuickActions.vue'

// Initialize theme on mount
useTheme()

onMounted(() => {
  // Add any additional initialization here
  console.log('Dashboard mounted')
})
</script>

<style scoped>
.app-container {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    #2d3748 0%,
    #4a5568 50%,
    #2c5282 100%
  );
}

:deep(.dark) .app-container {
  background: linear-gradient(
    135deg,
    #0f172a 0%,
    #1e293b 50%,
    #1a202c 100%
  );
}

.app-content {
  position: relative;
  z-index: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

.left-column,
.right-column {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.full-width {
  grid-column: 1 / -1;
}

/* Responsive design */
@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .app-content {
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  .app-content {
    padding: 1rem;
  }

  .dashboard-grid {
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .app-content {
    padding: 0.75rem;
  }

  .dashboard-grid {
    gap: 0.75rem;
  }
}
</style>
