<script setup lang="ts">
import { ref } from 'vue'
import type { User } from '../types'

const user = ref<User>({
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  avatar: '👤',
  role: 'admin',
  status: 'online'
})

const showEditModal = ref(false)
const formData = ref({ name: user.value.name, email: user.value.email })

const handleSaveProfile = () => {
  user.value.name = formData.value.name
  user.value.email = formData.value.email
  showEditModal.value = false
}
</script>

<template>
  <div class="card user-profile">
    <div class="profile-header">
      <div class="avatar-section">
        <span class="avatar">{{ user.avatar }}</span>
        <div class="status" :class="user.status"></div>
      </div>
      <div class="user-info">
        <h2>{{ user.name }}</h2>
        <p class="email">{{ user.email }}</p>
        <p class="role">{{ user.role }}</p>
      </div>
    </div>

    <button class="btn btn-small" @click="showEditModal = true">
      Edit Profile
    </button>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
      <div class="modal">
        <h3>Edit Profile</h3>
        <form @submit.prevent="handleSaveProfile">
          <div class="form-group">
            <label>Name:</label>
            <input v-model="formData.name" type="text" required />
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input v-model="formData.email" type="email" required />
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="showEditModal = false">
              Cancel
            </button>
            <button type="submit" class="btn">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-profile {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.profile-header {
  display: flex;
  gap: 16px;
  align-items: center;
}

.avatar-section {
  position: relative;
}

.avatar {
  font-size: 48px;
  display: block;
}

.status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #10b981;
  border: 2px solid white;
}

.status.offline {
  background: #6b7280;
}

.status.away {
  background: #f59e0b;
}

.user-info h2 {
  margin: 0;
  font-size: 18px;
}

.user-info p {
  margin: 4px 0 0 0;
  font-size: 13px;
  color: var(--text-secondary);
}

.email {
  font-weight: 500;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--bg-primary);
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 400px;
  box-shadow: var(--shadow-lg);
}

.modal h3 {
  margin-top: 0;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
}

.form-group input {
  width: 100%;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
</style>
