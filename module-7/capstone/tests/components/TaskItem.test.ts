import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TaskItem from '@/components/TaskItem.vue';
import type { Task } from '@/utils/taskHelpers';

describe('TaskItem Component', () => {
    const mockTask: Task = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        category: 'Work',
        duration: 600,
        estimatedDuration: 3600,
        completed: false,
        createdAt: new Date().toISOString()
    };

    it('renders task item', () => {
        const wrapper = mount(TaskItem, {
            props: { task: mockTask }
        });

        expect(wrapper.text()).toContain('Test Task');
        expect(wrapper.text()).toContain('Test Description');
        expect(wrapper.text()).toContain('Work');
    });

    it('emits toggle event when checkbox is clicked', async () => {
        const wrapper = mount(TaskItem, {
            props: { task: mockTask }
        });

        await wrapper.find('input[type="checkbox"]').trigger('change');

        expect(wrapper.emitted('toggle')).toBeTruthy();
        expect(wrapper.emitted('toggle')[0][0]).toBe(1);
    });

    it('shows completed state', () => {
        const completedTask = { ...mockTask, completed: true };
        const wrapper = mount(TaskItem, {
            props: { task: completedTask }
        });

        expect(wrapper.classes()).toContain('completed');
    });

    it('emits edit event', async () => {
        const wrapper = mount(TaskItem, {
            props: { task: mockTask }
        });

        const editBtn = wrapper.findAll('.btn-icon')[0];
        await editBtn.trigger('click');

        expect(wrapper.emitted('edit')).toBeTruthy();
        expect(wrapper.emitted('edit')[0][0]).toBe(1);
    });

    it('emits delete event', async () => {
        const wrapper = mount(TaskItem, {
            props: { task: mockTask }
        });

        const deleteBtn = wrapper.findAll('.btn-icon')[1];
        await deleteBtn.trigger('click');

        expect(wrapper.emitted('delete')).toBeTruthy();
        expect(wrapper.emitted('delete')[0][0]).toBe(1);
    });
});
