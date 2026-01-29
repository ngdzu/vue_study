<template>
  <GlassCard variant="elevated">
    <template #header>
      <h3 class="widget-title">📋 Recent Tasks</h3>
    </template>

    <div class="tasks-list">
      <div v-for="task in tasks" :key="task.id" class="task-item">
        <div class="task-check">
          <input
            type="checkbox"
            :id="`task-${task.id}`"
            :checked="task.completed"
            @change="(e) => toggleTask(task.id, (e.target as HTMLInputElement).checked)"
          />
          <label :for="`task-${task.id}`"></label>
        </div>

        <div class="task-content">
          <p class="task-title" :class="{ 'task-done': task.completed }">
            {{ task.title }}
          </p>
          <div class="task-meta">
            <span class="priority-badge" :class="`priority-${task.priority}`">
              {{ task.priority }}
            </span>
            <span class="task-date">{{ formatDate(task.dueDate) }}</span>
          </div>
        </div>
      </div>
    </div>
  </GlassCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GlassCard from './GlassCard.vue'

interface Task {
  id: string
  title: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  dueDate: string
}

const tasks = ref<Task[]>([
  {
    id: '1',
    title: 'Review project proposal',
    completed: false,
    priority: 'high',
    dueDate: '2024-01-15'
  },
  {
    id: '2',
    title: 'Update client dashboard',
    completed: true,
    priority: 'medium',
    dueDate: '2024-01-12'
  },
  {
    id: '3',
    title: 'Team meeting preparation',
    completed: false,
    priority: 'medium',
    dueDate: '2024-01-16'
  },
  {
    id: '4',
    title: 'Code review for PR #234',
    completed: true,
    priority: 'high',
    dueDate: '2024-01-10'
  }
])

const toggleTask = (taskId: string, completed: boolean) => {
  const task = tasks.value.find(t => t.id === taskId)
  if (task) {
    task.completed = completed
  }
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (date.toDateString() === today.toDateString()) {
    return 'Today'
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow'
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
}
</script>

<style scoped>
.widget-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding: 0.75rem;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.task-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.task-check {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.task-check input {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.task-check input:checked {
  background: linear-gradient(135deg, var(--color-success), #0d9488);
  border-color: var(--color-success);
}

.task-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.task-title {
  margin: 0;
  color: var(--text-primary);
  font-weight: 500;
  transition: all 0.3s ease;
}

.task-done {
  opacity: 0.6;
  text-decoration: line-through;
  color: var(--text-secondary);
}

.task-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
}

.priority-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
  text-transform: capitalize;
}

.priority-high {
  background: rgba(239, 68, 68, 0.15);
  color: var(--color-error);
}

.priority-medium {
  background: rgba(245, 158, 11, 0.15);
  color: var(--color-warning);
}

.priority-low {
  background: rgba(16, 185, 129, 0.15);
  color: var(--color-success);
}

.task-date {
  color: var(--text-secondary);
}
</style>
