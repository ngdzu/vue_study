# Module 2 Capstone Project Plan

## Project: Professional Vue Component Library

### Overview
Build a production-ready component library that demonstrates all Module 2 concepts through a practical, reusable UI component system with a live demo application.

---

## Project Goals

1. **Demonstrate Module 2 Mastery**:
   - Component lifecycle management (Lesson 2.1)
   - Composition API patterns (Lesson 2.2)
   - Reusable composables (Lesson 2.3)
   - Slot-based composition (Lesson 2.4)
   - Advanced props patterns (Lesson 2.5)
   - Provide/Inject contexts (Lesson 2.6)

2. **Build Production-Quality Code**:
   - TypeScript throughout
   - Proper error handling
   - Accessibility (ARIA labels, keyboard navigation)
   - Comprehensive documentation
   - Unit tests for critical components

3. **Create Practical, Reusable Components**:
   - Real-world use cases
   - Clean, maintainable code
   - Professional design
   - Well-documented API

---

## Project Structure

```
capstone/
├── plan.md                           # This file
├── README.md                         # Project documentation
├── index.html                        # Entry HTML
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── tsconfig.node.json               # Node TypeScript config
├── vite.config.ts                   # Vite configuration
├── src/
│   ├── main.ts                      # App entry point
│   ├── App.vue                      # Demo application
│   ├── style.css                    # Global styles
│   ├── components/                  # UI Components
│   │   ├── Button.vue               # (2.5) Advanced props + attrs
│   │   ├── Card.vue                 # (2.4) Slots + named slots
│   │   ├── Modal.vue                # (2.4) Scoped slots + (2.1) lifecycle
│   │   ├── Input.vue                # (2.5) v-model + validation
│   │   ├── DataTable.vue            # (2.4) Scoped slots + (2.1) lifecycle
│   │   ├── Tabs.vue                 # (2.4) Slots + (2.6) provide/inject
│   │   ├── TabPanel.vue             # (2.6) inject context
│   │   ├── ThemeProvider.vue        # (2.6) Provide/inject theme
│   │   └── Toast.vue                # (2.1) Lifecycle + animations
│   ├── composables/                 # Reusable Logic (2.2, 2.3)
│   │   ├── useFetch.ts              # (2.3) API data fetching
│   │   ├── useLocalStorage.ts       # (2.3) State persistence
│   │   ├── useToggle.ts             # (2.3) Boolean state
│   │   ├── useClickOutside.ts       # (2.1) Event listeners + cleanup
│   │   ├── useDebounce.ts           # (2.3) Debouncing logic
│   │   ├── useTheme.ts              # (2.6) Theme context consumer
│   │   └── useToast.ts              # (2.6) Toast context consumer
│   ├── types/
│   │   └── index.ts                 # TypeScript type definitions
│   └── utils/
│       └── validators.ts            # Form validation utilities
└── tests/                            # Unit tests (optional bonus)
    ├── composables/
    │   ├── useFetch.spec.ts
    │   └── useLocalStorage.spec.ts
    └── components/
        ├── Button.spec.ts
        └── Card.spec.ts
```

---

## Detailed Component Specifications

### 1. Button Component (Lesson 2.5: Advanced Props)

**Purpose**: Demonstrate advanced props patterns, attribute inheritance, and variants.

**Props**:
```ts
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  icon?: string  // Icon name (optional)
  iconPosition?: 'left' | 'right'
}
```

**Features**:
- Transparent attribute forwarding with `v-bind="$attrs"`
- Support all native button attributes (type, aria-*, etc.)
- Loading state with spinner
- Icon support (left/right positioning)
- Proper disabled state handling
- Click event emission

**Key Concepts**:
- `defineOptions({ inheritAttrs: false })`
- `v-bind="$attrs"`
- Computed classes based on props
- Proper TypeScript typing

---

### 2. Card Component (Lesson 2.4: Slots)

**Purpose**: Demonstrate named slots, default slots, and slot fallbacks.

**Props**:
```ts
interface CardProps {
  title?: string
  variant?: 'default' | 'elevated' | 'outlined'
  padding?: boolean  // Default: true
}
```

**Slots**:
- `header` - Named slot for header content
- `default` - Default slot for body content
- `footer` - Named slot for footer actions
- `image` - Named slot for card image

**Features**:
- Fallback content if slots empty
- Conditional rendering based on slot presence
- Variant-based styling
- Accessible structure

