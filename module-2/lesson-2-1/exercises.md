# Exercises, Validation, and Grading — Lesson 2.1

## Exercise A: Timer Component with Cleanup

Goal: Practice `onMounted`, `onUnmounted`, and proper resource management.

**Requirements**
- Create a `Timer.vue` component
- Display elapsed seconds (starting from 0)
- Start timer automatically on mount
- Stop and clear timer on unmount
- Provide "Pause" and "Resume" buttons
- Provide "Reset" button
- Display formatted time (MM:SS)
- No memory leaks when component unmounts

**Validation (Manual)**
- Timer starts automatically when component mounts
- Seconds increment every 1000ms
- Timer stops when component unmounts (verify in DevTools)
- Pause button stops the timer
- Resume button continues from paused time
- Reset button sets timer back to 00:00
- Time displays in MM:SS format (e.g., 01:25)

**Grading Points** (20 points)
- Timer starts/stops correctly (5 pts)
- Proper cleanup in `onUnmounted` (5 pts)
- Pause/Resume functionality (5 pts)
- Reset functionality (2 pts)
- Formatted display (MM:SS) (3 pts)

---

## Exercise B: Window Resize Tracker

Goal: Practice event listener management and cleanup.

**Requirements**
- Create a `WindowSize.vue` component
- Display current window width and height
- Update dimensions when window resizes
- Use `onMounted` to add resize listener
- Use `onUnmounted` to remove resize listener
- Debounce resize events (only update after 200ms pause)
- Show whether viewport is mobile (<768px), tablet (768-1024px), or desktop (>1024px)

**Validation (Manual)**
- Dimensions display correctly on mount
- Resizing window updates dimensions
- Debouncing works (not updating on every pixel change)
- Listener properly removed on unmount
- Viewport classification correct
- No errors in console when unmounting

**Grading Points** (20 points)
- Correct dimension tracking (5 pts)
- Proper event listener setup (5 pts)
- Proper cleanup in `onUnmounted` (5 pts)
- Debouncing implementation (3 pts)
- Viewport classification (2 pts)

---

## Exercise C: Data Fetching with AbortController

Goal: Practice fetch lifecycle management and cancellation.

**Requirements**
- Create a `PostList.vue` component
- Fetch posts from `https://jsonplaceholder.typicode.com/posts`
- Show loading state during fetch
- Show error state if fetch fails
- Use `AbortController` to cancel ongoing request on unmount
- Provide "Refresh" button to manually refetch
- Cancel previous request if new request starts
- Display posts in a list with title and body

**Validation (Manual)**
- Posts load on mount
- Loading indicator shows during fetch
- Error handling works (test by using invalid URL)
- Refresh button triggers new fetch
- Previous request cancels when clicking Refresh quickly
- Request cancels when component unmounts (verify in Network tab)
- No race conditions

**Grading Points** (25 points)
- Fetch on mount (5 pts)
- Loading and error states (5 pts)
- AbortController implementation (7 pts)
- Refresh functionality (3 pts)
- Request cancellation (5 pts)

---

## Exercise D: Focus Input on Mount

Goal: Practice template refs and DOM access in lifecycle hooks.

**Requirements**
- Create a `SearchInput.vue` component
- Input field auto-focuses when component mounts
- Emit search events when user types (debounced 300ms)
- Clear button to reset input
- Display character count
- Max length of 100 characters

**Validation (Manual)**
- Input auto-focuses on mount
- Typing emits debounced events
- Clear button resets input and emits clear event
- Character count displays correctly
- Max length enforced

**Grading Points** (15 points)
- Auto-focus on mount (5 pts)
- Debounced emit (5 pts)
- Clear functionality (3 pts)
- Character count (2 pts)

---

## Exercise E: Real-Time Clock

Goal: Practice timer management and cleanup.

