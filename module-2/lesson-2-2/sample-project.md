# Sample Project — Refactoring Todo App from Options API to Composition API

Purpose: Demonstrate how to refactor a real-world component from Options API to Composition API, extract reusable logic into composables, and leverage `<script setup>` for cleaner code.

## Requirements

Refactor a feature-rich Todo application:

- **Core Features**: Add, toggle, delete, filter todos
- **Advanced Features**: Local storage persistence, undo/redo functionality, bulk actions
- **Three Versions**:
  1. Original Options API implementation
  2. Composition API with `setup()` function
  3. Final version with `<script setup>` and extracted composables

## Suggested File Layout

```
src/
  components/
    TodoApp.vue              # Main component
    TodoItem.vue             # Individual todo component
    TodoFilters.vue          # Filter buttons
  composables/
    useTodos.ts              # Todo management logic
    useLocalStorage.ts       # Local storage persistence
    useUndoRedo.ts           # Undo/redo functionality
  types/
    todo.ts                  # TypeScript interfaces
  App.vue
```

## Implementation Steps

### Step 1: Original Options API Version

```ts
<!-- TodoApp.vue - Options API -->
<script lang="ts">
import { defineComponent } from 'vue'

interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: Date
}

type Filter = 'all' | 'active' | 'completed'

export default defineComponent({
  data() {
    return {
      todos: [] as Todo[],
      newTodoText: '',
      filter: 'all' as Filter,
      history: [] as Todo[][],
      historyIndex: -1
    }
  },
  
  computed: {
    filteredTodos(): Todo[] {
      switch (this.filter) {
        case 'active':
          return this.todos.filter(t => !t.completed)
        case 'completed':
          return this.todos.filter(t => t.completed)
        default:
          return this.todos
      }
    },
    
    activeCount(): number {
      return this.todos.filter(t => !t.completed).length
    },
    
    completedCount(): number {
      return this.todos.filter(t => t.completed).length
    },
    
    canUndo(): boolean {
      return this.historyIndex > 0
    },
    
    canRedo(): boolean {
      return this.historyIndex < this.history.length - 1
    }
  },
  
  methods: {
    addTodo() {
      if (this.newTodoText.trim()) {
        const newTodo: Todo = {
          id: Date.now(),
          text: this.newTodoText.trim(),
          completed: false,
          createdAt: new Date()
        }
        this.todos.push(newTodo)
        this.newTodoText = ''
        this.saveToHistory()
        this.saveToLocalStorage()
      }
    },
    
    toggleTodo(id: number) {
      const todo = this.todos.find(t => t.id === id)
      if (todo) {
        todo.completed = !todo.completed
        this.saveToHistory()
        this.saveToLocalStorage()
      }
    },
    
    deleteTodo(id: number) {
      this.todos = this.todos.filter(t => t.id !== id)
      this.saveToHistory()
      this.saveToLocalStorage()
    },
    
    clearCompleted() {
      this.todos = this.todos.filter(t => !t.completed)
      this.saveToHistory()
      this.saveToLocalStorage()
    },
    
    toggleAll() {
      const allCompleted = this.todos.every(t => t.completed)
      this.todos.forEach(t => {
        t.completed = !allCompleted
      })
      this.saveToHistory()
      this.saveToLocalStorage()
    },
    
    saveToHistory() {
      // Remove any future history if we're in the middle
      this.history = this.history.slice(0, this.historyIndex + 1)
      // Add current state
      this.history.push(JSON.parse(JSON.stringify(this.todos)))
      this.historyIndex++
      // Limit history to 50 states
      if (this.history.length > 50) {
        this.history.shift()
        this.historyIndex--
      }
    },
    
    undo() {
      if (this.canUndo) {
        this.historyIndex--
        this.todos = JSON.parse(JSON.stringify(this.history[this.historyIndex]))
        this.saveToLocalStorage()
      }
    },
    
    redo() {
      if (this.canRedo) {
        this.historyIndex++
        this.todos = JSON.parse(JSON.stringify(this.history[this.historyIndex]))
        this.saveToLocalStorage()
      }
    },
    
    saveToLocalStorage() {
      localStorage.setItem('todos', JSON.stringify(this.todos))
    },
    
    loadFromLocalStorage() {
      const stored = localStorage.getItem('todos')
      if (stored) {
        this.todos = JSON.parse(stored)
        this.saveToHistory()
      }
    }
  },
  
  mounted() {
    this.loadFromLocalStorage()
  }
})
</script>

<template>
  <div class="todo-app">
    <header>
      <h1>Todo App</h1>
      <div class="stats">
        <span>{{ activeCount }} active</span>
        <span>{{ completedCount }} completed</span>
      </div>
    </header>
    
    <div class="controls">
      <input 
        v-model="newTodoText"
        @keyup.enter="addTodo"
        placeholder="What needs to be done?"
      />
      <button @click="addTodo">Add</button>
    </div>
    
    <div class="actions">
      <button @click="toggleAll">Toggle All</button>
      <button @click="clearCompleted" :disabled="completedCount === 0">
        Clear Completed
      </button>
      <button @click="undo" :disabled="!canUndo">Undo</button>
      <button @click="redo" :disabled="!canRedo">Redo</button>
    </div>
    
    <div class="filters">
      <button 
        @click="filter = 'all'"
        :class="{ active: filter === 'all' }"
      >
        All
      </button>
      <button 
        @click="filter = 'active'"
        :class="{ active: filter === 'active' }"
      >
        Active
      </button>
      <button 
        @click="filter = 'completed'"
        :class="{ active: filter === 'completed' }"
      >
        Completed
      </button>
    </div>
    
    <ul class="todo-list">
      <li 
        v-for="todo in filteredTodos" 
        :key="todo.id"
        :class="{ completed: todo.completed }"
      >
        <input 
          type="checkbox" 
          :checked="todo.completed"
          @change="toggleTodo(todo.id)"
        />
        <span>{{ todo.text }}</span>
        <button @click="deleteTodo(todo.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>
```

