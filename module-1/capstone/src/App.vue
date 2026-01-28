<script setup lang="ts">
import { ref } from 'vue'
import DashboardHeader from './components/DashboardHeader.vue'
import UserProfile from './components/UserProfile.vue'
import TasksWidget from './components/TasksWidget.vue'
import WeatherWidget from './components/WeatherWidget.vue'
import QuickStats from './components/QuickStats.vue'
import NotificationsWidget from './components/NotificationsWidget.vue'
import SettingsPanel from './components/SettingsPanel.vue'
import { useSettings } from './composables/useSettings'

const { settings, toggleTheme } = useSettings()
const showSettings = ref(false)
</script>

<template>
  <div :class="{ 'dark-mode': settings.theme === 'dark' }">
    <DashboardHeader @toggle-theme="toggleTheme" />

    <div class="container" style="padding: 20px 20px">
      <!-- Top Row: User Profile & Quick Stats -->
      <div class="grid grid-2">
        <UserProfile />
        <QuickStats />
      </div>

      <!-- Middle Row: Tasks & Weather -->
      <div class="grid grid-2" style="margin-top: 20px">
        <TasksWidget />
        <WeatherWidget :unit="settings.temperatureUnit" />
      </div>

      <!-- Bottom Row: Notifications -->
      <NotificationsWidget style="margin-top: 20px" />

      <!-- Settings Panel -->
      <div style="margin-top: 20px">
        <button 
          class="btn"
          @click="showSettings = !showSettings"
        >
          {{ showSettings ? 'Hide Settings' : 'Show Settings' }}
        </button>
        <SettingsPanel v-if="showSettings" :settings="settings" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dark-mode {
  background: #111827;
}
</style>
