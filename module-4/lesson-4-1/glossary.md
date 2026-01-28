# Glossary: Vue Router Setup & Basics

**Module 4: Routing & Navigation** | Lesson 4.1

---

## Core Concepts

### Client-Side Routing
Navigation within a single-page application (SPA) that updates the URL and renders different components without full page reloads. The router intercepts link clicks and handles navigation programmatically using the History API.

### Route
A configuration object that maps a URL path to a Vue component. Contains properties like `path`, `name`, `component`, `children`, and `meta`.

### Router Instance
The main router object created with `createRouter()` that manages navigation, history, and route matching. Installed in the Vue app with `app.use(router)`.

### Router View
A component (`<router-view>`) that renders the matched component for the current route. Acts as a placeholder where route components appear.

### Router Link
A component (`<router-link>`) that creates navigation links. Renders as an `<a>` tag but handles navigation without page reloads.

---

## Installation & Configuration

### Vue Router 4
The official routing library for Vue 3 applications. Provides declarative routing, nested routes, navigation guards, and history management.

**Installation:**
```bash
npm install vue-router@4
```

### `createRouter()`
Function that creates a new router instance. Takes a configuration object with `history` mode and `routes` array.

**Example:**
```ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [...]
})
```

### `createWebHistory()`
Creates an HTML5 History mode instance. Produces clean URLs (`/about`) without hash symbols. Requires server configuration for production.

### `createWebHashHistory()`
Creates a hash mode instance. URLs include a hash symbol (`/#/about`). Works without server configuration but less SEO-friendly.

### `createMemoryHistory()`
Creates a memory-based history instance that doesn't interact with the browser URL. Used for server-side rendering and testing.

---

## Route Configuration

### Route Record
An object in the routes array that defines a route. Can be a simple object or contain nested child routes.

**Type:**
```ts
interface RouteRecordRaw {
  path: string
  name?: string | symbol
  component?: Component
  components?: Record<string, Component>
  redirect?: string | RouteLocationRaw | Function
  alias?: string | string[]
  children?: RouteRecordRaw[]
  meta?: RouteMeta
  props?: boolean | Record<string, any> | Function
  // ... other properties
}
```

### Path
The URL pattern that triggers the route. Can be static (`/about`) or dynamic (`/users/:id`).

**Examples:**
```ts
path: '/home'           // Static
path: '/users/:id'      // Dynamic with param
path: '/posts/:id?'     // Optional param
path: '/:pathMatch(.*)*' // Catch-all
```

### Dynamic Segment
A part of the path that matches variable values, indicated by colon prefix (`:name`). The matched value is available in `route.params`.

**Example:**
```ts
// Route: /users/:userId/posts/:postId
// URL: /users/123/posts/456
// Params: { userId: '123', postId: '456' }
```

### Named Route
A route with a `name` property. Allows navigation by name instead of path, making refactoring easier and providing type safety.

**Example:**
```ts
{
  path: '/users/:id',
  name: 'user-detail',
  component: UserDetail
}

// Navigate by name
router.push({ name: 'user-detail', params: { id: 123 } })
```

### Route Component
The Vue component that renders when the route matches. Can be imported directly or lazy-loaded.

**Example:**
```ts
// Direct import
import Home from '@/views/Home.vue'
{ path: '/', component: Home }

// Lazy load
{ 
  path: '/about', 
  component: () => import('@/views/About.vue') 
}
```

### Route Meta
Custom metadata attached to a route via the `meta` property. Commonly used for authentication requirements, page titles, roles, etc.

**Example:**
```ts
{
  path: '/admin',
  component: Admin,
  meta: { 
    requiresAuth: true,
    role: 'admin',
    title: 'Admin Panel'
  }
}
```

---

## Navigation

### Declarative Navigation
Navigation defined in templates using `<router-link>` components. The router handles the click events and prevents full page reloads.

**Example:**
```ts
<router-link to="/about">About</router-link>
<router-link :to="{ name: 'user', params: { id: 123 } }">User</router-link>
```

### Programmatic Navigation
Navigation triggered from JavaScript code using the router instance. Accessed via `useRouter()` composable in Composition API.

**Example:**
```ts
const router = useRouter()
router.push('/about')
router.push({ name: 'user', params: { id: 123 } })
```

### `useRouter()`
Composition API composable that returns the router instance. Provides methods for programmatic navigation like `push()`, `replace()`, and `go()`.

**Example:**
```ts
import { useRouter } from 'vue-router'

const router = useRouter()
router.push('/home')
```

### `useRoute()`
Composition API composable that returns the current route object. Provides reactive access to route params, query, path, etc.

**Example:**
```ts
import { useRoute } from 'vue-router'

const route = useRoute()
console.log(route.params.id)
console.log(route.query.search)
```

