# Lesson 4.1: Vue Router Setup & Basics

**Module 4: Routing & Navigation** | Lesson 1 of 4

---

## Introduction

Modern single-page applications (SPAs) need to simulate multi-page navigation without full page reloads. **Vue Router** is the official routing library for Vue.js that enables seamless client-side navigation, URL management, and component rendering based on the current route.

In this lesson, you'll learn how to:
- Install and configure Vue Router
- Define routes and navigate between pages
- Use declarative and programmatic navigation
- Create nested route hierarchies
- Pass data through routes

> 💡 **IMPORTANT**: Vue Router 4 is designed specifically for Vue 3. If you're migrating from Vue 2, you'll need to upgrade to Vue Router 4.

---

## 1. What is Vue Router?

### Purpose

Vue Router provides:
- **Client-side routing**: Navigate without page reloads
- **URL management**: Sync application state with browser URL
- **Component mapping**: Render components based on URL
- **Navigation guards**: Control access to routes
- **Route transitions**: Animate page changes
- **History management**: Browser back/forward support

### How It Works

```
URL Changes → Router Matches Path → Component Renders
```

1. User clicks a link or enters URL
2. Router intercepts navigation
3. Router matches URL to route definition
4. Corresponding component renders in `<router-view>`
5. Browser URL updates without page reload

> 💡 **IMPORTANT**: Vue Router uses the HTML5 History API by default, which requires server configuration for production deployments.

---

## 2. Installation & Setup

### Step 1: Install Vue Router

```bash
npm install vue-router@4
```

> ⚠️ **CRITICAL**: Always use Vue Router 4.x for Vue 3 projects. Vue Router 3 is for Vue 2 only.

### Step 2: Create Router Configuration

Create a router configuration file:

**File: `src/router/index.ts`**

```ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Import view components
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'

// Define routes
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  }
]

// Create router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
```

### Step 3: Install Router in Application

**File: `src/main.ts`**

```ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.mount('#app')
```

> ⚠️ **CRITICAL**: Always call `app.use(router)` BEFORE `app.mount('#app')`.

### Step 4: Add Router View to App

**File: `src/App.vue`**

```ts
<script setup lang="ts">
// No imports needed - router-link and router-view are global
</script>

<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
    </nav>
    
    <!-- Route components render here -->
    <router-view />
  </div>
</template>

<style scoped>
nav {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f5f5f5;
}

nav a {
  text-decoration: none;
  color: #42b983;
  font-weight: 500;
}

nav a.router-link-active {
  color: #35495e;
  border-bottom: 2px solid #35495e;
}
</style>
```

---

## 3. Route Configuration

### Basic Route Object

```ts
{
  path: '/users',           // URL path
  name: 'users',            // Route name (optional but recommended)
  component: UsersView,     // Component to render
  meta: { requiresAuth: true }  // Custom metadata
}
```

### Route Properties

| Property     | Type                    | Description                                          |
| ------------ | ----------------------- | ---------------------------------------------------- |
| `path`       | string                  | URL path pattern (e.g., `/`, `/users`, `/posts/:id`) |
| `name`       | string                  | Unique identifier for the route                      |
| `component`  | Component               | Component to render when route matches               |
| `components` | Object                  | Named views (multiple components per route)          |
| `redirect`   | string/Object           | Redirect to another route                            |
| `alias`      | string/Array            | Alternative paths for same component                 |
| `children`   | Array                   | Nested routes                                        |
| `meta`       | Object                  | Custom data (auth, roles, title, etc.)               |
| `props`      | boolean/Object/Function | Pass route params as props                           |

### Path Patterns

```ts
// Static path
{ path: '/about', component: About }

// Dynamic segment
{ path: '/users/:id', component: UserDetail }

// Multiple dynamic segments
{ path: '/posts/:category/:id', component: Post }

// Optional segment
{ path: '/users/:id?', component: Users }

// Catch-all / 404
{ path: '/:pathMatch(.*)*', component: NotFound }

// Regex constraint
{ path: '/order/:orderId(\\d+)', component: Order }
```

> 💡 **IMPORTANT**: Dynamic segments start with `:` and match any value until the next `/` or end of path.

---

## 4. Declarative Navigation with `<router-link>`

### Basic Usage