### Step 2: Composition API with setup() Function

```ts
<!-- TodoApp.vue - Composition API with setup() -->
<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'

interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: Date
}

type Filter = 'all' | 'active' | 'completed'

export default defineComponent({
  setup() {
    // State
    const todos = ref<Todo[]>([])
    const newTodoText = ref('')
    const filter = ref<Filter>('all')
    const history = ref<Todo[][]>([])
    const historyIndex = ref(-1)
    
    // Computed
    const filteredTodos = computed(() => {
      switch (filter.value) {
        case 'active':
          return todos.value.filter(t => !t.completed)
        case 'completed':
          return todos.value.filter(t => t.completed)
        default:
          return todos.value
      }
    })
    
    const activeCount = computed(() => {
      return todos.value.filter(t => !t.completed).length
    })
    
    const completedCount = computed(() => {
      return todos.value.filter(t => t.completed).length
    })
    
    const canUndo = computed(() => historyIndex.value > 0)
    const canRedo = computed(() => historyIndex.value < history.value.length - 1)
    
    // Methods
    function saveToHistory() {
      history.value = history.value.slice(0, historyIndex.value + 1)
      history.value.push(JSON.parse(JSON.stringify(todos.value)))
      historyIndex.value++
      if (history.value.length > 50) {
        history.value.shift()
        historyIndex.value--
      }
    }
    
    function saveToLocalStorage() {
      localStorage.setItem('todos', JSON.stringify(todos.value))
    }
    
    function loadFromLocalStorage() {
      const stored = localStorage.getItem('todos')
      if (stored) {
        todos.value = JSON.parse(stored)
        saveToHistory()
      }
    }
    
    function addTodo() {
      if (newTodoText.value.trim()) {
        const newTodo: Todo = {
          id: Date.now(),
          text: newTodoText.value.trim(),
          completed: false,
          createdAt: new Date()
        }
        todos.value.push(newTodo)
        newTodoText.value = ''
        saveToHistory()
        saveToLocalStorage()
      }
    }
    
    function toggleTodo(id: number) {
      const todo = todos.value.find(t => t.id === id)
      if (todo) {
        todo.completed = !todo.completed
        saveToHistory()
        saveToLocalStorage()
      }
    }
    
    function deleteTodo(id: number) {
      todos.value = todos.value.filter(t => t.id !== id)
      saveToHistory()
      saveToLocalStorage()
    }
    
    function clearCompleted() {
      todos.value = todos.value.filter(t => !t.completed)
      saveToHistory()
      saveToLocalStorage()
    }
    
    function toggleAll() {
      const allCompleted = todos.value.every(t => t.completed)
      todos.value.forEach(t => {
        t.completed = !allCompleted
      })
      saveToHistory()
      saveToLocalStorage()
    }
    
    function undo() {
      if (canUndo.value) {
        historyIndex.value--
        todos.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]))
        saveToLocalStorage()
      }
    }
    
    function redo() {
      if (canRedo.value) {
        historyIndex.value++
        todos.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]))
        saveToLocalStorage()
      }
    }
    
    // Lifecycle
    onMounted(() => {
      loadFromLocalStorage()
    })
    
    // Expose to template
    return {
      todos,
      newTodoText,
      filter,
      filteredTodos,
      activeCount,
      completedCount,
      canUndo,
      canRedo,
      addTodo,
      toggleTodo,
      deleteTodo,
      clearCompleted,
      toggleAll,
      undo,
      redo
    }
  }
})
</script>

<!-- Template remains the same -->
```

