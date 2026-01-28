# Lesson 4.4: Advanced Routing Patterns

**Module 4: Routing & Navigation** | Lesson 4 of 4

---

## 📋 Lesson Overview

**Duration**: 50-65 minutes  
**Difficulty**: Advanced  
**Prerequisites**: Lessons 4.1-4.3

### Learning Objectives

- ✅ Implement lazy loading for code splitting
- ✅ Create route transitions and animations
- ✅ Use named views for complex layouts
- ✅ Build dynamic route generation
- ✅ Implement route history modes
- ✅ Optimize router performance

---

## 📚 Materials

- [📖 Lesson](lesson.md)
- [📘 Glossary](glossary.md)
- [💻 Sample Project](sample-project.md)
- [✏️ Exercises](exercises.md)
- [❓ Quiz](quiz.md)
- [✅ Answers](quiz-answers.md)

---

## ⚡ Quick Reference

### Lazy Loading

```ts
{
  path: '/admin',
  component: () => import('@/views/AdminView.vue')
}
```

### Route Transitions

```ts
<router-view v-slot="{ Component }">
  <transition name="fade">
    <component :is="Component" />
  </transition>
</router-view>
```

### Named Views

```ts
{
  path: '/dashboard',
  components: {
    default: Main,
    sidebar: Sidebar,
    header: Header
  }
}
```

---

**Optimize and enhance your routing! ⚡**
