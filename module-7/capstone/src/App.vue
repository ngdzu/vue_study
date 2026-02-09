<template>
  <div id="app" class="app">
    <header class="header">
      <h1>⏱ Task Manager</h1>
      <p>Track your tasks and time efficiently</p>
    </header>

    <main class="main">
      <section class="section">
        <h2>Quick Stats</h2>
        <task-stats />
      </section>

      <section class="section">
        <h2>Add New Task</h2>
        <task-form @submit="handleAddTask" />
      </section>

      <section class="section">
        <h2>Time Tracker</h2>
        <timer-control @time-logged="handleTimeLogged" ref="timerRef" />
      </section>

      <section class="section">
        <h2>Your Tasks</h2>
        <div class="controls">
          <category-filter v-model="selectedCategory" />
        </div>
        <empty-state />
        <task-list :category="selectedCategory" />
      </section>

      <task-detail-modal
        :is-open="showDetailModal"
        :task-id="selectedTaskId"
        @close="showDetailModal = false"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTaskStore } from '@/stores/taskStore';
import TaskStats from '@/components/TaskStats.vue';
import TaskForm from '@/components/TaskForm.vue';
import TaskList from '@/components/TaskList.vue';
import CategoryFilter from '@/components/CategoryFilter.vue';
import TimerControl from '@/components/TimerControl.vue';
import TaskDetailModal from '@/components/TaskDetailModal.vue';
import EmptyState from '@/components/EmptyState.vue';

const taskStore = useTaskStore();
const selectedCategory = ref('All');
const showDetailModal = ref(false);
const selectedTaskId = ref<number>();
const timerRef = ref();

const handleAddTask = (data: {
  title: string;
  category: string;
  description?: string;
  estimatedDuration: number;
}) => {
  taskStore.addTask(data);
  taskStore.saveTasks();
};

const handleTimeLogged = (seconds: number) => {
  // In a real app, you'd assign this to a specific task
  console.log('Time logged:', seconds);
};

// Load tasks on mount
taskStore.loadTasks();
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    sans-serif;
  background: #f9f9f9;
  min-height: 100vh;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.header p {
  font-size: 1.125rem;
  opacity: 0.9;
}

.main {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.section {
  margin-bottom: 2rem;
}

.section h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

@media (max-width: 600px) {
  .header h1 {
    font-size: 1.75rem;
  }

  .controls {
    flex-direction: column;
  }
}
</style>