### `router.push()`
Method that navigates to a new route and adds an entry to the browser history stack. User can use browser back button to return.

**Example:**
```ts
router.push('/about')
router.push({ path: '/user/123' })
router.push({ name: 'user', params: { id: 123 } })
```

### `router.replace()`
Method that navigates to a new route but replaces the current history entry instead of adding a new one. User cannot go back to previous page.

**Example:**
```ts
// Use after login to prevent back navigation to login page
router.replace('/dashboard')
```

### `router.go()`
Method that navigates forward or backward through history by a specified number of steps.

**Example:**
```ts
router.go(-1)  // Go back one page
router.go(1)   // Go forward one page
router.go(-3)  // Go back three pages
```

---

## Route Object Properties

### `route.path`
The current route path as a string, including dynamic segments.

**Example:**
```ts
// URL: /users/123
route.path // '/users/123'
```

### `route.params`
Object containing dynamic route parameters extracted from the path.

**Example:**
```ts
// Route: /users/:id
// URL: /users/123
route.params.id // '123'
```

### `route.query`
Object containing URL query parameters (after `?` in URL).

**Example:**
```ts
// URL: /search?q=vue&sort=date
route.query.q    // 'vue'
route.query.sort // 'date'
```

### `route.hash`
The hash fragment of the URL (after `#`), including the `#` symbol.

**Example:**
```ts
// URL: /docs#installation
route.hash // '#installation'
```

### `route.fullPath`
The complete URL path including query and hash.

**Example:**
```ts
// URL: /search?q=vue#results
route.fullPath // '/search?q=vue#results'
```

### `route.name`
The name of the current route, if defined in route configuration.

**Example:**
```ts
// Route: { path: '/about', name: 'about' }
route.name // 'about'
```

### `route.matched`
Array of route records that matched the current route, including parent routes in nested routing.

**Example:**
```ts
// Useful for breadcrumbs
route.matched.forEach(record => {
  console.log(record.path)
})
```

---

## Components

### `<router-view>`
Component that renders the matched component for the current route. Place in parent components to create outlets for nested routes.

**Example:**
```ts
<template>
  <div id="app">
    <nav>...</nav>
    <router-view />
  </div>
</template>
```

### `<router-link>`
Component that creates navigation links. Renders as `<a>` tag with special handling for SPA navigation.

**Props:**
- `to`: Target route (string or object)
- `replace`: Use `replace` instead of `push`
- `active-class`: CSS class when route matches
- `exact-active-class`: CSS class when route exactly matches

**Example:**
```ts
<router-link to="/about">About</router-link>
<router-link :to="{ name: 'user', params: { id: 123 } }">User</router-link>
<router-link to="/home" replace>Home</router-link>
```

### Active Link Classes

#### `router-link-active`
CSS class automatically applied to `<router-link>` when its route partially matches the current route.

**Example:**
```ts
// Current route: /users/123
// This link has router-link-active class:
<router-link to="/users">Users</router-link>
```

#### `router-link-exact-active`
CSS class automatically applied to `<router-link>` when its route exactly matches the current route.

**Example:**
```ts
// Current route: /users
// This link has router-link-exact-active class:
<router-link to="/users">Users</router-link>
// But this one doesn't:
<router-link to="/users/123">User 123</router-link>
```

### Named Views
Multiple `<router-view>` components with names, allowing multiple components to be rendered for a single route.

**Example:**
```ts
// Route configuration
{
  path: '/dashboard',
  components: {
    default: DashboardMain,
    sidebar: DashboardSidebar,
    header: DashboardHeader
  }
}

// Template
<template>
  <router-view />
  <router-view name="sidebar" />
  <router-view name="header" />
</template>
```

---

## Nested Routes

### Children Routes
Routes defined inside a parent route's `children` array. Create hierarchical page structures with multiple levels of components.

**Example:**
```ts
{
  path: '/users',
  component: UsersLayout,
  children: [
    { path: '', component: UsersList },
    { path: ':id', component: UserDetail },
    { path: ':id/edit', component: UserEdit }
  ]
}
```

### Nested Router View
A `<router-view>` component placed inside a parent route component to render child routes.

**Example:**
```ts
// UsersLayout.vue
<template>
  <div>
    <h1>Users Section</h1>
    <router-view /> <!-- Child routes render here -->
  </div>
</template>
```

---

## Advanced Features

### Route Props
Feature that passes route params as component props instead of accessing via `route.params`. Makes components more testable.

**Modes:**
- **Boolean**: `props: true` passes all params as props
- **Object**: `props: { staticProp: 'value' }` passes static props
- **Function**: `props: (route) => ({ ... })` custom logic

