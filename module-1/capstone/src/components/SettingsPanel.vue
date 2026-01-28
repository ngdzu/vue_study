<script setup lang="ts">
import type { Settings } from '../types'

const props = defineProps<{
  settings: Settings
}>()

const emit = defineEmits<{
  (e: 'update:theme', value: Settings['theme']): void
  (e: 'update:language', value: Settings['language']): void
  (e: 'update:temperatureUnit', value: Settings['temperatureUnit']): void
  (e: 'update:notificationsEnabled', value: boolean): void
}>()
</script>

<template>
  <div class="card settings-panel">
    <h2>⚙️ Settings</h2>
    
    <div class="settings-group">
      <label>Theme</label>
      <select 
        :value="settings.theme"
        @change="emit('update:theme', ($event.target as HTMLSelectElement).value as any)"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="auto">Auto</option>
      </select>
    </div>

    <div class="settings-group">
      <label>Language</label>
      <select 
        :value="settings.language"
        @change="emit('update:language', ($event.target as HTMLSelectElement).value as any)"
      >
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
      </select>
    </div>

    <div class="settings-group">
      <label>Temperature Unit</label>
      <select 
        :value="settings.temperatureUnit"
        @change="emit('update:temperatureUnit', ($event.target as HTMLSelectElement).value as any)"
      >
        <option value="C">Celsius (°C)</option>
        <option value="F">Fahrenheit (°F)</option>
      </select>
    </div>

    <div class="settings-group">
      <label>
        <input 
          type="checkbox"
          :checked="settings.notificationsEnabled"
          @change="emit('update:notificationsEnabled', ($event.target as HTMLInputElement).checked)"
        />
        Enable Notifications
      </label>
    </div>
  </div>
</template>

<style scoped>
.settings-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}

.settings-panel h2 {
  margin: 0;
}

.settings-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.settings-group label {
  font-weight: 500;
}

.settings-group select {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.settings-group input[type="checkbox"] {
  width: auto;
  cursor: pointer;
  margin-right: 8px;
}
</style>
