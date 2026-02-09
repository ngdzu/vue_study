import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useTimer } from '@/composables/useTimer';

describe('useTimer', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });

    it('should start with 0 elapsed time', () => {
        const timer = useTimer();
        expect(timer.elapsed.value).toBe(0);
        expect(timer.isRunning.value).toBe(false);
    });

    it('should start timer', () => {
        const timer = useTimer();
        timer.start();
        expect(timer.isRunning.value).toBe(true);
    });

    it('should increment elapsed time', () => {
        const timer = useTimer();
        timer.start();
        vi.advanceTimersByTime(1000);
        expect(timer.elapsed.value).toBe(1);
    });

    it('should pause timer', () => {
        const timer = useTimer();
        timer.start();
        vi.advanceTimersByTime(1000);
        timer.pause();
        expect(timer.isRunning.value).toBe(false);

        const elapsed = timer.elapsed.value;
        vi.advanceTimersByTime(1000);
        expect(timer.elapsed.value).toBe(elapsed);
    });

    it('should resume timer', () => {
        const timer = useTimer();
        timer.start();
        vi.advanceTimersByTime(1000);
        timer.pause();
        timer.resume();
        expect(timer.isRunning.value).toBe(true);
        vi.advanceTimersByTime(1000);
        expect(timer.elapsed.value).toBe(2);
    });

    it('should reset timer', () => {
        const timer = useTimer();
        timer.start();
        vi.advanceTimersByTime(5000);
        timer.reset();
        expect(timer.elapsed.value).toBe(0);
        expect(timer.isRunning.value).toBe(false);
    });

    it('should return formatted time', () => {
        const timer = useTimer();
        timer.start();
        vi.advanceTimersByTime(3661000); // 1 hour, 1 minute, 1 second
        expect(timer.formattedTime.value).toBe('01:01:01');
    });
});
