import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TaskStats from '@/components/TaskStats.vue';
import { createPinia, setActivePinia } from 'pinia';
import { useTaskStore } from '@/stores/taskStore';

describe('TaskStats Component', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('renders stats card', () => {
        const wrapper = mount(TaskStats);
        expect(wrapper.find('.task-stats').exists()).toBe(true);
    });

    it('displays total tasks count', () => {
        const store = useTaskStore();
        store.addTask({
            title: 'Task 1',
            category: 'Work',
            estimatedDuration: 3600
        });

        const wrapper = mount(TaskStats);
        expect(wrapper.text()).toContain('Total Tasks');
        expect(wrapper.text()).toContain('1');
    });

    it('displays completed tasks count', () => {
        const store = useTaskStore();
        store.addTask({
            title: 'Task 1',
            category: 'Work',
            estimatedDuration: 3600
        });
        store.toggleTask(store.tasks[0].id);

        const wrapper = mount(TaskStats);
        expect(wrapper.text()).toContain('Completed');
        expect(wrapper.text()).toContain('1');
    });

    it('displays formatted total time', () => {
        const store = useTaskStore();
        store.addTask({
            title: 'Task 1',
            category: 'Work',
            estimatedDuration: 3600
        });
        store.logTime(store.tasks[0].id, 3661); // 1h 1m 1s

        const wrapper = mount(TaskStats);
        expect(wrapper.text()).toContain('01:01:01');
    });
});
