# Sample Project — Search & Sort UI Component

Purpose: Demonstrate the differences and use cases for methods, computed properties, and watchers in a practical search and sort interface with debounced API calls and analytics tracking.

## Requirements

Build a product search interface with the following features:

- **Search input**: Debounced search (300ms delay)
- **Category filter**: Dropdown to filter by category
- **Sort controls**: Sort by name or price, ascending/descending
- **View mode toggle**: Grid or list view
- **Analytics tracking**: Track user interactions with watchers
- **API simulation**: Simulate search API calls with loading states
- **Statistics**: Show filtered item count, average price, etc.
- **Local storage**: Save user preferences (view mode, last search)
- **Performance**: Use computed for filtering/sorting, watchers for side effects

## Suggested File Layout

```
src/
  components/
    ProductSearch.vue       # Main search component
    ProductCard.vue         # Individual product display (optional)
  composables/
    useDebounce.ts          # Debounce composable (optional)
    useLocalStorage.ts      # localStorage composable (optional)
  App.vue
```

## Implementation Steps

### 1. Setup Types and Mock Data

```ts
import { ref, computed, watch } from 'vue'

interface Product {
  id: number
  name: string
  category: string
  price: number
  description: string
  imageUrl: string
  inStock: boolean
}

// Mock product database
const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Laptop Pro',
    category: 'Electronics',
    price: 1299,
    description: 'High-performance laptop',
    imageUrl: 'https://via.placeholder.com/150',
    inStock: true
  },
  {
    id: 2,
    name: 'Wireless Mouse',
    category: 'Electronics',
    price: 29,
    description: 'Ergonomic wireless mouse',
    imageUrl: 'https://via.placeholder.com/150',
    inStock: true
  },
  {
    id: 3,
    name: 'Office Desk',
    category: 'Furniture',
    price: 399,
    description: 'Adjustable standing desk',
    imageUrl: 'https://via.placeholder.com/150',
    inStock: false
  },
  {
    id: 4,
    name: 'Coffee Maker',
    category: 'Appliances',
    price: 89,
    description: 'Programmable coffee maker',
    imageUrl: 'https://via.placeholder.com/150',
    inStock: true
  },
  {
    id: 5,
    name: 'Desk Chair',
    category: 'Furniture',
    price: 299,
    description: 'Ergonomic office chair',
    imageUrl: 'https://via.placeholder.com/150',
    inStock: true
  },
  // Add at least 10 more products for better demonstration
]

// Available categories
const CATEGORIES = ['All', 'Electronics', 'Furniture', 'Appliances']
```

### 2. Reactive State

```ts
// Search and filter state
const searchQuery = ref('')
const selectedCategory = ref('All')
const sortBy = ref<'name' | 'price'>('name')
const sortOrder = ref<'asc' | 'desc'>('asc')
const viewMode = ref<'grid' | 'list'>('grid')

// API state
const allProducts = ref<Product[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

// Analytics state
const searchCount = ref(0)
const lastSearchTime = ref<number>(0)
```

### 3. Computed Properties (Filtering & Sorting)

