# Exercises: Navigation Guards & Route Protection

**Module 4, Lesson 4.2** | 5 Exercises | 130 Points

---

## Exercise 1: Basic Auth Guard (20 points)

### Requirements
1. Create global `beforeEach` guard
2. Check if route requires auth (`meta.requiresAuth`)
3. Redirect to login if not authenticated
4. Save intended destination in query param

### Grading
- Global guard implemented (5)
- Meta check works (5)
- Redirect to login (5)
- Query param saved (3)
- Authentication state management (2)

---

## Exercise 2: Role-Based Access (25 points)

### Requirements
1. Add `meta.role` to admin routes
2. Create role check in global guard
3. Redirect to forbidden page if wrong role
4. Support multiple roles per route
5. Test with admin and user accounts

### Grading
- Role meta defined (4)
- Role check logic (6)
- Forbidden redirect (4)
- Multiple roles support (5)
- Testing complete (4)
- Error handling (2)

---

## Exercise 3: Unsaved Changes Warning (30 points)

### Requirements
1. Create form component with data
2. Track dirty state (form modified)
3. Implement `onBeforeRouteLeave` guard
4. Show confirmation dialog if unsaved changes
5. Allow navigation if user confirms
6. Reset dirty state on save

### Grading
- Form tracks dirty state (6)
- Route leave guard implemented (8)
- Confirmation dialog works (6)
- Navigation allowed on confirm (4)
- Save resets dirty state (4)
- Edge cases handled (2)

---

## Exercise 4: Per-Route Guards (30 points)

### Requirements
1. Create reusable guard functions
2. Use `beforeEnter` on specific routes
3. Implement multiple guards on single route
4. Create admin-only guard
5. Create permission-based guard

### Grading
- Reusable guard functions (6)
- `beforeEnter` implemented (6)
- Multiple guards work (6)
- Admin guard correct (6)
- Permission guard correct (4)
- Code organization (2)

---

## Exercise 5: Complete Auth System (25 points)

### Requirements
1. Login/logout functionality
2. Auth state in Pinia
3. Protected routes
4. Guest-only routes (login/register)
5. Redirect after login
6. Page title updates
7. Loading state during auth check

### Grading
- Login/logout works (5)
- Pinia store correct (5)
- Protected routes work (4)
- Guest routes redirect (3)
- Post-login redirect (3)
- Page titles update (3)
- Loading state (2)

---

**Total**: 130 points | **Pass**: 104 points (80%)

---

**Complete all exercises to master navigation guards! 🔒**
