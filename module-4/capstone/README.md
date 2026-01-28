# Module 4 Capstone: Admin Dashboard Application

**Module 4: Routing & Navigation** | Final Project

---

## Project Overview

Build a complete admin dashboard that demonstrates all routing concepts from Module 4:
- Multi-page navigation
- Protected routes with authentication
- Role-based access control
- Dynamic route parameters
- Search and filters with query params
- Nested routes for dashboard sections
- Lazy-loaded admin modules
- Route transitions

**Estimated Time**: 3-4 hours

---

## Learning Objectives

By completing this capstone, you will:
- ✅ Implement complete routing architecture
- ✅ Protect routes with authentication guards
- ✅ Create role-based access control
- ✅ Build data-driven routes with params and query
- ✅ Optimize with lazy loading
- ✅ Enhance UX with transitions
- ✅ Handle all navigation scenarios

---

## Requirements

### 1. Authentication System
- Login page for unauthenticated users
- Logout functionality
- Token-based auth simulation
- Redirect to intended page after login
- Protected routes requiring authentication

### 2. Role-Based Access
- Two user roles: `admin` and `user`
- Admin-only routes (user management, settings)
- User routes (dashboard, profile)
- Forbidden page for unauthorized access

### 3. Dashboard with Nested Routes
```
/dashboard
├── /overview (default)
├── /analytics
├── /reports
└── /settings
```

### 4. User Management (Admin Only)
```
/users
├── / (list)
├── /:id (detail)
├── /:id/edit (edit form)
└── /create (new user form)
```

### 5. Search & Filters
- User list with search query param
- Filter by role, status
- Pagination with page query param
- Sort options
- URL reflects all filters

### 6. Advanced Features
- Lazy-loaded admin section
- Route transitions between pages
- Loading states
- 404 error page
- Unsaved changes warnings
- Breadcrumb navigation

---

## Project Structure

```
src/
├── router/
│   ├── index.ts (main router)
│   ├── guards.ts (navigation guards)
│   └── routes/
│       ├── auth.ts
│       ├── dashboard.ts
│       └── users.ts
├── stores/
│   ├── auth.ts (authentication state)
│   └── users.ts (user management)
├── views/
│   ├── auth/
│   │   ├── LoginView.vue
│   │   └── ForbiddenView.vue
│   ├── dashboard/
│   │   ├── DashboardLayout.vue
│   │   ├── OverviewView.vue
│   │   ├── AnalyticsView.vue
│   │   ├── ReportsView.vue
│   │   └── SettingsView.vue
│   ├── users/
│   │   ├── UsersListView.vue
│   │   ├── UserDetailView.vue
│   │   ├── UserEditView.vue
│   │   └── UserCreateView.vue
│   ├── HomeView.vue
│   └── NotFoundView.vue
├── components/
│   ├── AppHeader.vue
│   ├── Sidebar.vue
│   ├── Breadcrumbs.vue
│   └── UserCard.vue
└── types/
    └── index.ts
```

---

## Implementation Steps

### Step 1: Setup Project (15 min)

```bash
npm create vite@latest admin-dashboard -- --template vue-ts
cd admin-dashboard
npm install
npm install vue-router@4 pinia
```

### Step 2: Create Type Definitions (10 min)

**File: `src/types/index.ts`**

```ts
export interface User {
  id: number
  username: string
  email: string
  role: 'admin' | 'user'
  status: 'active' | 'inactive'
  createdAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export interface RouteGuardParams {
  requiresAuth?: boolean
  role?: 'admin' | 'user'
  guest?: boolean
}
```

### Step 3: Auth Store (20 min)

**File: `src/stores/auth.ts`**

```ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  
  function login(username: string, password: string): boolean {
    // Simulated authentication
    if (username === 'admin' && password === 'admin123') {
      user.value = {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin',
        status: 'active',
        createdAt: new Date().toISOString()
      }
      token.value = 'admin-token-' + Date.now()
    } else if (username === 'user' && password === 'user123') {
      user.value = {
        id: 2,
        username: 'user',
        email: 'user@example.com',
        role: 'user',
        status: 'active',
        createdAt: new Date().toISOString()
      }
      token.value = 'user-token-' + Date.now()
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
  
  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    login,
    logout
  }
})
```

### Step 4: Router Configuration (30 min)

**File: `src/router/guards.ts`**

