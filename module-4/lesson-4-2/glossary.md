# Glossary: Navigation Guards & Route Protection

**Module 4: Routing & Navigation** | Lesson 4.2

---

## Guard Types

### Navigation Guard
Function that controls whether navigation to a route should proceed, be cancelled, or redirected. Guards can be global, per-route, or in-component.

### Global Before Guard (`router.beforeEach`)
Guard that runs before every route navigation. Used for authentication, logging, and global checks.

**Example:**
```ts
router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return { name: 'login' }
  }
})
```

### Global Resolve Guard (`router.beforeResolve`)
Guard that runs after all in-component guards and async route components are resolved, but before navigation is confirmed.

### Global After Hook (`router.afterEach`)
Hook that runs after navigation is confirmed. Cannot affect navigation. Used for analytics, page titles, scroll behavior.

**Example:**
```ts
router.afterEach((to) => {
  document.title = to.meta.title || 'App'
})
```

### Per-Route Guard (`beforeEnter`)
Guard defined in route configuration. Runs only for specific route. Can be a single function or array of functions.

**Example:**
```ts
{
  path: '/admin',
  beforeEnter: (to, from) => {
    if (!isAdmin()) return false
  }
}
```

### In-Component Guard
Guard defined within a component. Three types: `onBeforeRouteEnter`, `onBeforeRouteUpdate`, `onBeforeRouteLeave`.

---

## Component Guards

### `onBeforeRouteEnter`
Composable that registers a guard called before the route enters the component. Cannot access component instance.

### `onBeforeRouteUpdate`
Composable that registers a guard called when the route updates but the component is reused (e.g., params change).

**Example:**
```ts
onBeforeRouteUpdate((to) => {
  fetchData(to.params.id)
})
```

### `onBeforeRouteLeave`
Composable that registers a guard called before navigating away from the component. Perfect for unsaved changes warnings.

**Example:**
```ts
onBeforeRouteLeave(() => {
  if (hasUnsavedChanges()) {
    return confirm('Leave without saving?')
  }
})
```

---

## Authentication & Authorization

### Authentication
Process of verifying user identity (who you are). Typically involves login with credentials.

### Authorization
Process of determining what an authenticated user is allowed to do (what you can access). Involves checking roles and permissions.

### Route Meta
Custom metadata attached to routes via the `meta` property. Used for storing auth requirements, roles, permissions, page titles, etc.

**Example:**
```ts
{
  path: '/admin',
  meta: {
    requiresAuth: true,
    role: 'admin',
    title: 'Admin Panel'
  }
}
```

### Role-Based Access Control (RBAC)
Authorization model where access is determined by user roles (admin, user, moderator, etc.).

### Permission-Based Access
Authorization model where access is determined by specific permissions (read, write, delete, etc.).

---

## Guard Return Values

### Return `false`
Cancels the navigation. User stays on current route.

### Return `true` or `undefined`
Allows navigation to proceed.

### Return Route Location
Redirects to a different route.

**Example:**
```ts
return { name: 'login' }
return '/home'
return { path: '/users', query: { page: 1 } }
```

### Return Error
Aborts navigation with an error that can be caught.

**Example:**
```ts
return new Error('Access denied')
```

---

## Navigation Failures

### NavigationFailure
Object returned when navigation is prevented by a guard or other reason.

### NavigationFailureType
Enum of failure types:
- `aborted`: Guard returned `false`
- `cancelled`: New navigation started before current finished
- `duplicated`: Navigating to same location

**Example:**
```ts
import { isNavigationFailure, NavigationFailureType } from 'vue-router'

router.push('/admin').catch(failure => {
  if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
    console.log('Navigation prevented by guard')
  }
})
```

---

## Guard Execution Order

The complete order in which guards execute:

1. `onBeforeRouteLeave` in deactivated components
2. Global `beforeEach` guards
3. `beforeEnter` in route configuration
4. `onBeforeRouteEnter` in activated components
5. Global `beforeResolve` guards
6. Navigation confirmed
7. Global `afterEach` hooks
8. DOM updates
9. `onBeforeRouteEnter` callbacks with component instance

---

## Async Guards

### Async Guard
Guard that returns a promise. Navigation waits for promise to resolve before proceeding.

**Example:**
```ts
router.beforeEach(async (to) => {
  try {
    await verifyToken()
    return true
  } catch {
    return { name: 'login' }
  }
})
```

---

## Common Patterns

### Redirect After Login
Store intended destination in query params, redirect after successful authentication.

**Example:**
```ts
// Guard
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isAuth()) {
    return { 
      name: 'login', 
      query: { redirect: to.fullPath } 
    }
  }
})

// Login component
const redirect = route.query.redirect || '/dashboard'
router.push(redirect)
```

### Guest-Only Routes
Redirect authenticated users away from login/register pages.

**Example:**
```ts
router.beforeEach((to) => {
  if (to.meta.guest && isAuthenticated()) {
    return { name: 'dashboard' }
  }
})
```

### Unsaved Changes Warning
Warn users before they leave a form with unsaved changes.

**Example:**
```ts
onBeforeRouteLeave(() => {
  if (isDirty.value) {
    return confirm('Discard changes?')
  }
})
```

---

This glossary covers all key terms for Navigation Guards & Route Protection. Use it as a reference while building protected routes.
