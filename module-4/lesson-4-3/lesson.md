# Lesson 4.3: Route Parameters & Query Strings

**Module 4: Routing & Navigation** | Lesson 3 of 4

---

## 1. Dynamic Route Parameters

### Basic Parameters

```ts
// Route definition
{
  path: '/users/:id',
  component: UserDetail,
  props: true
}

// Access in component
<script setup lang="ts">
const props = defineProps<{ id: string }>()
// or
const route = useRoute()
const userId = computed(() => route.params.id)
</script>
```

### Multiple Parameters

```ts
{
  path: '/posts/:category/:id',
  component: PostDetail
}

// URL: /posts/tech/123
// route.params = { category: 'tech', id: '123' }
```

### Optional Parameters

```ts
{
  path: '/users/:id/:tab?',
  component: User
}

// Matches: /users/123 and /users/123/posts
```

### Parameter Validation

```ts
{
  path: '/order/:orderId(\\d+)',  // Only digits
  component: Order
}

{
  path: '/user/:username([a-z]+)',  // Only lowercase letters
  component: UserProfile
}
```

---

## 2. Query Parameters

### Setting Query Params

```ts
// Declarative
<router-link :to="{ path: '/search', query: { q: 'vue', sort: 'date' } }">
  Search
</router-link>

// Programmatic
router.push({
  path: '/products',
  query: {
    category: 'electronics',
    minPrice: 100,
    maxPrice: 500
  }
})
```

### Reading Query Params

```ts
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const searchQuery = computed(() => route.query.q as string || '')
const currentPage = computed(() => Number(route.query.page) || 1)
const filters = computed(() => ({
  category: route.query.category as string,
  minPrice: Number(route.query.minPrice) || 0,
  maxPrice: Number(route.query.maxPrice) || Infinity
}))
</script>
```

### Updating Query Params

```ts
function updatePage(page: number) {
  router.push({
    query: {
      ...route.query,
      page
    }
  })
}

function addFilter(key: string, value: string) {
  router.push({
    query: {
      ...route.query,
      [key]: value
    }
  })
}

function clearFilters() {
  router.push({ query: {} })
}
```

---

## 3. Hash Fragments

### Using Hash

```ts
// Navigate to section
router.push({ path: '/docs', hash: '#installation' })

// Access hash
const section = computed(() => route.hash)  // '#installation'

// Scroll to element
watch(() => route.hash, (hash) => {
  if (hash) {
    const element = document.querySelector(hash)
    element?.scrollIntoView({ behavior: 'smooth' })
  }
})
```

---

## 4. Pagination Pattern

```ts
<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const currentPage = computed(() => Number(route.query.page) || 1)
const itemsPerPage = 10
const totalItems = ref(0)
const items = ref([])

const totalPages = computed(() => 
  Math.ceil(totalItems.value / itemsPerPage)
)

watch(currentPage, async (page) => {
  await fetchItems(page)
}, { immediate: true })

function goToPage(page: number) {
  router.push({ query: { ...route.query, page } })
}

async function fetchItems(page: number) {
  const offset = (page - 1) * itemsPerPage
  const data = await api.get(`/items?offset=${offset}&limit=${itemsPerPage}`)
  items.value = data.items
  totalItems.value = data.total
}
</script>

<template>
  <div>
    <div v-for="item in items" :key="item.id">
      {{ item.name }}
    </div>
    
    <div class="pagination">
      <button 
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
      >
        Previous
      </button>
      
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      
      <button 
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
      >
        Next
      </button>
    </div>
  </div>
</template>
```

---

## 5. Search & Filter Pattern

```ts
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDebounceFn } from '@vueuse/core'

const route = useRoute()
const router = useRouter()

// Sync with URL
const searchQuery = ref(route.query.q as string || '')
const category = ref(route.query.category as string || 'all')
const sortBy = ref(route.query.sort as string || 'date')

// Update URL when filters change
const updateFilters = useDebounceFn(() => {
  router.push({
    query: {
      q: searchQuery.value || undefined,
      category: category.value !== 'all' ? category.value : undefined,
      sort: sortBy.value
    }
  })
}, 300)

watch([searchQuery, category, sortBy], updateFilters)

// Fetch results based on query params
const results = ref([])

watch(() => route.query, async (query) => {
  results.value = await fetchResults(query)
}, { immediate: true })
</script>

<template>
  <div>
    <input v-model="searchQuery" placeholder="Search..." />
    
    <select v-model="category">
      <option value="all">All Categories</option>
      <option value="tech">Technology</option>
      <option value="science">Science</option>
    </select>
    
    <select v-model="sortBy">
      <option value="date">Date</option>
      <option value="title">Title</option>
      <option value="relevance">Relevance</option>
    </select>
    
    <div v-for="item in results" :key="item.id">
      {{ item.title }}
    </div>
  </div>
</template>
```

---

## 6. Preserving Scroll Position

```ts
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition  // Browser back/forward
    }
    
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    
    return { top: 0 }  // Scroll to top
  }
})
```

---

## 7. Best Practices

### ✅ DO

```ts
// Type query params
const page = computed(() => Number(route.query.page) || 1)

// Preserve existing query params
router.push({ query: { ...route.query, newParam: 'value' } })

// Use props for params
{ path: '/user/:id', props: true }

// Validate params
const userId = computed(() => {
  const id = Number(route.params.id)
  return isNaN(id) ? null : id
})
```

### ❌ DON'T

```ts
// Don't trust query params type
const page = route.query.page  // Could be string, array, or undefined

// Don't mutate route object
route.query.page = 2  // Won't work!

// Don't use params with path
router.push({ path: '/user', params: { id: 123 } })  // params ignored
```

---

## Summary

✅ Dynamic params: `:param` syntax  
✅ Query strings: persistent filter state  
✅ Hash fragments: scroll to sections  
✅ Pagination: page in query params  
✅ Search/Filter: debounced URL updates  
✅ Type safety: validate and convert params  

---

**Next**: [Lesson 4.4: Advanced Routing Patterns](../lesson-4-4/README.md)
