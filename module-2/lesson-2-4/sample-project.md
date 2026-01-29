# Sample Project — Flexible Card & List Components with Slots

Purpose: Build reusable Card and List components that demonstrate named slots, scoped slots, and slot composition.

## Requirements

Build two primary components:

1. **Card Component**: Flexible card with header, body, and footer slots
2. **List Component**: Data-driven list with scoped slots for custom item rendering
3. **Bonus**: Build a complete user management UI using both components

## File Layout

```
src/
  components/
    Card.vue           # Card component with named slots
    List.vue           # List component with scoped slots
    UserCard.vue       # Example: User profile card
    UserList.vue       # Example: User list with custom items
  App.vue
```

## Part 1: Card Component

### Requirements
- Named slots: `header`, `default` (body), `footer`
- Conditional rendering (don't show empty sections)
- Optional `variant` prop (default, primary, success, danger)
- Responsive padding and styling

### Implementation

```ts
// src/components/Card.vue
<script setup lang="ts">
import { useSlots } from 'vue'

defineProps<{
  variant?: 'default' | 'primary' | 'success' | 'danger'
}>()

const slots = useSlots()
</script>

<template>
  <div :class="['card', `card--${variant || 'default'}`]">
    <div v-if="slots.header" class="card__header">
      <slot name="header"></slot>
    </div>
    
    <div class="card__body">
      <slot></slot>
    </div>
    
    <div v-if="slots.footer" class="card__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card--default {
  border: 1px solid #ddd;
}

.card--primary {
  border: 2px solid #007bff;
}

.card--success {
  border: 2px solid #28a745;
}

.card--danger {
  border: 2px solid #dc3545;
}

.card__header {
  padding: 1rem;
  background: #f8f9fa;
  border-bottom: 1px solid #ddd;
  font-weight: 600;
}

.card__body {
  padding: 1rem;
}

.card__footer {
  padding: 1rem;
  background: #f8f9fa;
  border-top: 1px solid #ddd;
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}
</style>
```

## Part 2: List Component

### Requirements
- Accept `items` prop (array of any type)
- Scoped slot providing `item` and `index`
- Optional `empty` slot for when list is empty
- Optional `loading` slot
- Keyboard navigation support

### Implementation

```ts
// src/components/List.vue
<script setup lang="ts">
import { useSlots } from 'vue'

defineProps<{
  items: any[]
  loading?: boolean
}>()

const slots = useSlots()
</script>

<template>
  <div class="list">
    <div v-if="loading && slots.loading" class="list__loading">
      <slot name="loading"></slot>
    </div>
    
    <div v-else-if="items.length === 0 && slots.empty" class="list__empty">
      <slot name="empty"></slot>
    </div>
    
    <div v-else class="list__items">
      <div
        v-for="(item, index) in items"
        :key="item.id || index"
        class="list__item"
      >
        <slot :item="item" :index="index"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list {
  width: 100%;
}

.list__items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.list__item {
  transition: transform 0.2s;
}

.list__item:hover {
  transform: translateX(4px);
}

.list__loading,
.list__empty {
  padding: 2rem;
  text-align: center;
  color: #6c757d;
}
</style>
```

## Part 3: User Management Example

### UserCard Component

```ts
// src/components/UserCard.vue
<script setup lang="ts">
import Card from './Card.vue'

interface User {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
}

defineProps<{
  user: User
}>()

const emit = defineEmits<{
  edit: [user: User]
  delete: [user: User]
}>()
</script>

<template>
  <Card :variant="user.status === 'active' ? 'success' : 'default'">
    <template #header>
      <div class="user-header">
        <h3>{{ user.name }}</h3>
        <span :class="`badge badge--${user.status}`">
          {{ user.status }}
        </span>
      </div>
    </template>
    
    <template #default>
      <div class="user-info">
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Role:</strong> {{ user.role }}</p>
      </div>
    </template>
    
    <template #footer>
      <button @click="emit('edit', user)">Edit</button>
      <button @click="emit('delete', user)" class="btn-danger">Delete</button>
    </template>
  </Card>
</template>

<style scoped>
.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-header h3 {
  margin: 0;
}

.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
}

.badge--active {
  background: #28a745;
  color: white;
}

.badge--inactive {
  background: #6c757d;
  color: white;
}

.user-info p {
  margin: 0.5rem 0;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #007bff;
  color: white;
}

.btn-danger {
  background: #dc3545;
}
</style>
```

### App.vue - Complete Example

```ts
// src/App.vue
<script setup lang="ts">
import { ref } from 'vue'
import Card from './components/Card.vue'
import List from './components/List.vue'
import UserCard from './components/UserCard.vue'

interface User {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
}

const users = ref<User[]>([
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'inactive' }
])

const loading = ref(false)

const handleEdit = (user: User) => {
  console.log('Edit user:', user)
}

const handleDelete = (user: User) => {
  users.value = users.value.filter(u => u.id !== user.id)
}
</script>

<template>
  <div class="app">
    <Card variant="primary">
      <template #header>
        <h1>User Management</h1>
      </template>
      
      <template #default>
        <List :items="users" :loading="loading">
          <template #loading>
            <p>Loading users...</p>
          </template>
          
          <template #empty>
            <p>No users found.</p>
          </template>
          
          <template #default="{ item: user }">
            <UserCard
              :user="user"
              @edit="handleEdit"
              @delete="handleDelete"
            />
          </template>
        </List>
      </template>
      
      <template #footer>
        <button>Add New User</button>
      </template>
    </Card>
  </div>
</template>

<style>
.app {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: #007bff;
  color: white;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}
</style>
```

## Validation Criteria

### Card Component (30 points)
- ✅ Named slots work correctly (header, body, footer) (10 pts)
- ✅ Conditional rendering (slots only render when provided) (5 pts)
- ✅ Variant prop styling works (5 pts)
- ✅ Clean, accessible markup (5 pts)
- ✅ Proper use of `useSlots()` (5 pts)

### List Component (30 points)
- ✅ Scoped slots provide item and index (10 pts)
- ✅ Empty state slot works (5 pts)
- ✅ Loading state slot works (5 pts)
- ✅ Proper key binding for items (5 pts)
- ✅ Clean styling and animations (5 pts)

### Integration (40 points)
- ✅ Components work together seamlessly (10 pts)
- ✅ User management UI is functional (10 pts)
- ✅ Edit and delete actions work (10 pts)
- ✅ Responsive and accessible (10 pts)

## Extension Ideas

After completing the basic project:

1. **Add sorting**: Allow sorting list items by different fields
2. **Add filtering**: Filter list items based on criteria
3. **Add pagination**: Paginate long lists
4. **Add transitions**: Animate list item additions/removals
5. **Add drag-and-drop**: Reorder list items
6. **Add bulk actions**: Select multiple items for bulk operations

## Summary

This project demonstrates:
- Named slots for flexible component structure
- Scoped slots for custom rendering
- Slot composition for complex UIs
- Conditional slot rendering
- Real-world component patterns

Complete this project to master slots before moving to the exercises!
