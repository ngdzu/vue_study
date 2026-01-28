# Quiz: Navigation Guards & Route Protection

**Module 4, Lesson 4.2** | 30 Questions

---

**1.** What is the purpose of navigation guards?
a) Style navigation links  
b) Control navigation flow and protect routes  
c) Create routes  
d) Render components

**2.** Which guard runs before every navigation?
a) `beforeEnter`  
b) `router.beforeEach()`  
c) `onBeforeRouteEnter`  
d) `router.guard()`

**3.** How do you cancel navigation in a guard?
a) Return `null`  
b) Return `false`  
c) Throw error  
d) Call `cancel()`

**4.** What are the three types of guards?
a) Global, local, component  
b) Global, per-route, in-component  
c) Before, after, during  
d) Auth, role, permission

**5.** Where is `beforeEnter` defined?
a) In components  
b) In route configuration  
c) In main.ts  
d) In App.vue

**6.** Can `router.afterEach()` prevent navigation?
a) Yes  
b) No  
c) Only with return false  
d) Only if async

**7.** Which composable creates an in-component guard?
a) `useGuard()`  
b) `onBeforeRouteLeave()`  
c) `beforeRoute()`  
d) `routeGuard()`

**8.** What should `requiresAuth` routes check?
a) User is logged in  
b) User role  
c) User permissions  
d) Page title

**9.** How do you redirect in a guard?
a) Return route location object  
b) Call `router.push()`  
c) Return string path  
d) Both a and c

**10.** What's stored in `route.meta`?
a) Route params  
b) Custom metadata  
c) Component data  
d) Query strings

**11.** When does `onBeforeRouteUpdate` run?
a) Always on navigation  
b) When component is reused with different params  
c) On page refresh  
d) After navigation

**12.** What's the purpose of `onBeforeRouteLeave`?
a) Load data  
b) Check auth  
c) Warn about unsaved changes  
d) Log analytics

**13.** Can guards be async?
a) No  
b) Yes  
c) Only global guards  
d) Only component guards

**14.** What's RBAC?
a) Route-Based Access Control  
b) Role-Based Access Control  
c) Router Before After Callbacks  
d) Restricted Bypass Access Control

**15.** How do you allow navigation?
a) Return `true`  
b) Return `undefined`  
c) Return nothing  
d) All of the above

**16.** What parameter does `beforeEach` receive?
a) Only `to`  
b) `to` and `from`  
c) `to`, `from`, `next`  
d) `route`

**17.** When does `beforeResolve` run?
a) Before `beforeEach`  
b) After in-component guards  
c) After navigation  
d) Before DOM update

**18.** How to save intended destination?
a) `localStorage`  
b) Query param: `redirect`  
c) Route meta  
d) Cookie

**19.** What's a guest-only route?
a) Public route  
b) Route only for non-authenticated users  
c) Route without guards  
d) Demo route

**20.** Can you have multiple `beforeEnter` guards?
a) No  
b) Yes, as array  
c) Yes, comma-separated  
d) Only two max

**21.** What's navigation failure?
a) 404 error  
b) Navigation prevented by guard  
c) Server error  
d) Component not found

**22.** How to detect navigation failure?
a) `try-catch`  
b) `isNavigationFailure()`  
c) Check error message  
d) `onNavigationFail()`

**23.** What's the guard execution order?
a) Global → Per-Route → Component  
b) Component → Per-Route → Global  
c) Leave → Global → Route → Enter  
d) Random

**24.** Can `onBeforeRouteEnter` access component instance?
a) Yes  
b) No  
c) Only with callback  
d) Only in Options API

**25.** What's authorization?
a) Verifying identity  
b) Checking permissions  
c) Login process  
d) Token validation

**26.** Where should auth state be stored?
a) LocalStorage  
b) Pinia store  
c) Global variable  
d) Route meta

**27.** What does `to.fullPath` include?
a) Only path  
b) Path + query + hash  
c) Only params  
d) Route name

**28.** How to implement role check?
a) Check `user.role` in guard  
b) Check route.meta.role  
c) Compare both  
d) All correct

**29.** When to use `router.replace()` in guard?
a) Never  
b) For redirects without history  
c) Always  
d) Only after login

**30.** What's best practice for auth guards?
a) Inline in routes  
b) Separate guard functions  
c) Component-level only  
d) No guards needed

---

**Answers**: See [quiz-answers.md](quiz-answers.md)
