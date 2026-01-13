# Quiz Answers — Lesson 8.9

1) `createSSRApp()` creates an app configured for server rendering; `createApp()` is for client-only apps.
2) `@vue/server-renderer` — it exports `renderToString()`.
3) To run async data fetching during SSR so the server-rendered HTML includes data.
4) The server has no DOM; direct access throws or yields inconsistent output. Use `onMounted()` or guards.
5) Server: `createMemoryHistory()`. Client: `createWebHistory()`.
6) Serialize `pinia.state.value` into HTML (e.g., `window.__PINIA_STATE__ = ...`) and restore on client before mount.
7) The process of attaching client-side Vue to server-rendered HTML, wiring events and reusing markup.
8) Shared singletons across requests (state leakage), direct DOM access on server, forgetting to await router/data before render.
9) When you want batteries-included SSR (routing, data, conventions) and faster production delivery.
10) Per-request context access on the server (e.g., request-specific data, headers, cookies), useful in SSR hooks.
