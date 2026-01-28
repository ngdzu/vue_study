# Exercises, Validation, and Grading — Lesson 1.4

## Exercise A: Smart Shopping Cart Calculator

Goal: Practice computed properties for derived state and understand caching benefits.

**Requirements**
- Create a shopping cart with at least 5 items
- Each item has: name, price, quantity, taxRate (e.g., 0.1 for 10%)
- Implement computed properties for:
  - Subtotal per item (price × quantity)
  - Total tax per item (subtotal × taxRate)
  - Cart subtotal (sum of all item subtotals)
  - Cart total tax (sum of all item taxes)
  - Cart total (subtotal + tax)
  - Item count (total quantity)
  - Average item price
- Methods for:
  - Adding/removing items
  - Changing quantity
  - Applying discount code
- All calculations use computed properties (not methods in template)
- Display formatted currency

**Data Structure**
```ts
interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  taxRate: number
}

const cartItems = ref<CartItem[]>([
  { id: 1, name: 'Laptop', price: 999, quantity: 1, taxRate: 0.1 },
  { id: 2, name: 'Mouse', price: 29, quantity: 2, taxRate: 0.1 },
  // Add at least 3 more items
])
```

**Validation (Manual)**
- All computed properties update when items change
- Changing quantity updates all totals correctly
- Adding/removing items updates counts and totals
- Currency formatting is consistent
- No methods called in template for calculations
- Open Vue DevTools → check computed properties are cached

**Grading Points** (25 points)
- Cart item data structure with 5+ items (3 pts)
- Computed properties for all calculations (10 pts)
- Methods for cart operations (add, remove, update) (5 pts)
- Currency formatting (2 pts)
- UI displays all computed values correctly (3 pts)
- Clean code organization (2 pts)

---

## Exercise B: Debounced Search with Analytics

Goal: Practice watchers for side effects, debouncing, and analytics tracking.

**Requirements**
- Search input with debounced search (300ms delay)
- Track search metrics with watchers:
  - Total searches performed
  - Last search timestamp
  - Average search query length
  - Most common search terms (top 5)
- Simulate API call with loading state
- Display search history (last 10 searches)
- Clear history button
- Save search history to localStorage
- Restore history on page load

**Implementation Guide**
```ts
import { ref, watch, onMounted } from 'vue'

const searchQuery = ref('')
const searchResults = ref<string[]>([])
const isSearching = ref(false)

// Analytics state
const totalSearches = ref(0)
const lastSearchTime = ref<number>(0)
const searchHistory = ref<string[]>([])
const searchLengths = ref<number[]>([])

// Computed analytics
const averageSearchLength = computed(() => {
  if (searchLengths.value.length === 0) return 0
  const sum = searchLengths.value.reduce((a, b) => a + b, 0)
  return (sum / searchLengths.value.length).toFixed(1)
})

const topSearchTerms = computed(() => {
  // Count frequency of each search term
  const counts = new Map<string, number>()
  searchHistory.value.forEach(term => {
    counts.set(term, (counts.get(term) || 0) + 1)
  })
  
  // Sort by frequency and return top 5
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([term, count]) => ({ term, count }))
})
```

