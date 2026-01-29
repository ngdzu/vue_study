# Module 2 Capstone Project — Component Library

Build a professional component library showcasing all Module 2 concepts.

## Project Overview

Create a reusable component library with:
- Reusable composables for common patterns
- Well-designed slot-based layout system
- Proper prop handling and validation
- Form components with shared state management
- Full unit tests for each component

## Requirements

### 1. Composables (from Lesson 2.3)

Create the following reusable composables:

**`useFetch.ts`** - API data fetching
- Generic type support
- Loading, error, and success states
- Request cancellation with AbortController
- Automatic cleanup on unmount

**`useLocalStorage.ts`** - State persistence
- Generic type support
- Automatic sync with localStorage
- JSON serialization/deserialization
- Error handling

**`useForm.ts`** - Form state management
- Field validation
- Form submission handling
- Error messages
- Reset functionality

**`useToggle.ts`** - Boolean state management
- Toggle, setTrue, setFalse functions
- Optional initial value

### 2. Layout Components with Slots (from Lesson 2.4)

**`Card.vue`**
- Named slots: header, default (body), footer
- Props: variant (default, primary, danger), elevated (boolean)
- Fallback content for empty slots

**`Modal.vue`**
- Named slots: header, default (body), footer
- Props: modelValue (v-model support), title, closable
- Scoped slot for custom close button

**`List.vue`**
- Scoped slots exposing item data and index
- Props: items array, emptyText
- Support for custom item rendering

### 3. Advanced Props Components (from Lesson 2.5)

**`Button.vue`**
- Props: variant, size, disabled, loading
- Transparent attribute forwarding with `v-bind="$attrs"`
- Proper aria attributes
- Supports all native button attributes

**`Input.vue`**
- Props: modelValue, type, label, error, disabled
- v-model support
- Attribute inheritance
- Validation state visual feedback

### 4. Provide/Inject Pattern (from Lesson 2.6)

**Theme System**
- `ThemeProvider.vue` - Provides theme context
- `useTheme()` composable - Injects theme
- Support for light/dark modes
- Type-safe injection

**Form Validation Context**
- `FormProvider.vue` - Provides validation context
- `useFormContext()` composable
- Shared validation state across nested components

## Project Structure

```
component-library/
├── src/
│   ├── components/
│   │   ├── Button.vue
│   │   ├── Card.vue
│   │   ├── Input.vue
│   │   ├── List.vue
│   │   ├── Modal.vue
│   │   ├── ThemeProvider.vue
│   │   └── FormProvider.vue
│   ├── composables/
│   │   ├── useFetch.ts
│   │   ├── useForm.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useTheme.ts
│   │   ├── useFormContext.ts
│   │   └── useToggle.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.vue (Demo page)
│   └── main.ts
├── tests/
│   ├── composables/
│   │   ├── useFetch.spec.ts
│   │   ├── useLocalStorage.spec.ts
│   │   └── useForm.spec.ts
│   └── components/
│       ├── Button.spec.ts
│       ├── Card.spec.ts
│       └── Input.spec.ts
└── README.md
```

## Testing Requirements

Write unit tests for:
- ✅ All composables (80%+ coverage)
- ✅ Button component (all variants and states)
- ✅ Card component (slot rendering)
- ✅ Input component (v-model, validation)
- ✅ Theme provider/inject

### Example Test (useFetch)

```ts
import { describe, it, expect, vi } from 'vitest'
import { useFetch } from '../composables/useFetch'

describe('useFetch', () => {
  it('fetches data successfully', async () => {
    const mockData = { id: 1, name: 'Test' }
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData
    })

    const { data, loading, error, execute } = useFetch('/api/test')
    
    await execute()
    
    expect(loading.value).toBe(false)
    expect(data.value).toEqual(mockData)
    expect(error.value).toBeNull()
  })

  it('handles errors', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    const { data, error, execute } = useFetch('/api/test')
    
    await execute()
    
    expect(data.value).toBeNull()
    expect(error.value).toBe('Network error')
  })
})
```

## Demo Page Requirements

Create `App.vue` that demonstrates:
- All components in action
- Theme switcher (light/dark)
- Form with validation
- Data fetching example
- Modal trigger
- Responsive card grid

## Grading Criteria

| Component                          | Points  |
| ---------------------------------- | ------- |
| Composables (4 × 10)               | 40      |
| Layout Components (3 × 10)         | 30      |
| Advanced Props Components (2 × 10) | 20      |
| Provide/Inject System              | 20      |
| Unit Tests                         | 30      |
| Demo Page                          | 10      |
| Code Quality & Documentation       | 10      |
| **Total**                          | **160** |

**Passing Grade**: 110/160 (69%)

## Bonus Challenges (+30 points)

- ✅ Add animation/transitions to components (+10)
- ✅ Create Storybook documentation (+10)
- ✅ Implement accessibility features (ARIA labels, keyboard navigation) (+10)

## Key Learning Outcomes

By completing this capstone, you will have:

✅ Built production-ready reusable composables  
✅ Mastered slot-based component composition  
✅ Implemented advanced props patterns  
✅ Created a type-safe provide/inject system  
✅ Written comprehensive unit tests  
✅ Organized a scalable component library  

## Submission Checklist

- [ ] All composables implemented and tested
- [ ] All components implemented with proper props/slots
- [ ] Theme system working (light/dark mode)
- [ ] Form validation context functional
- [ ] Unit tests passing (80%+ coverage)
- [ ] Demo page showcasing all features
- [ ] README with usage examples
- [ ] Code follows Vue 3 best practices
- [ ] TypeScript types properly defined
- [ ] No console errors or warnings

---

## Next Steps

After completing this capstone:
1. Move on to Module 3 (State Management with Pinia)
2. Consider publishing your component library to npm
3. Add more components and composables as needed
4. Contribute to open-source Vue component libraries
