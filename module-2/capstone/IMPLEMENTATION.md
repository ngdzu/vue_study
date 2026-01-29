# Module 2 Capstone Project - Implementation Complete ✅

## Overview

This is a comprehensive Vue 3 component library that demonstrates all 6 lessons from Module 2:

1. **Lesson 2.1**: Component Lifecycle & Hooks (onMounted, onUnmounted, cleanup)
2. **Lesson 2.2**: Composition API & `<script setup>` syntax
3. **Lesson 2.3**: Reusable Composables (custom hooks)
4. **Lesson 2.4**: Slots & Component Composition
5. **Lesson 2.5**: Advanced Props & v-bind="$attrs"
6. **Lesson 2.6**: Provide/Inject Pattern (dependency injection)

## Project Structure

```
module-2/capstone/
├── src/
│   ├── components/          # Vue 3 components
│   │   ├── ThemeProvider.vue    # Provides theme context (Lesson 2.6)
│   │   ├── Button.vue           # Button with variants (Lesson 2.5)
│   │   ├── Card.vue             # Card with named slots (Lesson 2.4)
│   │   └── Input.vue            # Form input with v-model (Lesson 2.2)
│   ├── composables/         # Reusable logic (Lesson 2.3)
│   │   ├── useTheme.ts          # Theme management with provide/inject
│   │   ├── useFetch.ts          # Async data fetching
│   │   ├── useLocalStorage.ts   # Persistent storage
│   │   ├── useToggle.ts         # Boolean state management
│   │   └── useClickOutside.ts   # Click outside detection
│   ├── types/               # TypeScript definitions
│   │   └── index.ts             # Shared types for all components
│   ├── App.vue              # Main demo application
│   ├── main.ts              # Application entry point
│   └── style.css            # Global styles & CSS variables
├── index.html               # HTML entry point
├── package.json             # Project dependencies
├── vite.config.ts          # Vite build configuration
├── tsconfig.json           # TypeScript strict mode config
├── plan.md                 # Implementation plan
└── README.md               # This file
```

## Components

### 1. ThemeProvider (Lesson 2.6 - Provide/Inject)
- Root component that provides theme context to all descendants
- Avoids "prop drilling" by using Vue's provide/inject API
- Manages light/dark theme switching
- Stores preference in localStorage

### 2. Button (Lesson 2.5 - Advanced Props)
- **Variants**: primary, secondary, danger, ghost
- **Sizes**: sm, md, lg
- Uses `v-bind="$attrs"` for fallthrough attributes
- Accepts all native button attributes (aria-*, data-*, etc.)
- Demonstrates prop defaults with `withDefaults()`

### 3. Card (Lesson 2.4 - Slots)
- **Named slots**: header, default, footer
- **Variants**: default, elevated, outlined
- Flexible layout composition
- Conditional slot rendering with `$slots`

### 4. Input (Lesson 2.2 & 2.5 - Reactivity & Props)
- **Types**: text, email, password, number
- v-model two-way binding
- Label with accessibility support
- Error state display
- Form validation demo

## Composables

### useTheme (Lesson 2.6)
```ts
const { theme, mode, toggleTheme, setTheme } = useTheme()
```
- Access injected theme context from any component
- Fallback state management for root components
- Side effects on mount/unmount for theme persistence

### useFetch (Lesson 2.1 & 2.3)
```ts
const { data, loading, error, refetch } = useFetch(url)
```
- Async data fetching with AbortController
- Proper cleanup to prevent memory leaks
- Error handling and loading states

### useLocalStorage (Lesson 2.3)
```ts
const [storedValue, setStoredValue] = useLocalStorage(key, initialValue)
```
- Persistent reactive state
- Syncs across browser tabs
- Type-safe storage

### useToggle (Lesson 2.3)
```ts
const { value, toggle, on, off } = useToggle(initialValue)
```
- Simple boolean state management
- Clean API for toggle behavior

### useClickOutside (Lesson 2.1)
```ts
const elementRef = useClickOutside(callback)
```
- Detects clicks outside an element
- Proper event listener cleanup
- Useful for closing menus/modals

## Key Features Demonstrated

