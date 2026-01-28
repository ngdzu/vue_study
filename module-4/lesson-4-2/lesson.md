# Lesson 4.2: Navigation Guards & Route Protection

**Module 4: Routing & Navigation** | Lesson 2 of 4

---

## Introduction

**Navigation guards** are hooks that allow you to control navigation flow in your Vue Router application. They enable you to:
- Protect routes that require authentication
- Implement authorization (role-based access)
- Prevent navigation away from unsaved forms
- Log analytics or track page views
- Load data before entering routes

> 💡 **IMPORTANT**: Navigation guards can be async. They can return promises, making them perfect for authentication checks that require API calls.

---

## 1. Understanding Navigation Guards

### Types of Guards

1. **Global Guards**: Apply to all routes
   - `beforeEach` - runs before every navigation
   - `beforeResolve` - runs after in-component guards
   - `afterEach` - runs after navigation confirmed

2. **Per-Route Guards**: Apply to specific routes
   - `beforeEnter` - defined in route configuration

3. **In-Component Guards**: Defined in components
   - `onBeforeRouteEnter` - before route enters
   - `onBeforeRouteUpdate` - when route updates with same component
   - `onBeforeRouteLeave` - before leaving route

### Guard Execution Order

```
1. Navigation triggered
2. Call leave guards in deactivated components
3. Call global beforeEach guards
4. Call beforeEnter guards in route config
5. Resolve async route components
6. Call enter guards in activated components
7. Call global beforeResolve guards
8. Navigation confirmed
9. Call global afterEach hooks
10. DOM updates
11. Call onBeforeRouteEnter next callbacks
```

---

## 2. Global Before Guards

### `router.beforeEach()`

Runs before every navigation. Perfect for authentication checks.

**File: `src/router/index.ts`**

```ts
import { createRouter, createWebHistory } from 'vue-router'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [...]
})

// Global before guard
router.beforeEach((to, from) => {
  // Check if route requires auth
  if (to.meta.requiresAuth) {
    const isAuthenticated = checkAuth()
    
    if (!isAuthenticated) {
      // Redirect to login
      return {
        name: 'login',
        query: { redirect: to.fullPath }  // Save intended destination
      }
    }
  }
  
  // Allow navigation
  return true
})

export default router
```

### Guard Parameters

```ts
router.beforeEach((to, from) => {
  // to: Route being navigated TO
  // from: Current route being navigated AWAY from
})
```

| Parameter | Type                    | Description   |
| --------- | ----------------------- | ------------- |
| `to`      | RouteLocationNormalized | Target route  |
| `from`    | RouteLocationNormalized | Current route |

### Return Values

```ts
router.beforeEach((to, from) => {
  // Return false - cancel navigation
  return false
  
  // Return undefined/true - allow navigation
  return true
  
  // Return route location - redirect
  return { name: 'home' }
  return '/home'
  
  // Return error - abort with error
  return new Error('Navigation failed')
})
```

> ⚠️ **CRITICAL**: If you don't return anything, navigation proceeds. Return `false` to explicitly cancel.

---

## 3. Authentication Pattern

### Setting Up Auth State

**File: `src/stores/auth.ts`**

```ts
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  
  const isAuthenticated = computed(() => !!token.value)
  
  async function login(credentials: LoginCredentials) {
    try {
      const response = await api.post('/auth/login', credentials)
      token.value = response.data.token
      user.value = response.data.user
      localStorage.setItem('token', token.value)
      return true
    } catch (error) {
      return false
    }
  }
  
  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }
  
  return { user, token, isAuthenticated, login, logout }
})
```

### Implementing Auth Guard

**File: `src/router/index.ts`**

```ts
import { useAuthStore } from '@/stores/auth'

router.beforeEach((to, from) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {
      name: 'login',
      query: { redirect: to.fullPath }
    }
  }
})
```

### Route Configuration with Meta

```ts
const routes = [
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    component: Admin,
    meta: { 
      requiresAuth: true,
      role: 'admin'
    }
  },
  {
    path: '/login',
    component: Login,
    meta: { guest: true }  // Only for non-authenticated users
  }
]
```

---

## 4. Role-Based Access Control (RBAC)

### Implementing RBAC Guard

