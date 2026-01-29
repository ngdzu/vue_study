# Quiz Answers — Lesson 2.2 (Composition API Fundamentals)

1) **Main purpose of Composition API**:
   To provide better code organization, improved TypeScript support, and superior code reuse through composables. It allows grouping related logic together rather than scattering it across different option blocks.

2) **Key advantages of Composition API over Options API**:
   - Better code organization (group by feature, not option type)
   - Superior TypeScript inference
   - More flexible code reuse (composables vs mixins)
   - Better logic extraction and testing
   - No `this` confusion
   - More explicit and easier to understand
   - Smaller bundle size with tree-shaking

3) **setup() function and execution**:
   `setup()` is the entry point for using Composition API. It executes **before** the component is created, before `data()`, `computed`, and `methods`. It runs after props are resolved but before the component instance is available.

4) **setup() parameters**:
   ```ts
   setup(props, context)
   ```
   - `props`: Reactive object containing component props (do NOT destructure directly)
   - `context`: Object with `attrs`, `slots`, `emit`, and `expose`

5) **Why this is not available in setup()**:
   Because `setup()` runs before the component instance is created. The component instance (and therefore `this`) doesn't exist yet. This is intentional to encourage more explicit code without relying on `this`.

6) **`<script setup>` vs setup()**:
   `<script setup>` is compile-time syntactic sugar that:
   - Automatically exposes variables/functions to template (no return statement needed)
   - Provides better TypeScript inference
   - Less boilerplate code
   - Better performance (compiled to more efficient code)
   - Top-level bindings are automatically exposed
   ```ts
   // With setup()
   export default {
     setup() {
       const count = ref(0)
       return { count } // Must return
     }
   }
   
   // With <script setup>
   <script setup>
   const count = ref(0) // Automatically exposed
   </script>
   ```

7) **Convert to `<script setup>`**:
   ```ts
   <script setup lang="ts">
   import { ref } from 'vue'
   
   const count = ref(0)
   
   function increment() {
     count.value++
   }
   </script>
   ```

8) **What is a composable**:
   A composable is a function that uses Vue's Composition API to encapsulate and reuse stateful logic. Naming convention: Always prefix with `use` (e.g., `useMouse`, `useLocalStorage`, `useFetch`).

9) **Composables vs mixins**:
   Composables advantages:
   - **Clear source**: You know where values come from (explicit import)
   - **No naming conflicts**: Can rename on destructure
   - **Better TypeScript support**: Full type inference
   - **More flexible**: Can conditionally use composables
   - **Easier testing**: Pure functions
   
   Mixins problems:
   - Unclear property source
   - Naming conflicts between multiple mixins
   - Implicit property addition
   - Hard to type with TypeScript

10) **Simple useCounter composable**:
    ```ts
    import { ref } from 'vue'
    
    export function useCounter(initialValue = 0) {
      const count = ref(initialValue)
      
      function increment() {
        count.value++
      }
      
      function decrement() {
        count.value--
      }
      
      function reset() {
        count.value = initialValue
      }
      
      return {
        count,
        increment,
        decrement,
        reset
      }
    }
    ```

11) **Define props in `<script setup>`**:
    ```ts
    // Runtime declaration
    const props = defineProps({
      msg: String,
      count: { type: Number, default: 0 }
    })
    
    // TypeScript declaration (recommended)
    const props = defineProps<{
      msg: string
      count?: number
    }>()
    
    // TypeScript with defaults
    const props = withDefaults(defineProps<{
      msg: string
      count?: number
    }>(), {
      count: 0
    })
    ```

12) **Emit events in `<script setup>`**:
    ```ts
    // Runtime declaration
    const emit = defineEmits(['update', 'delete'])
    emit('update', newValue)
    
    // TypeScript declaration (recommended)
    const emit = defineEmits<{
      update: [id: number, value: string]
      delete: [id: number]
    }>()
    
    emit('update', 123, 'new value')
    emit('delete', 123)
    ```

13) **defineExpose() purpose**:
    `<script setup>` components are "closed" by default - they don't expose anything to parent components via template refs. `defineExpose()` explicitly exposes specific properties/methods.
    ```ts
    <script setup>
    const count = ref(0)
    const increment = () => count.value++
    
    // Only expose increment, not count
    defineExpose({ increment })
    </script>
    ```