```ts
<template>
  <!-- String path -->
  <router-link to="/about">About</router-link>
  
  <!-- Named route -->
  <router-link :to="{ name: 'user', params: { id: 123 } }">
    User Profile
  </router-link>
  
  <!-- With query params -->
  <router-link :to="{ path: '/search', query: { q: 'vue' } }">
    Search
  </router-link>
  
  <!-- With hash -->
  <router-link :to="{ path: '/docs', hash: '#setup' }">
    Docs - Setup Section
  </router-link>
</template>
```

### Props

| Prop                 | Type          | Description                     |
| -------------------- | ------------- | ------------------------------- |
| `to`                 | string/Object | Target route                    |
| `replace`            | boolean       | Replace history instead of push |
| `active-class`       | string        | CSS class for active link       |
| `exact-active-class` | string        | CSS class for exact match       |
| `custom`             | boolean       | Disable default `<a>` rendering |

### Active Link Classes

Vue Router automatically adds CSS classes to active links:

```ts
<template>
  <nav>
    <!-- Matches /users and /users/123 -->
    <router-link to="/users" active-class="active">
      Users
    </router-link>
    
    <!-- Only matches /users exactly -->
    <router-link to="/users" exact-active-class="exact-active">
      All Users
    </router-link>
  </nav>
</template>

<style>
.active {
  font-weight: bold;
}

.exact-active {
  color: #42b983;
  border-bottom: 2px solid #42b983;
}

/* Default classes if not specified */
.router-link-active {
  /* Applied when route is partially matched */
}

.router-link-exact-active {
  /* Applied when route is exactly matched */
}
</style>
```

### Custom Rendering with Slots

```ts
<template>
  <router-link to="/about" custom v-slot="{ navigate, isActive }">
    <button 
      @click="navigate" 
      :class="{ 'btn-active': isActive }"
    >
      {{ isActive ? '→' : '' }} About
    </button>
  </router-link>
</template>
```

---

## 5. Programmatic Navigation

Use `useRouter()` composable to navigate programmatically:

### Basic Navigation

```ts
<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goToAbout() {
  // Push new entry to history
  router.push('/about')
}

function goToUserProfile() {
  // Navigate with route object
  router.push({ 
    name: 'user', 
    params: { id: 123 } 
  })
}

function replaceRoute() {
  // Replace current history entry
  router.replace('/home')
}

function goBack() {
  // Navigate backward
  router.go(-1)
}

function goForward() {
  // Navigate forward
  router.go(1)
}
</script>

<template>
  <button @click="goToAbout">Go to About</button>
  <button @click="goToUserProfile">View Profile</button>
  <button @click="replaceRoute">Replace with Home</button>
  <button @click="goBack">Back</button>
  <button @click="goForward">Forward</button>
</template>
```

### `router.push()` vs `router.replace()`

| Method                     | Description              | History Effect         |
| -------------------------- | ------------------------ | ---------------------- |
| `router.push(location)`    | Navigate to new location | Adds history entry     |
| `router.replace(location)` | Navigate without history | Replaces current entry |

```ts
// Push - user can go back
router.push('/dashboard')

// Replace - user cannot go back to previous page
router.replace('/login')
```

> 💡 **IMPORTANT**: Use `replace()` for redirects after login/logout to prevent navigation to protected pages via back button.

### Navigation with Parameters

```ts
<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function viewUser(userId: number) {
  router.push({
    name: 'user-detail',
    params: { id: userId }
  })
}

function searchProducts(query: string) {
  router.push({
    path: '/search',
    query: { q: query, sort: 'price' }
  })
}

function jumpToSection() {
  router.push({
    path: '/docs',
    hash: '#installation'
  })
}
</script>
```

### Handling Navigation Errors

```ts
<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

async function navigateToUser(id: number) {
  try {
    await router.push({ name: 'user', params: { id } })
    console.log('Navigation successful')
  } catch (error) {
    // Navigation was cancelled or failed
    console.error('Navigation failed:', error)
  }
}
</script>
```

---

## 6. Accessing Route Information

Use `useRoute()` to access current route data:

