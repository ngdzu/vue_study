# Sample Project — Dynamic Todo List UI

Purpose: Demonstrate conditional rendering, list rendering, key management, filtering, and empty/loading states in a practical todo list application.

## Requirements

Build a todo list application with the following features:

- **Add todos**: Input field to add new todo items
- **Toggle completion**: Click checkbox to mark todos as done/undone
- **Delete todos**: Remove individual todo items
- **Filter todos**: Show all, active, or completed todos
- **Empty state**: Show message when no todos exist
- **Active count**: Display count of remaining active todos
- **Clear completed**: Remove all completed todos at once
- **Proper keys**: Use unique keys for efficient DOM updates
- **Conditional rendering**: Show/hide elements based on state

## Suggested File Layout

```
src/
  components/
    TodoList.vue         # Main todo list component
    TodoItem.vue         # Individual todo item component (optional)
    TodoFilters.vue      # Filter buttons component (optional)
  App.vue
```

## Implementation Steps

### 1. Setup State and Types

```ts
import { ref, computed } from 'vue'

interface Todo {
  id: number
  text: string
  done: boolean
  createdAt: number
}

const todos = ref<Todo[]>([])
const newTodoText = ref('')
const filter = ref<'all' | 'active' | 'completed'>('all')
let nextId = 1 // Simple ID generator
```

### 2. Computed Properties

```ts
// Filtered todos based on current filter
const filteredTodos = computed(() => {
  switch (filter.value) {
    case 'active':
      return todos.value.filter(todo => !todo.done)
    case 'completed':
      return todos.value.filter(todo => todo.done)
    default:
      return todos.value
  }
})

// Count of active (incomplete) todos
const activeCount = computed(() => {
  return todos.value.filter(todo => !todo.done).length
})

// Check if there are any completed todos
const hasCompletedTodos = computed(() => {
  return todos.value.some(todo => todo.done)
})

// Check if there are any todos at all
const hasTodos = computed(() => {
  return todos.value.length > 0
})
```

### 3. Methods

```ts
function addTodo() {
  const text = newTodoText.value.trim()
  if (!text) return
  
  todos.value.push({
    id: nextId++,
    text,
    done: false,
    createdAt: Date.now()
  })
  
  newTodoText.value = '' // Clear input
}

function removeTodo(id: number) {
  const index = todos.value.findIndex(todo => todo.id === id)
  if (index !== -1) {
    todos.value.splice(index, 1)
  }
}

function toggleTodo(id: number) {
  const todo = todos.value.find(todo => todo.id === id)
  if (todo) {
    todo.done = !todo.done
  }
}

function clearCompleted() {
  todos.value = todos.value.filter(todo => !todo.done)
}
```

### 4. Template Structure

```vue
<template>
  <div class="todo-app">
    <h1>Todo List</h1>
    
    <!-- Add todo form -->
    <form @submit.prevent="addTodo">
      <input
        v-model="newTodoText"
        type="text"
        placeholder="What needs to be done?"
        class="new-todo"
      />
      <button type="submit">Add</button>
    </form>
    
    <!-- Empty state: Show when no todos exist -->
    <div v-if="!hasTodos" class="empty-state">
      <p>No todos yet. Add one to get started! 📝</p>
    </div>
    
    <!-- Todo list: Show when todos exist -->
    <div v-else class="todo-section">
      <!-- Filter buttons -->
      <div class="filters">
        <button
          @click="filter = 'all'"
          :class="{ active: filter === 'all' }"
        >
          All ({{ todos.length }})
        </button>
        <button
          @click="filter = 'active'"
          :class="{ active: filter === 'active' }"
        >
          Active ({{ activeCount }})
        </button>
        <button
          @click="filter = 'completed'"
          :class="{ active: filter === 'completed' }"
        >
          Completed ({{ todos.length - activeCount }})
        </button>
      </div>
      
      <!-- Todo list -->
      <ul class="todo-list">
        <li
          v-for="todo in filteredTodos"
          :key="todo.id"
          :class="{ completed: todo.done }"
        >
          <input
            type="checkbox"
            :checked="todo.done"
            @change="toggleTodo(todo.id)"
          />
          <span class="todo-text">{{ todo.text }}</span>
          <button @click="removeTodo(todo.id)" class="delete-btn">
            ✕
          </button>
        </li>
      </ul>
      
      <!-- Empty filtered state -->
      <p v-if="filteredTodos.length === 0" class="no-results">
        No {{ filter }} todos
      </p>
      
      <!-- Footer with clear completed button -->
      <div class="footer">
        <span class="count">
          {{ activeCount }} {{ activeCount === 1 ? 'item' : 'items' }} left
        </span>
        <button
          v-if="hasCompletedTodos"
          @click="clearCompleted"
          class="clear-completed"
        >
          Clear completed
        </button>
      </div>
    </div>
  </div>
</template>
```

