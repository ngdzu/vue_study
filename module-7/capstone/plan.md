# Module 7 Capstone Project Plan

## Project Overview

**Task Management & Time Tracking App** - A practical productivity app that demonstrates professional testing practices.

This project demonstrates mastery of:
- Unit testing (Vitest) - Utilities, composables, store
- Component testing (@vue/test-utils) - All 8 components
- Integration testing - Multi-component workflows and store integration
- E2E testing (Cypress) - Complete user journeys
- Performance testing (Lighthouse) - Baseline and optimization
- Snapshot testing - Component visual regression

### Features

- ✅ Create, edit, delete, and complete tasks
- ✅ Organize tasks by category/project
- ✅ Built-in time tracking with play/pause/stop controls
- ✅ Filter tasks by status (All, Active, Completed, By Category)
- ✅ Task duration estimation and actual time tracking
- ✅ Local storage persistence
- ✅ Simulated API for saving/loading tasks
- ✅ Real-time statistics (tasks completed, total time logged)
- ✅ Form validation and error handling

### Tech Stack

- **Framework**: Vue 3 + Composition API
- **Build**: Vite
- **State**: Pinia
- **Testing**: Vitest + @vue/test-utils + Cypress
- **Styling**: Scoped CSS (Tailwind-ready)

## Timeline

**Phase 1: Setup (20 minutes)**
- [ ] Initialize Vitest
- [ ] Configure @vue/test-utils
- [ ] Setup Cypress
- [ ] Prepare test directory structure

**Phase 2: Unit Tests (45 minutes)**
- [ ] Write utility function tests
- [ ] Test composables
- [ ] Test pure functions
- [ ] Achieve 80%+ coverage

**Phase 3: Component Tests (40 minutes)**
- [ ] Test component rendering
- [ ] Test props and events
- [ ] Test conditional rendering
- [ ] Test slots

**Phase 4: Integration Tests (40 minutes)**
- [ ] Test multi-component workflows
- [ ] Test Pinia store integration
- [ ] Mock API calls
- [ ] Test loading/error states

**Phase 5: E2E Tests (35 minutes)**
- [ ] Write user workflow tests
- [ ] Test form submissions
- [ ] Test navigation
- [Project Structure

```
src/
  components/
    TaskForm.vue              # Add/edit task form
    TaskList.vue             # Display list of tasks
    TaskItem.vue             # Individual task display
    TaskStats.vue            # Statistics panel
    TimerControl.vue         # Time tracking controls
    CategoryFilter.vue       # Filter by category
    TaskDetailModal.vue      # Task detail view
    EmptyState.vue          # Empty state display
  stores/
    taskStore.ts            # Pinia store for tasks
  composables/
    useTaskAPI.ts           # API integration composable
    useTimer.ts             # Timer management
    useValidation.ts        # Form validation
  utils/
    taskHelpers.ts          # Task utility functions
    dateUtils.ts            # Date/time helpers
  tests/
    unit/
      utils/
        taskHelpers.test.ts
        dateUtils.test.ts
      composables/
        useTimer.test.ts
        useValidation.test.ts
      stores/
        taskStore.test.ts
    components/
      TaskForm.test.ts
      TaskItem.test.ts
      TaskList.test.ts
      TaskStats.test.ts
      TimerControl.test.ts
      CategoryFilter.test.ts
    integration/
      taskWorkflow.test.ts
      timerIntegration.test.ts
      filteringWorkflow.test.ts
    e2e/
      tasks.cy.ts
      timer.cy.ts
      filtering.cy.ts
    snapshots/
      components.snap
  __snapshots__/
  App.vue
  main.ts
public/
index.html
vite.config.ts
vitest.config.ts
cypress.config.ts
package.json
tsconfig.json

✅ Unit test coverage > 80%  
✅ Integration tests cover major workflows  
✅ E2E tests verify user journeys  
✅ Lighthouse score > 85  
✅ All tests pass locally and in CI  
✅ Documentation complete  

## Key Files to Create

```
capstone/
  README.md              # This file
  plan.md               # Detailed plan
  tests/
    unit/               # Unit tests
    integration/        # Integration tests
    e2e/               # E2E tests
  .github/
    workflows/
      tests.yml        # CI/CD configuration
  test-report.md       # Coverage and performance report
```

## Getting Started

1. Clone your Vue 3 application
2. Install testing dependencies
3. Create test directory structure
4. Start with Phase 1 setup
5. Follow phases sequentially
6. Document progress in test-report.md
7. Push to GitHub with CI/CD workflow

Good luck! 🚀
