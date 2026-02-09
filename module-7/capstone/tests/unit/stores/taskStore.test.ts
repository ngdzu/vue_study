import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useTaskStore } from '@/stores/taskStore';

describe('Task Store', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('should initialize with empty tasks', () => {
        const store = useTaskStore();
        expect(store.tasks).toHaveLength(0);
    });

    it('should add a task', () => {
        const store = useTaskStore();
        store.addTask({
            title: 'Test Task',
            category: 'Work',
            description: 'Test description',
            estimatedDuration: 3600
        });

        expect(store.tasks).toHaveLength(1);
        expect(store.tasks[0].title).toBe('Test Task');
        expect(store.tasks[0].completed).toBe(false);
    });

    it('should update a task', () => {
        const store = useTaskStore();
        store.addTask({
            title: 'Test Task',
            category: 'Work',
            description: '',
            estimatedDuration: 3600
        });

        const taskId = store.tasks[0].id;
        store.updateTask(taskId, { title: 'Updated Task' });

        expect(store.tasks[0].title).toBe('Updated Task');
    });

    it('should delete a task', () => {
        const store = useTaskStore();
        store.addTask({
            title: 'Test Task',
            category: 'Work',
            description: '',
            estimatedDuration: 3600
        });

        const taskId = store.tasks[0].id;
        store.deleteTask(taskId);

        expect(store.tasks).toHaveLength(0);
    });

    it('should toggle task completion', () => {
        const store = useTaskStore();
        store.addTask({
            title: 'Test Task',
            category: 'Work',
            description: '',
            estimatedDuration: 3600
        });

        const taskId = store.tasks[0].id;
        store.toggleTask(taskId);

        expect(store.tasks[0].completed).toBe(true);
        expect(store.tasks[0].completedAt).toBeDefined();
    });

    it('should log time for a task', () => {
        const store = useTaskStore();
        store.addTask({
            title: 'Test Task',
            category: 'Work',
            description: '',
            estimatedDuration: 3600
        });

        const taskId = store.tasks[0].id;
        store.logTime(taskId, 300); // 5 minutes

        expect(store.tasks[0].duration).toBe(300);
    });

    it('should get active tasks', () => {
        const store = useTaskStore();
        store.addTask({
            title: 'Active Task',
            category: 'Work',
            description: '',
            estimatedDuration: 3600
        });
        store.addTask({
            title: 'Completed Task',
            category: 'Work',
            description: '',
            estimatedDuration: 3600
        });

        store.toggleTask(store.tasks[0].id);

        expect(store.activeTasks).toHaveLength(1);
        expect(store.activeTasks[0].title).toBe('Completed Task');
    });

    it('should get completed tasks', () => {
        const store = useTaskStore();
        store.addTask({
            title: 'Task 1',
            category: 'Work',
            description: '',
            estimatedDuration: 3600
        });
        store.addTask({
            title: 'Task 2',
            category: 'Work',
            description: '',
            estimatedDuration: 3600
        });

        store.toggleTask(store.tasks[0].id);

        expect(store.completedTasks).toHaveLength(1);
        expect(store.completedTasks[0].title).toBe('Task 1');
    });

    it('should get task by id', () => {
        const store = useTaskStore();
        store.addTask({
            title: 'Test Task',
            category: 'Work',
            description: '',
            estimatedDuration: 3600
        });

        const taskId = store.tasks[0].id;
        const task = store.getTaskById(taskId);

        expect(task).toBeDefined();
        expect(task?.title).toBe('Test Task');
    });

    it('should calculate stats', () => {
        const store = useTaskStore();
        store.addTask({
            title: 'Task 1',
            category: 'Work',
            description: '',
            estimatedDuration: 3600
        });
        store.addTask({
            title: 'Task 2',
            category: 'Work',
            description: '',
            estimatedDuration: 3600
        });

        store.logTime(store.tasks[0].id, 600);
        store.toggleTask(store.tasks[0].id);

        const stats = store.stats;
        expect(stats.total).toBe(2);
        expect(stats.completed).toBe(1);
        expect(stats.active).toBe(1);
        expect(stats.totalDuration).toBe(600);
    });

    it('should persist and restore from local storage', () => {
        const store = useTaskStore();
        store.addTask({
            title: 'Test Task',
            category: 'Work',
            description: '',
            estimatedDuration: 3600
        });

        store.saveTasks();

        const store2 = useTaskStore();
        store2.loadTasks();

        expect(store2.tasks).toHaveLength(1);
        expect(store2.tasks[0].title).toBe('Test Task');
    });
});