**Requirements**
- Create a `Clock.vue` component
- Display current time in HH:MM:SS format
- Update every second
- Show AM/PM indicator
- Add "12-hour" / "24-hour" toggle
- Clean up timer on unmount
- Add timezone display (user's local timezone)

**Validation (Manual)**
- Clock updates every second
- Time format correct (HH:MM:SS)
- AM/PM shows in 12-hour mode
- Toggle switches between 12/24 hour formats
- Timer clears on unmount
- No memory leaks

**Grading Points** (20 points)
- Time updates correctly (5 pts)
- Proper timer cleanup (5 pts)
- 12/24 hour toggle (5 pts)
- AM/PM display (3 pts)
- Timezone display (2 pts)

---

## Exercise F: Component Lifecycle Logger

Goal: Understand the order of lifecycle hooks.

**Requirements**
- Create a `LifecycleLogger.vue` component
- Log messages in each lifecycle hook:
  - Setup phase (directly in `<script setup>`)
  - `onBeforeMount`
  - `onMounted`
  - `onBeforeUpdate`
  - `onUpdated`
  - `onBeforeUnmount`
  - `onUnmounted`
- Include a counter that triggers updates
- Display all logs in the component UI (not just console)
- Add "Destroy Component" button to test unmount hooks

**Validation (Manual)**
- All lifecycle hooks log correctly
- Logs appear in correct order
- Update hooks fire when counter changes
- Unmount hooks fire when component destroyed
- Logs display in UI

**Grading Points** (20 points)
- All hooks implemented (10 pts)
- Correct execution order (5 pts)
- UI display of logs (3 pts)
- Destroy functionality (2 pts)

---

## Advanced Challenge: Infinite Scroll List

Goal: Combine lifecycle, event listeners, and data fetching.

**Requirements**
- Create an `InfiniteScroll.vue` component
- Fetch initial 10 posts from JSONPlaceholder API
- Detect when user scrolls near bottom (within 100px)
- Automatically fetch next 10 posts
- Show loading indicator when fetching more
- Prevent duplicate fetches
- Clean up scroll listener on unmount
- Handle end of data (no more posts to load)

**Validation (Manual)**
- Initial posts load on mount
- Scrolling near bottom triggers next fetch
- Loading indicator shows during fetch
- No duplicate fetches
- Scroll listener removed on unmount
- "No more posts" message when data exhausted

**Grading Points** (30 points)
- Initial data fetch (5 pts)
- Scroll detection (7 pts)
- Infinite loading logic (8 pts)
- Cleanup on unmount (5 pts)
- End-of-data handling (5 pts)

---

## Testing Guidelines

### Memory Leak Detection

Use Chrome DevTools to verify proper cleanup:

1. Open DevTools → Performance → Memory
2. Take heap snapshot
3. Mount your component
4. Take another snapshot
5. Unmount component
6. Force garbage collection (trash icon)
7. Take final snapshot
8. Compare snapshots - memory should release

### Network Request Cancellation

Use Chrome DevTools Network tab:

1. Mount component that fetches data
2. Observe network request start
3. Unmount component before request completes
4. Request should show as "cancelled" in Network tab

### Timer Cleanup Verification

```ts
// Add this temporarily to test cleanup
let intervalCount = 0
const originalSetInterval = window.setInterval
window.setInterval = (...args) => {
  intervalCount++
  console.log('Active intervals:', intervalCount)
  return originalSetInterval(...args)
}

const originalClearInterval = window.clearInterval
window.clearInterval = (...args) => {
  intervalCount--
  console.log('Active intervals:', intervalCount)
  return originalClearInterval(...args)
}
```

---

## Grading Summary

| Exercise                   | Points  | Focus                    |
| -------------------------- | ------- | ------------------------ |
| A - Timer                  | 20      | Timer management         |
| B - Resize Tracker         | 20      | Event listeners          |
| C - Fetch with Abort       | 25      | Request cancellation     |
| D - Focus Input            | 15      | Template refs            |
| E - Real-Time Clock        | 20      | Timer + formatting       |
| F - Lifecycle Logger       | 20      | Hook order understanding |
| Advanced - Infinite Scroll | 30      | Complex lifecycle usage  |
| **Total**                  | **150** |                          |

**Passing Grade**: 100/150 (67%)

---

## Common Mistakes to Avoid

1. ❌ Not clearing intervals/timers
2. ❌ Not removing event listeners
3. ❌ Accessing template refs before `onMounted`
4. ❌ Modifying reactive state in `onUpdated` (infinite loops)
5. ❌ Not using `AbortController` for fetch requests
6. ❌ Forgetting to handle error states
7. ❌ Not testing unmount behavior
