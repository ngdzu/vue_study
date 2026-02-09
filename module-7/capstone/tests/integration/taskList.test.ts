import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import TaskList from '@/components/TaskList.vue';
import { createPinia, setActivePinia } from 'pinia';
import { useTaskStore } from '@/stores/taskStore';

describe('TaskList Component Integration', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('filters tasks by category', () => {
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

        const wrapper = mount(TaskList, {
            props: { category: 'Work' }
        });

        expect(wrapper.text()).toContain('Work Task');
        expect(wrapper.text()).not.toContain('Personal Task');
    });

    it('shows all tasks when category is All', () => {
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

        const wrapper = mount(TaskList, {
            props: { category: 'All' }
        });

        expect(wrapper.text()).toContain('Work Task');
        expect(wrapper.text()).toContain('Personal Task');
    });

    it('updates when store changes', async () => {
        setActivePinia(createPinia());
        const store = useTaskStore();

        const wrapper = mount(TaskList, {
            props: { category: 'All' }
        });

        expect(wrapper.text()).toContain('No tasks');

        store.addTask({
            title: 'New Task',
            category: 'Work',
            estimatedDuration: 3600
        });

        await wrapper.vm.$nextTick();
        expect(wrapper.text()).toContain('New Task');
    });
});