```ts
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

// Access route properties
const userId = computed(() => route.params.id)
const searchQuery = computed(() => route.query.q)
const currentPath = computed(() => route.path)
const routeName = computed(() => route.name)
const routeMeta = computed(() => route.meta)
</script>

<template>
  <div>
    <p>Current Path: {{ currentPath }}</p>
    <p>Route Name: {{ routeName }}</p>
    <p>User ID: {{ userId }}</p>
    <p>Search Query: {{ searchQuery }}</p>
  </div>
</template>
```

### Route Object Properties

| Property         | Type          | Description                       |
| ---------------- | ------------- | --------------------------------- |
| `path`           | string        | Current path (e.g., `/users/123`) |
| `name`           | string/symbol | Route name                        |
| `params`         | Object        | Dynamic route parameters          |
| `query`          | Object        | URL query parameters              |
| `hash`           | string        | URL hash (e.g., `#section`)       |
| `fullPath`       | string        | Full URL including query and hash |
| `matched`        | Array         | Matched route records             |
| `meta`           | Object        | Route metadata                    |
| `redirectedFrom` | Route         | Route redirected from (if any)    |

> ⚠️ **CRITICAL**: `route` from `useRoute()` is reactive. Use it in computed properties or watchers to react to route changes.

---

## 7. Nested Routes

Create parent-child route relationships for hierarchical page structures:

### Route Configuration

```ts
const routes: RouteRecordRaw[] = [
  {
    path: '/users',
    component: UsersLayout,
    children: [
      {
        // Matches /users
        path: '',
        component: UsersList
      },
      {
        // Matches /users/:id
        path: ':id',
        component: UserDetail
      },
      {
        // Matches /users/:id/posts
        path: ':id/posts',
        component: UserPosts
      },
      {
        // Matches /users/:id/settings
        path: ':id/settings',
        component: UserSettings
      }
    ]
  }
]
```

### Parent Component with Nested Router View

**File: `UsersLayout.vue`**

```ts
<script setup lang="ts">
// Optional: Access current route
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="users-layout">
    <header>
      <h1>Users</h1>
      <nav>
        <router-link to="/users">All Users</router-link>
      </nav>
    </header>
    
    <main>
      <!-- Nested routes render here -->
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.users-layout {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100vh;
}

header {
  padding: 1rem;
  background: #f5f5f5;
}

main {
  padding: 2rem;
  overflow-y: auto;
}
</style>
```

### Child Component

**File: `UserDetail.vue`**

```ts
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const userId = computed(() => route.params.id)
</script>

<template>
  <div class="user-detail">
    <h2>User Details</h2>
    <p>Viewing user: {{ userId }}</p>
    
    <nav>
      <router-link :to="`/users/${userId}/posts`">Posts</router-link>
      <router-link :to="`/users/${userId}/settings`">Settings</router-link>
    </nav>
    
    <!-- Further nested views can go here -->
    <router-view />
  </div>
</template>
```

### Nested Route Patterns

```ts
// Pattern 1: List and detail pages
{
  path: '/products',
  component: ProductsLayout,
  children: [
    { path: '', component: ProductsList },
    { path: ':id', component: ProductDetail }
  ]
}

// Pattern 2: Tabs navigation
{
  path: '/dashboard',
  component: DashboardLayout,
  children: [
    { path: '', redirect: 'overview' },
    { path: 'overview', component: Overview },
    { path: 'analytics', component: Analytics },
    { path: 'settings', component: Settings }
  ]
}

// Pattern 3: Multi-level nesting
{
  path: '/admin',
  component: AdminLayout,
  children: [
    {
      path: 'users',
      component: UsersSection,
      children: [
        { path: '', component: UsersList },
        { path: ':id', component: UserDetail },
        { path: ':id/edit', component: UserEdit }
      ]
    }
  ]
}
```

> 💡 **IMPORTANT**: Each level of nesting requires a `<router-view>` in the parent component to render child routes.

---

## 8. Route Props

Pass route parameters as component props for better testing and reusability:

### Boolean Mode

```ts
// Route configuration
{
  path: '/user/:id',
  component: UserDetail,
  props: true  // Pass route.params as props
}

// Component receives props instead of accessing route
<script setup lang="ts">
defineProps<{
  id: string
}>()
</script>

<template>
  <div>User ID: {{ id }}</div>
</template>
```

### Object Mode

```ts
// Pass static props
{
  path: '/promotion',
  component: Promotion,
  props: { banner: true, discount: 20 }
}
```

### Function Mode