### 5. Styling (Scoped CSS)

```vue
<style scoped>
.todo-app {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  font-family: system-ui, sans-serif;
}

h1 {
  text-align: center;
  color: #333;
}

/* Add todo form */
form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.new-todo {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.new-todo:focus {
  outline: none;
  border-color: #4CAF50;
}

button {
  padding: 0.75rem 1.5rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

button:hover {
  background: #45a049;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #999;
  font-size: 1.1rem;
}

/* Filters */
.filters {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.filters button {
  flex: 1;
  background: #f0f0f0;
  color: #333;
}

.filters button.active {
  background: #4CAF50;
  color: white;
}

/* Todo list */
.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.todo-list li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  transition: background 0.2s;
}

.todo-list li:hover {
  background: #f9f9f9;
}

.todo-list li.completed .todo-text {
  text-decoration: line-through;
  color: #999;
}

.todo-text {
  flex: 1;
  font-size: 1rem;
}

.delete-btn {
  padding: 0.25rem 0.5rem;
  background: #f44336;
  color: white;
  font-size: 0.875rem;
}

.delete-btn:hover {
  background: #d32f2f;
}

/* No results message */
.no-results {
  text-align: center;
  padding: 2rem;
  color: #999;
  font-style: italic;
}

/* Footer */
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-top: 1px solid #eee;
  margin-top: 1rem;
}

.count {
  color: #666;
  font-size: 0.9rem;
}

.clear-completed {
  padding: 0.5rem 1rem;
  background: #f44336;
  font-size: 0.875rem;
}
</style>
```

## Enhancement Ideas

Once the basic version works, try adding:

1. **Persistence**: Save todos to `localStorage` and restore on page load
2. **Edit mode**: Double-click a todo to edit its text
3. **Due dates**: Add optional due dates and show overdue items
4. **Priority levels**: Add high/medium/low priority indicators
5. **Bulk actions**: Select multiple todos and delete/complete at once
6. **Search**: Add a search input to filter by text content
7. **Animations**: Add transitions when todos are added/removed
8. **Keyboard shortcuts**: Press Enter to add, Escape to cancel edit
9. **Undo/Redo**: Implement undo functionality for deletions
10. **Categories/Tags**: Organize todos by category

## Validation Checklist

Before considering the project complete, verify:

- [ ] Todos can be added via form submission (Enter key works)
- [ ] Todos can be toggled between done/undone
- [ ] Todos can be deleted individually
- [ ] Filter buttons work correctly (all/active/completed)
- [ ] Active count updates correctly
- [ ] "Clear completed" button appears only when there are completed todos
- [ ] "Clear completed" removes all completed todos
- [ ] Empty state shows when no todos exist
- [ ] "No [filter] todos" message shows when filter returns empty
- [ ] Each todo has a unique `:key` (check with Vue DevTools)
- [ ] No console warnings about missing keys
- [ ] Input field clears after adding a todo
- [ ] Empty/whitespace-only todos are rejected
- [ ] UI updates immediately when todos change (reactivity works)
- [ ] Completed todos have strikethrough styling

## Debugging Tips

### If todos don't appear:
- Check `filteredTodos` in Vue DevTools
- Verify `:key="todo.id"` is set correctly
- Console.log the `todos` array to see if items are being added

### If filtering doesn't work:
- Check that `filter` ref is updating (click handler works)
- Verify computed property logic with console.log
- Make sure filter buttons have correct `@click` handlers

### If reactivity doesn't work:
- Ensure you're mutating `.value` for refs
- Don't reassign refs directly: use `todos.value = [...]` not `todos = [...]`
- Check that you're not destructuring reactive objects

### If keys are wrong:
- Open Vue DevTools → Components
- Select a todo item
- Check the key in the component details
- Verify `nextId` increments correctly

## Testing Scenarios

Test these user flows:

1. **Add first todo** → Empty state disappears, todo appears
2. **Add multiple todos** → All appear in order
3. **Toggle todo** → Strikethrough applies, active count updates
4. **Delete todo** → Todo removed, counts update
5. **Filter to "Active"** → Only incomplete todos show
6. **Filter to "Completed"** → Only complete todos show
7. **Complete all todos** → "Clear completed" button appears
8. **Clear completed** → All completed todos removed
9. **Filter with no results** → "No [filter] todos" message shows
10. **Submit empty input** → Nothing happens (validation works)

## Expected Output

A fully functional todo list that:
- Manages state with `ref()` and `reactive()`
- Uses `computed()` for derived state
- Implements `v-for` with proper `:key` attributes
- Uses `v-if` and `v-show` appropriately
- Handles empty and filtered-empty states
- Provides immediate visual feedback for all actions
- Has clean, organized code structure

This project demonstrates real-world usage of conditional and list rendering patterns you'll use in every Vue application.
