# Lesson 8.9 — Server-Side Rendering (SSR) & Hydration

## Learning Goals
- Understand Vue 3 SSR lifecycle and hydration
- Render HTML on the server using `createSSRApp` and `@vue/server-renderer`
- Prefetch async data on the server with `onServerPrefetch()`
- Transfer initial state to the client and hydrate Pinia
- Write SSR-safe code (avoid direct DOM access during server render)

## What You Will Build
A minimal SSR app that renders a route on the server, prefetches data, transfers initial state, and hydrates on the client.

---

## SSR Overview
SSR renders your Vue app to HTML on the server, improving TTFB/SEO. The client then hydrates the markup, attaching event listeners and making it interactive.

- Server: `createSSRApp(App)` + `renderToString(app)`
- Client: `createApp(App).mount('#app')` hydrates the server-rendered HTML

### Core APIs
- `createSSRApp(App)`: Create an SSR-capable app instance
- `@vue/server-renderer`: `renderToString(app)` renders HTML
- `onServerPrefetch(cb)`: Prefetch async data during SSR
- `useSSRContext()`: Access per-request context on the server

---

## Router & Pinia in SSR
- Router: Use `createMemoryHistory()` on the server; `createWebHistory()` on the client
- Pinia: Create a fresh store per request, populate on server, serialize to HTML, hydrate on client by restoring state

### Server History
```ts
// server-router.ts
import { createRouter, createMemoryHistory } from 'vue-router'
export function createServerRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [ /* ... */ ],
  })
}
```

### Client History
```ts
// client-router.ts
import { createRouter, createWebHistory } from 'vue-router'
export function createClientRouter() {
  return createRouter({
    history: createWebHistory(),
    routes: [ /* ... */ ],
  })
}
```

---

## Data Prefetch with onServerPrefetch
Use `onServerPrefetch()` inside components/composables to fetch data during SSR.

```ts
// useUser.ts
import { ref, onServerPrefetch } from 'vue'

export function useUser(id: string) {
  const user = ref<any>(null)
  const load = async () => {
    user.value = await fetch(`https://api.example.com/users/${id}`).then(r => r.json())
  }
  onServerPrefetch(load)
  return { user, load }
}
```

On the client, hydration uses the server-fetched state; you can also re-fetch in `onMounted()` if needed.

---

## Hydrating Pinia State
On the server, serialize store state into the HTML; on the client, restore it.

```ts
// server entry (pseudo)
import { renderToString } from '@vue/server-renderer'
import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'

export async function render(url: string) {
  const app = createSSRApp(App)
  const pinia = createPinia()
  app.use(pinia)
  // setup router, navigate to url, prefetch data
  const html = await renderToString(app)
  const state = JSON.stringify(pinia.state.value)
  return template(html, state) // inject into HTML
}
```

```ts
// client entry (pseudo)
import { createApp } from 'vue'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

// Restore server state
if ((window as any).__PINIA_STATE__) {
  pinia.state.value = (window as any).__PINIA_STATE__
}

app.mount('#app') // Hydrate
```

---

## SSR-Safe Code Patterns
- Avoid direct DOM access (`document`, `window`) during SSR; use `onMounted()` for browser-only work
- Check environment: `if (typeof window !== 'undefined') { /* browser-only */ }`
- Use per-request app instances (no singletons) to prevent cross-request state leakage
- Ensure async prefetch completes before `renderToString`

---

## Vite SSR vs Nuxt 3
- Vite SSR: Minimal, explicit control; you wire server and client entries yourself
- Nuxt 3: Batteries-included SSR+CSR with routing, data fetching conventions; faster to ship

Choose Vite SSR for learning and control; choose Nuxt 3 for production velocity.

---

## Verification Checklist
- Server renders HTML for routes
- Async data is preloaded via `onServerPrefetch`
- Pinia state is serialized server-side and hydrated client-side
- Router history differs per environment (memory vs web)
- No DOM access during server render

Proceed to the sample project and exercises.