14) **Lifecycle hooks differences**:
    Options API uses option properties, Composition API uses imported functions with `on` prefix:
    
    Options API:
    ```ts
    export default {
      mounted() {
        console.log('Mounted')
      },
      unmounted() {
        console.log('Unmounted')
      }
    }
    ```
    
    Composition API:
    ```ts
    import { onMounted, onUnmounted } from 'vue'
    
    onMounted(() => {
      console.log('Mounted')
    })
    
    onUnmounted(() => {
      console.log('Unmounted')
    })
    ```

15) **Hooks replaced by setup()**:
    `beforeCreate` and `created` are replaced by `setup()` itself. Code that would go in these hooks should be written directly in `setup()`.

16) **Options API to Composition API hooks**:
    - `mounted` → `onMounted()`
    - `beforeUnmount` → `onBeforeUnmount()`
    - `updated` → `onUpdated()`

17) **Multiple onMounted hooks**:
    Yes, you can register multiple `onMounted` hooks in the same component. They will all execute in the order they are registered. This is useful when using multiple composables that each need mounted behavior.
    ```ts
    onMounted(() => console.log('First'))
    onMounted(() => console.log('Second'))
    // Both will execute
    ```

18) **What's wrong with the code**:
    Lifecycle hooks must be registered **synchronously** during setup. You cannot register them inside async functions or callbacks.
    
    **Fixed**:
    ```ts
    <script setup lang="ts">
    import { ref, onMounted } from 'vue'
    
    const data = ref(null)
    
    // Register hook synchronously
    onMounted(async () => {
      // Async work inside the hook is fine
      data.value = await fetch('/api/data')
      console.log('Mounted')
    })
    </script>
    ```

19) **provide/inject in Composition API**:
    ```ts
    // Parent/ancestor component
    import { provide, ref } from 'vue'
    
    const theme = ref('dark')
    provide('theme', theme)
    
    // Descendant component
    import { inject } from 'vue'
    
    const theme = inject('theme')
    // With default value
    const theme = inject('theme', 'light')
    
    // TypeScript type-safe version
    import type { InjectionKey, Ref } from 'vue'
    
    const themeKey: InjectionKey<Ref<string>> = Symbol('theme')
    provide(themeKey, theme)
    const theme = inject(themeKey) // Fully typed
    ```

20) **When to use Composition API vs Options API**:
    
    **Use Composition API when**:
    - Building large/complex applications
    - Need to reuse logic across components
    - Using TypeScript (better inference)
    - Logic is scattered in Options API
    - Building libraries/composables
    
    **Use Options API when**:
    - Building simple applications
    - Team prefers it/more familiar
    - Migrating from Vue 2
    - Prefer organization by option type
    
    > 💡 Both can coexist in the same project!

21) **setup() return value usage**:
    The returned object's properties are exposed to the template and can be accessed in other component options:
    ```ts
    setup() {
      const count = ref(0)
      function increment() { count.value++ }
      
      // Exposed to template and other options
      return { count, increment }
    }
    ```
    Alternatively, `setup()` can return a render function.

22) **Mix Options API and Composition API**:
    Yes, you can use both in the same component:
    ```ts
    export default {
      // Composition API
      setup() {
        const compositionCount = ref(0)
        return { compositionCount }
      },
      // Options API
      data() {
        return { optionsCount: 0 }
      },
      computed: {
        total() {
          return this.compositionCount + this.optionsCount
        }
      }
    }
    ```
    The `setup()` runs first, and returned values are available on `this` in options.

23) **Access props in setup() with reactivity**:
    ```ts
    setup(props) {
      // ✅ Reactive access
      watch(() => props.count, (newCount) => {
        console.log('Count changed:', newCount)
      })
      
      // ✅ Access whole props object
      console.log(props.count)
      
      // ❌ Don't destructure directly - loses reactivity
      const { count } = props // Not reactive!
      
      // ✅ Use toRefs to destructure while preserving reactivity
      const { count } = toRefs(props)
      watch(count, (newCount) => {
        console.log('Count changed:', newCount)
      })
    }
    ```

