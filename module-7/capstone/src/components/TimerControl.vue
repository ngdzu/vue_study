<template>
  <div class="timer-control">
    <div class="timer-display">
      {{ formattedTime }}
    </div>
    <div class="timer-controls">
      <button
        @click="start"
        :disabled="isRunning"
        class="btn btn-start"
        aria-label="Start timer"
      >
        ▶ Start
      </button>
      <button
        @click="pause"
        :disabled="!isRunning"
        class="btn btn-pause"
        aria-label="Pause timer"
      >
        ⏸ Pause
      </button>
      <button
        @click="handleResume"
        :disabled="isRunning"
        class="btn btn-resume"
        aria-label="Resume timer"
      >
        ▶ Resume
      </button>
      <button
        @click="handleStop"
        class="btn btn-stop"
        aria-label="Stop timer"
      >
        ⏹ Stop
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTimer } from '@/composables/useTimer';

const timer = useTimer();

const emit = defineEmits<{
  timeLogged: [seconds: number];
}>();

const handleResume = () => {
  timer.resume();
};

const handleStop = () => {
  const elapsed = timer.stop();
  emit('timeLogged', elapsed);
};

defineExpose({
  start: timer.start,
  pause: timer.pause,
  resume: timer.resume,
  reset: timer.reset,
  stop: timer.stop,
  getElapsed: () => timer.elapsed.value
});
</script>

<style scoped>
.timer-control {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.timer-display {
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  font-family: 'Courier New', monospace;
  color: #333;
  margin-bottom: 1.5rem;
}

.timer-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0.5rem;
}

.btn {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-start {
  background: #4caf50;
  color: white;
}

.btn-start:hover:not(:disabled) {
  background: #45a049;
}

.btn-pause {
  background: #ff9800;
  color: white;
}

.btn-pause:hover:not(:disabled) {
  background: #e68900;
}

.btn-resume {
  background: #2196f3;
  color: white;
}

.btn-resume:hover:not(:disabled) {
  background: #0b7dda;
}

.btn-stop {
  background: #f44336;
  color: white;
}

.btn-stop:hover {
  background: #da190b;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
