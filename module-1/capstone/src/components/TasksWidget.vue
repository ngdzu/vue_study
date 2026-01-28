<script setup lang="ts">
import { ref } from 'vue'
import { useTasks } from '../composables/useTasks'

const {
  tasks,
  filterStatus,
  filteredTasks,
  addTask,
  deleteTask,
  toggleTaskStatus
} = useTasks()

const showAddForm = ref(false)
const newTask = ref({
  title: '',
  description: '',
  priority: 'medium' as const,
  dueDate: ''
})

const handleAddTask = () => {
  if (newTask.value.title.trim()) {
    addTask({
      title: newTask.value.title,
      description: newTask.value.description,
      priority: newTask.value.priority,
      status: 'pending',
      dueDate: newTask.value.dueDate
    })
    newTask.value = { title: '', description: '', priority: 'medium', dueDate: '' }
    showAddForm.value = false
  }
}
</script>

<template>
  <div class="card tasks-widget">
    <div class="widget-header">
      <h2>📋 Tasks</h2>
      <button class="btn btn-small" @click="showAddForm = !showAddForm">
        {{ showAddForm ? '✕ Close' : '+ Add Task' }}
      </button>
    </div>

    <!-- Add Task Form -->
    <form v-if="showAddForm" @submit.prevent="handleAddTask" class="add-task-form">
      <input
        v-model="newTask.title"
        type="text"
        placeholder="Task title"
        required
      />
      <textarea
        v-model="newTask.description"
        placeholder="Description (optional)"
        rows="2"
      ></textarea>
      <select v-model="newTask.priority">
        <option value="low">Low Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="high">High Priority</option>
      </select>
      <input v-model="newTask.dueDate" type="date" required />
      <div class="form-actions">
        <button type="button" class="btn btn-secondary btn-small" @click="showAddForm = false">
          Cancel
        </button>
        <button type="submit" class="btn btn-small">
          Add Task
        </button>
      </div>
    </form>

    <!-- Filter Tabs -->
    <div class="filter-tabs">
      <button
        v-for="status in ['all', 'pending', 'in-progress', 'completed']"
        :key="status"
        :class="{ active: filterStatus === status }"
        @click="filterStatus = status as any"
      >
        {{ status }}
      </button>
    </div>

    <!-- Task List -->
    <div class="task-list">
      <div
        v-for="task in filteredTasks"
        :key="task.id"
        class="task-item"
        :class="task.status"
      >
        <input
          type="checkbox"
          :checked="task.status === 'completed'"
          @change="toggleTaskStatus(task.id)"
        />
        <div class="task-content">
          <h4 :class="{ completed: task.status === 'completed' }">{{ task.title }}</h4>
          <p v-if="task.description" class="description">{{ task.description }}</p>
          <div class="task-meta">
            <span class="badge" :class="'badge-' + task.priority">
              {{ task.priority }}
            </span>
            <span class="date">📅 {{ task.dueDate }}</span>
          </div>
        </div>
        <button class="btn-delete" @click="deleteTask(task.id)">
          🗑️
        </button>
      </div>
      <p v-if="filteredTasks.length === 0" class="no-tasks">
        No tasks to display
      </p>
    </div>
  </div>
</template>

<style scoped>
.tasks-widget {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.widget-header h2 {
  margin: 0;
}

.add-task-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: 6px;
}

.add-task-form input,
.add-task-form textarea,
.add-task-form select {
  width: 100%;
}

.form-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.filter-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.filter-tabs button {
  padding: 6px 12px;
  background: var(--color-gray-200);
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  transition: all 0.2s;
}

.filter-tabs button:hover {
  background: var(--color-gray-300);
}

.filter-tabs button.active {
  background: var(--color-primary);
  color: white;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
}

.task-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: var(--bg-secondary);
  border-left: 3px solid var(--color-gray-400);
  border-radius: 4px;
  align-items: flex-start;
}

.task-item.high {
  border-left-color: var(--color-danger);
}

.task-item.medium {
  border-left-color: var(--color-warning);
}

.task-item.low {
  border-left-color: var(--color-success);
}

.task-item input[type="checkbox"] {
  margin-top: 4px;
  cursor: pointer;
}

.task-content {
  flex: 1;
  min-width: 0;
}

.task-content h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
}

.task-content h4.completed {
  text-decoration: line-through;
  color: var(--text-secondary);
}

.description {
  margin: 4px 0;
  font-size: 12px;
  color: var(--text-secondary);
}

.task-meta {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 6px;
  font-size: 12px;
}

.date {
  color: var(--text-secondary);
}

.btn-delete {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
}

.no-tasks {
  text-align: center;
  color: var(--text-secondary);
  padding: 20px;
}
</style>
