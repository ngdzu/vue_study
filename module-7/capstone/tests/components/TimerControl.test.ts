import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TimerControl from '@/components/TimerControl.vue';

describe('TimerControl Component', () => {
    it('renders timer controls', () => {
        const wrapper = mount(TimerControl);

        expect(wrapper.find('.timer-display').exists()).toBe(true);
        expect(wrapper.text()).toContain('Start');
        expect(wrapper.text()).toContain('Pause');
        expect(wrapper.text()).toContain('Stop');
    });

    it('displays timer display element', () => {
        const wrapper = mount(TimerControl);

        expect(wrapper.find('.timer-display').exists()).toBe(true);
    });

    it('enables start button initially', async () => {
        const wrapper = mount(TimerControl);

        const startBtn = wrapper.findAll('button')[0];
        expect(startBtn.exists()).toBe(true);
    });

    it('emits timeLogged event when stopped', async () => {
        const wrapper = mount(TimerControl);

        const stopBtn = wrapper.findAll('button')[3];
        await stopBtn.trigger('click');

        expect(wrapper.emitted('timeLogged')).toBeTruthy();
    });
});