**Example:**
```ts
// Route
{
  path: '/user/:id',
  component: User,
  props: true
}

// Component
<script setup lang="ts">
defineProps<{ id: string }>()
</script>
```

### Redirect
Route configuration that navigates to a different route when matched. Can be a string path, route object, or function.

**Example:**
```ts
// String redirect
{ path: '/home', redirect: '/' }

// Named route redirect
{ path: '/old-path', redirect: { name: 'new-route' } }

// Function redirect
{
  path: '/search/:query',
  redirect: (to) => {
    return { path: '/results', query: { q: to.params.query } }
  }
}
```

### Alias
Alternative paths that render the same component without changing the URL or redirecting.

**Example:**
```ts
{
  path: '/users',
  component: Users,
  alias: ['/people', '/members']
}
// /users, /people, and /members all show Users component
```

---

## History API

### HTML5 History Mode
Router mode that uses the browser's History API (`pushState`, `replaceState`) for clean URLs without hash symbols.

**Benefits:**
- Clean URLs: `/about` instead of `/#/about`
- Better for SEO
- Professional appearance

**Requirements:**
- Server must redirect all requests to `index.html`
- Fallback for 404 handling

### Hash Mode
Router mode that uses URL hash fragments for routing. Works without server configuration.

**Benefits:**
- No server configuration needed
- Works in all environments
- Simple deployment

**Drawbacks:**
- URLs include hash: `/#/about`
- Less SEO-friendly
- Not as clean-looking

### Base URL
The base path for the application, set with `createWebHistory(baseUrl)`. Useful when app is not served from domain root.

**Example:**
```ts
// App served from /my-app/
const router = createRouter({
  history: createWebHistory('/my-app/'),
  routes
})

// URLs: /my-app/, /my-app/about, etc.
```

---

## TypeScript Types

### `RouteRecordRaw`
TypeScript interface for route configuration objects.

```ts
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: Home
  }
]
```

### `RouteLocationRaw`
Type for navigation targets (used in `push()`, `replace()`, etc.).

```ts
import type { RouteLocationRaw } from 'vue-router'

const target: RouteLocationRaw = { 
  name: 'user', 
  params: { id: 123 } 
}
router.push(target)
```

### `Router`
Type for the router instance returned by `createRouter()` and `useRouter()`.

```ts
import type { Router } from 'vue-router'

const router: Router = useRouter()
```

### `RouteLocationNormalizedLoaded`
Type for the route object returned by `useRoute()`.

```ts
import type { RouteLocationNormalizedLoaded } from 'vue-router'

const route: RouteLocationNormalizedLoaded = useRoute()
```

---

## Common Patterns

### Layout Pattern
Using nested routes to create app layouts with shared headers, sidebars, etc.

**Example:**
```ts
{
  path: '/app',
  component: AppLayout,
  children: [
    { path: 'dashboard', component: Dashboard },
    { path: 'profile', component: Profile },
    { path: 'settings', component: Settings }
  ]
}
```

### Tab Navigation Pattern
Using nested routes for tab-based interfaces.

**Example:**
```ts
{
  path: '/user/:id',
  component: UserDetail,
  children: [
    { path: '', redirect: 'profile' },
    { path: 'profile', component: UserProfile },
    { path: 'posts', component: UserPosts },
    { path: 'settings', component: UserSettings }
  ]
}
```

### Catch-All Route (404)
Route that matches any path not matched by other routes. Used for "Not Found" pages.

**Example:**
```ts
{
  path: '/:pathMatch(.*)*',
  name: 'not-found',
  component: NotFound
}
```

---

## Debugging Terms

### Route Matching
Process where the router compares the current URL against defined route paths to find which component to render.

### Navigation Failure
When programmatic navigation is prevented (e.g., by navigation guard, duplicate navigation, or missing route).

**Example:**
```ts
try {
  await router.push('/protected')
} catch (error) {
  // Navigation was cancelled or failed
  console.error(error)
}
```

### Vue Router DevTools
Browser extension panel in Vue DevTools that shows current route, navigation history, and matched route records.

---

## Best Practices

### Route Organization
Keep route definitions organized in a separate file (`router/index.ts`) and split into modules for large applications.

### Lazy Loading
Import route components asynchronously to reduce initial bundle size.

**Example:**
```ts
{
  path: '/admin',
  component: () => import('@/views/Admin.vue')
}
```

### Route Naming Convention
Use kebab-case for route names and make them descriptive.

**Example:**
```ts
{ name: 'user-profile' }
{ name: 'admin-users-list' }
{ name: 'blog-post-detail' }
```

---

This glossary covers all essential terms for Vue Router Setup & Basics. Refer back to these definitions as you progress through exercises and build projects.
