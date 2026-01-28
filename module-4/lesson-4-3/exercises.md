# Exercises: Route Parameters & Query Strings

**Module 4, Lesson 4.3** | 130 Points

---

## Exercise 1: Dynamic Product Pages (25 points)
Create product list and detail pages with dynamic routing.

**Requirements:**
- List shows all products
- Click navigates to `/products/:id`
- Detail page uses `props: true`
- Handle invalid product ID

---

## Exercise 2: Search with Query Params (30 points)
Implement search functionality using query strings.

**Requirements:**
- Search input syncs with `?q=term`
- Debounce search updates
- Results filter based on query
- Clear search button
- Pre-fill input from URL

---

## Exercise 3: Pagination (30 points)
Add pagination using query parameters.

**Requirements:**
- Current page in `?page=X`
- Previous/Next buttons
- Direct page number links
- Disable buttons at boundaries
- Fetch data based on page

---

## Exercise 4: Multi-Filter System (25 points)
Create advanced filtering with multiple query params.

**Requirements:**
- Category filter (`?category=X`)
- Price range (`?minPrice=X&maxPrice=Y`)
- Sort order (`?sort=X`)
- Combine all filters
- Clear all filters button

---

## Exercise 5: Complete Catalog (20 points)
Combine all features into cohesive product catalog.

**Requirements:**
- Search + filters + pagination
- URL reflects all state
- Browser back/forward works
- Bookmark/share URL works
- Loading states

---

**Total**: 130 points | **Pass**: 104 (80%)
