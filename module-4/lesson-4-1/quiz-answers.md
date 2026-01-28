# Quiz Answers: Vue Router Setup & Basics

**Module 4, Lesson 4.1** | Answer Key with Explanations

---

## Section 1: Installation & Setup

### Question 1: Which command installs Vue Router 4 for a Vue 3 project?

**Answer: b) `npm install vue-router@4`**

**Explanation:**  
The `@4` specifies version 4, which is required for Vue 3. Without the version specifier, npm might install Vue Router 3 (for Vue 2) depending on your project configuration. Always specify the major version to ensure compatibility.

---

### Question 2: What function creates a router instance?

**Answer: c) `createRouter()`**

**Explanation:**  
`createRouter()` is the function from vue-router that creates a new router instance. It takes a configuration object with `history` and `routes` properties.

```ts
import { createRouter } from 'vue-router'

const router = createRouter({ history, routes })
```

---

### Question 3: Where should `app.use(router)` be called?

**Answer: c) Between `createApp()` and `app.mount()`**

**Explanation:**  
The router must be installed AFTER creating the app but BEFORE mounting it. This ensures the router is available to all components when the app initializes.

```ts
const app = createApp(App)
app.use(router)  // Install router here
app.mount('#app')
```

---

### Question 4: Which import provides HTML5 history mode?

**Answer: b) `createWebHistory`**

**Explanation:**  
`createWebHistory()` creates an HTML5 history mode instance that uses the browser's History API for clean URLs without hash symbols.

```ts
import { createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes
})
```

---

### Question 5: What component must be present in `App.vue` for routes to render?

**Answer: b) `<router-view>`**

**Explanation:**  
`<router-view>` is the component that renders the matched route component. Without it, routes won't display. It acts as a placeholder where route components appear.

```ts
<template>
  <nav>...</nav>
  <router-view />
</template>
```

---

### Question 6: What is the correct way to import `createRouter`?

**Answer: b) `import { createRouter } from 'vue-router'`**

**Explanation:**  
`createRouter` is a named export from vue-router, so it must be imported using destructuring syntax with curly braces.

---

## Section 2: Route Configuration

### Question 7: Which property is required in a route object?

**Answer: d) Both `path` and `component`**

**Explanation:**  
A valid route must have at least a `path` (URL pattern) and either a `component` or `redirect`. The `name` is optional but recommended.

```ts
{
  path: '/about',     // Required
  component: About,   // Required (or use redirect)
  name: 'about'      // Optional
}
```

---

### Question 8: How do you define a dynamic route segment?

**Answer: b) `path: '/user/:id'`**

**Explanation:**  
Dynamic segments are prefixed with `:` (colon). The matched value becomes available in `route.params`.

```ts
{
  path: '/users/:userId',  // Dynamic segment
  component: UserDetail
}
// URL: /users/123
// route.params.userId === '123'
```

---

### Question 9: What does `props: true` do in a route configuration?

**Answer: b) Passes route params as component props**

**Explanation:**  
Setting `props: true` automatically passes `route.params` as props to the component, making it easier to test and more decoupled from the router.

```ts
// Route
{ path: '/user/:id', component: User, props: true }

// Component receives id as prop
defineProps<{ id: string }>()
```

---

### Question 10: Which property stores custom route metadata?

**Answer: b) `meta`**

**Explanation:**  
The `meta` property holds custom data like authentication requirements, page titles, roles, etc.

```ts
{
  path: '/admin',
  component: Admin,
  meta: { 
    requiresAuth: true,
    role: 'admin'
  }
}
```

---

### Question 11: How do you define a catch-all/404 route?

**Answer: c) `path: '/:pathMatch(.*)*'`**

**Explanation:**  
This regex pattern matches any path not matched by other routes. Place it last in your routes array.

```ts
{
  path: '/:pathMatch(.*)*',
  name: 'not-found',
  component: NotFound
}
```

---

### Question 12: What is the purpose of the `name` property in a route?

**Answer: b) Provides a unique identifier for programmatic navigation**

**Explanation:**  
Named routes allow you to navigate by name instead of path, making refactoring easier and enabling type safety.

```ts
// Navigate by name
router.push({ name: 'user', params: { id: 123 } })
```

---

## Section 3: Navigation

### Question 13: Which component creates navigation links?

**Answer: a) `<router-link>`**

**Explanation:**  
`<router-link>` is the component for creating navigation links that handle SPA routing without page reloads.

---

### Question 14: How do you navigate to `/about` declaratively?

**Answer: b) `<router-link to="/about">About</router-link>`**

**Explanation:**  
`<router-link>` with the `to` prop creates declarative navigation. Regular `<a>` tags cause full page reloads.

---

### Question 15: Which composable provides the router instance?

**Answer: c) `useRouter()`**

**Explanation:**  
`useRouter()` returns the router instance for programmatic navigation in Composition API components.

```ts
import { useRouter } from 'vue-router'

const router = useRouter()
router.push('/home')
```

---

### Question 16: How do you navigate programmatically to `/home`?

**Answer: b) `router.push('/home')`**

**Explanation:**  
`router.push()` is the method for programmatic navigation. It adds a new entry to the browser history.

---

### Question 17: What's the difference between `router.push()` and `router.replace()`?

**Answer: b) `push()` adds history entry, `replace()` doesn't**

**Explanation:**  
- `push()`: Adds new history entry (user can go back)
- `replace()`: Replaces current entry (user cannot go back)

Use `replace()` after login/logout to prevent navigation to previous page.

---

### Question 18: How do you navigate back one page?

**Answer: d) Both a and b**

**Explanation:**  
Both `router.back()` and `router.go(-1)` navigate backward one page. `router.back()` is just shorthand for `router.go(-1)`.

