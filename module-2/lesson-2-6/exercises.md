# Exercises, Validation, and Grading — Lesson 2.6

## Exercise A: Auth Context Provider

Goal: Practice provide/inject with authentication state.

**Requirements**
- Create `AuthProvider.vue` component
- Provide user state (null when logged out)
- Provide `login()` and `logout()` functions
- Create `useAuth()` composable
- Use TypeScript with InjectionKey
- Persist auth state to localStorage
- Provide `isAuthenticated` computed property

**Validation (Manual)**
- Login sets user and persists to localStorage
- Logout clears user and localStorage
- useAuth() throws error outside provider
- isAuthenticated computed works correctly
- Page reload preserves auth state

**Grading Points** (25 points)
- Provider component correct (7 pts)
- useAuth composable (5 pts)
- Type safety with InjectionKey (5 pts)
- localStorage persistence (5 pts)
- isAuthenticated computed (3 pts)

---

## Exercise B: Multi-Level Form Context

Goal: Build nested form with shared validation state.

**Requirements**
- Create `FormProvider.vue` with validation context
- Track errors for multiple fields
- Provide `setError()`, `clearError()`, `isValid` computed
- Create 3-level nested components:
  - FormProvider → FormSection → FormInput
- FormInput validates and updates shared errors
- Display form-level error summary
- Use `useFormContext()` composable

**Validation (Manual)**
- Errors tracked across all fields
- isValid reflects all field states
- No prop drilling for error state
- Error summary displays all errors
- Validation updates in real-time

**Grading Points** (30 points)
- FormProvider implementation (10 pts)
- useFormContext composable (5 pts)
- Multi-level nesting works (7 pts)
- Validation logic (5 pts)
- Error summary display (3 pts)

---

## Exercise C: Notification System

Goal: Create app-wide notification provider.

**Requirements**
- Create `NotificationProvider.vue`
- Provide `notify(message, type)` function
- Types: 'success', 'error', 'warning', 'info'
- Display notifications as toast messages
- Auto-dismiss after 3 seconds
- Support multiple simultaneous notifications
- Create `useNotifications()` composable

**Validation (Manual)**
- notify() callable from any component
- Notifications display correctly
- Auto-dismiss works
- Multiple notifications stack properly
- Type-based styling (colors)

**Grading Points** (25 points)
- Provider implementation (8 pts)
- useNotifications composable (5 pts)
- Auto-dismiss logic (5 pts)
- Multiple notifications (4 pts)
- Styled by type (3 pts)

---

## Exercise D: i18n (Internationalization) Provider

Goal: Build translation system with provide/inject.

**Requirements**
- Create `I18nProvider.vue`
- Support 'en' and 'es' locales
- Provide translation dictionary
- Provide `t(key)` function for translations
- Provide `setLocale(locale)` function
- Create `useI18n()` composable
- Persist locale to localStorage

**Example translations**:
```ts
const translations = {
  en: {
    welcome: 'Welcome',
    goodbye: 'Goodbye'
  },
  es: {
    welcome: 'Bienvenido',
    goodbye: 'Adiós'
  }
}
```

**Validation (Manual)**
- t() returns correct translation
- setLocale switches language
- All text updates reactively
- Locale persists after reload
- Missing keys handled gracefully

**Grading Points** (25 points)
- Provider with translations (8 pts)
- t() function (5 pts)
- setLocale function (5 pts)
- useI18n composable (4 pts)
- Persistence (3 pts)

---

## Exercise E: Modal Manager

Goal: Create global modal system.

**Requirements**
- Create `ModalProvider.vue`
- Provide `openModal(component, props)` function
- Provide `closeModal()` function
- Display modal with overlay
- Support passing props to modal content
- Only one modal open at a time
- ESC key closes modal
- Create `useModal()` composable

**Validation (Manual)**
- openModal displays modal with content
- closeModal hides modal
- Overlay click closes modal
- ESC key closes modal
- Props passed correctly to content

**Grading Points** (30 points)
- Provider implementation (10 pts)
- openModal/closeModal (8 pts)
- useModal composable (5 pts)
- Overlay and ESC handling (4 pts)
- Props passing (3 pts)

---

## Exercise F: Shopping Cart Context

Goal: Build shopping cart with provide/inject.

**Requirements**
- Create `CartProvider.vue`
- Provide cart items array
- Provide `addItem()`, `removeItem()`, `updateQuantity()` functions
- Provide `total` computed (sum of item prices)
- Provide `itemCount` computed
- Persist cart to localStorage
- Create `useCart()` composable

**Item interface**:
```ts
interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}
```

**Validation (Manual)**
- addItem adds to cart
- removeItem removes from cart
- updateQuantity changes quantity
- total computes correctly
- itemCount is accurate
- Cart persists after reload

**Grading Points** (30 points)
- Provider implementation (10 pts)
- CRUD operations (10 pts)
- Computed properties (5 pts)
- useCart composable (3 pts)
- Persistence (2 pts)

---

## Advanced Challenge: Nested Providers

Goal: Combine multiple providers.

**Requirements**
- Create app with AuthProvider, ThemeProvider, and NotificationProvider
- All nested properly
- Components can use all three contexts
- Create a component that uses all three:
  - Display user name from auth
  - Apply theme colors
  - Show notification on login/logout
- Demonstrate no prop drilling

**Validation (Manual)**
- All providers work together
- No conflicts between providers
- Component uses all three contexts
- Notification on auth changes
- Theme applies correctly

**Grading Points** (35 points)
- Three providers nested (10 pts)
- Component uses all contexts (10 pts)
- Integration logic (10 pts)
- No prop drilling (5 pts)

---

## Testing Guidelines

### Test Provide/Inject in Components

```ts
import { mount } from '@vue/test-utils'
import { ThemeKey } from './keys'
import MyComponent from './MyComponent.vue'

describe('MyComponent with theme', () => {
  it('uses provided theme', () => {
    const wrapper = mount(MyComponent, {
      global: {
        provide: {
          [ThemeKey as symbol]: {
            theme: ref({ mode: 'dark', colors: { /* ... */ } }),
            toggleTheme: vi.fn()
          }
        }
      }
    })

    expect(wrapper.html()).toContain('dark')
  })

  it('throws error without provider', () => {
    expect(() => {
      mount(MyComponent)
    }).toThrow('useTheme must be used within ThemeProvider')
  })
})
```

### Test Composable Directly

```ts
import { useTheme } from './composables/useTheme'
import { ThemeKey } from './keys'

describe('useTheme', () => {
  it('throws without provider', () => {
    expect(() => useTheme()).toThrow()
  })
})
```

---

## Grading Summary

| Exercise          | Points  | Focus                  |
| ----------------- | ------- | ---------------------- |
| A - Auth Provider | 25      | Authentication context |
| B - Form Context  | 30      | Nested validation      |
| C - Notifications | 25      | Toast system           |
| D - i18n          | 25      | Translations           |
| E - Modal Manager | 30      | Global modals          |
| F - Shopping Cart | 30      | CRUD operations        |
| Advanced - Nested | 35      | Multiple providers     |
| **Total**         | **200** |                        |

**Passing Grade**: 140/200 (70%)

---

## Common Mistakes to Avoid

1. ❌ Using string keys instead of Symbols
2. ❌ Not providing default values for inject
3. ❌ Mutating readonly provided state
4. ❌ Not wrapping inject in composable
5. ❌ Using provide/inject for parent-child communication
6. ❌ Not handling missing provider errors
7. ❌ Overusing provide/inject instead of props
