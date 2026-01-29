# Sample Project — Theme Provider with Provide/Inject

Purpose: Build a complete theme system using provide/inject to demonstrate dependency injection without prop drilling.

## Requirements

Build a theme provider that:
- Supports light and dark modes
- Allows any component to access the current theme
- Provides a toggle function
- Uses TypeScript for type safety
- Persists theme preference to localStorage
- Provides theme-aware color utilities

## File Structure

```
src/
  types/
    theme.ts
  keys/
    index.ts
  components/
    ThemeProvider.vue
    ThemeToggle.vue
    Card.vue
  composables/
    useTheme.ts
  App.vue
```

## Implementation Steps

### 1. Define Theme Types

```ts
// types/theme.ts
export interface Theme {
  mode: 'light' | 'dark'
  colors: {
    primary: string
    secondary: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
    error: string
    success: string
  }
}

export interface ThemeContext {
  theme: ComputedRef<Theme>
  mode: Ref<'light' | 'dark'>
  toggleTheme: () => void
  setTheme: (mode: 'light' | 'dark') => void
}
```

### 2. Create Injection Key

```ts
// keys/index.ts
import { InjectionKey } from 'vue'
import { ThemeContext } from '../types/theme'

export const ThemeKey: InjectionKey<ThemeContext> = Symbol('theme')
```

### 3. Define Theme Values

```ts
// types/theme.ts (continued)
export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    primary: '#3490dc',
    secondary: '#6cb2eb',
    background: '#f7fafc',
    surface: '#ffffff',
    text: '#2d3748',
    textSecondary: '#718096',
    border: '#e2e8f0',
    error: '#e53e3e',
    success: '#38a169'
  }
}

export const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    primary: '#6cb2eb',
    secondary: '#3490dc',
    background: '#1a202c',
    surface: '#2d3748',
    text: '#f7fafc',
    textSecondary: '#cbd5e0',
    border: '#4a5568',
    error: '#fc8181',
    success: '#68d391'
  }
}
```

### 4. Theme Provider Component

```ts
<!-- components/ThemeProvider.vue -->
<script setup lang="ts">
import { ref, provide, computed, watch } from 'vue'
import { ThemeKey } from '../keys'
import { lightTheme, darkTheme, type ThemeContext } from '../types/theme'

// Load saved theme from localStorage
const savedMode = localStorage.getItem('theme-mode') as 'light' | 'dark' | null
const mode = ref<'light' | 'dark'>(savedMode ?? 'light')

// Compute current theme based on mode
const theme = computed(() => 
  mode.value === 'light' ? lightTheme : darkTheme
)

// Toggle between light and dark
function toggleTheme() {
  mode.value = mode.value === 'light' ? 'dark' : 'light'
}

// Set specific theme
function setTheme(newMode: 'light' | 'dark') {
  mode.value = newMode
}

// Persist theme to localStorage
watch(mode, (newMode) => {
  localStorage.setItem('theme-mode', newMode)
  // Apply to document for global styles
  document.documentElement.setAttribute('data-theme', newMode)
}, { immediate: true })

// Provide theme context
provide(ThemeKey, {
  theme,
  mode,
  toggleTheme,
  setTheme
})
</script>

<template>
  <div 
    class="theme-root"
    :style="{
      backgroundColor: theme.colors.background,
      color: theme.colors.text,
      minHeight: '100vh'
    }"
  >
    <slot />
  </div>
</template>
```

### 5. useTheme Composable

```ts
// composables/useTheme.ts
import { inject } from 'vue'
import { ThemeKey } from '../keys'

export function useTheme() {
  const context = inject(ThemeKey)
  
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  
  return context
}
```

### 6. Theme Toggle Component

```ts
<!-- components/ThemeToggle.vue -->
<script setup lang="ts">
import { useTheme } from '../composables/useTheme'

const { mode, toggleTheme } = useTheme()
</script>

<template>
  <button 
    @click="toggleTheme"
    class="theme-toggle"
  >
    {{ mode === 'light' ? '🌙' : '☀️' }}
    {{ mode === 'light' ? 'Dark' : 'Light' }} Mode
  </button>
</template>

<style scoped>
.theme-toggle {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
}
</style>
```

### 7. Themed Card Component

```ts
<!-- components/Card.vue -->
<script setup lang="ts">
import { useTheme } from '../composables/useTheme'

defineProps<{
  title?: string
}>()

const { theme } = useTheme()
</script>

<template>
  <div 
    class="card"
    :style="{
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      color: theme.colors.text
    }"
  >
    <h3 v-if="title" :style="{ color: theme.colors.primary }">
      {{ title }}
    </h3>
    <slot />
  </div>
</template>

<style scoped>
.card {
  padding: 1.5rem;
  border: 1px solid;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

h3 {
  margin-top: 0;
}
</style>
```

### 8. App Component

```ts
<script setup lang="ts">
import ThemeProvider from './components/ThemeProvider.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import Card from './components/Card.vue'
</script>

<template>
  <ThemeProvider>
    <div class="app">
      <header>
        <h1>Theme Provider Demo</h1>
        <ThemeToggle />
      </header>

      <main>
        <Card title="Welcome">
          <p>This card automatically uses the current theme!</p>
          <p>Toggle the theme to see it update.</p>
        </Card>

        <Card title="Features">
          <ul>
            <li>✅ Light and dark modes</li>
            <li>✅ Persistent theme preference</li>
            <li>✅ Type-safe provide/inject</li>
            <li>✅ No prop drilling</li>
          </ul>
        </Card>
      </main>
    </div>
  </ThemeProvider>
</template>

<style>
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
</style>
```

## Testing Checklist

- [ ] Theme provider wraps the entire app
- [ ] Theme toggle switches between light/dark
- [ ] All themed components update automatically
- [ ] Theme preference persists after reload
- [ ] No props are passed for theme data
- [ ] TypeScript types are correct
- [ ] Error thrown if useTheme used outside provider
- [ ] Document has correct data-theme attribute

## Advanced Features (Bonus)

### 1. System Theme Detection

```ts
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
const mode = ref<'light' | 'dark'>(
  savedMode ?? (prefersDark.matches ? 'dark' : 'light')
)

// Listen for system theme changes
prefersDark.addEventListener('change', (e) => {
  if (!savedMode) {
    mode.value = e.matches ? 'dark' : 'light'
  }
})
```

### 2. Custom Theme Colors

```ts
interface ThemeContext {
  // ... existing
  customColors: Ref<Partial<Theme['colors']>>
  setCustomColor: (key: string, value: string) => void
}
```

### 3. Multiple Themes

```ts
const themes = {
  light: lightTheme,
  dark: darkTheme,
  ocean: oceanTheme,
  forest: forestTheme
}

const theme = computed(() => themes[mode.value])
```

## Key Learnings

✅ Provide/inject eliminates prop drilling  
✅ InjectionKey provides type safety  
✅ Composables wrap inject logic cleanly  
✅ Provider components encapsulate context  
✅ Reactive data propagates automatically  
✅ localStorage persists user preferences
