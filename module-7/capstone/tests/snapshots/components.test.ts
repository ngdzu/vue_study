import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TaskStats from '@/components/TaskStats.vue';
import TaskForm from '@/components/TaskForm.vue';
import TaskItem from '@/components/TaskItem.vue';
import { createPinia, setActivePinia } from 'pinia';
import { useTaskStore } from '@/stores/taskStore';

describe('Snapshot Tests', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('TaskStats snapshot', () => {
        const store = useTaskStore();
        store.addTask({
            title: 'Test',
            category: 'Work',
            estimatedDuration: 3600
        });

        const wrapper = mount(TaskStats);
        expect(wrapper.html()).toMatchSnapshot();
    });

    it('TaskForm snapshot', () => {
        const wrapper = mount(TaskForm);
        expect(wrapper.html()).toMatchSnapshot();
    });

    it('TaskItem snapshot', () => {
        const task = {
            id: 1,
            title: 'Test Task',
            description: 'Test',
            category: 'Work',
            duration: 600,
            estimatedDuration: 3600,
            completed: false,
            createdAt: '2024-01-01T00:00:00Z'
        };

        const wrapper = mount(TaskItem, {
            props: { task }
        });
        expect(wrapper.html()).toMatchSnapshot();
    });
});
