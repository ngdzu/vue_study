# Lesson 4.1: Vue Router Setup & Basics

**Module 4: Routing & Navigation** | Lesson 1 of 4

---

## 📋 Lesson Overview

**Duration**: 60-75 minutes  
**Difficulty**: Beginner  
**Prerequisites**: Module 1 (Vue Foundations)

### Learning Objectives

By the end of this lesson, you will be able to:

- ✅ Install and configure Vue Router in a Vue 3 project
- ✅ Define routes and create navigation between pages
- ✅ Use `<router-link>` and `<router-view>` components
- ✅ Implement programmatic navigation with `useRouter()`
- ✅ Understand route matching and priority
- ✅ Create nested routes for hierarchical page structures
- ✅ Pass data through route props

---

## 📚 Lesson Materials

### Core Content
- [📖 Lesson Content](lesson.md) - Complete guide to Vue Router setup and basics
- [📘 Glossary](glossary.md) - Key terms and definitions

### Practice & Assessment
- [💻 Sample Project](sample-project.md) - Build a multi-page blog application
- [✏️ Exercises](exercises.md) - Hands-on practice (5 exercises, 130 points)
- [❓ Quiz](quiz.md) - Knowledge check (30 questions)
- [✅ Quiz Answers](quiz-answers.md) - Detailed explanations

---

## 🎯 Key Concepts Covered

### 1. Router Installation & Configuration
- Installing vue-router package
- Creating router instance
- Defining routes array
- Integrating router with Vue app

### 2. Basic Navigation
- `<router-link>` for declarative navigation
- `<router-view>` for rendering matched components
- Active link classes
- Navigation styling

### 3. Programmatic Navigation
- `useRouter()` composable
- `router.push()` method
- `router.replace()` vs `router.push()`
- Navigation with params

### 4. Route Configuration
- Route path patterns
- Named routes
- Route components
- Route meta fields

### 5. Nested Routes
- Parent-child route relationships
- Nested `<router-view>` components
- Route hierarchy
- Layout patterns

---

## 🚀 Getting Started

### Recommended Study Path

1. **Read**: [Lesson Content](lesson.md) (30-40 min)
2. **Build**: [Sample Project](sample-project.md) (20-30 min)
3. **Practice**: [Exercises](exercises.md) (30-45 min)
4. **Test**: [Quiz](quiz.md) (10-15 min)
5. **Review**: [Quiz Answers](quiz-answers.md) + [Glossary](glossary.md)

### Prerequisites Check

Before starting, ensure you understand:
- ✅ Vue 3 component basics
- ✅ Composition API (`<script setup>`)
- ✅ Props and component communication
- ✅ Basic TypeScript syntax

---

## 📊 Assessment Criteria

| Component      | Points | Passing Score |
| -------------- | ------ | ------------- |
| Quiz           | 30     | 24/30 (80%)   |
| Exercises      | 130    | 104/130 (80%) |
| Sample Project | N/A    | Completion    |

**Total Available**: 160 points  
**Required to Pass**: 128 points (80%)

---

## 🔗 Additional Resources

### Official Documentation
- [Vue Router Official Docs](https://router.vuejs.org/)
- [Vue Router API Reference](https://router.vuejs.org/api/)
- [Migration from Vue Router 3](https://router.vuejs.org/guide/migration/)

### Helpful Guides
- [Vue Router Essentials](https://router.vuejs.org/guide/)
- [Router Configuration Options](https://router.vuejs.org/api/#router-options)

---

## ⚡ Quick Reference

### Basic Router Setup

```ts
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About }
  ]
})

export default router
```

### Using Router in App

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App)
  .use(router)
  .mount('#app')
```

---

## 💡 Tips for Success

1. **Understand the Basics**: Master simple navigation before nested routes
2. **Use DevTools**: Vue DevTools shows current route and navigation history
3. **Test Navigation**: Click all links to ensure routes work correctly
4. **Start Simple**: Begin with static routes, add dynamic ones later
5. **Use Named Routes**: Makes refactoring paths easier
6. **Check Active Links**: Verify active-class styling works as expected

---

## 🐛 Common Pitfalls

❌ **Forgetting to install router in main.ts**
```ts
// Wrong - router not installed
createApp(App).mount('#app')

// Correct
createApp(App).use(router).mount('#app')
```

❌ **Missing `<router-view>` in App.vue**
```ts
// Wrong - no outlet for routes
<template>
  <nav>...</nav>
</template>

// Correct
<template>
  <nav>...</nav>
  <router-view />
</template>
```

❌ **Using regular `<a>` tags instead of `<router-link>`**
```ts
// Wrong - causes full page reload
<a href="/about">About</a>

// Correct - SPA navigation
<router-link to="/about">About</router-link>
```

---

## 📝 Next Steps

After completing this lesson:

1. ✅ Review all materials and ensure 80%+ quiz score
2. ✅ Complete all exercises
3. ✅ Understand the difference between declarative and programmatic navigation
4. ➡️ Proceed to [Lesson 4.2: Navigation Guards & Route Protection](../lesson-4-2/README.md)

---

**Need Help?** Review the [Glossary](glossary.md) for term definitions, or revisit the [Lesson Content](lesson.md) for detailed explanations.
