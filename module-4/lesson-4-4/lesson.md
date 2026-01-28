# Lesson 4.4: Advanced Routing Patterns

**Module 4: Routing & Navigation** | Lesson 4 of 4

---

## 1. Lazy Loading Routes

### Why Lazy Load?

- Reduces initial bundle size
- Faster initial page load
- Load routes on demand

### Basic Lazy Loading

```ts
{
  path: '/admin',
  component: () => import('@/views/AdminView.vue')
}
```

### Grouping with Webpack Chunks

```ts
{
  path: '/admin',
  component: () => import(/* webpackChunkName: "admin" */ '@/views/AdminView.vue')
},
{
  path: '/admin/users',
  component: () => import(/* webpackChunkName: "admin" */ '@/views/AdminUsers.vue')
}
```

---

## 2. Route Transitions

### Basic Transition

```ts
<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
```

### Per-Route Transitions

```ts
<router-view v-slot="{ Component, route }">
  <transition :name="route.meta.transition || 'fade'" mode="out-in">
    <component :is="Component" :key="route.path" />
  </transition>
</router-view>

// Route meta
{
  path: '/slide-page',
  meta: { transition: 'slide' }
}
```

---

## 3. Named Views

### Multiple Components Per Route

```ts
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
  <router-view name="header" />
  <div class="content">
    <router-view name="sidebar" />
    <router-view />
  </div>
</template>
```

---

## 4. Dynamic Routes

### Adding Routes at Runtime

```ts
router.addRoute({
  path: '/dynamic',
  component: DynamicView
})

// Remove route
router.removeRoute('route-name')

// Check if route exists
router.hasRoute('route-name')

// Get all routes
const routes = router.getRoutes()
```

---

## 5. History Modes Comparison

| Mode   | URL        | Server Config | Use Case      |
| ------ | ---------- | ------------- | ------------- |
| HTML5  | `/about`   | Required      | Production    |
| Hash   | `/#/about` | Not needed    | Simple deploy |
| Memory | N/A        | N/A           | Testing/SSR   |

---

## 6. Route Prefetching

```ts
{
  path: '/heavy',
  component: () => import(
    /* webpackPrefetch: true */
    '@/views/HeavyView.vue'
  )
}
```

---

## 7. Error Handling

```ts
router.onError((error) => {
  console.error('Router error:', error)
  // Handle chunk loading failures
  if (error.message.includes('Failed to fetch dynamically imported module')) {
    window.location.reload()
  }
})
```

---

## 8. Best Practices

✅ Lazy load routes by feature
✅ Group related routes in same chunk
✅ Use route transitions for better UX
✅ Prefetch critical routes
✅ Handle loading errors
✅ Use named views sparingly

---

**Next**: [Module 4 Capstone](../capstone/README.md)
