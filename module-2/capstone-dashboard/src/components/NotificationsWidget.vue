<template>
  <GlassCard variant="elevated">
    <template #header>
      <h3 class="widget-title">🔔 Notifications</h3>
      <button v-if="notifications.length > 0" class="clear-btn" @click="clearAll">
        Clear
      </button>
    </template>

    <div class="notifications-list">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification-item"
      >
        <div class="notification-icon" :class="`icon-${notification.type}`">
          {{ getIcon(notification.type) }}
        </div>

        <div class="notification-content">
          <p class="notification-title">{{ notification.title }}</p>
          <p class="notification-message">{{ notification.message }}</p>
          <span class="notification-time">{{ formatTime(notification.timestamp) }}</span>
        </div>

        <button class="notification-close" @click="removeNotification(notification.id)">
          ✕
        </button>
      </div>

      <div v-if="notifications.length === 0" class="empty-state">
        <p>No notifications</p>
      </div>
    </div>
  </GlassCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GlassCard from './GlassCard.vue'

interface Notification {
  id: string
  type: 'task' | 'system' | 'reminder' | 'message'
  title: string
  message: string
  timestamp: Date
}

const notifications = ref<Notification[]>([
  {
    id: '1',
    type: 'task',
    title: 'Task Assigned',
    message: 'You have been assigned to "Design System Updates"',
    timestamp: new Date(Date.now() - 5 * 60000)
  },
  {
    id: '2',
    type: 'reminder',
    title: 'Reminder',
    message: 'Team meeting in 1 hour',
    timestamp: new Date(Date.now() - 15 * 60000)
  },
  {
    id: '3',
    type: 'system',
    title: 'System Update',
    message: 'Dashboard has been updated to v2.1.0',
    timestamp: new Date(Date.now() - 30 * 60000)
  }
])

const getIcon = (type: string) => {
  const icons: Record<string, string> = {
    task: '📝',
    system: '⚙️',
    reminder: '⏰',
    message: '💬'
  }
  return icons[type] || '📢'
}

const formatTime = (date: Date) => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString()
}

const removeNotification = (id: string) => {
  notifications.value = notifications.value.filter(n => n.id !== id)
}

const clearAll = () => {
  notifications.value = []
}
</script>

<style scoped>
.widget-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  flex: 1;
}

.clear-btn {
  background: none;
  border: none;
  color: var(--color-primary);
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  transition: color 0.3s ease;
}

.clear-btn:hover {
  color: var(--color-secondary);
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.notification-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  transition: all 0.3s ease;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.notification-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.notification-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.notification-title {
  margin: 0;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.notification-message {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.notification-time {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.notification-close {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 1rem;
  flex-shrink: 0;
  transition: color 0.3s ease;
}

.notification-close:hover {
  color: var(--text-primary);
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: var(--text-secondary);
}

.empty-state p {
  margin: 0;
}
</style>