> 💡 **IMPORTANT**: Notice how in Composition API, related logic is grouped together rather than scattered across different option blocks.

### Step 3: Extract Composables

Create reusable composables for each feature:

**useLocalStorage.ts**:
```ts
import { ref, watch, Ref } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const data = ref<T>(defaultValue) as Ref<T>
  
  // Load from localStorage
  const stored = localStorage.getItem(key)
  if (stored) {
    try {
      data.value = JSON.parse(stored)
    } catch (e) {
      console.error('Failed to parse localStorage data:', e)
    }
  }
  
  // Save to localStorage on changes
  watch(
    data,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue))
    },
    { deep: true }
  )
  
  return data
}
```

**useUndoRedo.ts**:
```ts
import { ref, computed, Ref } from 'vue'

export function useUndoRedo<T>(initialState: T) {
  const history = ref<T[]>([JSON.parse(JSON.stringify(initialState))]) as Ref<T[]>
  const historyIndex = ref(0)
  
  const canUndo = computed(() => historyIndex.value > 0)
  const canRedo = computed(() => historyIndex.value < history.value.length - 1)
  
  function save(state: T) {
    // Remove any future history
    history.value = history.value.slice(0, historyIndex.value + 1)
    // Add current state
    history.value.push(JSON.parse(JSON.stringify(state)))
    historyIndex.value++
    // Limit history to 50 states
    if (history.value.length > 50) {
      history.value.shift()
      historyIndex.value--
    }
  }
  
  function undo(): T | null {
    if (canUndo.value) {
      historyIndex.value--
      return JSON.parse(JSON.stringify(history.value[historyIndex.value]))
    }
    return null
  }
  
  function redo(): T | null {
    if (canRedo.value) {
      historyIndex.value++
      return JSON.parse(JSON.stringify(history.value[historyIndex.value]))
    }
    return null
  }
  
  return {
    canUndo,
    canRedo,
    save,
    undo,
    redo
  }
}
```

**useTodos.ts**:
```ts
import { ref, computed } from 'vue'

export interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: Date
}

export type Filter = 'all' | 'active' | 'completed'

export function useTodos(initialTodos: Todo[] = []) {
  const todos = ref<Todo[]>(initialTodos)
  const filter = ref<Filter>('all')
  
  const filteredTodos = computed(() => {
    switch (filter.value) {
      case 'active':
        return todos.value.filter(t => !t.completed)
      case 'completed':
        return todos.value.filter(t => t.completed)
      default:
        return todos.value
    }
  })
  
  const activeCount = computed(() => {
    return todos.value.filter(t => !t.completed).length
  })
  
  const completedCount = computed(() => {
    return todos.value.filter(t => t.completed).length
  })
  
  function addTodo(text: string) {
    const newTodo: Todo = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
      createdAt: new Date()
    }
    todos.value.push(newTodo)
    return newTodo
  }
  
  function toggleTodo(id: number) {
    const todo = todos.value.find(t => t.id === id)
    if (todo) {
      todo.completed = !todo.completed
    }
  }
  
  function deleteTodo(id: number) {
    todos.value = todos.value.filter(t => t.id !== id)
  }
  
  function clearCompleted() {
    todos.value = todos.value.filter(t => !t.completed)
  }
  
  function toggleAll() {
    const allCompleted = todos.value.every(t => t.completed)
    todos.value.forEach(t => {
      t.completed = !allCompleted
    })
  }
  
  return {
    todos,
    filter,
    filteredTodos,
    activeCount,
    completedCount,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    toggleAll
  }
}
```

