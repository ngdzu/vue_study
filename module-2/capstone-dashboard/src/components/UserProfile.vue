<template>
  <GlassCard variant="elevated" glow>
    <template #header>
      <div class="profile-avatar">
        <span>👤</span>
      </div>
      <div class="profile-header">
        <h3>Alex Johnson</h3>
        <p>Product Manager</p>
      </div>
    </template>

    <div class="profile-content">
      <div class="profile-stat">
        <span class="label">Email</span>
        <span class="value">alex.johnson@company.com</span>
      </div>
      <div class="profile-stat">
        <span class="label">Location</span>
        <span class="value">San Francisco, CA</span>
      </div>
      <div class="profile-stat">
        <span class="label">Member Since</span>
        <span class="value">January 2023</span>
      </div>
      <div class="profile-status">
        <span class="status-badge">🟢 Online</span>
      </div>
    </div>

    <template #footer>
      <Button variant="secondary" size="sm">Edit Profile</Button>
      <Button variant="outline" size="sm">Settings</Button>
    </template>
  </GlassCard>
</template>

<script setup lang="ts">
import GlassCard from './GlassCard.vue'
import Button from './Button.vue'
</script>

<style scoped>
.profile-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  flex-shrink: 0;
}

.profile-header {
  display: flex;
  flex-direction: column;
}

.profile-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.profile-header p {
  margin: 0.25rem 0 0 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.profile-stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.profile-stat .label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.profile-stat .value {
  font-size: 0.95rem;
  color: var(--text-primary);
}

.profile-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-badge {
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
  background: rgba(16, 185, 129, 0.15);
  color: var(--color-success);
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