**Key Concepts**:
- Named slots
- Slot fallbacks
- `v-if="$slots.slotName"`
- Flexible composition

---

### 3. Modal Component (Lesson 2.4 + 2.1: Slots + Lifecycle)

**Purpose**: Demonstrate scoped slots, lifecycle hooks, and event handling.

**Props**:
```ts
interface ModalProps {
  modelValue: boolean  // v-model support
  title?: string
  closable?: boolean  // Default: true
  size?: 'sm' | 'md' | 'lg' | 'full'
}
```

**Emits**:
```ts
{
  'update:modelValue': [value: boolean]
  close: []
}
```

**Slots**:
- `header` - Custom header (scoped with close function)
- `default` - Modal body content
- `footer` - Action buttons

**Features**:
- ESC key to close (lifecycle event listener)
- Click outside to close (useClickOutside composable)
- Focus trap when open
- Body scroll lock when modal open
- Smooth animations
- Proper cleanup on unmount

**Key Concepts**:
- `onMounted` - Add ESC listener
- `onUnmounted` - Remove listeners
- Scoped slots exposing methods
- v-model pattern
- Portal/Teleport to body

---

### 4. Input Component (Lesson 2.5: v-model + Validation)

**Purpose**: Demonstrate v-model, validation, and computed props.

**Props**:
```ts
interface InputProps {
  modelValue: string | number
  type?: 'text' | 'email' | 'password' | 'number'
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  required?: boolean
  maxlength?: number
}
```

**Emits**:
```ts
{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}
```

**Features**:
- v-model support
- Error state display
- Character counter (if maxlength)
- Label with required indicator
- Proper ARIA attributes
- Attribute forwarding

**Key Concepts**:
- v-model pattern (`modelValue` prop + `update:modelValue` emit)
- Computed error state
- Attribute inheritance
- Accessibility

---

### 5. DataTable Component (Lesson 2.4 + 2.1: Scoped Slots + Lifecycle)

**Purpose**: Demonstrate scoped slots with data, sorting, and async loading.

**Props**:
```ts
interface DataTableProps {
  columns: Column[]
  data: any[]
  loading?: boolean
  sortable?: boolean
  emptyText?: string
}

interface Column {
  key: string
  label: string
  sortable?: boolean
  width?: string
}
```

**Slots**:
- `header-{key}` - Custom header cell (scoped with column)
- `cell-{key}` - Custom cell content (scoped with row, column, index)
- `empty` - Empty state content

**Features**:
- Column sorting (click header)
- Loading skeleton
- Empty state
- Custom cell rendering via scoped slots
- Row hover effects

**Key Concepts**:
- Dynamic scoped slot names
- Reactive sorting
- Conditional rendering
- Data transformation

---

### 6. Tabs Component (Lesson 2.4 + 2.6: Slots + Provide/Inject)

**Purpose**: Demonstrate provide/inject for component communication.

**Tabs.vue** (Parent):
```ts
interface TabsProps {
  modelValue?: string  // Active tab ID
}

// Provides:
{
  activeTab: Ref<string>
  registerTab: (id: string) => void
  unregisterTab: (id: string) => void
}
```

**TabPanel.vue** (Child):
```ts
interface TabPanelProps {
  id: string
  label: string
  disabled?: boolean
}

// Injects: Tabs context
```

**Features**:
- Automatic tab registration
- Active tab highlighting
- Keyboard navigation (arrow keys)
- Lazy loading of tab content
- v-model support for active tab

**Key Concepts**:
- Provide/inject pattern
- Parent-child implicit communication
- InjectionKey for type safety
- Lifecycle registration/cleanup

---

### 7. ThemeProvider Component (Lesson 2.6: Provide/Inject)

**Purpose**: Demonstrate app-wide context with provide/inject.

**Provides**:
```ts
interface ThemeContext {
  theme: ComputedRef<Theme>
  mode: Ref<'light' | 'dark'>
  toggleTheme: () => void
  setTheme: (mode: 'light' | 'dark') => void
}

interface Theme {
  mode: 'light' | 'dark'
  colors: {
    primary: string
    secondary: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
  }
}
```

**Features**:
- Light/dark theme toggle
- Persistent to localStorage
- CSS custom properties injection
- Reactive theme changes across all components

**Key Concepts**:
- Type-safe provide/inject
- InjectionKey pattern
- Composable wrapper (useTheme)
- State persistence

