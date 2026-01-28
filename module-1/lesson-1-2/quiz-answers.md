# Quiz Answers — Lesson 1.2

1) **Difference between ref() and reactive()**:
   - `ref()`: For primitives and when you need `.value` access in script; works with any value type; can be reassigned.
   - `reactive()`: For objects; no `.value` needed; cannot be reassigned without breaking reactivity; auto-unwraps nested refs.

2) **Using .value in templates**:
   No, `.value` is not needed in templates. Vue automatically unwraps refs in templates for convenience. In `<script>`, you must use `.value`.

3) **Destructuring reactive()**:
   It **breaks reactivity**. The destructured variables (`count`) become plain values, not reactive. Use `toRefs()` to preserve reactivity: `const { count } = toRefs(reactive({ count: 0 }))`.

4) **When to use computed() vs method**:
   Use `computed()` when:
   - The value is derived from reactive data
   - The calculation is expensive
   - The value is used multiple times
   - You want caching (only recomputes when dependencies change)
   Methods recalculate on every call; computed properties cache results.

5) **watch() vs watchEffect()**:
   - `watch()`: Explicit dependencies, provides old/new values, lazy by default.
   - `watchEffect()`: Automatically tracks dependencies used inside callback, runs immediately, no old/new values.

6) **Watch specific property of reactive object**:
   ```ts
   const state = reactive({ user: { name: 'Alice' } })
   watch(() => state.user.name, (newName) => {
     console.log('Name changed:', newName)
   })
   ```

7) **v-model modifiers**:
   - `.lazy`: Syncs on `change` event instead of `input` (updates on blur, not every keystroke)
   - `.number`: Automatically converts input to number type
   - `.trim`: Automatically trims whitespace from input

8) **How Vue tracks dependencies**:
   During computed property evaluation, Vue tracks which reactive properties are accessed (via Proxy getters). When those properties change, Vue knows to recompute the computed property. This is automatic dependency collection.

9) **deep: true in watch()**:
   Enables deep watching of nested properties in objects/arrays. Without it, only top-level property changes trigger the watcher. With `deep: true`, changes to any nested property trigger the watcher. Can impact performance on large objects.

10) **Why debounce user input**:
    To avoid making excessive API calls on every keystroke. Debouncing waits for the user to stop typing (e.g., 300ms pause) before making the API call, reducing server load and improving performance.

11) **What's wrong**:
    Reassigning a `reactive()` object breaks reactivity. The new object is not reactive. Solution: Use `ref()` for reassignable objects:
    ```ts
    const user = ref({ name: 'Alice' })
    user.value = { name: 'Bob' } // ✅ Works
    ```

12) **Writable computed property**:
    ```ts
    const fullName = computed({
      get() {
        return `${firstName.value} ${lastName.value}`
      },
      set(newValue) {
        [firstName.value, lastName.value] = newValue.split(' ')
      }
    })
    ```

13) **toRefs() purpose**:
    Converts all properties of a reactive object into individual refs, preserving reactivity when destructuring:
    ```ts
    const state = reactive({ count: 0, name: 'Alice' })
    const { count, name } = toRefs(state) // Both are reactive refs
    ```

14) **Performance comparison**:
    - `computed()`: Calculates once, caches result, only recalculates when dependencies change. Efficient for expensive operations.
    - Method: Runs every time it's called in the template (every render). Inefficient if used multiple times or for expensive calculations.

15) **Return type of ref(0)**:
    `Ref<number>` in TypeScript. It's a reactive reference object with a `.value` property of type `number`.

16) **Cleanup in watchEffect()**:
    ```ts
    watchEffect((onCleanup) => {
      const timer = setTimeout(() => {}, 1000)
      onCleanup(() => {
        clearTimeout(timer) // Runs before next effect or on unmount
      })
    })
    ```

17) **Watch flush options**:
    - `flush: 'pre'`: Callback runs before component updates (default for `watch`)
    - `flush: 'post'`: Callback runs after component updates (can access updated DOM)
    - `flush: 'sync'`: Callback runs synchronously (use sparingly, can cause performance issues)

18) **Deep watching with ref()**:
    For `ref()` wrapping an object/array, you need `deep: true` to watch nested properties:
    ```ts
    const obj = ref({ nested: { value: 0 } })
    watch(obj, callback, { deep: true })
    ```

19) **How v-model works**:
    It's syntactic sugar for:
    ```vue
    <input 
      :value="modelValue" 
      @input="modelValue = $event.target.value"
    >
    ```
    It binds the value and listens to input events to update the data.

20) **Typing nullable ref**:
    ```ts
    const user = ref<User | null>(null)
    
    interface User {
      id: number
      name: string
    }
    ```
    Use generic syntax with union type when initial value can be null/undefined.

21) **toRef() vs computed() with get/set**:
    - `toRef()`: Extracts a single property from reactive object; lightweight; maintains a link (two-way); no caching; purpose is property extraction.
    - `computed()` with get/set: Derives/transforms values; caches results; auto-tracks all dependencies; heavier; general-purpose derived state.
    
    **Use `toRef()`** when you just want to extract and pass a property around:
    ```ts
    const state = reactive({ count: 0 })
    const countRef = toRef(state, 'count') // Extract count as Ref
    ```
    
    **Use `computed()`** when you need transformation or logic:
    ```ts
    const doubled = computed({
      get() { return state.count * 2 },
      set(val) { state.count = val / 2 }
    })
    ```

22) **Correct syntax for nested ref**:
    **Answer: B) `state.value.count`**
    
    When `state = ref({ count: 0 })`, you must access `.value` first (because state is a Ref), then the property:
    ```ts
    const state = ref({ count: 0 })
    state.value.count // ✅ Correct: .value then .count
    state.count.value // ❌ Wrong: state.count doesn't exist
    ```

