<script setup lang="ts">
import { useNotifications } from '../composables/useNotifications'

const { notifications, clearNotification, clearAllNotifications } = useNotifications()

const getIcon = (type: string) => {
  const icons: Record<string, string> = {
    'task_complete': '✅',
    'task_due': '📅',
    'system': 'ℹ️'
  }
  return icons[type] || '📢'
}

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}
</script>

<template>
  <div class="card notifications-widget">
    <div class="widget-header">
      <h2>🔔 Notifications</h2>
      <button 
        v-if="notifications.length > 0"
        class="btn btn-small btn-danger"
        @click="clearAllNotifications"
      >
        Clear All
      </button>
    </div>

    <div class="notifications-list">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification-item"
      >
        <span class="icon">{{ getIcon(notification.type) }}</span>
        <div class="content">
          <p class="message">{{ notification.message }}</p>
          <p class="time">{{ formatTime(notification.timestamp) }}</p>
        </div>
        <button 
          class="btn-close"
          @click="clearNotification(notification.id)"
        >
          ✕
        </button>
      </div>
      <p v-if="notifications.length === 0" class="no-notifications">
        No notifications
      </p>
    </div>
  </div>
</template>

<style scoped>
.notifications-widget {
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

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 300px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: 6px;
  align-items: flex-start;
}

.icon {
  font-size: 20px;
  flex-shrink: 0;
}

.content {
  flex: 1;
}

.message {
  margin: 0;
  font-size: 14px;
}

.time {
  margin: 4px 0 0 0;
  font-size: 12px;
  color: var(--text-secondary);
}

.btn-close {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 4px;
}

.no-notifications {
  text-align: center;
  color: var(--text-secondary);
  padding: 20px;
  margin: 0;
}
</style>
