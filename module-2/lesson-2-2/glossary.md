# Glossary — Lesson 2.2 Terms & Definitions

Quick reference for technical terms used in this lesson.

---

## Core Concepts

### Composition API
**Definition**: A set of APIs in Vue 3 that allows you to author components using imported functions instead of declaring options, enabling better code organization and reuse.

**Purpose**: Provides an alternative to the Options API with better TypeScript support, more flexible code organization, and improved logic reuse through composables.

**Example**:
```ts
// Composition API
import { ref, computed } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const doubled = computed(() => count.value * 2)
    
    function increment() {
      count.value++
    }
    
    return { count, doubled, increment }
  }
}
```

**vs Options API**:
```ts
// Options API
export default {
  data() {
    return { count: 0 }
  },
  computed: {
    doubled() {
      return this.count * 2
    }
  },
  methods: {
    increment() {
      this.count++
    }
  }
}
```

---

### Options API
**Definition**: The traditional Vue component authoring style where you define component logic using option objects (`data`, `methods`, `computed`, `watch`, etc.).

**Characteristics**:
- Component logic organized by option type
- Uses `this` to access component instance
- Less flexible for code reuse (uses mixins)
- Simpler for beginners

**Example**:
```ts
export default {
  data() {
    return {
      user: { name: 'Alice', age: 30 }
    }
  },
  computed: {
    greeting() {
      return `Hello, ${this.user.name}`
    }
  },
  methods: {
    celebrateBirthday() {
      this.user.age++
    }
  },
  mounted() {
    console.log('Component mounted')
  }
}
```

---

### setup()
**Definition**: A component option that serves as the entry point for using the Composition API. It runs before the component is created, before `data()` and `computed` properties.

**Signature**: `setup(props, context)`

**Parameters**:
- `props`: Reactive object containing component props
- `context`: Object with `attrs`, `slots`, `emit`, and `expose`

**Returns**: An object of values to expose to the template, or a render function.

**Example**:
```ts
export default {
  props: ['initialCount'],
  setup(props, { emit }) {
    const count = ref(props.initialCount)
    
    function increment() {
      count.value++
      emit('update', count.value)
    }
    
    return { count, increment }
  }
}
```

> ⚠️ **CRITICAL**: Inside `setup()`, `this` is NOT available because the component instance hasn't been created yet.

---

### `<script setup>`
**Definition**: A compile-time syntactic sugar for using Composition API inside Single File Components. It makes code more concise by automatically exposing bindings to the template.

**Benefits**:
- Less boilerplate code
- Better TypeScript inference
- Auto-imports are more ergonomic
- Better runtime performance (compiled to more efficient code)

**Example**:

Regular `setup()`:
```ts
export default {
  props: ['msg'],
  setup(props) {
    const count = ref(0)
    const doubled = computed(() => count.value * 2)
    
    return { count, doubled }
  }
}
```

With `<script setup>`:
```ts
<script setup lang="ts">
const props = defineProps<{ msg: string }>()
const count = ref(0)
const doubled = computed(() => count.value * 2)
// Automatically exposed to template
</script>
```

> 💡 **IMPORTANT**: `<script setup>` is the recommended way to write Composition API components in Vue 3.

---

### Composable
**Definition**: A function that uses Vue's Composition API to encapsulate and reuse stateful logic. Composables are conventionally named with the `use` prefix.

**Purpose**: Share reactive logic across multiple components without using mixins or render-props patterns.

**Characteristics**:
- Returns reactive state and/or functions
- Can use other composables
- Usually named `useSomething`
- Can access lifecycle hooks

**Example**:
```ts
// composables/useMouse.ts
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

// Usage in component:
const { x, y } = useMouse()
```

---

### Code Reuse
**Definition**: The practice of writing logic once and using it in multiple places to avoid duplication.

**In Vue**:
- **Options API**: Uses mixins (problematic with naming conflicts and unclear source)
- **Composition API**: Uses composables (clear source, no naming conflicts)

**Composables vs Mixins**:

Mixins (Options API):
```ts
// Unclear where 'x' and 'y' come from
// Risk of naming conflicts if multiple mixins define same property
export default {
  mixins: [mouseMixin, otherMixin]
}
```

Composables (Composition API):
```ts
// Clear where 'x' and 'y' come from
// No naming conflicts - you can rename on import
const { x, y } = useMouse()
const { x: scrollX } = useScroll()
```

> 💡 **IMPORTANT**: Composables are the preferred code reuse pattern in Vue 3.

---

### Reactivity in Composition API
**Definition**: The same reactivity system as the Options API, but exposed through explicit imports (`ref`, `reactive`, `computed`, `watch`).

**Key Functions**:
- `ref()`: Create reactive reference for any value
- `reactive()`: Create reactive object (only for objects)
- `computed()`: Create computed value
- `watch()` / `watchEffect()`: Watch reactive data changes

**Example**:
```ts
import { ref, reactive, computed, watch } from 'vue'

const count = ref(0)
const user = reactive({ name: 'Alice', age: 30 })
const doubled = computed(() => count.value * 2)

watch(count, (newVal, oldVal) => {
  console.log(`Count changed from ${oldVal} to ${newVal}`)
})
```

---

### Lifecycle Hooks in Composition API
**Definition**: Functions that allow you to hook into component lifecycle stages. In Composition API, they are imported and called inside `setup()`.

**Naming Convention**: Options API hooks get `on` prefix in Composition API.

**Mapping**:
- `beforeCreate` / `created` → Use `setup()` itself
- `beforeMount` → `onBeforeMount()`
- `mounted` → `onMounted()`
- `beforeUpdate` → `onBeforeUpdate()`
- `updated` → `onUpdated()`
- `beforeUnmount` → `onBeforeUnmount()`
- `unmounted` → `onUnmounted()`

**Example**:
```ts
import { onMounted, onUnmounted } from 'vue'

export default {
  setup() {
    onMounted(() => {
      console.log('Component mounted')
    })
    
    onUnmounted(() => {
      console.log('Component unmounted')
    })
  }
}
```

> ⚠️ **CRITICAL**: Lifecycle hooks in `setup()` must be registered synchronously. Don't call them inside `setTimeout` or async functions.

---

### defineProps()
**Definition**: A compile-time macro available only in `<script setup>` that declares component props with TypeScript type inference.

**Usage**:
```ts
<script setup lang="ts">
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
</script>
```

> 💡 **IMPORTANT**: `defineProps()` doesn't need to be imported - it's auto-available in `<script setup>`.

---

### defineEmits()
**Definition**: A compile-time macro in `<script setup>` that declares events the component can emit, with full TypeScript support.

**Usage**:
```ts
<script setup lang="ts">
// Runtime declaration
const emit = defineEmits(['update', 'delete'])

// TypeScript declaration (recommended)
const emit = defineEmits<{
  update: [id: number, value: string]
  delete: [id: number]
}>()

// Emit events
emit('update', 123, 'new value')
emit('delete', 123)
</script>
```

---

### defineExpose()
**Definition**: A compile-time macro that explicitly exposes public methods/properties when using `<script setup>`. By default, `<script setup>` components are "closed" to parent refs.

**Why it exists**: `<script setup>` components don't expose anything to parent components by default for encapsulation.

**Usage**:
```ts
<script setup lang="ts">
const count = ref(0)
const increment = () => count.value++

// Only expose specific items
defineExpose({
  increment
  // count is NOT exposed
})
</script>

<!-- Parent component -->
<script setup lang="ts">
const childRef = ref()

function callChildMethod() {
  childRef.value.increment() // ✅ Works
  console.log(childRef.value.count) // ❌ undefined
}
</script>

<template>
  <Child ref="childRef" />
</template>
```

---

### Provide / Inject
**Definition**: A pair of functions for dependency injection, allowing ancestor components to provide data to all descendants without prop drilling.