23) **Syntax difference: reactive() vs ref()**:
    - `reactive({ count: 0 })`: Access properties directly without `.value` → `state.count`
    - `ref({ count: 0 })`: Must use `.value` first, then access property → `state.value.count`
    
    ```ts
    const stateReactive = reactive({ count: 0 })
    stateReactive.count++ // ✅ Direct access
    
    const stateRef = ref({ count: 0 })
    stateRef.value.count++ // ✅ Must use .value first
    ```

24) **Is `const countRef = computed(() => state.count.value)` correct for reactive()?**
    **No, it's incorrect.**
    
    - `state = reactive({ count: 0 })` means `state.count` is already the plain value (`0`), NOT a Ref
    - `.value` is only for Refs
    - `state.count.value` returns `undefined`
    
    **Correct**:
    ```ts
    const countRef = computed(() => state.count) // ✅ No .value
    ```

25) **toRef() vs destructuring**:
    Destructuring breaks reactivity, `toRef()` preserves it:
    
    ```ts
    const state = reactive({ count: 0, name: 'Alice' })
    
    // ❌ Destructuring breaks reactivity
    const { count, name } = state
    count++ // Does NOT update Vue
    
    // ✅ toRef() preserves reactivity
    const { count, name } = toRefs(state)
    count.value++ // Updates Vue ✅
    
    // ✅ Single property with toRef()
    const countRef = toRef(state, 'count')
    countRef.value++ // Updates Vue ✅
    ```
    
    Use `toRefs()` when you need to destructure a reactive object; use `toRef()` to extract a single property.

26) **Main difference between v-if and v-show**:
    - `v-if`: **Conditionally renders** elements — completely adds/removes elements from the DOM
    - `v-show`: **Toggles visibility** — elements always stay in DOM, just hidden with CSS `display: none`

27) **Which has higher initial render cost and why**:
    `v-show` has higher initial render cost because it **creates all elements upfront** regardless of condition.
    
    - `v-show`: Renders element even if initially hidden (just sets `display: none`)
    - `v-if`: "Lazy" — doesn't create element at all if condition is false on initial render
    
    However, `v-if` has higher **toggle cost** (adding/removing DOM elements vs. just changing CSS).

28) **When to use v-show instead of v-if**:
    Use `v-show` when:
    - Element toggles **frequently** (lower toggle cost)
    - Initial render cost is acceptable
    - You want to keep element state (form inputs, scroll position) when hidden
    
    Use `v-if` when:
    - Element toggles **infrequently**
    - Conditional logic is complex (v-else-if, v-else)
    - You want to avoid rendering costly components unless needed

29) **What "lazy" means for v-if and reactivity**:
    **"Lazy"** refers to **initial render only**: If the condition is false when the component first renders, the element won't be created at all.
    
    **However, v-if IS fully reactive!** When the condition changes later, Vue re-evaluates and dynamically creates/removes the element from the DOM.
    
    ```ts
    const show = ref(false)
    // Initial render: <div v-if="show"> is NOT created (lazy)
    
    show.value = true
    // Vue reactively creates the div ✅
    ```

30) **What happens when isVisible changes from false to true**:
    ```vue
    <div v-if="isVisible">Content A</div>
    <div v-show="isVisible">Content B</div>
    ```
    
    **Initial state (isVisible = false)**:
    - `v-if` div: Does NOT exist in DOM
    - `v-show` div: Exists in DOM but has `style="display: none"`
    
    **When isVisible = true**:
    - `v-if` div: **Created and inserted** into DOM
    - `v-show` div: CSS changed to `display: block` (or original display value)
    
    DOM operation difference: v-if adds element (expensive), v-show just changes CSS property (cheap).

31) **Default `deep` property value for watch()**:
    
    **Watching a specific primitive property** (via getter function):
    ```ts
    watch(() => state.user.name, callback) // name is a string
    ```
    Default: Not applicable — you're already narrowing to a primitive, so changes to `name` always trigger.
    
    **Watching a specific object/array property** (via getter function):
    ```ts
    const state = reactive({ user: { name: 'Alice', age: 30 } })
    watch(() => state.user, callback) // Default: NOT deep
    ```
    Default: **`deep: false` (implicit)** — only detects if `state.user` object reference is completely replaced. Nested changes (e.g., `state.user.age = 31`) won't trigger the callback. To watch nested changes, explicitly set `deep: true`:
    ```ts
    watch(() => state.user, callback, { deep: true }) // ✅ Now catches nested age changes
    ```
    
    **Watching a whole reactive object directly**:
    ```ts
    const state = reactive({ count: 0, name: 'Alice' })
    watch(state, callback) // Default: implicitly DEEP
    ```
    Default: **`deep: true` (implicit)** — Vue automatically creates a deep watcher. ALL nested mutations trigger the callback:
    ```ts
    state.count++ // ✅ Triggers
    state.name = 'Bob' // ✅ Triggers
    ```
    
    **Watching a ref wrapping an object**:
    ```ts
    const state = ref({ count: 0, name: 'Alice' })
    watch(state, callback) // Default: NOT deep
    ```
    Default: **`deep: false` (implicit)** — only detects if the entire object reference changes. Nested mutations won't trigger. Set `deep: true` if needed:
    ```ts
    watch(state, callback, { deep: true }) // ✅ Now watches nested changes
    ```
    
    **Summary**: 
    - **`watch(reactiveObject, ...)`**: Implicitly **deep** ✅ (watches nested changes automatically)
    - **`watch(() => getter, ...)`**: Implicitly **NOT deep** (only surface-level or object reference changes)
    - **`watch(ref, ...)`**: Implicitly **NOT deep** (unless object inside the ref)
