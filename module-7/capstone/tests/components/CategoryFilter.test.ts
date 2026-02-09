import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CategoryFilter from '@/components/CategoryFilter.vue';
import { createPinia, setActivePinia } from 'pinia';
import { useTaskStore } from '@/stores/taskStore';

describe('CategoryFilter Component', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('renders select element', () => {
        const wrapper = mount(CategoryFilter, {
            props: { modelValue: 'All' }
        });

        expect(wrapper.find('select').exists()).toBe(true);
    });

    it('displays All Categories option', () => {
        const wrapper = mount(CategoryFilter, {
            props: { modelValue: 'All' }
        });

        expect(wrapper.text()).toContain('All Categories');
    });

    it('updates selected category', async () => {
        const wrapper = mount(CategoryFilter, {
            props: { modelValue: 'All' }
        });

        const store = useTaskStore();
        store.addTask({
            title: 'Work Task',
            category: 'Work',
            estimatedDuration: 3600
        });

        await wrapper.vm.$nextTick();
        expect(wrapper.text()).toContain('Work');
    });
});
