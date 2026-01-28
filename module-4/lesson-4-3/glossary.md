# Glossary: Route Parameters & Query Strings

**Module 4, Lesson 4.3**

---

## Route Parameters

### Dynamic Segment
URL path component that matches variable values, denoted by colon (`:param`). Example: `/users/:id` matches `/users/123`.

### Route Params (`route.params`)
Object containing dynamic route parameter values extracted from URL path.

### Optional Parameter
Dynamic segment that may or may not be present in URL. Denoted with `?`: `/users/:id/:tab?`

### Parameter Validation
Regex pattern applied to parameter to restrict allowed values. Example: `/:id(\\d+)` only matches digits.

---

## Query Parameters

### Query String
URL component after `?` containing key-value pairs. Example: `?q=vue&page=2`

### Route Query (`route.query`)
Object containing query parameter values from URL query string.

### Query Persistence
Preserving query parameters when navigating to maintain filter/state.

---

## Hash Fragment

### URL Hash
Part of URL after `#` symbol, typically used for in-page navigation to specific sections.

---

## Patterns

### Pagination
Pattern using query params to track current page: `?page=2`

### Search Pattern
Using query params for search term and filters: `?q=vue&category=tech&sort=date`

### Scroll Behavior
Router configuration controlling scroll position on navigation.

---

**Use params for required data, query for optional filters!**
