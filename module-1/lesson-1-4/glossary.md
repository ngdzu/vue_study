# Glossary — Lesson 1.4

## Method Terms

### Method
A regular JavaScript function defined in a Vue component. Methods run every time they're called and don't cache results.

**Example**:
```ts
function increment() {
  count.value++
}
```

### Event Handler
A function that responds to DOM events (click, input, submit, etc.). Typically implemented as methods in Vue components.

**Example**: `@click="handleClick"`

### Event Object
The native DOM event passed to event handlers. Contains information about the event (target, coordinates, key pressed, etc.).

**Example**:
```ts
function handleClick(event: MouseEvent) {
  console.log(event.clientX, event.clientY)
}
```

### Inline Handler
An event handler written directly in the template, often calling a method with arguments.

**Example**: `@click="greet('Alice')"`

### $event
A special variable in Vue templates that references the native DOM event object.

**Example**: `@submit="handleSubmit($event, 'data')"`

---

## Computed Property Terms

### Computed Property
A cached reactive value that automatically updates when its dependencies change. More efficient than methods for values used multiple times.

**Example**:
```ts
const fullName = computed(() => `${firstName.value} ${lastName.value}`)
```

### Dependency Tracking
Vue's mechanism for automatically detecting which reactive data a computed property or watcher depends on.

**Example**: When `computed(() => a.value + b.value)` is created, Vue tracks that it depends on `a` and `b`.

### Caching
Computed properties store their result and only recalculate when dependencies change. Calling the computed property multiple times returns the cached value.

### Derived State
State that is calculated from other state. Computed properties are the primary way to create derived state in Vue.

**Example**: `filteredItems` derived from `items` and `searchQuery`

### Getter
The function that computes and returns the value of a computed property. In writable computed properties, this is the `get()` function.

**Example**:
```ts
const fullName = computed({
  get() {
    return `${firstName.value} ${lastName.value}`
  }
})
```

### Setter
In writable computed properties, the function that runs when you assign a new value to the computed property.

**Example**:
```ts
const fullName = computed({
  get() { return `${first.value} ${last.value}` },
  set(value) {
    const [f, l] = value.split(' ')
    first.value = f
    last.value = l
  }
})
```

### Writable Computed Property
A computed property with both getter and setter, allowing two-way data binding.

---

## Watcher Terms

### Watcher
A function that runs side effects in response to reactive data changes. Watchers observe specific reactive sources and execute callbacks when they change.

**Example**:
```ts
watch(userId, async (newId) => {
  await fetchUser(newId)
})
```

### Side Effect
Any operation that affects something outside its scope: API calls, DOM manipulation, logging, localStorage, etc. Watchers are designed for side effects.

### watch()
Vue's API for creating watchers that observe specific reactive sources. Requires explicitly declaring what to watch.

**Example**:
```ts
watch(source, callback, options)
```

### watchEffect()
Vue's API for creating watchers that automatically track all reactive dependencies. Runs immediately on creation.

**Example**:
```ts
watchEffect(() => {
  console.log(`${firstName.value} ${lastName.value}`)
})
```

### Watch Source
The reactive data being watched. Can be a ref, reactive object, getter function, or array of sources.

**Examples**:
- Single ref: `watch(count, ...)`
- Getter: `watch(() => user.name, ...)`
- Multiple: `watch([a, b, c], ...)`

### Watch Callback
The function that runs when the watched data changes. Receives new and old values as parameters.

**Example**:
```ts
watch(count, (newValue, oldValue) => {
  console.log(`Changed from ${oldValue} to ${newValue}`)
})
```

### Deep Watch
A watch option (`{ deep: true }`) that triggers on changes to any nested property of an object, not just the object reference.

**Example**:
```ts
watch(user, callback, { deep: true })
```

### Immediate Watch
A watch option (`{ immediate: true }`) that runs the callback immediately when the watcher is created, not just on subsequent changes.

**Example**:
```ts
watch(userId, fetchUser, { immediate: true })
```

### Flush Timing
Controls when a watcher callback runs relative to component updates. Options: `'pre'` (before), `'post'` (after), `'sync'` (synchronously).

### Stop Handle
The function returned by `watch()` and `watchEffect()` that stops the watcher when called.

**Example**:
```ts
const stop = watch(count, callback)
stop() // Stop watching
```

### Cleanup Function
A function in `watchEffect()` that runs before the next execution and on component unmount. Used to clean up side effects like timers or subscriptions.

**Example**:
```ts
watchEffect((onCleanup) => {
  const timer = setTimeout(() => {...}, 1000)
  onCleanup(() => clearTimeout(timer))
})
```

---

## Performance Terms

### Debouncing
Delaying execution of a function until a certain time has passed since the last invocation. Common for search inputs.

**Example**: Only search after user stops typing for 300ms.

### Throttling
Limiting how often a function can execute within a time period. Ensures function runs at most once per interval.

**Example**: Handle scroll events at most once every 100ms.

