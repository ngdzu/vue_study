import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Task, getTaskStats, generateTaskId } from '@/utils/taskHelpers';

export const useTaskStore = defineStore('tasks', () => {
    const tasks = ref<Task[]>([]);
    const STORAGE_KEY = 'tasks_app_data';

    // Computed properties
    const activeTasks = computed(() => tasks.value.filter(t => !t.completed));
    const completedTasks = computed(() => tasks.value.filter(t => t.completed));
    const stats = computed(() => getTaskStats(tasks.value));

    // Actions
    const addTask = (data: {
        title: string;
        category: string;
        description?: string;
        estimatedDuration: number;
    }) => {
        const task: Task = {
            id: generateTaskId(),
            title: data.title,
            category: data.category,
            description: data.description || '',
            estimatedDuration: data.estimatedDuration,
            duration: 0,
            completed: false,
            createdAt: new Date().toISOString()
        };
        tasks.value.push(task);
        return task;
    };

    const updateTask = (id: number, updates: Partial<Task>) => {
        const task = tasks.value.find(t => t.id === id);
        if (task) {
            Object.assign(task, updates);
        }
    };

    const deleteTask = (id: number) => {
        tasks.value = tasks.value.filter(t => t.id !== id);
    };

    const toggleTask = (id: number) => {
        const task = tasks.value.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            if (task.completed) {
                task.completedAt = new Date().toISOString();
            } else {
                task.completedAt = undefined;
            }
        }
    };

    const logTime = (id: number, seconds: number) => {
        const task = tasks.value.find(t => t.id === id);
        if (task) {
            task.duration = seconds;
        }
    };

    const getTaskById = (id: number): Task | undefined => {
        return tasks.value.find(t => t.id === id);
    };

    const clearAllTasks = () => {
        tasks.value = [];
    };

    const saveTasks = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks.value));
    };

    const loadTasks = () => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            tasks.value = JSON.parse(stored);
        }
    };

    return {
        tasks,
        activeTasks,
        completedTasks,
        stats,
        addTask,
        updateTask,
        deleteTask,
        toggleTask,
        logTime,
        getTaskById,
        clearAllTasks,
        saveTasks,
        loadTasks
    };
});
