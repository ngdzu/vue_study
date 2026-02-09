import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TaskForm from '@/components/TaskForm.vue';

describe('TaskForm Component', () => {
    it('renders form elements', () => {
        const wrapper = mount(TaskForm);
        expect(wrapper.find('input[id="title"]').exists()).toBe(true);
        expect(wrapper.find('input[id="category"]').exists()).toBe(true);
        expect(wrapper.find('textarea[id="description"]').exists()).toBe(true);
        expect(wrapper.find('input[id="duration"]').exists()).toBe(true);
    });

    it('submits form with valid data', async () => {
        const wrapper = mount(TaskForm);

        await wrapper.find('input[id="title"]').setValue('Test Task');
        await wrapper.find('input[id="category"]').setValue('Work');
        await wrapper.find('input[id="duration"]').setValue(3600);

        await wrapper.find('form').trigger('submit');

        expect(wrapper.emitted('submit')).toBeTruthy();
        const submitted = wrapper.emitted('submit')[0][0];
        expect(submitted.title).toBe('Test Task');
        expect(submitted.category).toBe('Work');
    });

    it('displays validation errors', async () => {
        const wrapper = mount(TaskForm);

        await wrapper.find('form').trigger('submit');

        expect(wrapper.text()).toContain('required');
    });

    it('clears form after submission', async () => {
        const wrapper = mount(TaskForm);

        await wrapper.find('input[id="title"]').setValue('Test Task');
        await wrapper.find('input[id="category"]').setValue('Work');
        await wrapper.find('input[id="duration"]').setValue(3600);

        await wrapper.find('form').trigger('submit');

        await wrapper.vm.$nextTick();

        // Check that form was cleared by checking input values
        expect(wrapper.find('input[id="title"]').element.value).toBe('');
    });
});
