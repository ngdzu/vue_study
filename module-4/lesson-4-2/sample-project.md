# Sample Project: Protected Admin Dashboard

**Module 4, Lesson 4.2** | Navigation Guards & Route Protection

---

## Project Overview

Build an admin dashboard with authentication and role-based access control.

**Features:**
- User login/logout
- Protected admin routes
- Role-based access (admin vs user)
- Unsaved changes warning
- Redirect after login

**Time**: 30-40 minutes

---

## Step 1: Install Dependencies

```bash
npm create vite@latest admin-dashboard -- --template vue-ts
cd admin-dashboard
npm install
npm install vue-router@4 pinia
```

---

## Step 2: Auth Store

**File: `src/stores/auth.ts`**

```ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface User {
  id: number
  username: string
  role: 'admin' | 'user'
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  
  function login(username: string, password: string) {
    // Simulated auth
    if (username === 'admin' && password === 'admin') {
      user.value = { id: 1, username: 'admin', role: 'admin' }
      token.value = 'fake-admin-token'
    } else if (username === 'user' && password === 'user') {
      user.value = { id: 2, username: 'user', role: 'user' }
      token.value = 'fake-user-token'
    } else {
      return false
    }
    
    localStorage.setItem('token', token.value)
    return true
  }
  
  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }
  
  return { user, token, isAuthenticated, isAdmin, login, logout }
})
```

---

## Step 3: Router with Guards

**File: `src/router/index.ts`**

```ts
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { title: 'Home' }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { guest: true, title: 'Login' }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true, title: 'Dashboard' }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/AdminView.vue'),
      meta: { requiresAuth: true, role: 'admin', title: 'Admin Panel' }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: true, title: 'Profile' }
    },
    {
      path: '/forbidden',
      name: 'forbidden',
      component: () => import('@/views/ForbiddenView.vue'),
      meta: { title: '403 Forbidden' }
    }
  ]
})

// Auth guard
router.beforeEach((to, from) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  
  if (to.meta.role === 'admin' && !authStore.isAdmin) {
    return { name: 'forbidden' }
  }
  
  if (to.meta.guest && authStore.isAuthenticated) {
    return { name: 'dashboard' }
  }
})

// Page title
router.afterEach((to) => {
  document.title = `${to.meta.title} | Admin Dashboard` || 'Admin Dashboard'
})

export default router
```

---

## Step 4: Login View

**File: `src/views/LoginView.vue`**

```ts
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const error = ref('')

async function handleLogin() {
  const success = authStore.login(username.value, password.value)
  
  if (success) {
    const redirect = (route.query.redirect as string) || '/dashboard'
    router.push(redirect)
  } else {
    error.value = 'Invalid credentials'
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <h1>Login</h1>
      <p class="hint">Admin: admin/admin | User: user/user</p>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Username</label>
          <input v-model="username" type="text" required />
        </div>
        
        <div class="form-group">
          <label>Password</label>
          <input v-model="password" type="password" required />
        </div>
        
        <p v-if="error" class="error">{{ error }}</p>
        
        <button type="submit">Login</button>
      </form>
    </div>
  </div>
</template>
```

---

## Step 5: Profile with Unsaved Changes Warning

**File: `src/views/ProfileView.vue`**

```ts
<script setup lang="ts">
import { ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const isDirty = ref(false)
const formData = ref({
  email: 'user@example.com',
  bio: ''
})

function handleInput() {
  isDirty.value = true
}

function save() {
  // Save logic
  isDirty.value = false
  alert('Profile saved!')
}

onBeforeRouteLeave(() => {
  if (isDirty.value) {
    return confirm('You have unsaved changes. Leave anyway?')
  }
})
</script>

<template>
  <div>
    <h1>Profile</h1>
    <p>User: {{ authStore.user?.username }}</p>
    
    <form @submit.prevent="save">
      <input v-model="formData.email" @input="handleInput" />
      <textarea v-model="formData.bio" @input="handleInput"></textarea>
      <button type="submit">Save</button>
    </form>
    
    <p v-if="isDirty" class="warning">You have unsaved changes</p>
  </div>
</template>
```

---

## Testing Checklist

- [ ] Login redirects to dashboard
- [ ] Protected routes require login
- [ ] Admin route blocked for regular users
- [ ] Logout works
- [ ] Redirect after login works
- [ ] Unsaved changes warning appears
- [ ] Guest routes redirect authenticated users

---

**Complete project demonstrates all guard types and auth patterns! 🔒**
