import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import EmptyState from '@/components/EmptyState.vue';
import { createPinia, setActivePinia } from 'pinia';

describe('EmptyState Component', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('renders empty state when no tasks', () => {
        const wrapper = mount(EmptyState);

        expect(wrapper.text()).toContain('No tasks yet');
        expect(wrapper.text()).toContain('Create your first task');
    });

    it('displays icon', () => {
        const wrapper = mount(EmptyState);

        expect(wrapper.text()).toContain('📋');
    });
});