---

## Section 4: Route Access

### Question 19: Which composable provides the current route object?

**Answer: b) `useRoute()`**

**Explanation:**  
`useRoute()` returns the current route object with reactive access to params, query, path, etc.

```ts
import { useRoute } from 'vue-router'

const route = useRoute()
console.log(route.params.id)
```

---

### Question 20: How do you access route parameters?

**Answer: b) `route.params.id`**

**Explanation:**  
Route parameters (from dynamic segments like `:id`) are accessed via `route.params`.

```ts
// Route: /users/:id
// URL: /users/123
const userId = route.params.id  // '123'
```

---

### Question 21: How do you access query parameters?

**Answer: a) `route.query.search`**

**Explanation:**  
Query parameters (after `?` in URL) are accessed via `route.query`.

```ts
// URL: /search?q=vue&sort=date
const searchQuery = route.query.q     // 'vue'
const sortOrder = route.query.sort    // 'date'
```

---

### Question 22: What property gives the full URL path including query and hash?

**Answer: c) `route.fullPath`**

**Explanation:**  
`route.fullPath` includes everything: path, query, and hash.

```ts
// URL: /search?q=vue#results
route.path      // '/search'
route.fullPath  // '/search?q=vue#results'
```

---

### Question 23: Is the `route` object from `useRoute()` reactive?

**Answer: a) Yes**

**Explanation:**  
The route object is reactive, so it updates when the route changes. Use it in computed properties or watch to react to route changes.

```ts
const route = useRoute()

const userId = computed(() => route.params.id)  // Reactive

watch(() => route.params.id, (newId) => {
  console.log('User ID changed:', newId)
})
```

---

### Question 24: How do you access the route hash (e.g., `#section`)?

**Answer: c) `route.hash`**

**Explanation:**  
The hash fragment (including the `#`) is available via `route.hash`.

```ts
// URL: /docs#installation
route.hash  // '#installation'
```

---

## Section 5: Nested Routes & Advanced

### Question 25: Where are child routes defined?

**Answer: b) In the `children` array of parent route**

**Explanation:**  
Child routes are defined in the `children` array of their parent route, creating a hierarchical structure.

```ts
{
  path: '/users',
  component: UsersLayout,
  children: [
    { path: '', component: UsersList },
    { path: ':id', component: UserDetail }
  ]
}
```

---

### Question 26: Do child routes need their own `<router-view>`?

**Answer: b) Yes, in the parent component**

**Explanation:**  
Each level of nesting requires a `<router-view>` in the parent component to render child routes.

```ts
// UsersLayout.vue (parent)
<template>
  <div>
    <h1>Users Section</h1>
    <router-view />  <!-- Child routes render here -->
  </div>
</template>
```

---

### Question 27: Which CSS class is applied to an active `<router-link>`?

**Answer: c) `router-link-active`**

**Explanation:**  
`router-link-active` is automatically applied when the link's route partially matches the current route.

```ts
// Current route: /users/123
// This link has router-link-active class:
<router-link to="/users">Users</router-link>
```

---

### Question 28: Which CSS class is applied when the route exactly matches?

**Answer: b) `router-link-exact-active`**

**Explanation:**  
`router-link-exact-active` is applied only when the route path exactly matches the current route.

```ts
// Current route: /users
// Has exact-active class:
<router-link to="/users">Users</router-link>
// Doesn't have exact-active class:
<router-link to="/">Home</router-link>
```

---

### Question 29: What does `exact-active-class` prop do on `<router-link>`?

**Answer: b) Customizes the CSS class for exact matches**

**Explanation:**  
This prop lets you specify a custom CSS class name instead of the default `router-link-exact-active`.

```ts
<router-link 
  to="/users" 
  exact-active-class="my-exact-active"
>
  Users
</router-link>
```

---

### Question 30: What's required for HTML5 history mode in production?

**Answer: b) Server configuration to redirect to index.html**

**Explanation:**  
HTML5 mode requires server configuration to redirect all requests to `index.html`. Otherwise, direct URL access or page refresh returns 404.

**Nginx example:**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

---

## Scoring Summary

- **27-30 correct**: Excellent! You've mastered the basics.
- **24-26 correct**: Good! Review missed concepts.
- **20-23 correct**: Fair. Revisit lesson content.
- **Below 20**: Review entire lesson and try again.

---

## Key Takeaways

### Must Remember:

1. **Router Setup**: Install with `npm install vue-router@4`, create with `createRouter()`, use with `app.use(router)`
2. **Navigation**: Use `<router-link>` for declarative, `router.push()` for programmatic
3. **Route Access**: `useRoute()` for current route, `useRouter()` for navigation
4. **Dynamic Routes**: Use `:param` syntax, access via `route.params`
5. **Nested Routes**: Define in `children` array, need `<router-view>` in parent
6. **Props**: Use `props: true` to pass params as component props
7. **History Mode**: HTML5 mode needs server configuration

---

## Common Mistakes to Avoid

❌ **Using `<a>` tags instead of `<router-link>`** → causes page reloads  
❌ **Forgetting `<router-view>` in nested routes** → child routes won't render  
❌ **Not using `computed()` with route params** → won't react to changes  
❌ **Mixing `path` and `params` in `router.push()`** → params ignored  

---

## Next Steps

1. ✅ Review any questions you missed
2. ✅ Refer to [Glossary](glossary.md) for term definitions
3. ✅ Practice with [Exercises](exercises.md)
4. ✅ Build the [Sample Project](sample-project.md)
5. ➡️ Continue to [Lesson 4.2](../lesson-4-2/README.md)

---

**Great job completing the quiz! 🎉**