---

### 8. Toast Component (Lesson 2.1: Lifecycle + Animations)

**Purpose**: Demonstrate lifecycle management and animations.

**Features**:
- Auto-dismiss after timeout
- Multiple toasts stacking
- Different types (success, error, warning, info)
- Manual dismiss
- Slide-in/slide-out animations
- Proper cleanup on unmount

**Toast Manager** (via provide/inject):
```ts
interface ToastContext {
  toasts: Ref<Toast[]>
  showToast: (message: string, type: ToastType, duration?: number) => void
  removeToast: (id: string) => void
}
```

**Key Concepts**:
- `onMounted` - Start auto-dismiss timer
- `onUnmounted` - Clear timer
- Transition components
- Array state management

---

## Composables Specifications

### 1. useFetch (Lesson 2.3)

```ts
interface UseFetchOptions {
  immediate?: boolean
  refetch?: boolean
}

function useFetch<T>(url: string, options?: UseFetchOptions) {
  const data = ref<T | null>(null)
  const error = ref<string | null>(null)
  const loading = ref(false)
  const controller = ref<AbortController | null>(null)

  async function execute(): Promise<void>
  function abort(): void

  // Auto-execute if immediate
  // Cleanup on unmount

  return { data, error, loading, execute, abort }
}
```

**Key Concepts**:
- Generic typing
- AbortController for cleanup
- Lifecycle hooks
- Reactive state

---

### 2. useLocalStorage (Lesson 2.3)

```ts
function useLocalStorage<T>(
  key: string,
  defaultValue: T
): Ref<T> {
  // Load initial value from localStorage
  // Watch for changes and persist
  // Handle JSON serialization
  // Handle errors gracefully

  return data
}
```

**Key Concepts**:
- Generic typing
- Watch for persistence
- Error handling
- Type safety

---

### 3. useClickOutside (Lesson 2.1)

```ts
function useClickOutside(
  target: Ref<HTMLElement | null>,
  callback: () => void
): void {
  // Add click listener on mount
  // Check if click is outside target
  // Remove listener on unmount
}
```

**Key Concepts**:
- Template refs
- Event listener management
- Lifecycle cleanup

---

### 4. useDebounce (Lesson 2.3)

```ts
function useDebounce<T>(
  value: Ref<T>,
  delay: number
): Ref<T> {
  const debouncedValue = ref<T>(value.value)

  // Watch value and debounce updates
  // Clear timeout on unmount

  return debouncedValue as Ref<T>
}
```

**Key Concepts**:
- Watch API
- Timer management
- Generic typing

---

## Demo Application (App.vue)

The demo app showcases all components in action:

### Sections:

1. **Theme Toggle Demo**
   - ThemeProvider wrapping entire app
   - Toggle button to switch themes
   - All components react to theme changes

2. **Button Showcase**
   - All variants (primary, secondary, danger, ghost)
   - All sizes (sm, md, lg)
   - Loading states
   - Icon buttons
   - Disabled states

3. **Card Examples**
   - Default card with all slots
   - Elevated card
   - Outlined card
   - Card without header/footer

4. **Form Demo**
   - Multiple Input components
   - Real-time validation
   - Error states
   - Submit handling

5. **Modal Trigger**
   - Button to open modal
   - Modal with custom header/footer
   - Demonstrates ESC/click-outside close

6. **Tabs Example**
   - 3-4 tab panels
   - Different content per tab
   - Keyboard navigation demo

7. **Data Table**
   - Fetch data with useFetch
   - Display in DataTable
   - Sortable columns
   - Custom cell rendering with scoped slots
   - Loading state

8. **Toast Notifications**
   - Buttons to trigger different toast types
   - Auto-dismiss demonstration

---

## Implementation Order

### Phase 1: Foundation (Setup & Core)
1. ✅ Create project structure
2. ✅ Setup Vite + TypeScript
3. ✅ Create type definitions
4. ✅ Implement ThemeProvider + useTheme
5. ✅ Create global styles

### Phase 2: Basic Composables
6. ✅ Implement useToggle
7. ✅ Implement useLocalStorage
8. ✅ Implement useDebounce
9. ✅ Implement useClickOutside

### Phase 3: Basic Components
10. ✅ Create Button component
11. ✅ Create Card component
12. ✅ Create Input component

### Phase 4: Advanced Composables
13. ✅ Implement useFetch
14. ✅ Implement useToast

