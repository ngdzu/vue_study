# Capstone2 Code Preview - See What Each Option Looks Like

This document shows real code examples from each option so you can see what you'd be building!

---

## Option 1: Modern Dashboard UI - Code Examples

### Example: Glassmorphism Card Component
```ts
// components/GlassCard.vue
<template>
  <div :class="['glass-card', `glass-${variant}`]">
    <div v-if="$slots.header" class="glass-card-header">
      <slot name="header" />
    </div>
    <div class="glass-card-body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'elevated' | 'gradient'
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.glass-elevated {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.glass-gradient {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2));
}
</style>
```

### Example: Animation Composable
```ts
// composables/useAnimation.ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useAnimation(elementRef) {
  const isVisible = ref(false)

  const handleScroll = () => {
    const element = elementRef.value
    if (!element) return

    const rect = element.getBoundingClientRect()
    if (rect.top < window.innerHeight) {
      isVisible.value = true
    }
  }

  // Lesson 2.1: Setup on mount
  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
  })

  // Lesson 2.1: Cleanup on unmount
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return { isVisible }
}
```

### Example: Theme with Provide/Inject
```ts
// composables/useThemeContext.ts
// Lesson 2.6: Type-safe provide/inject
import { InjectionKey, provide, inject } from 'vue'

export interface Theme {
  mode: 'light' | 'dark'
  primary: string
  secondary: string
}

export const ThemeKey: InjectionKey<Theme> = Symbol('theme')

export function provideTheme(theme: Theme) {
  provide(ThemeKey, theme)
}

export function useThemeContext() {
  return inject(ThemeKey)!
}
```

---

## Option 2: Real-time Collaboration - Code Examples

### Example: Presence Composable
```ts
// composables/usePresence.ts
import { ref, onMounted, onUnmounted } from 'vue'

interface User {
  id: string
  name: string
  status: 'online' | 'away' | 'offline'
  avatar: string
}

export function usePresence() {
  const onlineUsers = ref<User[]>([])

  // Lesson 2.1: Setup WebSocket on mount
  onMounted(() => {
    // Simulate WebSocket connection
    const interval = setInterval(() => {
      // Mock presence updates
      updatePresence()
    }, 1000)

    return () => clearInterval(interval)
  })

  // Lesson 2.1: Cleanup on unmount
  onUnmounted(() => {
    // Close WebSocket connection properly
  })

  const updatePresence = () => {
    // Update user presence list
  }

  return { onlineUsers }
}
```

### Example: Activity Feed with Real-time Updates
```ts
// composables/useActivityFeed.ts
// Lesson 2.3: Advanced composable for data management
import { ref, computed, watch } from 'vue'

interface Activity {
  id: string
  user: string
  action: string
  timestamp: Date
}

export function useActivityFeed() {
  const activities = ref<Activity[]>([])
  const isLoading = ref(false)

  // Lesson 2.3: Complex composable with multiple responsibilities
  const recentActivities = computed(() => {
    return activities.value.slice(0, 10)
  })

  const fetchActivities = async () => {
    isLoading.value = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    isLoading.value = false
  }

  // Lesson 2.1: Lifecycle + 2.3: Composable
  const setupAutoRefresh = () => {
    const interval = setInterval(fetchActivities, 5000)
    return () => clearInterval(interval)
  }

  return {
    activities,
    recentActivities,
    isLoading,
    fetchActivities,
    setupAutoRefresh,
  }
}
```

### Example: Recursive Comment Thread
```ts
// components/CommentThread.vue
// Lesson 2.4: Recursive slots for nested content
<template>
  <div class="comment-thread">
    <div class="comment">
      <div class="comment-header">
        <img :src="comment.author.avatar" :alt="comment.author.name" />
        <span class="author">{{ comment.author.name }}</span>
        <span class="timestamp">{{ formatTime(comment.timestamp) }}</span>
      </div>
      <p class="comment-text">{{ comment.text }}</p>
      <button @click="toggleReply">Reply</button>
    </div>

    <!-- Lesson 2.4: Recursive slot for nested replies -->
    <div v-if="comment.replies" class="replies">
      <CommentThread
        v-for="reply in comment.replies"
        :key="reply.id"
        :comment="reply"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Comment {
  id: string
  text: string
  author: { name: string; avatar: string }
  timestamp: Date
  replies?: Comment[]
}

defineProps<{ comment: Comment }>()
</script>
```

