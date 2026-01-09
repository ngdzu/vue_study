# Transpilation in Vue + Vite + TypeScript Projects

## What is Transpilation?

**Transpilation** = transforming source code from one language/syntax to another at the same abstraction level.

Examples:
- TypeScript → JavaScript (strip types)
- Vue templates → JavaScript render functions
- JSX → `React.createElement()` calls
- ES2023 → ES5 (for old browsers)

## TypeScript Transpilation

TypeScript adds **static types** to JavaScript, but browsers and Node can only run vanilla JS.

**Input (.ts file)**:
```ts
const greet = (name: string): string => {
  return `Hello, ${name}`;
}

interface User {
  id: number;
  name: string;
}

const user: User = { id: 1, name: "Alice" };
```

**TypeScript Compiler Output (.js file)**:
```js
const greet = (name) => {
  return `Hello, ${name}`;
}

const user = { id: 1, name: "Alice" };
```

**What happened**:
- Type annotations (`: string`, `: User`) removed
- Interface declaration removed (types don't exist at runtime)
- Logic remains identical

## Vue File Transpilation

Vue Single File Components (`.vue`) contain **three different languages** in one file:

**Input (Component.vue)**:
```vue
<script setup lang="ts">
import { ref } from 'vue'
const count = ref<number>(0)
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>

<style scoped>
.button { color: blue; }
</style>
```

**Multi-stage compilation**:

### Stage 1: Vue Compiler Splits the File
```
<script setup lang="ts">  → scriptBlock
<template>                → templateBlock
<style scoped>            → styleBlock
```

### Stage 2: Each Block Gets Transpiled

**Script Block** (TypeScript compiler):
```js
import { ref } from 'vue'
const count = ref(0)  // Type removed
```

**Template Block** (Vue template compiler):
```js
import { createElementVNode as _createElementVNode } from "vue"

function render(_ctx) {
  return _createElementVNode("button", {
    onClick: $event => (_ctx.count++)
  }, _toDisplayString(_ctx.count))
}
```

**Style Block** (CSS processor + scoping):
```css
.button[data-v-7a7a37b1] { color: blue; }
```

### Stage 3: Combine Into ES Module
```js
import { ref, createElementVNode } from 'vue'

// Script logic
const count = ref(0)

// Render function
function render(_ctx) {
  return createElementVNode("button", {
    onClick: $event => (_ctx.count++)
  }, _toDisplayString(_ctx.count))
}

// Inject scoped styles
const __cssModules = { /* style injection code */ }

// Export component
export default { setup, render }
```

## How Vite Routes Files to Transpilers

Vite uses a **plugin system** that matches **file extensions** to transformers.

### File Extension Mapping

| Extension         | Transpiler(s)                    | Process                      |
| ----------------- | -------------------------------- | ---------------------------- |
| `.js`             | None (or Babel for old browsers) | Bundle as-is                 |
| `.ts`             | TypeScript → JS                  | Type-check, strip types      |
| `.vue`            | Vue compiler (multi-stage)       | Parse blocks, compile each   |
| `.jsx` / `.tsx`   | Babel or TS compiler             | JSX → `createElement()`      |
| `.css`            | PostCSS                          | Process, inject via JS       |
| `.scss` / `.sass` | Sass → CSS → PostCSS             | Compile to CSS, then process |
| `.json`           | JSON parser                      | Convert to JS export         |

### Vite Configuration

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue()  // Registers .vue file handler
    // TypeScript support is built-in
  ]
})
```

### Request Pipeline

When you write:
```ts
import App from './App.vue'
```

**What happens**:
```
1. Browser/Node requests: ./App.vue
2. Vite intercepts the import
3. Checks file extension: .vue
4. Routes to Vue plugin
5. Vue plugin:
   - Parses .vue into blocks
   - Sees <script lang="ts">
   - Delegates script to TypeScript compiler
   - Compiles <template> to render function
   - Processes <style scoped> with unique hash
6. Returns compiled ES module (all JavaScript)
7. Browser receives and executes JS
```

## The Full Development Flow

```
┌─────────────────────────────────────────────────┐
│  You write: Component.vue + utils.ts            │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  npm run dev → Vite Dev Server starts           │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  Browser requests: /src/main.ts                 │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  Vite: .ts extension → TypeScript compiler      │
│  Output: ES module (JavaScript)                 │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  main.ts imports App.vue                        │
│  Vite: .vue extension → Vue plugin              │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  Vue Plugin Pipeline:                           │
│  1. Parse <script> <template> <style>           │
│  2. <script lang="ts"> → TypeScript compiler    │
│  3. <template> → Vue template compiler          │
│  4. <style scoped> → Add unique hash            │
│  5. Combine into single ES module               │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  Browser receives compiled JavaScript           │
│  Executes: reactive state + render function     │
└─────────────────────────────────────────────────┘
```

## Build vs Development Mode

### Development (`npm run dev`)
- **On-demand compilation**: Files compiled when requested
- **No bundling**: Native ES modules served directly
- **Fast**: Only changed files recompile (HMR)
- **Source maps**: Compiled code maps back to original for debugging

### Production (`npm run build`)
- **Full bundle**: All files compiled and bundled together
- **Optimizations**: Tree-shaking, minification, code splitting
- **Output**: Optimized `.js` and `.css` files in `dist/`
- **No source maps** (unless configured)

## Key Takeaways

1. **TypeScript transpilation**: Strips types, keeps logic
2. **Vue compilation**: Multi-stage (script + template + styles)
3. **File extension = router**: Vite uses extensions to pick transpilers
4. **Plugin system**: Extensible, each file type has a handler
5. **Development is fast**: Only changed modules recompile
6. **Browser gets JS**: All transpilation happens server-side in dev, build-time in production

## Why This Matters

- **You write**: Expressive, type-safe code with modern syntax
- **Browser runs**: Plain JavaScript that works everywhere
- **Build tools handle**: The boring transpilation work automatically
- **You debug**: Source maps let you see original code in DevTools

Understanding this pipeline helps you:
- Debug build issues
- Configure custom loaders
- Optimize build performance
- Choose the right file extensions and tools

## Further Reading

- [Vite Plugin API](https://vitejs.dev/guide/api-plugin.html)
- [Vue SFC Spec](https://vuejs.org/api/sfc-spec.html)
- [TypeScript Compiler](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- [Rollup Plugins](https://rollupjs.org/plugin-development/) (Vite uses Rollup under the hood)