### Lesson 2.1 - Lifecycle & Side Effects
- Clock component updating with interval
- Proper cleanup in `onUnmounted` hook
- AbortController for fetch cleanup
- Event listener management

### Lesson 2.2 - Composition API & Reactivity
- `<script setup>` syntax for components
- `ref()` for reactive state
- `computed()` for derived state
- Reactive object management in forms

### Lesson 2.3 - Composable Patterns
- Custom hooks extracting reusable logic
- Composition of multiple composables
- Clean separation of concerns
- Reusable across components

### Lesson 2.4 - Slots
- Named slots for flexible layouts
- Default slot fallback
- Conditional rendering with `$slots`
- Scoped slots usage in demo

### Lesson 2.5 - Advanced Props
- TypeScript-first prop definition
- `withDefaults()` for default values
- `v-bind="$attrs"` for transparent fallthrough
- Custom events with `defineEmits()`

### Lesson 2.6 - Provide/Inject
- Type-safe contexts with `InjectionKey`
- Avoiding prop drilling
- Composable-based dependency injection
- Fallback values for flexibility

## Running the Project

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
# Server runs at http://localhost:5174
```

### Build for Production
```bash
npm run build
# Output in dist/ folder
```

### Preview Build
```bash
npm run preview
```

## Demo Application (App.vue)

The main application demonstrates all 6 lessons with interactive sections:

1. **Theme Provider** - Switch between light/dark mode
2. **Button Variants** - All button styles and sizes
3. **Card Components** - Named slots in action
4. **Form Input** - Reactive form with validation
5. **Lifecycle Hooks** - Real-time clock with cleanup
6. **Composables** - useToggle and useLocalStorage demos
7. **Composition API** - Counter with computed properties

## Styling

### CSS Custom Properties (Theme Variables)
```css
--color-primary: var value changes based on theme
--color-text: Adapts to light/dark mode
--spacing-*: Consistent spacing scale
--font-size-*: Typography scale
--shadow-*: Elevation shadows
--transition-*: Animation timing
```

All colors automatically switch between light and dark themes using CSS custom properties.

## Design Patterns Used

### Provider Pattern
Theme state is provided at root level and injected throughout app hierarchy.

### Composable Pattern
Business logic extracted into reusable composable functions.

### Slot Pattern
Components use named slots for flexible composition.

### Props Pattern
Type-safe props with defaults and fallthrough attributes.

## TypeScript Configuration

- **Strict Mode**: Enabled for maximum type safety
- **Target**: ES2020 with DOM library
- **Module**: ESNext for modern syntax

## Best Practices Demonstrated

✅ Proper cleanup in lifecycle hooks  
✅ Composables for code reuse  
✅ Type-safe dependency injection  
✅ CSS variables for theming  
✅ Accessibility attributes (labels, ARIA)  
✅ Error handling and validation  
✅ Responsive design patterns  
✅ Progressive enhancement  

## Next Steps

This capstone project can be extended with:
- Unit tests using Vitest
- E2E tests using Cypress
- Storybook for component documentation
- Additional components (Modal, Tabs, DataTable)
- Advanced composables (useFetch, useToast, useDebounce)

## Files Summary

| File               | Purpose                  | Lines |
| ------------------ | ------------------------ | ----- |
| App.vue            | Demo application         | 400+  |
| Button.vue         | Button component         | 110+  |
| Card.vue           | Card component           | 90+   |
| Input.vue          | Input component          | 110+  |
| ThemeProvider.vue  | Theme provider           | 30+   |
| useTheme.ts        | Theme composable         | 95+   |
| useFetch.ts        | Fetch composable         | 55+   |
| useLocalStorage.ts | Storage composable       | 40+   |
| useToggle.ts       | Toggle composable        | 15+   |
| useClickOutside.ts | Click outside composable | 25+   |
| style.css          | Global styles            | 200+  |
| types/index.ts     | TypeScript definitions   | 55+   |

**Total**: 1,200+ lines of production-ready Vue 3 code

---

Created as part of Module 2 Capstone Project  
Module 2 Topics: Lifecycle, Composition API, Composables, Slots, Props, Provide/Inject
