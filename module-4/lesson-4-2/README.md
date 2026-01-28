# Lesson 4.2: Navigation Guards & Route Protection

**Module 4: Routing & Navigation** | Lesson 2 of 4

---

## 📋 Lesson Overview

**Duration**: 60-75 minutes  
**Difficulty**: Intermediate  
**Prerequisites**: Lesson 4.1 (Vue Router Setup & Basics)

### Learning Objectives

By the end of this lesson, you will be able to:

- ✅ Implement global navigation guards
- ✅ Use per-route guards for specific routes
- ✅ Create in-component guards
- ✅ Protect routes with authentication
- ✅ Implement role-based access control
- ✅ Handle navigation failures and redirects
- ✅ Use route meta for authorization

---

## 📚 Lesson Materials

### Core Content
- [📖 Lesson Content](lesson.md) - Complete guide to navigation guards
- [📘 Glossary](glossary.md) - Key terms and definitions

### Practice & Assessment
- [💻 Sample Project](sample-project.md) - Build a protected admin dashboard
- [✏️ Exercises](exercises.md) - Hands-on practice (5 exercises, 130 points)
- [❓ Quiz](quiz.md) - Knowledge check (30 questions)
- [✅ Quiz Answers](quiz-answers.md) - Detailed explanations

---

## 🎯 Key Concepts Covered

### 1. Global Guards
- `router.beforeEach()` - global before guards
- `router.beforeResolve()` - global resolve guards
- `router.afterEach()` - global after hooks

### 2. Per-Route Guards
- `beforeEnter` in route configuration
- Multiple guards execution order
- Route-specific logic

### 3. In-Component Guards
- `onBeforeRouteEnter()` composable
- `onBeforeRouteUpdate()` composable
- `onBeforeRouteLeave()` composable

### 4. Authentication Patterns
- Login/logout flows
- Token validation
- Redirect after login

### 5. Authorization
- Role-based access control
- Permission checking
- Route meta usage

---

## 🚀 Getting Started

### Recommended Study Path

1. **Read**: [Lesson Content](lesson.md) (35-45 min)
2. **Build**: [Sample Project](sample-project.md) (25-35 min)
3. **Practice**: [Exercises](exercises.md) (35-50 min)
4. **Test**: [Quiz](quiz.md) (15-20 min)
5. **Review**: [Quiz Answers](quiz-answers.md) + [Glossary](glossary.md)

---

## ⚡ Quick Reference

### Global Before Guard

```ts
router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return { name: 'login' }
  }
})
```

### Per-Route Guard

```ts
{
  path: '/admin',
  component: Admin,
  beforeEnter: (to, from) => {
    if (!hasAdminRole()) {
      return false  // Cancel navigation
    }
  }
}
```

### In-Component Guard

```ts
<script setup lang="ts">
import { onBeforeRouteLeave } from 'vue-router'

onBeforeRouteLeave((to, from) => {
  if (hasUnsavedChanges()) {
    return confirm('Discard unsaved changes?')
  }
})
</script>
```

---

## 💡 Tips for Success

1. **Understand Guard Order**: Global → Per-Route → In-Component
2. **Use Route Meta**: Store auth requirements in `meta`
3. **Return False to Cancel**: Prevents navigation
4. **Return Route Location**: Redirects to different route
5. **Async Guards**: Can return promises for async checks

---

## 📝 Next Steps

After completing this lesson:

1. ✅ Master all three types of guards
2. ✅ Understand guard execution order
3. ✅ Implement authentication flows
4. ➡️ Proceed to [Lesson 4.3: Route Parameters & Query Strings](../lesson-4-3/README.md)

---

**Secure your routes! 🔒**
