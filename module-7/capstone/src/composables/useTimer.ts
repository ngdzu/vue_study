import { ref, computed } from 'vue';
import { formatDuration } from '@/utils/taskHelpers';

/**
 * Composable for managing timer functionality
 */
export function useTimer() {
    const elapsed = ref(0);
    const isRunning = ref(false);
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const formattedTime = computed(() => formatDuration(elapsed.value));

    const start = () => {
        if (isRunning.value) return;
        isRunning.value = true;

        intervalId = setInterval(() => {
            elapsed.value += 1;
        }, 1000);
    };

    const pause = () => {
        isRunning.value = false;
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    };

    const resume = () => {
        if (!isRunning.value) {
            start();
        }
    };

    const reset = () => {
        pause();
        elapsed.value = 0;
    };

    const stop = () => {
        const finalTime = elapsed.value;
        reset();
        return finalTime;
    };

    return {
        elapsed,
        isRunning,
        formattedTime,
        start,
        pause,
        resume,
        reset,
        stop
    };
}