```ts
// Custom logic to generate props
{
  path: '/search',
  component: SearchResults,
  props: (route) => ({ 
    query: route.query.q,
    page: Number(route.query.page) || 1
  })
}
```

### Named Views with Props

```ts
{
  path: '/dashboard',
  components: {
    default: DashboardMain,
    sidebar: DashboardSidebar
  },
  props: {
    default: true,
    sidebar: { expanded: true }
  }
}
```

> 💡 **IMPORTANT**: Using props makes components easier to test because they don't depend on the router.

---

## 9. Named Routes

Named routes provide benefits:
- **Refactoring safety**: Change URL without updating all references
- **Type safety**: TypeScript can validate route names
- **Cleaner code**: More readable than string paths

```ts
// Route definition
{
  path: '/user/:id/posts/:postId',
  name: 'user-post',
  component: UserPost
}

// Navigation with name
<router-link :to="{ 
  name: 'user-post', 
  params: { id: 123, postId: 456 } 
}">
  View Post
</router-link>

// Programmatic navigation
router.push({ 
  name: 'user-post', 
  params: { id: 123, postId: 456 } 
})
```

> ⚠️ **CRITICAL**: When using named routes with params, you MUST provide all required params or navigation will fail.

---

## 10. Redirect and Alias

### Redirect

```ts
// Simple redirect
{
  path: '/home',
  redirect: '/'
}

// Named route redirect
{
  path: '/old-about',
  redirect: { name: 'about' }
}

// Dynamic redirect with function
{
  path: '/search/:query',
  redirect: (to) => {
    return { path: '/results', query: { q: to.params.query } }
  }
}

// Relative redirect (in children)
{
  path: '/users/:id',
  children: [
    { path: '', redirect: 'profile' },
    { path: 'profile', component: UserProfile },
    { path: 'posts', component: UserPosts }
  ]
}
```

### Alias

Aliases allow multiple paths to render the same component:

```ts
{
  path: '/users',
  component: Users,
  alias: ['/people', '/members']
}

// All these URLs show the same component:
// /users
// /people
// /members
```

> 💡 **IMPORTANT**: Unlike redirects, aliases keep the URL unchanged. The browser shows `/people`, not `/users`.

---

## 11. History Modes

Vue Router supports different history modes:

### HTML5 History Mode (Recommended)

```ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes
})
```

**URLs**: `/about`, `/user/123`  
**Requires**: Server configuration for production  
**Benefits**: Clean URLs, SEO-friendly

### Hash Mode

```ts
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
```

**URLs**: `/#/about`, `/#/user/123`  
**Requires**: No server configuration  
**Benefits**: Works anywhere, simpler deployment

### Memory Mode (Testing/SSR)

```ts
import { createRouter, createMemoryHistory } from 'vue-router'

const router = createRouter({
  history: createMemoryHistory(),
  routes
})
```

**Use Cases**: Unit tests, server-side rendering  
**Benefits**: No browser dependency

> ⚠️ **CRITICAL**: HTML5 mode requires server configuration to redirect all requests to `index.html`. Otherwise, direct URL access or page refreshes will return 404.

---

## 12. Server Configuration for HTML5 History

### Nginx

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### Apache

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Node.js (Express)

```ts
const express = require('express')
const path = require('path')
const app = express()

app.use(express.static(path.join(__dirname, 'dist')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'))
})
```

---

## 13. Best Practices

### ✅ DO

```ts
// Use named routes for type safety
router.push({ name: 'user', params: { id: 123 } })

// Use router props for testability
{ path: '/user/:id', component: User, props: true }

// Use exact-active-class for precise styling
<router-link to="/" exact-active-class="exact-active">Home</router-link>

// Handle navigation errors
try {
  await router.push('/protected')
} catch (error) {
  console.error('Navigation blocked:', error)
}
```

### ❌ DON'T

```ts
// Don't use hardcoded paths everywhere
router.push('/user/123/posts/456')  // Hard to refactor

// Don't access route inside composables without computed
const userId = route.params.id  // Won't react to changes

// Don't forget router-view
<template>
  <nav>...</nav>
  <!-- Missing: <router-view /> -->
</template>

// Don't mix path and params in same object
router.push({ 
  path: '/user', 
  params: { id: 123 }  // Won't work!
})
// Use this instead:
router.push({ name: 'user', params: { id: 123 } })
```

