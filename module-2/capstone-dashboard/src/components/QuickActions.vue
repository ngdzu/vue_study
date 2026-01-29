<template>
  <div class="quick-actions">
    <Button variant="gradient" @click="addTask">
      ➕ Add Task
    </Button>
    <Button variant="primary" @click="addNote">
      📝 Add Note
    </Button>
    <Button variant="secondary" @click="openSettings">
      ⚙️ Settings
    </Button>
    <Button variant="outline" @click="exportData">
      📤 Export
    </Button>
  </div>
</template>

<script setup lang="ts">
import Button from './Button.vue'

const addTask = () => {
  console.log('Add task clicked')
  alert('Open task creation dialog')
}

const addNote = () => {
  console.log('Add note clicked')
  alert('Open note creation dialog')
}

const openSettings = () => {
  console.log('Settings clicked')
  alert('Open settings panel')
}

const exportData = () => {
  console.log('Export clicked')
  alert('Export dashboard data')
}
</script>

<style scoped>
.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

@media (max-width: 768px) {
  .quick-actions {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .quick-actions {
    grid-template-columns: 1fr;
  }
}
</style>
