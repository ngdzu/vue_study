import { ref } from 'vue'
import type { Notification } from '../types'

/**
 * useNotifications - Manages notification state
 * Demonstrates: ref, array operations, methods
 */
export const useNotifications = () => {
    const notifications = ref<Notification[]>([
        {
            id: '1',
            type: 'system',
            message: 'Welcome to your Personal Dashboard!',
            timestamp: new Date().toISOString(),
            read: false
        },
        {
            id: '2',
            type: 'task_due',
            message: 'Review Module 1 is due today',
            timestamp: new Date(Date.now() - 600000).toISOString(),
            read: false
        }
    ])

    const addNotification = (notification: Omit<Notification, 'id'>) => {
        notifications.value.unshift({
            ...notification,
            id: Date.now().toString()
        })
        if (notifications.value.length > 5) {
            notifications.value.pop()
        }
    }

    const clearNotification = (id: string) => {
        notifications.value = notifications.value.filter(n => n.id !== id)
    }

    const clearAllNotifications = () => {
        notifications.value = []
    }

    const markAsRead = (id: string) => {
        const notification = notifications.value.find(n => n.id === id)
        if (notification) {
            notification.read = true
        }
    }

    return {
        notifications,
        addNotification,
        clearNotification,
        clearAllNotifications,
        markAsRead
    }
}