```ts
router.beforeEach((to, from) => {
  const authStore = useAuthStore()
  
  // Check authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  
  // Check role authorization
  if (to.meta.role) {
    const requiredRole = to.meta.role as string
    const userRole = authStore.user?.role
    
    if (userRole !== requiredRole) {
      return { name: 'forbidden' }  // 403 page
    }
  }
  
  // Check permissions array
  if (to.meta.permissions) {
    const requiredPermissions = to.meta.permissions as string[]
    const userPermissions = authStore.user?.permissions || []
    
    const hasPermission = requiredPermissions.every(
      permission => userPermissions.includes(permission)
    )
    
    if (!hasPermission) {
      return { name: 'forbidden' }
    }
  }
})
```

### TypeScript Route Meta

```ts
// File: src/router/types.ts
export interface RouteMeta {
  requiresAuth?: boolean
  guest?: boolean
  role?: 'admin' | 'user' | 'moderator'
  permissions?: string[]
  title?: string
}

declare module 'vue-router' {
  interface RouteMeta extends RouteMeta {}
}
```

---

## 5. Per-Route Guards

### `beforeEnter` Guard

Defined in route configuration. Runs only for that route.

```ts
{
  path: '/admin',
  component: Admin,
  beforeEnter: (to, from) => {
    const authStore = useAuthStore()
    
    if (authStore.user?.role !== 'admin') {
      alert('Admin access required')
      return { name: 'home' }
    }
  }
}
```

### Multiple `beforeEnter` Guards

```ts
const requiresAuth = (to, from) => {
  if (!isAuthenticated()) {
    return { name: 'login' }
  }
}

const requiresAdmin = (to, from) => {
  if (!isAdmin()) {
    return false
  }
}

{
  path: '/admin',
  component: Admin,
  beforeEnter: [requiresAuth, requiresAdmin]  // Array of guards
}
```

---

## 6. In-Component Guards

### `onBeforeRouteEnter`

Runs before the component is created. Cannot access `this`.

```ts
<script setup lang="ts">
import { onBeforeRouteEnter } from 'vue-router'

onBeforeRouteEnter((to, from) => {
  // Called before route enters
  // Cannot access component instance
  console.log('Entering route:', to.path)
})
</script>
```

### `onBeforeRouteUpdate`

Runs when route changes but component is reused (e.g., `/users/1` to `/users/2`).

```ts
<script setup lang="ts">
import { onBeforeRouteUpdate } from 'vue-router'
import { watch } from 'vue'

const route = useRoute()
const userId = ref(route.params.id)

onBeforeRouteUpdate((to, from) => {
  // Component will be reused
  // Fetch new data based on new params
  userId.value = to.params.id
  fetchUserData(to.params.id)
})
</script>
```

### `onBeforeRouteLeave`

Runs before navigating away. Perfect for unsaved changes warnings.

```ts
<script setup lang="ts">
import { ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

const formData = ref({ name: '', email: '' })
const isDirty = ref(false)

function handleInput() {
  isDirty.value = true
}

onBeforeRouteLeave((to, from) => {
  if (isDirty.value) {
    const answer = window.confirm(
      'You have unsaved changes. Do you really want to leave?'
    )
    // Cancel navigation if user chooses to stay
    if (!answer) return false
  }
})
</script>

<template>
  <form>
    <input v-model="formData.name" @input="handleInput" />
    <input v-model="formData.email" @input="handleInput" />
  </form>
</template>
```

---

## 7. Async Guards & Data Loading

### Loading Data in Guards

```ts
router.beforeEach(async (to, from) => {
  if (to.meta.requiresAuth) {
    try {
      // Verify token is still valid
      await api.get('/auth/verify')
      return true
    } catch (error) {
      // Token expired or invalid
      return { name: 'login' }
    }
  }
})
```

### Prefetching Route Data

```ts
{
  path: '/users/:id',
  component: UserProfile,
  beforeEnter: async (to) => {
    try {
      // Fetch user data before entering route
      const userData = await fetchUser(to.params.id)
      // Store in route meta for component to access
      to.meta.userData = userData
    } catch (error) {
      return { name: 'user-not-found' }
    }
  }
}
```

---

## 8. Global Resolve Guards

### `router.beforeResolve()`

Runs after all in-component guards and async route components are resolved.

```ts
router.beforeResolve(async (to) => {
  if (to.meta.requiresData) {
    try {
      // Fetch critical data needed for route
      await fetchCriticalData(to)
    } catch (error) {
      return { name: 'error', params: { error } }
    }
  }
})
```

---

