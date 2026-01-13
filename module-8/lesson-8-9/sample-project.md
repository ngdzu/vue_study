# Sample Project — Minimal Vite SSR App

This guide outlines a minimal SSR setup with Vite.

## Structure
```
sample-ssr/
  server.ts            // SSR server entry
  client.ts            // Client hydration entry
  App.vue              // Root component
  router.server.ts     // Server router factory
  router.client.ts     // Client router factory
  stores/user.ts       // Pinia store
  index.html           // HTML template with state injection
```

## Server Entry (server.ts) — Pseudocode
```ts
import { createSSRApp } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { createPinia } from 'pinia'
import { createServer } from 'node:http'
import { createServerRouter } from './router.server'
import App from './App.vue'

createServer(async (req, res) => {
  const app = createSSRApp(App)
  const pinia = createPinia()
  app.use(pinia)
  const router = createServerRouter()
  app.use(router)

  // Navigate router to requested URL
  await router.push(req.url || '/')
  await router.isReady()

  // Render HTML and serialize Pinia state
  const appHtml = await renderToString(app)
  const stateJson = JSON.stringify(pinia.state.value)

  // Inject into HTML template and send
  const html = `<!DOCTYPE html>
  <html>
    <head><meta charset="utf-8"><title>SSR</title></head>
    <body>
      <div id="app">${appHtml}</div>
      <script>window.__PINIA_STATE__ = ${stateJson}</script>
      <script type="module" src="/client.ts"></script>
    </body>
  </html>`

  res.setHeader('content-type', 'text/html')
  res.end(html)
}).listen(5174)
```

## Client Entry (client.ts)
```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createClientRouter } from './router.client'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

// Restore server state
if ((window as any).__PINIA_STATE__)
  pinia.state.value = (window as any).__PINIA_STATE__

const router = createClientRouter()
app.use(router)
router.isReady().then(() => app.mount('#app'))
```

## Store Example (stores/user.ts)
```ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({ user: null as any }),
  actions: {
    async load(id: string) {
      this.user = await fetch(`https://api.example.com/users/${id}`).then(r => r.json())
    }
  }
})
```

## SSR Notes
- Use `createMemoryHistory()` on the server and `createWebHistory()` on the client
- Prefetch data via `onServerPrefetch()` or store actions before `renderToString`
- Inject initial state into HTML and hydrate on the client
- Avoid direct DOM access during server render

---

## Nuxt 3 Variant — Quick Start

If you prefer a batteries-included SSR framework, Nuxt 3 streamlines routing, data fetching, and hydration.

### Scaffold & Run
```bash
npx nuxi init ssr-nuxt
cd ssr-nuxt
npm install
npm run dev
```

### Pages & Data Fetching
Nuxt provides file-based routing under `pages/` and built-in SSR data utilities.

```vue
<!-- pages/index.vue -->
<script setup lang="ts">
const { data: products } = await useAsyncData('products', async () => {
  const res = await $fetch('/api/products')
  return res
})
</script>

<template>
  <div>
    <h1>Products</h1>
    <ul>
      <li v-for="p in products" :key="p.id">{{ p.name }}</li>
    </ul>
  </div>
<template>
```

### Server Routes (Nitro)
Create server endpoints under `server/api/`.

```ts
// server/api/products.get.ts
export default defineEventHandler(async () => {
  return [
    { id: 1, name: 'Keyboard' },
    { id: 2, name: 'Mouse' }
  ]
})
```

### Pinia Integration
Nuxt auto-hydrates state; add Pinia via a Nuxt plugin.

```ts
// plugins/pinia.ts
import { defineNuxtPlugin } from '#app'
import { createPinia } from 'pinia'

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = createPinia()
  nuxtApp.vueApp.use(pinia)
})
```

Then define a store and use it in pages:

```ts
// stores/useProduct.ts
import { defineStore } from 'pinia'
export const useProductStore = defineStore('product', {
  state: () => ({ products: [] as any[] }),
  actions: {
    async load() {
      this.products = await $fetch('/api/products')
    }
  }
})
```

```vue
<!-- pages/products.vue -->
<script setup lang="ts">
const store = useProductStore()
await store.load() // runs during SSR
</script>

<template>
  <ul>
    <li v-for="p in store.products" :key="p.id">{{ p.name }}</li>
  </ul>
</template>
```

### SSR-Safe Practices in Nuxt
- Use `onMounted()`/client-only checks for DOM APIs (`window`, `document`).
- Prefer `useAsyncData()`/`$fetch` for SSR-friendly fetching.
- Avoid global singletons; rely on Nuxt’s per-request context.

### When to choose Nuxt 3
- Faster delivery with conventions (routing, data, server routes).
- Built-in SSR, hydration, code-splitting, and performance defaults.