### Step 4: Final Version with `<script setup>` and Composables

```ts
<!-- TodoApp.vue - Final version with <script setup> -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useTodos, type Todo } from '@/composables/useTodos'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { useUndoRedo } from '@/composables/useUndoRedo'

// Load persisted todos
const persistedTodos = useLocalStorage<Todo[]>('todos', [])

// Setup todo management
const {
  todos,
  filter,
  filteredTodos,
  activeCount,
  completedCount,
  addTodo,
  toggleTodo,
  deleteTodo,
  clearCompleted,
  toggleAll
} = useTodos(persistedTodos.value)

// Setup undo/redo
const { canUndo, canRedo, save, undo: undoHistory, redo: redoHistory } = useUndoRedo(todos.value)

// Input binding
const newTodoText = ref('')

// Sync todos with localStorage
watch(todos, (newTodos) => {
  persistedTodos.value = newTodos
  save(newTodos)
}, { deep: true })

// Enhanced methods with undo/redo support
function handleAddTodo() {
  if (newTodoText.value.trim()) {
    addTodo(newTodoText.value)
    newTodoText.value = ''
  }
}

function handleToggleTodo(id: number) {
  toggleTodo(id)
}

function handleDeleteTodo(id: number) {
  deleteTodo(id)
}

function handleClearCompleted() {
  clearCompleted()
}

function handleToggleAll() {
  toggleAll()
}

function undo() {
  const previousState = undoHistory()
  if (previousState) {
    todos.value = previousState
  }
}

function redo() {
  const nextState = redoHistory()
  if (nextState) {
    todos.value = nextState
  }
}
</script>

<template>
  <div class="todo-app">
    <header>
      <h1>Todo App</h1>
      <div class="stats">
        <span>{{ activeCount }} active</span>
        <span>{{ completedCount }} completed</span>
      </div>
    </header>
    
    <div class="controls">
      <input 
        v-model="newTodoText"
        @keyup.enter="handleAddTodo"
        placeholder="What needs to be done?"
      />
      <button @click="handleAddTodo">Add</button>
    </div>
    
    <div class="actions">
      <button @click="handleToggleAll">Toggle All</button>
      <button @click="handleClearCompleted" :disabled="completedCount === 0">
        Clear Completed
      </button>
      <button @click="undo" :disabled="!canUndo">Undo</button>
      <button @click="redo" :disabled="!canRedo">Redo</button>
    </div>
    
    <div class="filters">
      <button 
        @click="filter = 'all'"
        :class="{ active: filter === 'all' }"
      >
        All
      </button>
      <button 
        @click="filter = 'active'"
        :class="{ active: filter === 'active' }"
      >
        Active
      </button>
      <button 
        @click="filter = 'completed'"
        :class="{ active: filter === 'completed' }"
      >
        Completed
      </button>
    </div>
    
    <ul class="todo-list">
      <li 
        v-for="todo in filteredTodos" 
        :key="todo.id"
        :class="{ completed: todo.completed }"
      >
        <input 
          type="checkbox" 
          :checked="todo.completed"
          @change="handleToggleTodo(todo.id)"
        />
        <span>{{ todo.text }}</span>
        <button @click="handleDeleteTodo(todo.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>
```

## Testing Checklist

- [ ] Add new todos
- [ ] Toggle individual todo completion
- [ ] Delete todos
- [ ] Toggle all todos at once
- [ ] Clear completed todos
- [ ] Filter by all/active/completed
- [ ] Undo/redo actions
- [ ] Refresh page - todos persist
- [ ] Clear localStorage - starts fresh
- [ ] Stats update correctly

## Key Learnings

1. **Code Organization**: Composition API allows grouping related logic together, making it easier to understand and maintain.

2. **Reusability**: Extracting composables (`useTodos`, `useLocalStorage`, `useUndoRedo`) makes the logic reusable across different components.

3. **`<script setup>` Benefits**: Less boilerplate, better TypeScript inference, cleaner code.

4. **No `this` Required**: Direct access to variables and functions without `this`.

5. **Flexible Composition**: Composables can use other composables, creating powerful abstractions.

6. **TypeScript Support**: Better type inference with Composition API compared to Options API.

7. **Easier Testing**: Pure functions (composables) are easier to test than component options.

> ⚠️ **CRITICAL**: When refactoring from Options API to Composition API, refactor incrementally. Start with one component, test thoroughly, then move to the next.