---

## 14. Common Patterns

### Layout with Sidebar Navigation

```ts
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const isActive = (path: string) => {
  return computed(() => route.path.startsWith(path))
}
</script>

<template>
  <div class="layout">
    <aside>
      <nav>
        <router-link to="/dashboard" :class="{ active: isActive('/dashboard').value }">
          Dashboard
        </router-link>
        <router-link to="/users" :class="{ active: isActive('/users').value }">
          Users
        </router-link>
        <router-link to="/settings" :class="{ active: isActive('/settings').value }">
          Settings
        </router-link>
      </nav>
    </aside>
    
    <main>
      <router-view />
    </main>
  </div>
</template>
```

### Breadcrumb Navigation

```ts
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const breadcrumbs = computed(() => {
  return route.matched
    .filter(r => r.meta.breadcrumb)
    .map(r => ({
      title: r.meta.breadcrumb,
      path: r.path
    }))
})
</script>

<template>
  <nav class="breadcrumbs">
    <router-link 
      v-for="(crumb, index) in breadcrumbs" 
      :key="index"
      :to="crumb.path"
    >
      {{ crumb.title }}
      <span v-if="index < breadcrumbs.length - 1"> / </span>
    </router-link>
  </nav>
</template>
```

### Tab Navigation

```ts
<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const userId = computed(() => route.params.id)

const tabs = [
  { name: 'Profile', path: 'profile' },
  { name: 'Posts', path: 'posts' },
  { name: 'Settings', path: 'settings' }
]
</script>

<template>
  <div class="tabs">
    <router-link
      v-for="tab in tabs"
      :key="tab.path"
      :to="`/users/${userId}/${tab.path}`"
      active-class="tab-active"
    >
      {{ tab.name }}
    </router-link>
  </div>
  
  <router-view />
</template>
```

---

## 15. Debugging Router Issues

### Vue DevTools

1. Open Vue DevTools in browser
2. Click "Router" tab
3. View current route, history, and matched components

### Console Logging

```ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Log all navigation
router.beforeEach((to, from) => {
  console.log('Navigating from:', from.fullPath)
  console.log('Navigating to:', to.fullPath)
})

export default router
```

### Common Issues

| Issue                       | Cause                                | Solution                                                   |
| --------------------------- | ------------------------------------ | ---------------------------------------------------------- |
| Blank page after navigation | Missing `<router-view>`              | Add `<router-view />` to parent component                  |
| 404 on page refresh         | Server not configured for HTML5 mode | Configure server or use hash mode                          |
| Params not updating         | Component reused for same route      | Use `watch` on `route.params` or `:key` on `<router-view>` |
| Active class not working    | Path doesn't match                   | Use `exact-active-class` or check path pattern             |

---

## Summary

In this lesson, you learned:

✅ How to install and configure Vue Router 4 for Vue 3  
✅ Defining routes with path, component, and metadata  
✅ Declarative navigation with `<router-link>`  
✅ Programmatic navigation with `useRouter()`  
✅ Accessing route information with `useRoute()`  
✅ Creating nested routes for hierarchical pages  
✅ Using route props for better component testability  
✅ Named routes for refactoring safety  
✅ Redirects and aliases for URL management  
✅ History modes and server configuration  

### Key Takeaways

1. **Router Setup**: Install router, create configuration, use in app
2. **Navigation**: Use `<router-link>` for links, `useRouter()` for programmatic navigation
3. **Route Access**: Use `useRoute()` to access current route data reactively
4. **Nested Routes**: Each nesting level needs `<router-view>` in parent component
5. **Route Props**: Pass params as props for better testing
6. **Named Routes**: Use names instead of paths for refactoring safety
7. **History Mode**: Use HTML5 mode with proper server configuration

---

## Next Steps

Now that you understand basic routing:

1. ✅ Complete the [Sample Project](sample-project.md) to build a multi-page blog
2. ✅ Practice with [Exercises](exercises.md) to reinforce concepts
3. ✅ Take the [Quiz](quiz.md) to test your knowledge
4. ➡️ Continue to [Lesson 4.2: Navigation Guards & Route Protection](../lesson-4-2/README.md)

---

**Practice makes perfect!** Build small routing examples to solidify your understanding before moving to advanced topics.