```ts
// Filter by category
const categoryFilteredProducts = computed(() => {
  if (selectedCategory.value === 'All') {
    return allProducts.value
  }
  return allProducts.value.filter(p => p.category === selectedCategory.value)
})

// Filter by search query
const searchFilteredProducts = computed(() => {
  if (!searchQuery.value.trim()) {
    return categoryFilteredProducts.value
  }
  
  const query = searchQuery.value.toLowerCase()
  return categoryFilteredProducts.value.filter(product => 
    product.name.toLowerCase().includes(query) ||
    product.description.toLowerCase().includes(query)
  )
})

// Sort products
const sortedProducts = computed(() => {
  const products = [...searchFilteredProducts.value]
  
  products.sort((a, b) => {
    let comparison = 0
    
    if (sortBy.value === 'name') {
      comparison = a.name.localeCompare(b.name)
    } else {
      comparison = a.price - b.price
    }
    
    return sortOrder.value === 'asc' ? comparison : -comparison
  })
  
  return products
})

// Final displayed products
const displayedProducts = computed(() => sortedProducts.value)

// Statistics
const stats = computed(() => ({
  total: displayedProducts.value.length,
  inStock: displayedProducts.value.filter(p => p.inStock).length,
  outOfStock: displayedProducts.value.filter(p => !p.inStock).length,
  averagePrice: displayedProducts.value.length > 0
    ? displayedProducts.value.reduce((sum, p) => sum + p.price, 0) / displayedProducts.value.length
    : 0,
  minPrice: displayedProducts.value.length > 0
    ? Math.min(...displayedProducts.value.map(p => p.price))
    : 0,
  maxPrice: displayedProducts.value.length > 0
    ? Math.max(...displayedProducts.value.map(p => p.price))
    : 0
}))

// Format price (method used in template)
function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}
```

### 4. Methods (Event Handlers)

```ts
// Toggle sort order
function toggleSortOrder() {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

// Change sort field
function changeSortBy(field: 'name' | 'price') {
  sortBy.value = field
}

// Toggle view mode
function toggleViewMode() {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
}

// Clear all filters
function clearFilters() {
  searchQuery.value = ''
  selectedCategory.value = 'All'
  sortBy.value = 'name'
  sortOrder.value = 'asc'
}

// Simulate API call to fetch products
async function fetchProducts(query: string): Promise<Product[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Simulate search on mock database
  if (!query) {
    return MOCK_PRODUCTS
  }
  
  const lowerQuery = query.toLowerCase()
  return MOCK_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery)
  )
}
```

### 5. Watchers (Side Effects)

```ts
import { onMounted } from 'vue'

// Debounced search watcher
let searchDebounceTimer: number | null = null

watch(searchQuery, (newQuery) => {
  // Clear previous timer
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer)
  }
  
  // Debounce: wait 300ms after user stops typing
  searchDebounceTimer = setTimeout(async () => {
    console.log('Performing search for:', newQuery)
    
    isLoading.value = true
    error.value = null
    
    try {
      allProducts.value = await fetchProducts(newQuery)
      searchCount.value++
      lastSearchTime.value = Date.now()
    } catch (err) {
      error.value = 'Failed to search products'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }, 300)
})

// Save preferences to localStorage
watch([viewMode, sortBy, sortOrder], () => {
  const preferences = {
    viewMode: viewMode.value,
    sortBy: sortBy.value,
    sortOrder: sortOrder.value
  }
  localStorage.setItem('productSearchPreferences', JSON.stringify(preferences))
  console.log('Saved preferences:', preferences)
})

// Analytics tracking: log when filters change
watch(selectedCategory, (newCategory, oldCategory) => {
  console.log(`Analytics: Category changed from ${oldCategory} to ${newCategory}`)
  // In real app: send to analytics service
})

watch(sortBy, (newSort) => {
  console.log(`Analytics: Sort changed to ${newSort}`)
})

// Load initial data on mount
onMounted(async () => {
  // Restore preferences from localStorage
  const savedPreferences = localStorage.getItem('productSearchPreferences')
  if (savedPreferences) {
    try {
      const prefs = JSON.parse(savedPreferences)
      viewMode.value = prefs.viewMode || 'grid'
      sortBy.value = prefs.sortBy || 'name'
      sortOrder.value = prefs.sortOrder || 'asc'
    } catch (e) {
      console.error('Failed to parse saved preferences')
    }
  }
  
  // Load initial products
  isLoading.value = true
  try {
    allProducts.value = await fetchProducts('')
  } catch (err) {
    error.value = 'Failed to load products'
  } finally {
    isLoading.value = false
  }
})
```

### 6. Template Structure

