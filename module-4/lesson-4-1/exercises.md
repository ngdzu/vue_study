# Exercises: Vue Router Setup & Basics

**Module 4, Lesson 4.1** | 5 Exercises | 130 Points Total

---

## Instructions

Complete all 5 exercises to reinforce your understanding of Vue Router basics. Each exercise builds upon the previous ones.

**Passing Score**: 104/130 (80%)

---

## Exercise 1: Basic Router Setup (20 points)

### Objective
Set up Vue Router in a new Vite project with multiple static routes.

### Requirements

1. Create a new Vite + Vue + TypeScript project
2. Install Vue Router 4
3. Create a router configuration with these routes:
   - `/` → HomeView
   - `/services` → ServicesView
   - `/contact` → ContactView
   - `/privacy` → PrivacyView
4. Install router in main.ts
5. Add navigation with `<router-link>` in App.vue
6. Add `<router-view>` to render matched components

### Grading Rubric

| Criteria                   | Points |
| -------------------------- | ------ |
| Router installed correctly | 3      |
| Routes configured properly | 5      |
| Router installed in app    | 2      |
| Navigation links work      | 5      |
| `<router-view>` present    | 3      |
| All pages accessible       | 2      |

**Total**: 20 points

### Verification

- [ ] All navigation links work without page reload
- [ ] URL updates when clicking links
- [ ] Browser back/forward buttons work
- [ ] Direct URL access works (e.g., `localhost:5173/services`)

---

## Exercise 2: Dynamic Routes with Parameters (25 points)

### Objective
Create dynamic routes for viewing individual product details.

### Requirements

1. Create a `ProductsView` that displays a list of products
2. Create a `ProductDetailView` that shows a single product
3. Add route: `/products/:id` with `props: true`
4. Display product list with `<router-link>` to each detail page
5. Product detail page should receive `id` as a prop
6. Add a "Back to Products" button using `router.back()`
7. Handle case when product ID doesn't exist (show "Not Found")

### Sample Data

```ts
const products = [
  { id: 1, name: 'Laptop', price: 999, description: 'Powerful laptop' },
  { id: 2, name: 'Mouse', price: 29, description: 'Wireless mouse' },
  { id: 3, name: 'Keyboard', price: 79, description: 'Mechanical keyboard' }
]
```

### Grading Rubric

| Criteria                         | Points |
| -------------------------------- | ------ |
| Products list displays correctly | 3      |
| Dynamic route configured         | 4      |
| `props: true` used               | 3      |
| Links to product details work    | 4      |
| Product detail receives id prop  | 3      |
| Back button works                | 3      |
| "Not Found" handling             | 3      |
| TypeScript types for product     | 2      |

**Total**: 25 points

### Verification

- [ ] Clicking product navigates to `/products/1`, `/products/2`, etc.
- [ ] Product detail shows correct product based on ID
- [ ] Back button returns to product list
- [ ] Invalid product ID shows "Not Found" message

---

## Exercise 3: Nested Routes for Dashboard (30 points)

### Objective
Build a dashboard layout with nested routes for different sections.

### Requirements

1. Create `DashboardView` layout component
2. Add nested routes under `/dashboard`:
   - `/dashboard` (default) → `DashboardOverview`
   - `/dashboard/stats` → `DashboardStats`
   - `/dashboard/users` → `DashboardUsers`
   - `/dashboard/settings` → `DashboardSettings`
3. DashboardView should have:
   - Sidebar with navigation to nested routes
   - `<router-view>` for rendering child routes
4. Add active link styling to highlight current section
5. Default route should redirect to overview

### Layout Structure

```
/dashboard
├── (overview) - default
├── /stats
├── /users
└── /settings
```

### Grading Rubric

| Criteria                       | Points |
| ------------------------------ | ------ |
| Parent route configured        | 4      |
| Child routes defined           | 6      |
| Default redirect works         | 3      |
| Sidebar navigation present     | 4      |
| Nested `<router-view>` present | 4      |
| Active link styling            | 4      |
| All nested routes accessible   | 3      |
| Clean layout design            | 2      |

**Total**: 30 points

### Verification

- [ ] `/dashboard` redirects to `/dashboard` (overview)
- [ ] Sidebar links navigate to nested routes
- [ ] Active route highlighted in sidebar
- [ ] URL updates correctly
- [ ] All child routes render within dashboard layout

---

## Exercise 4: Programmatic Navigation & Query Params (30 points)

### Objective
Implement a search feature with query parameters and programmatic navigation.

### Requirements

1. Create `SearchView` with search form
2. Form should have:
   - Text input for search query
   - Dropdown for category filter
   - Button to submit search
3. On submit, navigate to `/search?q={query}&category={category}` using `router.push()`
4. Display search results based on query params
5. Add "Clear" button that navigates to `/search` without params
6. Update search form inputs based on current query params
7. Handle empty search (show message)

### Sample Categories

```ts
const categories = ['All', 'Electronics', 'Clothing', 'Books', 'Food']
```

### Grading Rubric

| Criteria                           | Points |
| ---------------------------------- | ------ |
| Search form renders                | 3      |
| Form inputs bind correctly         | 4      |
| Submit navigates with query params | 6      |
| Query params read correctly        | 5      |
| Results display based on params    | 4      |
| Clear button resets search         | 3      |
| Form updates from URL              | 3      |
| Empty search handled               | 2      |