**Validation (Manual)**
- Search is debounced (doesn't trigger on every keystroke)
- Analytics metrics update correctly
- Search history saves to localStorage
- History restores on page reload
- Loading indicator appears during search
- Search history limited to last 10 items
- Top search terms calculated correctly

**Grading Points** (30 points)
- Debounced search implementation (8 pts)
- Analytics tracking with watchers (8 pts)
- Search history management (5 pts)
- localStorage persistence (5 pts)
- Computed analytics (top terms, average) (4 pts)

---

## Exercise C: Temperature Converter with History

Goal: Practice writable computed properties and watchers.

**Requirements**
- Input fields for Celsius, Fahrenheit, and Kelvin
- All three synchronized via writable computed properties
- Track conversion history (last 20 conversions)
- Each history entry shows: from → to (unit and value)
- Save history to localStorage
- Clear history button
- Validation: show error for invalid temperatures
- Display temperature in color (blue < 0°C, green 0-30°C, red > 30°C)

**Implementation Guide**
```ts
import { ref, computed, watch } from 'vue'

interface Conversion {
  from: { value: number; unit: string }
  to: { value: number; unit: string }
  timestamp: number
}

const celsius = ref(0)

const fahrenheit = computed({
  get() {
    return (celsius.value * 9/5) + 32
  },
  set(value: number) {
    celsius.value = (value - 32) * 5/9
  }
})

const kelvin = computed({
  get() {
    return celsius.value + 273.15
  },
  set(value: number) {
    celsius.value = value - 273.15
  }
})

const conversionHistory = ref<Conversion[]>([])

// Watch for manual changes to track conversions
let lastCelsius = celsius.value
watch(celsius, (newValue) => {
  if (newValue !== lastCelsius) {
    conversionHistory.value.unshift({
      from: { value: lastCelsius, unit: 'C' },
      to: { value: newValue, unit: 'C' },
      timestamp: Date.now()
    })
    
    // Keep only last 20
    if (conversionHistory.value.length > 20) {
      conversionHistory.value = conversionHistory.value.slice(0, 20)
    }
    
    lastCelsius = newValue
  }
})
```

**Validation (Manual)**
- Changing any temperature updates the other two
- All three inputs stay synchronized
- History tracks conversions correctly
- History persists to localStorage
- Temperature color indicator works
- Invalid input handling

**Grading Points** (25 points)
- Writable computed for all three units (10 pts)
- Conversion history tracking (5 pts)
- localStorage persistence (3 pts)
- Temperature validation (3 pts)
- Color indicator based on temperature (2 pts)
- UI polish and usability (2 pts)

---

## Exercise D: Real-time Form Validation

Goal: Combine methods, computed properties, and watchers for complex validation.

**Requirements**
- Registration form with fields:
  - Username (min 3 chars, alphanumeric only)
  - Email (valid email format)
  - Password (min 8 chars, must include: uppercase, lowercase, number)
  - Confirm password (must match password)
- Computed properties for:
  - Individual field validation status
  - Overall form validity
  - Password strength score (0-5)
  - Error messages for each field
- Watchers for:
  - Async username availability check (debounced)
  - Save draft to localStorage (debounced)
  - Track validation attempts
- Methods for:
  - Form submission
  - Field blur handlers
- Show validation only after field is touched
- Display password strength meter
- Show character count for username

**Data Structure**
```ts
interface FormData {
  username: string
  email: string
  password: string
  confirmPassword: string
}

interface FieldStatus {
  touched: boolean
  valid: boolean
  error: string
}

const formData = reactive<FormData>({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const fieldStatus = reactive<Record<keyof FormData, FieldStatus>>({
  username: { touched: false, valid: false, error: '' },
  email: { touched: false, valid: false, error: '' },
  password: { touched: false, valid: false, error: '' },
  confirmPassword: { touched: false, valid: false, error: '' }
})
```

**Validation (Manual)**
- Validation only shows after field is touched
- All validation rules work correctly
- Username availability check is debounced
- Form cannot submit when invalid
- Password strength meter updates in real-time
- Draft saves to localStorage
- Character count shows for username

**Grading Points** (30 points)
- All field validations (10 pts)
- Computed form validity (5 pts)
- Async username check with debounce (5 pts)
- Password strength meter (4 pts)
- Touch state management (3 pts)
- Draft auto-save to localStorage (3 pts)

---

## Exercise E: Performance Benchmark (Advanced)

Goal: Measure and understand the performance difference between methods and computed properties.

**Requirements**

Create a component that demonstrates performance impact:

1. **Large dataset**: Generate 1000 items with random data
2. **Expensive calculation**: Calculate something complex for each item
3. **Two implementations**:
   - Method version: Uses methods in template
   - Computed version: Uses computed properties

4. **Benchmark**:
   - Count how many times each executes
   - Measure execution time
   - Display results

5. **User interaction**:
   - Button to trigger re-render (change unrelated state)
   - Show execution counts
   - Show total time spent

**Implementation**
```ts
import { ref, computed } from 'vue'

// Generate large dataset
const items = ref(
  Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    value: Math.random() * 100
  }))
)

const unrelatedState = ref(0) // To trigger re-renders

// Track executions
const methodCallCount = ref(0)
const computedCallCount = ref(0)

// Method version (called multiple times)
function expensiveMethod() {
  methodCallCount.value++
  
  // Expensive calculation
  let result = 0
  for (let i = 0; i < 100000; i++) {
    result += Math.sqrt(i)
  }
  
  return items.value.reduce((sum, item) => sum + item.value, 0) + result
}

// Computed version (cached)
const expensiveComputed = computed(() => {
  computedCallCount.value++
  
  // Same expensive calculation
  let result = 0
  for (let i = 0; i < 100000; i++) {
    result += Math.sqrt(i)
  }
  
  return items.value.reduce((sum, item) => sum + item.value, 0) + result
})

function triggerRerender() {
  unrelatedState.value++ // Doesn't affect items
}
```

**Template**
```vue
<template>
  <div>
    <h2>Performance Benchmark</h2>
    
    <button @click="triggerRerender">Trigger Re-render</button>
    <p>Re-renders: {{ unrelatedState }}</p>
    
    <h3>Method Version</h3>
    <p>Result: {{ expensiveMethod() }}</p>
    <p>Result again: {{ expensiveMethod() }}</p>
    <p>Result third time: {{ expensiveMethod() }}</p>
    <p>Method executions: {{ methodCallCount }}</p>
    
    <h3>Computed Version</h3>
    <p>Result: {{ expensiveComputed }}</p>
    <p>Result again: {{ expensiveComputed }}</p>
    <p>Result third time: {{ expensiveComputed }}</p>
    <p>Computed executions: {{ computedCallCount }}</p>
    
    <h3>Analysis</h3>
    <p>
      Method called {{ methodCallCount }} times vs 
      Computed called {{ computedCallCount }} times
    </p>
    <p>
      Efficiency: Computed is 
      {{ Math.round((methodCallCount / computedCallCount) * 100) / 100 }}x 
      more efficient
    </p>
  </div>
</template>
```

**Validation (Manual)**
- Initial render: method executes 3x, computed 1x
- Click "Trigger Re-render": method executes 3 more times, computed 0 times
- Execution counts are accurate
- Efficiency calculation is correct

**Grading Points** (20 points)
- Large dataset generation (3 pts)
- Expensive calculation implementation (4 pts)
- Both method and computed versions (6 pts)
- Execution tracking (4 pts)
- Performance analysis display (3 pts)

---

## Common Issues & Debugging

### Issue: Computed property not updating
**Check**:
- Are dependencies reactive? (`ref()` or `reactive()`)
- Are you accessing `.value` correctly?
- Is the dependency actually changing?
- Check Vue DevTools → computed properties

### Issue: Watcher not firing
**Check**:
- Is the source reactive?
- For nested properties, use getter: `() => obj.value.prop`
- For objects, do you need `{ deep: true }`?
- Is the watcher created before the value changes?

### Issue: Debounce not working
**Check**:
- Are you clearing the previous timer?
- Is the timer variable accessible in the watcher?
- Is the delay long enough to notice?
- Console.log inside the timeout to verify execution

### Issue: Infinite loop with watchers
**Cause**: Watcher modifies the same value it watches
**Solution**: 
- Use computed for derived state
- Add conditions to prevent infinite updates
- Use `watchEffect` cleanup function

### Issue: localStorage not persisting
**Check**:
- Is localStorage available? (not in private browsing)
- Are you JSON.stringify/parse correctly?
- Check browser console for localStorage errors
- Verify the key name matches when reading/writing

---

## Testing Checklist

For each exercise, verify:

- [ ] No console errors or warnings
- [ ] All computed properties used correctly (not methods for displayed values)
- [ ] Watchers used only for side effects
- [ ] Methods used only for event handlers and parameterized functions
- [ ] No performance issues (check with Vue DevTools profiler)
- [ ] TypeScript types are correct
- [ ] localStorage works (test in different browser sessions)
- [ ] Debouncing works as expected
- [ ] Component is well-organized and readable

---

## Submission Format

For each exercise, provide:

1. **Source code**: Full `.vue` component file(s)
2. **Screenshots**: Show initial state, after interactions, analytics data
3. **Performance notes**: What did you observe about computed vs methods?
4. **Self-assessment**: Check off grading points you completed
5. **Reflection**: What was challenging? What did you learn?

---

## Bonus Challenges

If you complete all exercises early:

1. **Composable extraction**: Extract debounce logic into `useDebounce()` composable
2. **Advanced analytics**: Create a dashboard showing all metrics over time
3. **Performance monitoring**: Add real-time performance metrics (render time, etc.)
4. **Undo/Redo**: Implement undo/redo for form changes using watchers
5. **Comparison mode**: Create side-by-side method vs computed benchmark
6. **Testing**: Write Vitest unit tests for computed properties and watchers

---

## Resources

- [Vue 3 Docs: Computed Properties](https://vuejs.org/guide/essentials/computed.html)
- [Vue 3 Docs: Watchers](https://vuejs.org/guide/essentials/watchers.html)
- [Vue 3 Docs: Event Handling](https://vuejs.org/guide/essentials/event-handling.html)
- [Debouncing in JavaScript](https://davidwalsh.name/javascript-debounce-function)
- [Vue 3 Performance Best Practices](https://vuejs.org/guide/best-practices/performance.html)