```vue
<template>
  <div class="product-search">
    <header class="search-header">
      <h1>Product Search</h1>
      
      <!-- Search input -->
      <div class="search-controls">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products..."
          class="search-input"
        />
        <span v-if="isLoading" class="loading-indicator">🔄 Searching...</span>
      </div>
      
      <!-- Filters -->
      <div class="filters">
        <select v-model="selectedCategory" class="category-select">
          <option v-for="cat in CATEGORIES" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
        
        <div class="sort-controls">
          <button
            @click="changeSortBy('name')"
            :class="{ active: sortBy === 'name' }"
          >
            Sort by Name
          </button>
          <button
            @click="changeSortBy('price')"
            :class="{ active: sortBy === 'price' }"
          >
            Sort by Price
          </button>
          <button @click="toggleSortOrder">
            {{ sortOrder === 'asc' ? '↑' : '↓' }}
          </button>
        </div>
        
        <div class="view-controls">
          <button @click="toggleViewMode">
            {{ viewMode === 'grid' ? '☷' : '☰' }} View
          </button>
          <button @click="clearFilters" class="clear-btn">
            Clear Filters
          </button>
        </div>
      </div>
      
      <!-- Statistics -->
      <div class="stats">
        <p>
          Showing {{ stats.total }} products
          ({{ stats.inStock }} in stock, {{ stats.outOfStock }} out of stock)
        </p>
        <p v-if="stats.total > 0">
          Price range: {{ formatPrice(stats.minPrice) }} - {{ formatPrice(stats.maxPrice) }}
          | Average: {{ formatPrice(stats.averagePrice) }}
        </p>
        <p class="analytics-info">
          Searches performed: {{ searchCount }}
        </p>
      </div>
    </header>
    
    <!-- Error state -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    
    <!-- Empty state -->
    <div v-else-if="displayedProducts.length === 0 && !isLoading" class="empty-state">
      <p>No products found matching your criteria.</p>
      <button @click="clearFilters">Clear filters</button>
    </div>
    
    <!-- Product grid/list -->
    <div
      v-else
      :class="['product-container', `view-${viewMode}`]"
    >
      <article
        v-for="product in displayedProducts"
        :key="product.id"
        class="product-card"
      >
        <img :src="product.imageUrl" :alt="product.name" />
        <div class="product-info">
          <h3>{{ product.name }}</h3>
          <p class="category">{{ product.category }}</p>
          <p class="description">{{ product.description }}</p>
          <p class="price">{{ formatPrice(product.price) }}</p>
          <p :class="['stock-status', { 'out-of-stock': !product.inStock }]">
            {{ product.inStock ? '✓ In Stock' : '✗ Out of Stock' }}
          </p>
        </div>
      </article>
    </div>
  </div>
</template>
```

### 7. Styling (Scoped CSS)

```vue
<style scoped>
.product-search {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: system-ui, sans-serif;
}

.search-header {
  margin-bottom: 2rem;
}

h1 {
  margin-bottom: 1rem;
  color: #333;
}

.search-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.search-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.search-input:focus {
  outline: none;
  border-color: #4CAF50;
}

.loading-indicator {
  color: #666;
  font-size: 0.9rem;
}

.filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.category-select {
  padding: 0.5rem;
  border: 2px solid #ddd;
  border-radius: 4px;
}

.sort-controls,
.view-controls {
  display: flex;
  gap: 0.5rem;
}

button {
  padding: 0.5rem 1rem;
  background: #f0f0f0;
  border: 2px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

button:hover {
  background: #e0e0e0;
}

button.active {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.clear-btn {
  background: #f44336;
  color: white;
  border-color: #f44336;
}

.stats {
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #666;
}

.stats p {
  margin: 0.25rem 0;
}

.analytics-info {
  font-size: 0.8rem;
  font-style: italic;
}

.error-message {
  padding: 1rem;
  background: #ffebee;
  color: #c62828;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #999;
}

/* Grid view */
.product-container.view-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

/* List view */
.product-container.view-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  background: white;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.view-list .product-card {
  display: flex;
  gap: 1rem;
}

.product-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
}

.view-list .product-card img {
  width: 150px;
  height: 150px;
}

.product-info h3 {
  margin: 0.5rem 0;
  color: #333;
}

.category {
  font-size: 0.85rem;
  color: #666;
  margin: 0.25rem 0;
}

.description {
  font-size: 0.9rem;
  color: #555;
  margin: 0.5rem 0;
}

.price {
  font-size: 1.25rem;
  font-weight: bold;
  color: #4CAF50;
  margin: 0.5rem 0;
}

.stock-status {
  font-size: 0.85rem;
  color: #4CAF50;
  margin: 0.25rem 0;
}

.stock-status.out-of-stock {
  color: #f44336;
}
</style>
```

