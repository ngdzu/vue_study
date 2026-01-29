# Quiz Answers — Lesson 2.6 (Provide/Inject Pattern)

1) **What problem does provide/inject solve?**

   **Answer**: Provide/inject solves the **prop drilling** problem - passing props through multiple intermediate components just to reach a deeply nested component. It allows sharing data across the component tree without explicitly passing props through every level.

---

2) **What is "prop drilling" and why is it a problem?**

   **Answer**: Prop drilling is when you pass props through multiple component levels, even though intermediate components don't use those props - they just pass them down.

   **Problems**:
   - Verbose and repetitive code
   - Intermediate components coupled to data they don't use
   - Hard to refactor and maintain
   - Difficult to add new nested consumers

   **Example**:
   ```ts
   <App :user> → <Layout :user> → <Header :user> → <UserMenu :user>
   // Layout and Header don't use :user, just pass it along
   ```

---

3) **Write code to provide a reactive `count` variable.**

   **Answer**:
   ```ts
   <script setup lang="ts">
   import { ref, provide } from 'vue'

   const count = ref(0)
   provide('count', count)
   </script>
   ```

---

4) **Write code to inject the `count` variable in a child component.**

   **Answer**:
   ```ts
   <script setup lang="ts">
   import { inject } from 'vue'

   const count = inject('count')
   </script>

   <template>
     <p>Count: {{ count }}</p>
   </template>
   ```

---

5) **What does `InjectionKey` do and why should you use it?**

   **Answer**: `InjectionKey` is a TypeScript type that provides **type safety** for provide/inject. It ensures the injected value has the correct type and prevents typos.

   ```ts
   import { InjectionKey, Ref } from 'vue'

   // Create typed key
   const CountKey: InjectionKey<Ref<number>> = Symbol('count')

   // Provide (type-checked)
   provide(CountKey, ref(0))

   // Inject (type-safe)
   const count = inject(CountKey) // Type: Ref<number> | undefined
   ```

   **Benefits**:
   - TypeScript autocomplete
   - Compile-time type checking
   - Prevents injection key typos
   - Better refactoring support

---

6) **What happens if you try to `inject()` a value that hasn't been provided?**

   **Answer**: `inject()` returns `undefined`. This can cause runtime errors if you try to use the value.

   ```ts
   const theme = inject('theme')
   console.log(theme) // undefined (if not provided)
   theme.value // ❌ Error: Cannot read property 'value' of undefined
   ```

   > ⚠️ **CRITICAL**: Always provide a default value or check for `undefined`!

---

7) **How do you provide a default value when injecting?**

   **Answer**:
   ```ts
   // Option 1: Default value
   const theme = inject('theme', ref('light'))

   // Option 2: Factory function
   const theme = inject('theme', () => ref('light'))

   // Option 3: Check and throw error
   const theme = inject('theme')
   if (!theme) {
     throw new Error('Theme provider not found!')
   }
   ```

---

8) **Why should you use `Symbol()` for injection keys instead of strings?**

   **Answer**: 
   - **Uniqueness**: Symbols are guaranteed unique, preventing key collisions
   - **Privacy**: Symbol keys can't be accidentally overwritten
   - **Type Safety**: Works better with TypeScript's `InjectionKey`

   ```ts
   // ❌ WRONG: String keys can collide
   provide('theme', lightTheme)  // From library A
   provide('theme', darkTheme)   // From library B - overwrites!

   // ✅ CORRECT: Symbols are unique
   const ThemeKeyA = Symbol('theme')
   const ThemeKeyB = Symbol('theme')
   provide(ThemeKeyA, lightTheme)
   provide(ThemeKeyB, darkTheme) // Different key, no collision
   ```

---

9) **What is the purpose of the `readonly()` function with provide/inject?**

   **Answer**: `readonly()` prevents child components from mutating provided state. Only the provider can modify the data.

   ```ts
   // Provider
   const count = ref(0)
   provide('count', readonly(count)) // Provide readonly version
   provide('increment', () => count.value++) // Provide method to modify

   // Consumer
   const count = inject('count') // Readonly<Ref<number>>
   const increment = inject('increment')

   count.value++ // ❌ Error: readonly!
   increment() // ✅ OK
   ```

   **Benefits**:
   - Enforces unidirectional data flow
   - Prevents accidental mutations
   - Makes state updates explicit and traceable

---

10) **Write code to create a type-safe injection key for a theme context.**

    **Answer**:
    ```ts
    // types/theme.ts
    import { ComputedRef, Ref } from 'vue'

    export interface Theme {
      mode: 'light' | 'dark'
      colors: {
        primary: string
        background: string
        text: string
      }
    }

    export interface ThemeContext {
      theme: ComputedRef<Theme>
      mode: Ref<'light' | 'dark'>
      toggleTheme: () => void
    }

    // keys.ts
    import { InjectionKey } from 'vue'
    import { ThemeContext } from './types/theme'

    export const ThemeKey: InjectionKey<ThemeContext> = Symbol('theme')
    ```

---

11) **When should you use provide/inject vs. passing props?**

    **Answer**:

    **Use Props When**:
    - Direct parent-child communication
    - Only 1-2 levels deep
    - Props are part of component API
    - Component is reusable

    **Use Provide/Inject When**:
    - Deeply nested components (3+ levels)
    - Avoiding prop drilling
    - App-wide contexts (theme, i18n, auth)
    - Component library internals
    - Data doesn't belong in component props

---