```ts
import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export function setupGuards(router: Router) {
  // Authentication guard
  router.beforeEach((to, from) => {
    const authStore = useAuthStore()
    
    // Check authentication
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      return {
        name: 'login',
        query: { redirect: to.fullPath }
      }
    }
    
    // Check role authorization
    if (to.meta.role === 'admin' && !authStore.isAdmin) {
      return { name: 'forbidden' }
    }
    
    // Redirect authenticated users from guest pages
    if (to.meta.guest && authStore.isAuthenticated) {
      return { name: 'dashboard' }
    }
    
    return true
  })
  
  // Update page title
  router.afterEach((to) => {
    const title = to.meta.title as string || 'Dashboard'
    document.title = `${title} | Admin Dashboard`
  })
}
```

**File: `src/router/index.ts`**

```ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { setupGuards } from './guards'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Home' }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { guest: true, title: 'Login' }
  },
  {
    path: '/forbidden',
    name: 'forbidden',
    component: () => import('@/views/auth/ForbiddenView.vue'),
    meta: { title: '403 Forbidden' }
  },
  {
    path: '/dashboard',
    component: () => import('@/views/dashboard/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/views/dashboard/OverviewView.vue'),
        meta: { title: 'Dashboard' }
      },
      {
        path: 'analytics',
        name: 'analytics',
        component: () => import('@/views/dashboard/AnalyticsView.vue'),
        meta: { title: 'Analytics' }
      },
      {
        path: 'reports',
        name: 'reports',
        component: () => import('@/views/dashboard/ReportsView.vue'),
        meta: { title: 'Reports' }
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@/views/dashboard/SettingsView.vue'),
        meta: { title: 'Settings' }
      }
    ]
  },
  {
    path: '/users',
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: '',
        name: 'users',
        component: () => import('@/views/users/UsersListView.vue'),
        meta: { title: 'Users' }
      },
      {
        path: 'create',
        name: 'user-create',
        component: () => import('@/views/users/UserCreateView.vue'),
        meta: { title: 'Create User' }
      },
      {
        path: ':id',
        name: 'user-detail',
        component: () => import('@/views/users/UserDetailView.vue'),
        props: true,
        meta: { title: 'User Detail' }
      },
      {
        path: ':id/edit',
        name: 'user-edit',
        component: () => import('@/views/users/UserEditView.vue'),
        props: true,
        meta: { title: 'Edit User' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Page Not Found' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

setupGuards(router)

export default router
```

### Step 5: Key Components (45 min)

Create views for:
- Login page
- Dashboard layout with sidebar
- User list with search/filters
- User detail and edit pages
- 404 and 403 pages

### Step 6: Styling & UX (30 min)

- Add route transitions
- Loading states
- Responsive design
- Active navigation highlighting

---

## Assessment Rubric (100 points)

| Category           | Points | Criteria                                     |
| ------------------ | ------ | -------------------------------------------- |
| **Router Setup**   | 15     | Routes configured, guards work, lazy loading |
| **Authentication** | 20     | Login/logout, protected routes, redirects    |
| **Authorization**  | 15     | Role-based access, admin routes protected    |
| **Navigation**     | 15     | Nested routes, links work, breadcrumbs       |
| **Query Params**   | 15     | Search, filters, pagination work             |
| **UX**             | 10     | Transitions, loading states, responsive      |
| **Code Quality**   | 10     | TypeScript, organization, best practices     |

**Total**: 100 points  
**Passing**: 80 points

---

## Testing Checklist

- [ ] Login redirects to dashboard
- [ ] Protected routes require login
- [ ] Admin routes blocked for regular users
- [ ] Logout clears session
- [ ] Redirect after login works
- [ ] Nested dashboard routes work
- [ ] User list with filters works
- [ ] Pagination updates URL
- [ ] User detail shows correct user
- [ ] 404 page for invalid routes
- [ ] Browser back/forward works
- [ ] Refresh page maintains state

---

## Extensions

Add these for additional challenge:

1. **Real API Integration**: Replace mock data with API calls
2. **Advanced Filters**: Date ranges, multi-select
3. **Export/Import**: Download user data
4. **Notifications**: Toast messages for actions
5. **Dark Mode**: Theme toggle
6. **Accessibility**: ARIA labels, keyboard navigation

---

## Summary

This capstone demonstrates:
✅ Complete router architecture  
✅ Authentication & authorization  
✅ Navigation guards  
✅ Dynamic routing  
✅ Query parameters  
✅ Nested routes  
✅ Lazy loading  
✅ Production-ready patterns  

**Congratulations on completing Module 4! 🎉**

You now have mastery of Vue Router and can build professional multi-page Vue applications!
