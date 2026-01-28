# Personal Dashboard - Module 1 Capstone Project

A comprehensive Vue 3 personal dashboard demonstrating all core concepts from Module 1 of the Vue 3 Professional Development Course.

## Features

### ✅ Implemented
- **Dashboard Header** - Live time display and greeting based on time of day
- **User Profile** - User information display with edit modal
- **Tasks Widget** - Full task management with filtering, priority levels, and status tracking
- **Weather Widget** - Mock weather display with 5-day forecast
- **Quick Stats** - Real-time task statistics and completion tracking
- **Notifications** - Notification system with dismissal and clearing
- **Settings Panel** - Application settings for theme, language, and preferences
- **Dark Mode** - Toggle between light and dark themes
- **Responsive Design** - Works on desktop and tablet

## Module 1 Concepts Demonstrated

✅ **Lesson 1.1**: Vue 3 Setup & Project Structure  
✅ **Lesson 1.2**: Reactive Data & Data Binding  
✅ **Lesson 1.3**: Conditional Rendering & List Rendering  
✅ **Lesson 1.4**: Methods, Computed, & Watchers  
✅ **Lesson 1.5**: Component Basics & Props  
✅ **Lesson 1.6**: Events & Emits

## Project Structure

```
src/
├── components/           # Vue components
│   ├── DashboardHeader.vue
│   ├── UserProfile.vue
│   ├── TasksWidget.vue
│   ├── WeatherWidget.vue
│   ├── QuickStats.vue
│   ├── NotificationsWidget.vue
│   └── SettingsPanel.vue
├── composables/          # Reusable logic
│   ├── useTime.ts
│   ├── useTasks.ts
│   ├── useNotifications.ts
│   └── useSettings.ts
├── types/               # TypeScript definitions
│   └── index.ts
├── App.vue
├── main.ts
└── style.css
```

## Getting Started

### Prerequisites
- Node.js 16+ (recommend 18 LTS)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The application will open automatically at `http://localhost:5173`

## How to Use

### Tasks Management
1. Click "Add Task" to create new tasks
2. Filter by status (all, pending, in-progress, completed)
3. Check the checkbox to mark as complete
4. Click 🗑️ to delete a task

### Profile Editing
1. Click "Edit Profile" in the User Profile section
2. Update name and email
3. Click "Save" to apply changes

### Settings
1. Click "Show Settings" at the bottom
2. Adjust theme, language, temperature unit
3. Toggle notifications on/off

### Dark Mode
1. Click the moon icon 🌙 in the header to toggle dark/light mode

## Code Examples

### Using Composables
```typescript
import { useTasks } from './composables/useTasks'

const { tasks, filteredTasks, addTask, deleteTask } = useTasks()
```

### Props with TypeScript
```typescript
const props = defineProps<{
  unit?: 'C' | 'F'
}>()
```

### Events and v-model
```typescript
const emit = defineEmits<{
  (e: 'toggleTheme'): void
}>()
```

### Computed Properties
```typescript
const formattedTime = computed(() => {
  return currentTime.value.toLocaleTimeString()
})
```

## Bonus Features

- Real-time task statistics
- Color-coded task priorities (high/medium/low)
- Responsive grid layout
- Smooth animations and transitions
- Type-safe TypeScript throughout
- Clean, professional styling

## Assessment

This project demonstrates mastery of:
- Component composition and reusability
- Reactive data management
- Event handling and communication
- TypeScript integration
- Professional UI/UX design
- Code organization and structure

## Troubleshooting

**Q: Styles not appearing correctly?**  
A: Ensure `style.css` is imported in `main.ts`

**Q: Tasks not persisting?**  
A: This is intentional - refresh clears state. Add localStorage in bonus challenge.

**Q: Dark mode not working?**  
A: The body class is set in App.vue. Check browser dev tools.

## Next Steps

1. Add localStorage persistence for tasks and settings
2. Implement drag-and-drop for task reordering
3. Add task search functionality
4. Create recurring task support
5. Add task categories or tags
6. Export tasks as JSON/CSV

## Resources

- [Vue 3 Official Documentation](https://vuejs.org)
- [Vite Documentation](https://vitejs.dev)
- [Module 1 Lessons](../README.md)

---

**Congratulations on completing Module 1! 🎉**
