import { describe, it, expect } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useTaskStore } from '@/stores/taskStore';

describe('Task Store Integration', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        localStorage.clear();
    });

    it('creates task and persists to storage', () => {
        const store = useTaskStore();

        store.addTask({
            title: 'Integration Test Task',
            category: 'Testing',
            estimatedDuration: 1800
        });

        store.saveTasks();

        const store2 = useTaskStore();
        store2.loadTasks();

        expect(store2.tasks).toHaveLength(1);
        expect(store2.tasks[0].title).toBe('Integration Test Task');
    });

    it('tracks task workflow', () => {
        const store = useTaskStore();

        // Create task
        const task = store.addTask({
            title: 'Workflow Task',
            category: 'Work',
            estimatedDuration: 3600
        });

        expect(store.activeTasks).toHaveLength(1);

        // Log time
        store.logTime(task.id, 600);
        expect(store.tasks[0].duration).toBe(600);

        // Complete task
        store.toggleTask(task.id);
        expect(store.completedTasks).toHaveLength(1);
        expect(store.activeTasks).toHaveLength(0);

        // Stats
        expect(store.stats.completed).toBe(1);
        expect(store.stats.active).toBe(0);
        expect(store.stats.totalDuration).toBe(600);
    });

    it('handles multiple categories', () => {
        const store = useTaskStore();

        store.addTask({
            title: 'Work Task',
            category: 'Work',
            estimatedDuration: 3600
        });

        store.addTask({
            title: 'Personal Task',
            category: 'Personal',
            estimatedDuration: 1800
        });

        store.addTask({
            title: 'Learning Task',
            category: 'Learning',
            estimatedDuration: 5400
        });

        expect(store.tasks).toHaveLength(3);
        const categories = new Set(store.tasks.map(t => t.category));
        expect(categories.size).toBe(3);
    });
});