### Cache Invalidation
The process of determining when a cached value (like a computed property) is outdated and needs recalculation.

### Reactivity Overhead
The performance cost of Vue tracking dependencies and triggering updates. Watchers on large objects with `deep: true` have high overhead.

### Synchronous Execution
Code that runs immediately in sequence. `flush: 'sync'` watchers run synchronously, which can hurt performance if overused.

---

## Pattern Terms

### Observer Pattern
A design pattern where objects (watchers) subscribe to changes in other objects (reactive sources). Vue's reactivity system implements this pattern.

### Lazy Evaluation
Delaying computation until the value is actually needed. Watchers without `immediate: true` are lazy—they don't run until data changes.

### Eager Evaluation
Computing values immediately. Watchers with `immediate: true` and `watchEffect()` are eager.

### Unidirectional Data Flow
Data flows in one direction: from parent to child via props. Computed properties enforce this by deriving state rather than mutating it.

### Two-Way Binding
Data flows both directions. Achieved with `v-model` or writable computed properties.

---

## Common Anti-Patterns

### Method in Template Anti-Pattern
Calling methods repeatedly in templates instead of using computed properties. Causes unnecessary recalculations.

**Anti-pattern**:
```vue
<p>{{ calculateTotal() }}</p>
<p>{{ calculateTotal() }}</p> <!-- Calculates twice! -->
```

**Solution**: Use computed property.

### Watcher for Derived State Anti-Pattern
Using watchers to update values that could be computed properties.

**Anti-pattern**:
```ts
watch(items, () => {
  total.value = items.value.reduce((sum, i) => sum + i, 0)
})
```

**Solution**: `const total = computed(() => items.value.reduce(...))`

### Computed with Side Effects Anti-Pattern
Performing side effects (API calls, mutations) in computed property getters. Computed should be pure functions.

**Anti-pattern**:
```ts
const user = computed(() => {
  fetch('/api/user') // DON'T DO THIS
  return userId.value
})
```

**Solution**: Use watchers for side effects.

### Unnecessary Deep Watch Anti-Pattern
Using `deep: true` on large objects when only specific properties need watching.

**Anti-pattern**:
```ts
watch(largeObject, callback, { deep: true }) // Expensive!
```

**Solution**: Watch specific property: `watch(() => obj.value.prop, callback)`

---

## Advanced Terms

### Composable
A reusable function that uses Vue's Composition API (ref, computed, watch, etc.) to encapsulate logic. Often includes methods, computed properties, and watchers.

**Example**: `useSearch()`, `useFetch()`, `useDebounce()`

### Pure Function
A function that always returns the same output for the same input and has no side effects. Computed property getters should be pure.

### Referential Transparency
A property of pure functions where a function call can be replaced with its return value. Computed properties are referentially transparent.

### Memoization
Caching function results based on input parameters. Vue's computed properties implement automatic memoization.

### Reactive Primitive
Basic reactive values created with `ref()`. The foundation for dependency tracking.

### Reactive Proxy
The underlying mechanism for `reactive()` and ref objects. Vue uses JavaScript Proxies to intercept property access and mutations.

---

## TypeScript-Specific Terms

### Generic Computed
A computed property with TypeScript generics for type safety.

**Example**:
```ts
const items = computed<Item[]>(() => [...])
```

### Type Inference
TypeScript's ability to automatically determine types. Computed properties infer their return type from the getter.

**Example**: `computed(() => 'string')` is inferred as `ComputedRef<string>`

### Type Predicate
A TypeScript function return type that narrows types. Useful in filtering with computed properties.

**Example**:
```ts
function isActive(item: Item): item is ActiveItem {
  return item.status === 'active'
}

const activeItems = computed(() => items.value.filter(isActive))
```

---

## Timing Terms

### Pre-flush
Default watcher timing. Callback runs before component re-renders.

### Post-flush
Watcher timing option (`flush: 'post'`). Callback runs after component re-renders, when DOM is updated.

### Sync Flush
Watcher timing option (`flush: 'sync'`). Callback runs synchronously whenever data changes. Can hurt performance.

### Microtask
JavaScript execution queue for promises and Vue's reactivity updates. Component updates are batched in microtasks.

---

## Testing Terms

### Mock Watcher
In tests, replacing a real watcher with a test double to verify it's called correctly.

### Computed Assertion
Testing that a computed property returns the expected value for given inputs.

### Watch Spy
A test tool that tracks when watchers are called and with what arguments.

---

## Reference

For more details on these concepts:
- [Vue 3 Documentation: Computed Properties](https://vuejs.org/guide/essentials/computed.html)
- [Vue 3 Documentation: Watchers](https://vuejs.org/guide/essentials/watchers.html)
- [Vue 3 Documentation: Event Handling](https://vuejs.org/guide/essentials/event-handling.html)
- [Vue 3 Documentation: Reactivity in Depth](https://vuejs.org/guide/extras/reactivity-in-depth.html)
