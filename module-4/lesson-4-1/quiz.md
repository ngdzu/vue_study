# Quiz: Vue Router Setup & Basics

**Module 4, Lesson 4.1** | 30 Questions | 60 minutes

---

## Instructions

- Answer all 30 questions
- Each question is worth 1 point
- Passing score: 24/30 (80%)
- Refer to [Quiz Answers](quiz-answers.md) after completing

---

## Questions

### Section 1: Installation & Setup (Questions 1-6)

**1.** Which command installs Vue Router 4 for a Vue 3 project?

a) `npm install vue-router`  
b) `npm install vue-router@4`  
c) `npm install @vue/router`  
d) `npm install router`

**2.** What function creates a router instance?

a) `newRouter()`  
b) `createVueRouter()`  
c) `createRouter()`  
d) `Router.create()`

**3.** Where should `app.use(router)` be called?

a) Before `createApp()`  
b) After `app.mount()`  
c) Between `createApp()` and `app.mount()`  
d) In the router configuration file

**4.** Which import provides HTML5 history mode?

a) `createHistory`  
b) `createWebHistory`  
c) `createHTMLHistory`  
d) `createBrowserHistory`

**5.** What component must be present in `App.vue` for routes to render?

a) `<router-outlet>`  
b) `<router-view>`  
c) `<route-container>`  
d) `<router-component>`

**6.** What is the correct way to import `createRouter`?

a) `import createRouter from 'vue-router'`  
b) `import { createRouter } from 'vue-router'`  
c) `import * as Router from 'vue-router'`  
d) `import Router from 'vue-router'`

---

### Section 2: Route Configuration (Questions 7-12)

**7.** Which property is required in a route object?

a) `name`  
b) `path`  
c) `component`  
d) Both `path` and `component`

**8.** How do you define a dynamic route segment?

a) `path: '/user/{id}'`  
b) `path: '/user/:id'`  
c) `path: '/user/<id>'`  
d) `path: '/user/$id'`

**9.** What does `props: true` do in a route configuration?

a) Enables route validation  
b) Passes route params as component props  
c) Makes the route public  
d) Enables route transitions

**10.** Which property stores custom route metadata?

a) `data`  
b) `meta`  
c) `custom`  
d) `options`

**11.** How do you define a catch-all/404 route?

a) `path: '*'`  
b) `path: '/:notFound'`  
c) `path: '/:pathMatch(.*)*'`  
d) `path: '/404'`

**12.** What is the purpose of the `name` property in a route?

a) Sets the page title  
b) Provides a unique identifier for programmatic navigation  
c) Names the component  
d) Sets the route description

---

### Section 3: Navigation (Questions 13-18)

**13.** Which component creates navigation links?

a) `<router-link>`  
b) `<nav-link>`  
c) `<route-link>`  
d) `<vue-link>`

**14.** How do you navigate to `/about` declaratively?

a) `<a href="/about">About</a>`  
b) `<router-link to="/about">About</router-link>`  
c) `<link route="/about">About</link>`  
d) `<navigate to="/about">About</navigate>`

**15.** Which composable provides the router instance?

a) `useVueRouter()`  
b) `getRouter()`  
c) `useRouter()`  
d) `router()`

**16.** How do you navigate programmatically to `/home`?

a) `router.navigate('/home')`  
b) `router.push('/home')`  
c) `router.go('/home')`  
d) `router.to('/home')`

**17.** What's the difference between `router.push()` and `router.replace()`?

a) `push()` is faster than `replace()`  
b) `push()` adds history entry, `replace()` doesn't  
c) `replace()` is for redirects only  
d) No difference

**18.** How do you navigate back one page?

a) `router.back()`  
b) `router.go(-1)`  
c) `router.previous()`  
d) Both a and b

---

### Section 4: Route Access (Questions 19-24)

**19.** Which composable provides the current route object?

a) `getCurrentRoute()`  
b) `useRoute()`  
c) `getRoute()`  
d) `useCurrentRoute()`

**20.** How do you access route parameters?

a) `route.parameters.id`  
b) `route.params.id`  
c) `route.param('id')`  
d) `route.get('id')`

**21.** How do you access query parameters?

a) `route.query.search`  
b) `route.queryParams.search`  
c) `route.search.search`  
d) `route.getQuery('search')`

**22.** What property gives the full URL path including query and hash?

a) `route.path`  
b) `route.url`  
c) `route.fullPath`  
d) `route.completePath`

**23.** Is the `route` object from `useRoute()` reactive?

a) Yes  
b) No  
c) Only in computed properties  
d) Only with `watch()`

**24.** How do you access the route hash (e.g., `#section`)?

a) `route.fragment`  
b) `route.anchor`  
c) `route.hash`  
d) `route.section`

---

### Section 5: Nested Routes & Advanced (Questions 25-30)

**25.** Where are child routes defined?

a) In a separate routes file  
b) In the `children` array of parent route  
c) In the `nested` property  
d) In the parent component

**26.** Do child routes need their own `<router-view>`?

a) No, they use the parent's  
b) Yes, in the parent component  
c) Only for deeply nested routes  
d) Only if `nested: true` is set

**27.** Which CSS class is applied to an active `<router-link>`?

a) `active`  
b) `link-active`  
c) `router-link-active`  
d) `nav-active`

**28.** Which CSS class is applied when the route exactly matches?

a) `exact-active`  
b) `router-link-exact-active`  
c) `active-exact`  
d) `precise-active`

**29.** What does `exact-active-class` prop do on `<router-link>`?

a) Makes the link exact match only  
b) Customizes the CSS class for exact matches  
c) Enables exact matching  
d) Applies class to all exact links

**30.** What's required for HTML5 history mode in production?

a) Nothing special  
b) Server configuration to redirect to index.html  
c) HTTPS only  
d) Special Vite configuration

---

## Scoring

- **27-30 correct**: Excellent! You've mastered Vue Router basics.
- **24-26 correct**: Good! Review missed concepts.
- **20-23 correct**: Fair. Revisit lesson content.
- **Below 20**: Review the entire lesson and try again.

---

## Next Steps

1. Check your answers against [Quiz Answers](quiz-answers.md)
2. Review any concepts you missed in [Lesson Content](lesson.md)
3. Complete [Exercises](exercises.md) for hands-on practice
4. Build the [Sample Project](sample-project.md) to solidify learning

---

**Good luck! 🚀**
