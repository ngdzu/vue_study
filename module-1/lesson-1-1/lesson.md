# Lesson 1.1 — Vue 3 Setup & Project Structure

## Learning Goals
- Scaffold a Vue 3 + Vite + TypeScript project from scratch
- Understand how the app boots: `index.html` → `main.ts` → root component
- Recognize the default Vite project layout and what to change first
- Verify Hot Module Replacement (HMR) and fast refresh behavior
- Establish a clean baseline for future lessons

## Prerequisites
- Node 18+ (recommend 20 LTS via nvm)
- npm or pnpm
- JavaScript + DOM basics; comfortable in the terminal

## What You Will Build
A fresh Vite + Vue 3 + TypeScript project with a working counter, a theme toggle, and verified HMR. This becomes the foundation for later modules.

---

## Scaffold the Project
1) Create the project (Vue + TS template):
   ```bash
   npm create vite@latest vue_study -- --template vue-ts
   cd vue_study
   npm install
   ```
2) Run dev server and open in browser:
   ```bash
   npm run dev
   ```
3) Open the project in VS Code and install the Volar extension (disable Vetur).

### Project Layout (post-scaffold)
```
vite.config.ts          # Vite configuration (plugins, aliases)
tsconfig.json           # TS compiler options
index.html              # Single HTML shell, mounts the Vue app
src/
  main.ts               # Entry file: createApp + mount
  App.vue               # Root component
  assets/               # Static assets (images, styles)
  components/           # Reusable components
```

---

## Entry Flow: index.html → main.ts → App.vue

`index.html` (Vite serves this during dev):
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vue 3 + Vite</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```
- The only DOM element Vue cares about initially is `#app`.
- Vite injects dev server client for HMR automatically.

`src/main.ts` (creates and mounts the app):
```ts
import { createApp } from "vue";
import App from "./App.vue";

createApp(App).mount("#app");
```
- `createApp(App)` builds a Vue application instance using `App` as the root component.
- `.mount("#app")` tells Vue to control the `#app` element in `index.html`.

`src/App.vue` (root component using `<script setup>`):
```vue
<script setup lang="ts">
import { ref } from "vue";
const count = ref(0);
</script>

<template>
  <main>
    <h1>Vue 3 + Vite</h1>
    <button @click="count++">Clicked {{ count }} times</button>
  </main>
</template>

<style scoped>
main { font-family: system-ui, sans-serif; padding: 2rem; }
button { padding: 0.5rem 1rem; }
</style>
```
- `<script setup>` is the recommended Composition API syntax; it removes boilerplate.
- `ref(0)` creates a reactive primitive; template reads `count` directly.
- `scoped` styles apply only to this component.

---

## First Edits to Prove HMR
1) Change the `<h1>` text, save; the browser updates instantly without a full reload.
2) Click the button to increase the count, then change button label text; the count stays (state preserved = HMR working).
3) Introduce a small style tweak; confirm CSS hot-reloads.

If the page fully reloads or state resets, HMR is not working—check the dev server console for errors.

---

## TypeScript & Tooling Notes
- The template ships with `tsconfig.json` tuned for Vue + Vite; keep `strict` enabled.
- Use Volar (not Vetur) for type-aware template IntelliSense.
- Prefer `lang="ts"` in `<script setup>` to keep types consistent across lessons.
- Aliases (e.g., `@/`) can be set in `vite.config.ts` and `tsconfig.json`—helpful as project grows.

Example alias setup (optional for now):
```ts
// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
```

You also need to update `tsconfig.json` for TypeScript support:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Usage examples with `@` alias:**
```ts
// ❌ Without alias (relative paths)
import Button from '../../components/Button.vue'
import { formatDate } from '../../../utils/formatters'
import logo from '../../assets/logo.png'

// ✅ With @ alias (cleaner, refactor-friendly)
import Button from '@/components/Button.vue'
import { formatDate } from '@/utils/formatters'
import logo from '@/assets/logo.png'
```

Benefits: no `../..` maze, works from any depth, easier refactoring.

---

## Verification Checklist (before moving on)
- `npm run dev` runs cleanly; no console errors in browser or terminal.
- HMR works: editing text does not reset `count` state.
- You can locate and explain the flow: `index.html` → `main.ts` → `App.vue`.
- Volar is active in VS Code; template type checks function.
- You understand where to place new components (`src/components`) and assets (`src/assets`).

When all boxes are checked, proceed to the sample project and exercises.
