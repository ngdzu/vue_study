<template>
  <div
    :class="[
      'glass-card',
      `glass-card-${variant}`,
      { 'glass-card-glow': glow }
    ]"
  >
    <div v-if="$slots.header" class="glass-card-header">
      <slot name="header" />
    </div>

    <div class="glass-card-body">
      <slot />
    </div>

    <div v-if="$slots.footer" class="glass-card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'default' | 'elevated' | 'gradient'
    glow?: boolean
  }>(),
  {
    variant: 'default',
    glow: false
  }
)
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-glass);
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 
              0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.dark) .glass-card {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 
              0 0 0 1px rgba(255, 255, 255, 0.05) inset;
}

.glass-card-elevated {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(28px) saturate(200%);
  -webkit-backdrop-filter: blur(28px) saturate(200%);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15),
              0 0 0 1px rgba(255, 255, 255, 0.15) inset;
}

.glass-card-elevated:hover {
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(32px) saturate(220%);
  -webkit-backdrop-filter: blur(32px) saturate(220%);
  box-shadow: 0 16px 56px rgba(0, 0, 0, 0.2),
              0 0 0 1px rgba(255, 255, 255, 0.2) inset;
  transform: translateY(-2px);
}

:deep(.dark) .glass-card-elevated {
  background: rgba(30, 41, 59, 0.6);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5),
              0 0 0 1px rgba(255, 255, 255, 0.08) inset;
}

.glass-card-gradient {
  background: linear-gradient(135deg,
    rgba(102, 126, 234, 0.2),
    rgba(118, 75, 162, 0.2)
  );
  backdrop-filter: blur(28px) saturate(200%);
  -webkit-backdrop-filter: blur(28px) saturate(200%);
  border: 1px solid;
  border-image: linear-gradient(135deg, 
    rgba(102, 126, 234, 0.5), 
    rgba(118, 75, 162, 0.5)
  ) 1;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.2),
              0 0 0 1px rgba(255, 255, 255, 0.1) inset;
}

.glass-card-gradient:hover {
  background: linear-gradient(135deg,
    rgba(102, 126, 234, 0.25),
    rgba(118, 75, 162, 0.25)
  );
  backdrop-filter: blur(32px) saturate(220%);
  -webkit-backdrop-filter: blur(32px) saturate(220%);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.3),
              0 0 0 1px rgba(255, 255, 255, 0.15) inset;
}

.glass-card-glow {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12),
              0 0 40px rgba(102, 126, 234, 0.4),
              0 0 0 1px rgba(255, 255, 255, 0.15) inset;
}

.glass-card-glow:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15),
              0 0 60px rgba(102, 126, 234, 0.6),
              0 0 0 1px rgba(255, 255, 255, 0.2) inset;
  transform: translateY(-2px);
}

.glass-card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.glass-card-footer {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