---

## Option 3: Data Visualization - Code Examples

### Example: Chart Data Composable
```ts
// composables/useChartData.ts
// Lesson 2.3: Composable for data transformation
import { ref, computed } from 'vue'

interface TaskData {
  date: string
  completed: number
  pending: number
}

export function useChartData() {
  const tasks = ref<TaskData[]>([])

  // Lesson 2.3: Composable transforms raw data for charts
  const chartData = computed(() => {
    return tasks.value.map(task => ({
      name: task.date,
      completed: task.completed,
      pending: task.pending,
      total: task.completed + task.pending,
    }))
  })

  const completionTrend = computed(() => {
    return tasks.value.reduce((sum, task) => {
      return sum + (task.completed / (task.completed + task.pending))
    }, 0) / tasks.value.length
  })

  return {
    chartData,
    completionTrend,
    tasks,
  }
}
```

### Example: Chart Container with Slots
```ts
// components/ChartCard.vue
// Lesson 2.4: Flexible chart container with slots
<template>
  <div :class="['chart-card', `chart-${variant}`]">
    <div class="chart-header">
      <h3>{{ title }}</h3>
      <slot name="actions" />
    </div>

    <div class="chart-body">
      <!-- Lesson 2.4: Named slot for custom chart content -->
      <slot name="chart" />
    </div>

    <div v-if="$slots.footer" class="chart-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  variant?: 'default' | 'compact' | 'full'
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<style scoped>
.chart-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 12px;
}

.chart-body {
  min-height: 300px;
}
</style>
```

### Example: Export Composable
```ts
// composables/useDataExport.ts
// Lesson 2.3: Composable for data handling
import { ref } from 'vue'

export function useDataExport() {
  const isExporting = ref(false)

  const exportToCSV = async (data: any[], filename: string) => {
    isExporting.value = true

    try {
      // Convert data to CSV format
      const csv = convertToCSV(data)

      // Create download link
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${filename}.csv`
      link.click()

      // Cleanup
      window.URL.revokeObjectURL(url)
    } finally {
      isExporting.value = false
    }
  }

  const convertToCSV = (data: any[]) => {
    const headers = Object.keys(data[0])
    const csv = [
      headers.join(','),
      ...data.map(row => headers.map(h => row[h]).join(',')),
    ]
    return csv.join('\n')
  }

  return { exportToCSV, isExporting }
}
```

---

## Code Complexity Comparison

### Option 1 Complexity
```
Components: Simple ✓
  - Mostly presentational
  - Heavy CSS focus
  - Slot usage: Moderate

Composables: Moderate ⚠
  - Animation timing
  - Theme management
  - Layout utilities

Overall: CSS > Components > Composables
```

### Option 2 Complexity
```
Components: Moderate ⚠
  - Need proper structure
  - Recursive components
  - Complex event handling

Composables: Complex ✗✗
  - WebSocket simulation
  - State synchronization
  - Multiple responsibilities

Overall: Composables > State Management > Components
```

### Option 3 Complexity
```
Components: Moderate ⚠
  - Container/presentational split
  - Chart library integration
  - Props customization

Composables: Moderate ⚠
  - Data transformation
  - Filtering/sorting logic
  - Export functionality

Overall: Balanced mix
```

---

## Which Looks Most Interesting?

- **Option 1**: Love writing CSS and creating beautiful UIs? → Pick this ✨
- **Option 2**: Love complex JavaScript and state management? → Pick this 🤝
- **Option 3**: Love working with data and algorithms? → Pick this 📊

---

## Ready to See Full Implementation?

Once you pick your option, I'll show you:

✅ Complete component source code  
✅ All composable implementations  
✅ TypeScript type definitions  
✅ Global styles and themes  
✅ Working demo app  

**Let me know which option speaks to you most!**