12) **When should you use Pinia instead of provide/inject?**

    **Answer**:

    **Use Pinia When**:
    - Need global app state
    - Want DevTools support
    - Need time-travel debugging
    - Complex state management
    - Multiple components across different trees need same data
    - Need actions, getters, and plugins

    **Use Provide/Inject When**:
    - Component-tree-scoped context
    - Theming, i18n, modals
    - Component library internals
    - Don't need debugging tools
    - Simpler, localized state

---

13) **How do you test a component that uses `inject()`?**

    **Answer**:
    ```ts
    import { mount } from '@vue/test-utils'
    import { ThemeKey } from './keys'
    import MyComponent from './MyComponent.vue'

    describe('MyComponent', () => {
      it('uses injected theme', () => {
        const mockTheme = {
          theme: ref({ mode: 'dark', colors: { primary: '#000' } }),
          toggleTheme: vi.fn()
        }

        const wrapper = mount(MyComponent, {
          global: {
            provide: {
              [ThemeKey as symbol]: mockTheme
            }
          }
        })

        expect(wrapper.text()).toContain('dark')
      })

      it('throws error without provider', () => {
        expect(() => {
          mount(MyComponent)
        }).toThrow('useTheme must be used within ThemeProvider')
      })
    })
    ```

---

14) **What's the recommended pattern for wrapping `inject()` in a composable?**

    **Answer**:
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

    // Usage in components
    const { theme, toggleTheme } = useTheme()
    ```

    **Benefits**:
    - Type safety without manual checks
    - Consistent error handling
    - Easier to test
    - Clear API

---

15) **Can you provide different values with the same key in nested components?**

    **Answer**: **Yes!** Child providers can override parent providers for their subtree.

    ```ts
    <!-- Outer Provider -->
    <ThemeProvider theme="light">
      <Component /> <!-- Uses light theme -->
      
      <!-- Inner Provider overrides -->
      <ThemeProvider theme="dark">
        <Component /> <!-- Uses dark theme -->
      </ThemeProvider>
    </ThemeProvider>
    ```

    Components inject the **nearest** provider in the tree.

---

16) **What happens to provided reactive data when it changes?**

    **Answer**: All components that injected the data **automatically re-render** with the new value. This is because provide/inject preserves reactivity.

    ```ts
    // Provider
    const count = ref(0)
    provide('count', count)

    setTimeout(() => {
      count.value = 10 // All consumers update automatically!
    }, 1000)

    // Consumer
    const count = inject('count')
    // When provider changes count, this component re-renders
    ```

---

17) **Write a complete provider component for a theme system.**

    **Answer**:
    ```ts
    <!-- components/ThemeProvider.vue -->
    <script setup lang="ts">
    import { ref, provide, computed } from 'vue'
    import { ThemeKey } from '../keys'

    const mode = ref<'light' | 'dark'>('light')

    const theme = computed(() => ({
      mode: mode.value,
      colors: mode.value === 'light'
        ? { primary: '#3490dc', background: '#fff', text: '#000' }
        : { primary: '#6cb2eb', background: '#1a202c', text: '#fff' }
    }))

    function toggleTheme() {
      mode.value = mode.value === 'light' ? 'dark' : 'light'
    }

    provide(ThemeKey, {
      theme,
      mode,
      toggleTheme
    })
    </script>

    <template>
      <div :style="{
        backgroundColor: theme.colors.background,
        color: theme.colors.text
      }">
        <slot />
      </div>
    </template>
    ```

---

18) **How do you prevent child components from mutating provided state?**

    **Answer**:
    ```ts
    import { ref, provide, readonly } from 'vue'

    const count = ref(0)

    // Provide readonly version
    provide('count', readonly(count))

    // Provide methods to mutate
    provide('increment', () => count.value++)
    provide('decrement', () => count.value--)
    ```

    Now children can't directly modify `count`, they must use the provided methods.

---

19) **What's wrong with this code?**
    ```ts
    const theme = inject('theme')
    theme.value = 'dark' // Modify provided data
    ```

    **Answer**: This violates the principle of **unidirectional data flow**. Child components should not directly mutate provided state.

    **Problems**:
    - Makes state changes hard to trace
    - Can cause unexpected behavior in other consumers
    - Breaks reactivity in some cases

    **Fix**:
    ```ts
    // Provider should provide a method to change theme
    provide('theme', readonly(theme))
    provide('setTheme', (newTheme) => { theme.value = newTheme })

    // Consumer
    const theme = inject('theme') // Readonly
    const setTheme = inject('setTheme')
    setTheme('dark') // ✅ Correct way
    ```

---

20) **List three real-world use cases for provide/inject.**

    **Answer**:

    1. **Theming System**
       - Provide theme context (colors, mode)
       - Any component can inject and use current theme
       - Toggle between light/dark modes globally

    2. **Authentication**
       - Provide user state and auth methods
       - Protected routes check auth context
       - Login/logout accessible anywhere

    3. **Internationalization (i18n)**
       - Provide current locale and translation function
       - All components use same language
       - Language switcher updates entire app

    **Other use cases**:
    - Form validation context
    - Modal/dialog manager
    - Notification/toast system
    - Shopping cart
    - User preferences
    - Feature flags

---

## Scoring Guide

Each question is worth 5 points.

**Total**: 100 points  
**Passing**: 80/100 (16+ correct answers)

## Key Takeaways

✅ Provide/inject eliminates prop drilling  
✅ Use InjectionKey for type safety  
✅ Always provide defaults or check for undefined  
✅ Use readonly() to prevent unwanted mutations  
✅ Wrap inject in composables for better API  
✅ Use for component contexts, not global state
