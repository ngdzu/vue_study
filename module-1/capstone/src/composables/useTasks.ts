import { ref, computed } from 'vue'
import type { Task } from '../types'

/**
 * useTasks - Manages task state and operations
 * Demonstrates: ref, reactive arrays, computed, methods
 */
export const useTasks = () => {
    const tasks = ref<Task[]>([
        {
            id: '1',
            title: 'Review Module 1',
            description: 'Complete all lessons and exercises',
            priority: 'high',
            status: 'in-progress',
            dueDate: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString()
        },
        {
            id: '2',
            title: 'Build Capstone Project',
            description: 'Create Personal Dashboard application',
            priority: 'high',
            status: 'in-progress',
            dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            createdAt: new Date().toISOString()
        },
        {
            id: '3',
            title: 'Study Module 2',
            description: 'Learn about component patterns',
            priority: 'medium',
            status: 'pending',
            dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
            createdAt: new Date().toISOString()
        }
    ])

    const filterStatus = ref<'all' | 'pending' | 'in-progress' | 'completed'>('all')

    const filteredTasks = computed(() => {
        if (filterStatus.value === 'all') {
            return tasks.value
        }
        return tasks.value.filter(task => task.status === filterStatus.value)
    })

    const tasksCompletedToday = computed(() => {
        const today = new Date().toISOString().split('T')[0]
        return tasks.value.filter(
            t => t.status === 'completed' && t.dueDate === today
        ).length
    })

    const tasksDueSoon = computed(() => {
        const today = new Date()
        const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)
        return tasks.value.filter(
            t => t.status !== 'completed' &&
                new Date(t.dueDate) >= today &&
                new Date(t.dueDate) <= threeDaysFromNow
        ).length
    })

    const totalTasks = computed(() => tasks.value.length)

    const completionPercentage = computed(() => {
        if (tasks.value.length === 0) return 0
        const completed = tasks.value.filter(t => t.status === 'completed').length
        return Math.round((completed / tasks.value.length) * 100)
    })

    const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
        tasks.value.push({
            ...task,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
        })
    }

    const updateTask = (id: string, updates: Partial<Task>) => {
        const index = tasks.value.findIndex(t => t.id === id)
        if (index !== -1) {
            tasks.value[index] = { ...tasks.value[index], ...updates }
        }
    }

    const deleteTask = (id: string) => {
        tasks.value = tasks.value.filter(t => t.id !== id)
    }

    const toggleTaskStatus = (id: string) => {
        const task = tasks.value.find(t => t.id === id)
        if (task) {
            task.status = task.status === 'completed' ? 'pending' : 'completed'
        }
    }

    return {
        tasks,
        filterStatus,
        filteredTasks,
        tasksCompletedToday,
        tasksDueSoon,
        totalTasks,
        completionPercentage,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus
    }
}