## 9. Global After Hooks

### `router.afterEach()`

Runs after navigation is confirmed. Cannot affect navigation. Perfect for analytics.

```ts
router.afterEach((to, from, failure) => {
  if (!failure) {
    // Send analytics
    analytics.track('page_view', {
      path: to.path,
      name: to.name,
      from: from.path
    })
    
    // Update page title
    document.title = to.meta.title || 'My App'
    
    // Scroll to top
    window.scrollTo(0, 0)
  }
})
```

---

## 10. Navigation Failures

### Detecting Failures

```ts
import { NavigationFailureType, isNavigationFailure } from 'vue-router'

router.push('/admin').catch(failure => {
  if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
    console.log('Navigation aborted')
  }
  
  if (isNavigationFailure(failure, NavigationFailureType.cancelled)) {
    console.log('Navigation cancelled')
  }
  
  if (isNavigationFailure(failure, NavigationFailureType.duplicated)) {
    console.log('Navigation duplicated')
  }
})
```

---

## 11. Complete Auth Example

**File: `src/router/guards.ts`**

```ts
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export function setupGuards(router) {
  // Authentication guard
  router.beforeEach((to, from) => {
    const authStore = useAuthStore()
    
    // Allow public routes
    if (!to.meta.requiresAuth) {
      return true
    }
    
    // Check authentication
    if (!authStore.isAuthenticated) {
      return {
        name: 'login',
        query: { redirect: to.fullPath }
      }
    }
    
    // Check role
    if (to.meta.role && authStore.user?.role !== to.meta.role) {
      return { name: 'forbidden' }
    }
    
    return true
  })
  
  // Redirect authenticated users away from auth pages
  router.beforeEach((to, from) => {
    const authStore = useAuthStore()
    
    if (to.meta.guest && authStore.isAuthenticated) {
      return { name: 'dashboard' }
    }
  })
  
  // Page title and analytics
  router.afterEach((to, from, failure) => {
    if (!failure) {
      document.title = `${to.meta.title || 'Page'} | My App`
    }
  })
}
```

**File: `src/router/index.ts`**

```ts
import { setupGuards } from './guards'

const router = createRouter({
  history: createWebHistory(),
  routes
})

setupGuards(router)

export default router
```

---

## 12. Best Practices

### ✅ DO

```ts
// Use route meta for auth requirements
{
  path: '/admin',
  meta: { requiresAuth: true, role: 'admin' }
}

// Return explicit values
router.beforeEach((to) => {
  if (!isAuth()) return { name: 'login' }
  return true  // Explicit allow
})

// Handle async properly
router.beforeEach(async (to) => {
  try {
    await verifyAuth()
    return true
  } catch (error) {
    return { name: 'login' }
  }
})

// Use stores for auth state
const authStore = useAuthStore()
if (!authStore.isAuthenticated) { ... }
```

### ❌ DON'T

```ts
// Don't rely on implicit allow
router.beforeEach((to) => {
  if (!isAuth()) return { name: 'login' }
  // Missing explicit return true
})

// Don't use global state without reactivity
let isAuth = false  // Won't update across app

// Don't forget error handling in async guards
router.beforeEach(async (to) => {
  await fetchData()  // What if this fails?
})

// Don't mutate route objects
router.beforeEach((to) => {
  to.params.id = '123'  // DON'T DO THIS
})
```

---

## Summary

Navigation guards provide powerful control over routing:

✅ **Global Guards**: `beforeEach`, `beforeResolve`, `afterEach`  
✅ **Per-Route Guards**: `beforeEnter` in route config  
✅ **In-Component Guards**: `onBeforeRouteEnter/Update/Leave`  
✅ **Authentication**: Protect routes requiring login  
✅ **Authorization**: Role-based and permission-based access  
✅ **Async Guards**: Load data before navigation  
✅ **Navigation Control**: Cancel, redirect, or allow navigation  

### Guard Execution Order

1. Leave guards (deactivating components)
2. Global `beforeEach`
3. Route `beforeEnter`
4. Component enter guards
5. Global `beforeResolve`
6. Navigation confirmed
7. Global `afterEach`

---

## Next Steps

1. ✅ Complete the [Sample Project](sample-project.md)
2. ✅ Practice with [Exercises](exercises.md)
3. ✅ Take the [Quiz](quiz.md)
4. ➡️ Continue to [Lesson 4.3](../lesson-4-3/README.md)