**Usage**:
```ts
// Parent/ancestor component
import { provide, ref } from 'vue'

const theme = ref('dark')
provide('theme', theme)

// Any descendant component
import { inject } from 'vue'

const theme = inject('theme') // Access provided value

// With default value
const theme = inject('theme', 'light')

// With TypeScript
import type { InjectionKey, Ref } from 'vue'

const themeKey: InjectionKey<Ref<string>> = Symbol('theme')
provide(themeKey, theme)
const theme = inject(themeKey) // Type-safe
```

> 💡 **IMPORTANT**: Provide/inject is useful for plugin/library authors and complex app architecture, but for simple parent-child communication, use props/events.

---

## When to Use Which API

### Use Composition API When:
- Building large, complex applications
- Need to reuse logic across multiple components
- Working with TypeScript (better inference)
- Logic is scattered across multiple options in Options API
- Building composable libraries

### Use Options API When:
- Building simple applications
- Team is more familiar with it
- Migrating from Vue 2
- Prefer organized structure by option type

> 💡 **IMPORTANT**: You can use both APIs in the same project. They are 100% compatible and can coexist in the same codebase.

---

## Common Patterns

### Extracting Reusable Logic

**Before (Options API with Mixins)**:
```ts
// Mixin - unclear source, potential naming conflicts
const myMixin = {
  data() {
    return { mixinData: 'hello' }
  }
}

export default {
  mixins: [myMixin, anotherMixin]
  // Where does 'mixinData' come from? Could conflict with anotherMixin!
}
```

**After (Composition API with Composables)**:
```ts
// Composable - clear source, no conflicts
function useFeature() {
  const data = ref('hello')
  return { data }
}

export default {
  setup() {
    const { data } = useFeature()
    const { data: otherData } = useOtherFeature() // Rename on destructure
    return { data, otherData }
  }
}
```

---

### Organizing Related Logic

**Options API** - Logic scattered across options:
```ts
export default {
  data() {
    return {
      // Feature A data
      userList: [],
      // Feature B data
      productList: []
    }
  },
  methods: {
    // Feature A method
    fetchUsers() { },
    // Feature B method
    fetchProducts() { }
  },
  mounted() {
    // Feature A
    this.fetchUsers()
    // Feature B
    this.fetchProducts()
  }
}
```

**Composition API** - Logic grouped by feature:
```ts
export default {
  setup() {
    // Feature A - all logic together
    const userList = ref([])
    function fetchUsers() { }
    onMounted(() => fetchUsers())
    
    // Feature B - all logic together
    const productList = ref([])
    function fetchProducts() { }
    onMounted(() => fetchProducts())
    
    return { userList, productList }
  }
}
```

**Even Better** - Extract to composables:
```ts
export default {
  setup() {
    const { users, fetchUsers } = useUsers()
    const { products, fetchProducts } = useProducts()
    
    return { users, products }
  }
}
```

---

## Best Practices

1. **Naming Composables**: Always prefix with `use` (e.g., `useMouse`, `useLocalStorage`)

2. **Return Values**: Return an object from composables for destructuring flexibility:
   ```ts
   // ✅ Good - flexible destructuring
   return { count, increment, decrement }
   
   // ❌ Avoid - forces all or nothing
   return [count, increment, decrement]
   ```

3. **Reactivity**: Ensure composables return reactive values (`ref` or `reactive`):
   ```ts
   // ✅ Good - reactive
   function useCounter() {
     const count = ref(0)
     return { count }
   }
   
   // ❌ Bad - loses reactivity
   function useCounter() {
     let count = 0
     return { count }
   }
   ```

4. **Side Effects**: Clean up side effects in lifecycle hooks:
   ```ts
   function useMouse() {
     const x = ref(0)
     
     function update(e: MouseEvent) {
       x.value = e.pageX
     }
     
     onMounted(() => window.addEventListener('mousemove', update))
     onUnmounted(() => window.removeEventListener('mousemove', update))
     
     return { x }
   }
   ```

5. **TypeScript**: Use type annotations for better developer experience:
   ```ts
   interface User {
     id: number
     name: string
   }
   
   function useUsers() {
     const users = ref<User[]>([])
     return { users }
   }
   ```