**Total**: 30 points

### Verification

- [ ] Entering search term and submitting updates URL
- [ ] URL shows query parameters: `/search?q=laptop&category=Electronics`
- [ ] Results filter based on query and category
- [ ] Clear button removes query params
- [ ] Direct URL with params pre-fills form

---

## Exercise 5: 404 Not Found & Named Routes (25 points)

### Objective
Implement proper error handling and use named routes throughout.

### Requirements

1. Add a catch-all route for 404 pages
2. Create `NotFoundView` component showing:
   - 404 error message
   - Attempted URL path
   - Button to navigate home using named route
3. Convert all existing routes to named routes
4. Update all navigation to use named routes instead of paths
5. Add route meta for page titles
6. Implement page title updates in router hook

### Named Routes Example

```ts
{
  path: '/products/:id',
  name: 'product-detail',  // Named route
  component: ProductDetail
}

// Navigate using name
router.push({ name: 'product-detail', params: { id: 123 } })
```

### Grading Rubric

| Criteria                     | Points |
| ---------------------------- | ------ |
| Catch-all route defined      | 3      |
| NotFoundView component       | 4      |
| Shows attempted URL          | 2      |
| Home button uses named route | 3      |
| All routes have names        | 4      |
| Navigation uses named routes | 4      |
| Route meta for titles        | 3      |
| Page title updates           | 2      |

**Total**: 25 points

### Verification

- [ ] Entering invalid URL shows 404 page
- [ ] 404 page displays the attempted URL
- [ ] Home button navigates correctly
- [ ] All navigation uses named routes (check code)
- [ ] Page title changes when navigating

---

## Bonus Challenge (+20 points)

### Advanced Router Features

Implement these advanced features for extra credit:

1. **Route Transitions** (7 points)
   - Add fade transitions between routes
   - Use `<transition>` with `<router-view>`
   - Different transitions for different routes

2. **Breadcrumb Navigation** (7 points)
   - Create breadcrumb component
   - Use `route.matched` to build breadcrumb trail
   - Clickable breadcrumb links

3. **Loading State** (6 points)
   - Show loading spinner during route changes
   - Use `router.beforeEach()` and `router.afterEach()`
   - Implement artificial delay for testing

### Bonus Grading

All bonus features working correctly: +20 points

---

## Submission Checklist

Before submitting, ensure:

- [ ] All exercises completed
- [ ] Code follows TypeScript best practices
- [ ] No console errors
- [ ] All routes work without page reloads
- [ ] Browser navigation (back/forward) works
- [ ] Direct URL access works for all routes
- [ ] Active link styling applied
- [ ] Page titles update correctly
- [ ] 404 page handles invalid routes
- [ ] Code is well-formatted and commented

---

## Testing Your Work

### Manual Testing

Test each route:
1. Click all navigation links
2. Enter URLs directly in address bar
3. Use browser back/forward buttons
4. Refresh page on each route
5. Test with invalid URLs

### Vue DevTools

1. Open Vue DevTools
2. Go to "Router" tab
3. Navigate between routes
4. Verify route params and query update
5. Check matched route records

---

## Common Issues & Solutions

### Issue: Routes not rendering

**Solution**: Check for `<router-view>` in parent component

### Issue: Page reloads on navigation

**Solution**: Use `<router-link>` instead of `<a>` tags

### Issue: Params not updating

**Solution**: Use `computed()` or `watch()` to react to route changes

### Issue: 404 on page refresh

**Solution**: Configure dev server for SPA (Vite does this automatically)

### Issue: Active link class not working

**Solution**: Check path matches exactly or use `exact-active-class`

---

## Grading Summary

| Exercise    | Points  | Description                            |
| ----------- | ------- | -------------------------------------- |
| Exercise 1  | 20      | Basic router setup                     |
| Exercise 2  | 25      | Dynamic routes with params             |
| Exercise 3  | 30      | Nested routes                          |
| Exercise 4  | 30      | Programmatic navigation & query params |
| Exercise 5  | 25      | 404 handling & named routes            |
| **Total**   | **130** | **Base score**                         |
| Bonus       | +20     | Optional advanced features             |
| **Maximum** | **150** | **With bonus**                         |

**Passing Score**: 104/130 (80%)

---

## Learning Objectives Achieved

After completing these exercises, you will have:

✅ Set up Vue Router in a Vite project  
✅ Configured static and dynamic routes  
✅ Implemented declarative and programmatic navigation  
✅ Created nested route hierarchies  
✅ Worked with route parameters and query strings  
✅ Used route props for better component design  
✅ Implemented 404 error handling  
✅ Applied named routes throughout application  
✅ Added route meta and page title management  
✅ Styled active navigation links  

---

## Next Steps

1. ✅ Review exercise solutions (if provided)
2. ✅ Complete the [Sample Project](sample-project.md) for additional practice
3. ✅ Take the [Quiz](quiz.md) to test theoretical knowledge
4. ➡️ Proceed to [Lesson 4.2: Navigation Guards & Route Protection](../lesson-4-2/README.md)

---

**Happy coding! 🚀**