### Phase 5: Advanced Components
15. ✅ Create Modal component
16. ✅ Create Tabs + TabPanel
17. ✅ Create DataTable
18. ✅ Create Toast component + ToastProvider

### Phase 6: Demo Application
19. ✅ Create App.vue layout
20. ✅ Add theme toggle section
21. ✅ Add button showcase
22. ✅ Add card examples
23. ✅ Add form demo
24. ✅ Add modal demo
25. ✅ Add tabs demo
26. ✅ Add data table demo
27. ✅ Add toast demo

### Phase 7: Polish
28. ✅ Add transitions/animations
29. ✅ Improve accessibility
30. ✅ Add documentation comments
31. ✅ Test all features

---

## Technical Requirements

### TypeScript
- Strict mode enabled
- All components fully typed
- No `any` types (use generics instead)
- Interface definitions for all props/emits

### Accessibility
- Proper ARIA labels
- Keyboard navigation support
- Focus management (modals, tabs)
- Semantic HTML
- Screen reader friendly

### Performance
- Lazy loading where appropriate
- Debounced user inputs
- Efficient v-for keys
- Minimal re-renders

### Code Quality
- Consistent naming conventions
- Clear code comments
- Reusable utilities
- DRY principle

---

## Demonstration Checklist

Each Module 2 concept must be clearly demonstrated:

### ✅ Lesson 2.1: Component Lifecycle & Hooks
- [ ] `onMounted` - Event listeners, data fetching (Modal, Toast, DataTable)
- [ ] `onUnmounted` - Cleanup listeners/timers (Modal, Toast, useClickOutside)
- [ ] `onUpdated` - (Optional: DataTable sorting animation)
- [ ] Resource management - AbortController in useFetch

### ✅ Lesson 2.2: Composition API Fundamentals
- [ ] All components use `<script setup>`
- [ ] Proper use of `ref()`, `reactive()`, `computed()`
- [ ] Lifecycle hooks as imports
- [ ] `defineProps()`, `defineEmits()`, `defineExpose()`

### ✅ Lesson 2.3: Building Reusable Composables
- [ ] useFetch - API data fetching pattern
- [ ] useLocalStorage - State persistence
- [ ] useToggle - Boolean state management
- [ ] useClickOutside - Event handling
- [ ] useDebounce - Input optimization
- [ ] useTheme - Context consumption
- [ ] useToast - Context consumption

### ✅ Lesson 2.4: Slots & Template Slots
- [ ] Card - Named slots (header, default, footer)
- [ ] Modal - Scoped slots exposing functions
- [ ] DataTable - Dynamic scoped slots for cells
- [ ] Tabs - Default slot for panels
- [ ] Slot fallbacks where appropriate

### ✅ Lesson 2.5: Component Props Advanced
- [ ] Button - Attribute forwarding with `v-bind="$attrs"`
- [ ] Input - v-model pattern
- [ ] All components - Proper prop validation
- [ ] Computed props for dynamic classes/styles

### ✅ Lesson 2.6: Provide/Inject Pattern
- [ ] ThemeProvider - Theme context
- [ ] useTheme - Type-safe injection
- [ ] Tabs/TabPanel - Component registration via inject
- [ ] ToastProvider - Toast notifications context
- [ ] InjectionKey for type safety

---

## Success Criteria

The project is successful if:

1. **All Module 2 concepts are demonstrated** with clear, practical examples
2. **Code is production-quality**: typed, accessible, well-documented
3. **Demo app is functional**: all features work without errors
4. **Components are reusable**: can be extracted and used in other projects
5. **Best practices followed**: proper cleanup, error handling, TypeScript usage

---

## Next Steps

1. Create package.json with dependencies
2. Setup Vite configuration
3. Create TypeScript configs
4. Implement components in order (Phase 1-7)
5. Build demo application
6. Test all features
7. Document usage in README.md

---

## API Endpoints for Demo

Use JSONPlaceholder for demo data:
- `https://jsonplaceholder.typicode.com/users` - User data for DataTable
- `https://jsonplaceholder.typicode.com/posts` - Posts data (if needed)

---

## Bonus Features (Optional)

- [ ] Unit tests with Vitest
- [ ] Storybook documentation
- [ ] Animation library integration
- [ ] Dark mode auto-detection
- [ ] Keyboard shortcuts guide
- [ ] Component size variants
- [ ] Export components as library

---

**Let's build this! 🚀**
