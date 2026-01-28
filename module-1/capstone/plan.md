# Module 1 Capstone Project: Personal Dashboard

## Project Overview

Build a **Personal Dashboard** application that demonstrates all core Vue 3 Composition API concepts from Module 1. This is a practical, feature-rich application that integrates reactive data binding, conditional rendering, list rendering, component communication, events, and computed properties.

**Duration**: 3-4 hours  
**Difficulty**: Intermediate  

---

## Learning Objectives

By completing this project, you'll demonstrate mastery of:

✅ **Lesson 1.1**: Project structure, component registration, Vite setup  
✅ **Lesson 1.2**: Reactive data with `ref()` and `reactive()`, v-model binding  
✅ **Lesson 1.3**: Conditional rendering with v-if/v-show, list rendering with v-for  
✅ **Lesson 1.4**: Methods, computed properties, and watchers  
✅ **Lesson 1.5**: Component composition, prop passing, validation  
✅ **Lesson 1.6**: Custom events, event emission, v-model patterns  

---

## Project Requirements

### Core Features

#### 1. Dashboard Header
- Display current time (updates every second)
- Display greeting based on time of day (Good morning/afternoon/evening)
- Show current date
- Dark mode toggle button

#### 2. User Profile Section
- Display user name, email, role
- Show user avatar
- Edit user profile button (modal-based)
- Status indicator (Online/Offline/Away)

#### 3. Tasks Widget
- List of tasks with:
  - Title
  - Description
  - Priority (High/Medium/Low)
  - Status (Pending/In Progress/Completed)
  - Due date
- Add new task form
- Filter tasks by status
- Mark task as complete/incomplete
- Delete task
- Sort by priority or due date

#### 4. Weather Widget (Mock Data)
- Show temperature, condition, humidity, wind speed
- Display 5-day forecast
- Unit toggle (Celsius/Fahrenheit)

#### 5. Quick Stats Section
- Tasks completed today
- Tasks due soon
- Total tasks
- Completion percentage

#### 6. Notifications Widget
- Display recent notifications (max 5)
- Types: task_complete, task_due, system
- Notification clear button
- Auto-dismiss option

#### 7. Settings Panel
- Theme selection (light/dark/auto)
- Language selection (English/Spanish/French)
- Notification preferences (toggle)
- Data export button

---

## Technical Specifications

### Architecture

```
src/
├── components/
│   ├── DashboardHeader.vue       # Header with time & greeting
│   ├── UserProfile.vue            # User info & profile section
│   ├── TasksWidget.vue            # Tasks list & management
│   ├── WeatherWidget.vue          # Weather display
│   ├── QuickStats.vue             # Stats overview
│   ├── NotificationsWidget.vue    # Notifications list
│   ├── SettingsPanel.vue          # Settings & preferences
│   ├── Modal.vue                  # Reusable modal
│   ├── TaskForm.vue               # Add/edit task form
│   └── EditProfileModal.vue       # Edit user profile modal
├── composables/
│   ├── useTime.ts                 # Time & greeting logic
│   ├── useTasks.ts                # Task management logic
│   ├── useNotifications.ts        # Notification logic
│   └── useSettings.ts             # Settings management
├── types/
│   └── index.ts                   # TypeScript interfaces
├── App.vue
├── main.ts
└── style.css
```

### Data Model

**User**
```ts
interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: 'admin' | 'user' | 'viewer'
  status: 'online' | 'offline' | 'away'
}
```

**Task**
```ts
interface Task {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in-progress' | 'completed'
  dueDate: string
  createdAt: string
}
```

**Notification**
```ts
interface Notification {
  id: string
  type: 'task_complete' | 'task_due' | 'system'
  message: string
  timestamp: string
  read: boolean
}
```

**Settings**
```ts
interface Settings {
  theme: 'light' | 'dark' | 'auto'
  language: 'en' | 'es' | 'fr'
  temperatureUnit: 'C' | 'F'
  notificationsEnabled: boolean
}
```

---

## Module 1 Concepts Demonstrated

### Lesson 1.1: Setup & Structure
- ✅ Vite project structure
- ✅ Component file organization
- ✅ Asset imports
- ✅ Module imports/exports

### Lesson 1.2: Reactive Data & Binding
- ✅ `ref()` for reactive values
- ✅ `reactive()` for objects
- ✅ `v-model` on form inputs
- ✅ Two-way data binding

### Lesson 1.3: Conditional & List Rendering
- ✅ `v-if` for conditional rendering
- ✅ `v-show` for visibility toggling
- ✅ `v-for` for list rendering
- ✅ `:key` for list reconciliation
- ✅ Filtering logic

### Lesson 1.4: Methods, Computed, Watchers
- ✅ Methods for event handlers
- ✅ Computed properties for derived state
- ✅ Watchers for side effects
- ✅ Performance optimization

### Lesson 1.5: Components & Props
- ✅ Component composition
- ✅ Props declaration with TypeScript
- ✅ Props validation
- ✅ Nested components

### Lesson 1.6: Events & Emits
- ✅ Custom event emission
- ✅ Event listening with `@`
- ✅ Event payloads
- ✅ v-model implementation

