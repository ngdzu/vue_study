# Sample Project: Complete Todo App Integration Tests

## Overview

Create comprehensive integration tests for a complete Todo application with multiple components, store state management, and API integration.

## Project Structure

```
src/
  components/
    TodoForm.vue
    TodoItem.vue
    TodoList.vue
  stores/
    todoStore.ts
  TodoApp.vue
  tests/
    TodoApp.integration.test.ts
```

## Components to Test

### TodoApp.vue (Main Component)
- Renders TodoForm and TodoList
- Manages overall app state

### TodoForm.vue (Form Component)
- Input for new todo
- Submit button
- Emits `add-todo` event

### TodoList.vue (List Component)
- Displays list of todos
- Handles delete and toggle complete
- Shows empty state

### TodoItem.vue (Item Component)
- Checkbox to mark complete
- Delete button
- Displays todo text

## Store (Pinia)

```ts
// stores/todoStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<Todo[]>([]);
  let nextId = 1;

  const addTodo = (text: string) => {
    todos.value.push({
      id: nextId++,
      text,
      completed: false
    });
  };

  const removeTodo = (id: number) => {
    todos.value = todos.value.filter(t => t.id !== id);
  };

  const toggleTodo = (id: number) => {
    const todo = todos.value.find(t => t.id === id);
    if (todo) todo.completed = !todo.completed;
  };

  const completedCount = computed(() =>
    todos.value.filter(t => t.completed).length
  );

  return { todos, addTodo, removeTodo, toggleTodo, completedCount };
});
```

## Test Requirements

Write integration tests covering:

### 1. Component Rendering
- ✅ TodoApp renders all child components
- ✅ TodoList displays empty state initially
- ✅ TodoForm input is focused and ready

### 2. Adding Todos
- ✅ User types in input and submits form
- ✅ Todo appears in list
- ✅ Input clears after submission
- ✅ Store state updates

### 3. Completing Todos
- ✅ User clicks checkbox on todo
- ✅ Todo shows completed styling
- ✅ Completed count updates in header
- ✅ Store marks todo as completed

### 4. Deleting Todos
- ✅ User clicks delete button on todo
- ✅ Todo disappears from list
- ✅ Store state updates

### 5. Complex Workflows
- ✅ Add multiple todos
- ✅ Complete some todos
- ✅ Delete a todo
- ✅ Verify counts and display

### 6. Store Integration
- ✅ Todos persist in store
- ✅ Multiple components see same store state
- ✅ Store calculations (completed count) update correctly

## Test Example

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import TodoApp from './TodoApp.vue';

describe('Todo App Integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should add and display todo items', async () => {
    const wrapper = mount(TodoApp, {
      global: { plugins: [createPinia()] }
    });

    // Initial state
    expect(wrapper.text()).toContain('No todos');

    // Add first todo
    const input = wrapper.find('input[placeholder="Add a todo..."]');
    await input.setValue('Buy groceries');
    await wrapper.find('button.add-btn').trigger('click');

    // Verify display
    expect(wrapper.text()).toContain('Buy groceries');
    expect(wrapper.text()).not.toContain('No todos');

    // Add second todo
    await input.setValue('Call mom');
    await wrapper.find('button.add-btn').trigger('click');

    // Verify both display
    expect(wrapper.findAll('.todo-item')).toHaveLength(2);
  });

  it('should complete and delete todos', async () => {
    const wrapper = mount(TodoApp, {
      global: { plugins: [createPinia()] }
    });

    // Add todo
    await wrapper.find('input').setValue('Task 1');
    await wrapper.find('button.add-btn').trigger('click');

    // Complete it
    await wrapper.find('input[type="checkbox"]').trigger('change');
    expect(wrapper.find('.todo-item').classes()).toContain('completed');

    // Delete it
    await wrapper.find('button.delete-btn').trigger('click');
    expect(wrapper.find('.todo-item').exists()).toBe(false);
  });
});
```

## Grading Criteria

✅ All tests pass  
✅ All user workflows are tested  
✅ Store integration is verified  
✅ Multiple components work together  
✅ Complex scenarios covered (add, complete, delete)  
✅ Tests use real Pinia store  
✅ Tests focus on user behavior

## Bonus Challenges

1. Add filter functionality (All/Active/Completed)
2. Add persistence (localStorage)
3. Add API integration (fetch todos from backend)
4. Add animations and verify they work in tests
