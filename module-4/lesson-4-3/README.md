# Lesson 4.3: Route Parameters & Query Strings

**Module 4: Routing & Navigation** | Lesson 3 of 4

---

## 📋 Lesson Overview

**Duration**: 50-65 minutes  
**Difficulty**: Intermediate  
**Prerequisites**: Lessons 4.1-4.2

### Learning Objectives

- ✅ Work with dynamic route parameters
- ✅ Handle query strings and hash fragments
- ✅ Implement route params validation
- ✅ Pass data between routes
- ✅ Build pagination with query params
- ✅ Create search/filter interfaces

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

### Dynamic Params

```ts
// Route
{ path: '/users/:id', component: User, props: true }

// Access
const route = useRoute()
const userId = computed(() => route.params.id)

// Navigate
router.push({ name: 'user', params: { id: 123 } })
```

### Query Strings

```ts
// Navigate
router.push({ path: '/search', query: { q: 'vue', page: 1 } })

// Access
const searchQuery = computed(() => route.query.q)
const currentPage = computed(() => Number(route.query.page) || 1)
```

---

**Master data passing in routes! 📦**
