<template>
  <div v-if="!tasks.length" class="empty-state">
    <div class="empty-icon">📋</div>
    <h3>No tasks yet</h3>
    <p>Create your first task to get started with tracking your time.</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTaskStore } from '@/stores/taskStore';

const taskStore = useTaskStore();
const tasks = computed(() => taskStore.tasks);
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: #999;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

h3 {
  font-size: 1.5rem;
  margin: 0.5rem 0;
  color: #666;
}

p {
  margin: 0.5rem 0;
  font-size: 1rem;
}
</style>