24) **toRefs() with props**:
    `toRefs()` converts all properties of a reactive object into individual refs, preserving reactivity when destructuring:
    ```ts
    import { toRefs } from 'vue'
    
    setup(props) {
      // Convert props to refs for destructuring
      const { msg, count } = toRefs(props)
      
      // Now msg and count are reactive refs
      watch(count, (newValue) => {
        console.log('Count changed:', newValue)
      })
      
      return { msg, count }
    }
    ```

25) **useMouse() composable with cleanup**:
    ```ts
    import { ref, onMounted, onUnmounted } from 'vue'
    
    export function useMouse() {
      const x = ref(0)
      const y = ref(0)
      
      function update(event: MouseEvent) {
        x.value = event.pageX
        y.value = event.pageY
      }
      
      onMounted(() => {
        window.addEventListener('mousemove', update)
      })
      
      onUnmounted(() => {
        window.removeEventListener('mousemove', update)
      })
      
      return { x, y }
    }
    ```

26) **Composable with reactive parameters**:
    ```ts
    import { watch, ref, Ref } from 'vue'
    
    export function useSearch(query: Ref<string>) {
      const results = ref([])
      const loading = ref(false)
      
      // Watch reactive parameter
      watch(query, async (newQuery) => {
        if (!newQuery) {
          results.value = []
          return
        }
        
        loading.value = true
        results.value = await fetchResults(newQuery)
        loading.value = false
      })
      
      return { results, loading }
    }
    
    // Usage
    const searchQuery = ref('')
    const { results, loading } = useSearch(searchQuery)
    ```

27) **Best practices for composable return values**:
    ```ts
    // ✅ Good - return object for flexible destructuring
    export function useCounter() {
      const count = ref(0)
      const increment = () => count.value++
      return { count, increment }
    }
    
    // Usage - can destructure what you need
    const { count } = useCounter()
    const { count: myCount, increment } = useCounter()
    
    // ❌ Avoid - array forces positional destructuring
    export function useCounter() {
      return [count, increment] // Harder to rename, skip values
    }
    ```

28) **Composables using other composables**:
    Yes! This is a powerful pattern:
    ```ts
    // useLocalStorage.ts
    export function useLocalStorage(key: string, defaultValue: any) {
      const value = ref(defaultValue)
      // ... implementation
      return value
    }
    
    // useTodos.ts - uses useLocalStorage
    export function useTodos() {
      const todos = useLocalStorage('todos', [])
      
      function addTodo(text: string) {
        todos.value.push({ id: Date.now(), text })
      }
      
      return { todos, addTodo }
    }
    
    // Component - uses useTodos which uses useLocalStorage
    const { todos, addTodo } = useTodos()
    ```

29) **Type composable with TypeScript generics**:
    ```ts
    import { ref, Ref } from 'vue'
    
    export function useLocalStorage<T>(
      key: string, 
      defaultValue: T
    ): Ref<T> {
      const value = ref<T>(defaultValue) as Ref<T>
      
      // Load from localStorage
      const stored = localStorage.getItem(key)
      if (stored) {
        try {
          value.value = JSON.parse(stored)
        } catch (e) {
          console.error('Parse error:', e)
        }
      }
      
      // Watch and save
      watch(value, (newValue) => {
        localStorage.setItem(key, JSON.stringify(newValue))
      }, { deep: true })
      
      return value
    }
    
    // Usage - fully typed
    const count = useLocalStorage<number>('count', 0)
    const user = useLocalStorage<User>('user', { name: '', age: 0 })
    ```

30) **ref() for template refs in Options API vs Composition API**:
    
    **Options API**:
    ```ts
    export default {
      mounted() {
        // Access via this.$refs
        console.log(this.$refs.input)
      }
    }
    // Template: <input ref="input" />
    ```
    
    **Composition API**:
    ```ts
    <script setup>
    import { ref, onMounted } from 'vue'
    
    // Create ref with same name as template ref
    const input = ref<HTMLInputElement | null>(null)
    
    onMounted(() => {
      console.log(input.value) // Access the element
      input.value?.focus()
    })
    </script>
    
    <template>
      <input ref="input" />
    </template>
    ```
    
    > ⚠️ **CRITICAL**: The variable name must match the template ref name for automatic binding.