---

## Implementation Steps

### Phase 1: Setup (15 min)
1. Create Vite project structure
2. Install dependencies
3. Set up TypeScript configuration
4. Create type definitions

### Phase 2: Core Components (60 min)
1. Create Modal component (reusable)
2. Build DashboardHeader component
3. Build UserProfile component
4. Build TasksWidget component
5. Build WeatherWidget component

### Phase 3: Additional Features (45 min)
1. Build QuickStats component
2. Build NotificationsWidget component
3. Build SettingsPanel component
4. Create composables for state management

### Phase 4: Integration & Polish (30 min)
1. Integrate all components in App.vue
2. Add styling and layout
3. Implement dark mode
4. Add animations/transitions

---

## Acceptance Criteria

### Functionality
- [ ] Dashboard displays all sections correctly
- [ ] Time updates every second
- [ ] Tasks can be added, edited, deleted
- [ ] Tasks can be filtered by status
- [ ] Task completion toggles correctly
- [ ] Profile can be edited via modal
- [ ] Settings persist during session
- [ ] Notifications appear and clear
- [ ] Weather displays correctly
- [ ] Stats calculate accurately

### Code Quality
- [ ] All components use `<script setup lang="ts">`
- [ ] Props typed with TypeScript
- [ ] Events declared with `defineEmits`
- [ ] Computed properties used appropriately
- [ ] No direct prop mutations
- [ ] Proper component composition
- [ ] Reusable composables created
- [ ] Clean, readable code

### User Experience
- [ ] Responsive layout
- [ ] Smooth animations/transitions
- [ ] Clear visual feedback on interactions
- [ ] Dark mode toggle works
- [ ] All buttons and controls are accessible
- [ ] No console errors or warnings

---

## Bonus Features (Optional)

1. **Local Storage**: Persist tasks and settings between sessions
2. **Drag & Drop**: Reorder tasks by dragging
3. **Task Search**: Search tasks by title or description
4. **Task Categories**: Organize tasks by categories
5. **Recurring Tasks**: Support daily/weekly/monthly recurring tasks
6. **Analytics**: Show task completion trends
7. **Export**: Export tasks as JSON/CSV
8. **Keyboard Shortcuts**: Navigate with keyboard
9. **Avatar Upload**: Allow custom avatar upload
10. **Theme Customization**: Allow custom color themes

---

## Assessment Rubric

### Completeness (40 points)
- 40 pts: All required features implemented
- 30 pts: 80% of features implemented
- 20 pts: 60% of features implemented
- 10 pts: 40% of features implemented

### Code Quality (30 points)
- 30 pts: Excellent - Proper structure, TypeScript, best practices
- 25 pts: Good - Minor improvements needed
- 20 pts: Adequate - Some issues but functional
- 15 pts: Fair - Multiple issues but mostly works

### User Experience (20 points)
- 20 pts: Excellent - Responsive, smooth, intuitive
- 15 pts: Good - Minor UX issues
- 10 pts: Adequate - Some UX problems
- 5 pts: Fair - Multiple UX issues

### Module 1 Concepts (10 points)
- 10 pts: Demonstrates all 6 lessons effectively
- 8 pts: Demonstrates 5 lessons effectively
- 6 pts: Demonstrates 4 lessons effectively
- 4 pts: Demonstrates 3 lessons effectively

**Total**: 100 points

---

## Getting Started

### Prerequisites
- Node.js 16+ (recommend 18 LTS)
- npm or yarn
- VS Code with Volar extension

### Installation
```bash
# Navigate to project directory
cd module-1/capstone

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Project Structure
```
capstone/
├── src/
│   ├── components/
│   ├── composables/
│   ├── types/
│   ├── App.vue
│   ├── main.ts
│   └── style.css
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Expected Outcomes

After completing this capstone project, you should be able to:

✅ Set up and scaffold a Vue 3 project with Vite  
✅ Create reusable components with proper prop handling  
✅ Implement complex state management with composables  
✅ Build interactive features with event handling  
✅ Apply TypeScript for type safety in Vue  
✅ Create a polished, production-ready UI  
✅ Demonstrate mastery of all Module 1 concepts  

---

## Submission Checklist

Before submitting, verify:

- [ ] Project runs without errors: `npm run dev`
- [ ] All features work as specified
- [ ] Code is clean and well-organized
- [ ] TypeScript types are properly defined
- [ ] Components are properly documented
- [ ] No console errors or warnings
- [ ] Responsive design works on desktop
- [ ] Dark mode toggle works
- [ ] All tasks can be managed
- [ ] Profile can be edited
- [ ] Settings persist in session

---

## Resources

- [Vue 3 Documentation](https://vuejs.org)
- [Vite Documentation](https://vitejs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Module 1 Lessons](../README.md)

---

## Support

If you get stuck:

1. Review the relevant Module 1 lesson
2. Check the sample projects from each lesson
3. Consult the glossaries for concept definitions
4. Debug with Vue DevTools
5. Use browser console for error messages

---

**Good luck! 🚀**