## Enhancement Ideas

Once the basic version works, try adding:

1. **Price range filter**: Min/max price sliders
2. **Multi-select categories**: Select multiple categories at once
3. **Search history**: Show recent searches
4. **Infinite scroll**: Load more products as user scrolls
5. **Favorites**: Save favorite products to localStorage
6. **Comparison mode**: Compare multiple products side-by-side
7. **Export results**: Download filtered results as CSV/JSON
8. **Advanced analytics**: Track time spent, clicks, conversion funnels
9. **URL state**: Sync filters to URL query parameters
10. **Keyboard shortcuts**: Navigate with keyboard

## Validation Checklist

Before considering the project complete, verify:

- [ ] Search is debounced (doesn't trigger immediately on every keystroke)
- [ ] Loading indicator appears during search
- [ ] Computed properties are used for filtering and sorting (not methods)
- [ ] Watchers are used only for side effects (API, localStorage, analytics)
- [ ] Methods are used only for event handlers
- [ ] Statistics update correctly when filters change
- [ ] View mode persists across page reloads
- [ ] Sort preferences persist across page reloads
- [ ] No console warnings or errors
- [ ] Category filter works correctly
- [ ] Sort by name/price works in both directions
- [ ] Clear filters resets all state
- [ ] Empty state shows when no results
- [ ] Products display in both grid and list views

## Debugging Tips

### If debounce doesn't work:
- Check that you're clearing the previous timer
- Verify the timeout delay (300ms)
- Console.log inside the timeout to confirm execution

### If computed properties recalculate too often:
- Check Vue DevTools to see what's triggering updates
- Ensure you're not mutating arrays in place (use spread: `[...array]`)
- Verify dependencies are minimal

### If watchers don't fire:
- Check that you're watching the correct source
- For nested properties, use getter function: `() => obj.value.prop`
- Verify deep/immediate options if needed

### If localStorage doesn't persist:
- Check browser console for localStorage errors
- Verify JSON.stringify/parse is working
- Check for private browsing mode (localStorage disabled)

## Testing Scenarios

Test these user flows:

1. **Initial load** → Products appear, preferences restored
2. **Type in search** → Debounced search triggers after 300ms
3. **Change category** → Filter updates immediately
4. **Sort by price** → Products reorder correctly
5. **Toggle sort order** → Order reverses
6. **Switch view mode** → Layout changes, preference saved
7. **Clear filters** → All state resets
8. **Refresh page** → Preferences persist
9. **Search with no results** → Empty state shows
10. **Multiple rapid searches** → Only last search executes (debounce works)

## Expected Output

A fully functional product search interface that demonstrates:
- **Methods**: Event handlers for user interactions
- **Computed properties**: Efficient filtering, sorting, statistics
- **Watchers**: Debounced API calls, localStorage persistence, analytics
- Clean separation of concerns
- Optimal performance (no unnecessary recalculations)
- Professional user experience

This project showcases real-world patterns you'll use in every Vue application that handles data.
