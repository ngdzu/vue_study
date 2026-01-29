<template>
  <div class="stat-card" :style="{ borderLeftColor: color }">
    <div class="stat-header">
      <div v-if="$slots.icon" class="stat-icon">
        <slot name="icon" />
      </div>
      <div v-else class="stat-icon-placeholder" :style="{ backgroundColor: color }">
        📊
      </div>
      <div v-if="trend" class="stat-trend" :class="`trend-${trend}`">
        <span>{{ trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→' }}</span>
      </div>
    </div>

    <div class="stat-content">
      <p class="stat-label">{{ label }}</p>
      <div class="stat-value">
        <span class="stat-number">{{ Math.floor(displayValue) }}</span>
        <span v-if="unit" class="stat-unit">{{ unit }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useAnimateValue } from '../composables/useAnimationFrame'

interface Props {
  label: string
  value: number
  unit?: string
  color?: string
  trend?: 'up' | 'down' | 'neutral'
  animate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color: '#667eea',
  animate: true
})

const displayValue = ref(props.value)

if (props.animate) {
  const { currentValue, start } = useAnimateValue(0, props.value, 1500)
  displayValue.value = currentValue.value

  onMounted(() => {
    start()
  })
}

watch(() => props.value, (newValue) => {
  displayValue.value = newValue
})
</script>

<style scoped>
.stat-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-left: 4px solid;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08),
              0 0 0 1px rgba(255, 255, 255, 0.08) inset;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:hover {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(24px) saturate(200%);
  -webkit-backdrop-filter: blur(24px) saturate(200%);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12),
              0 0 0 1px rgba(255, 255, 255, 0.15) inset;
  transform: translateY(-4px);
}

:deep(.dark) .stat-card {
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3),
              0 0 0 1px rgba(255, 255, 255, 0.05) inset;
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.stat-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-icon-placeholder {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  opacity: 0.7;
}

.stat-trend {
  font-size: 1.5rem;
  margin-left: auto;
  transition: transform 0.3s ease;
}

.trend-up {
  color: var(--color-success);
  transform: scaleY(1);
}

.trend-down {
  color: var(--color-error);
  transform: scaleY(-1);
}

.trend-neutral {
  color: var(--color-primary);
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

.stat-value {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.stat-number {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-unit {
  font-size: 0.875rem;
  color: var(--text-secondary);
}
</style>
