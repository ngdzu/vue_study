<template>
  <ThemeProvider>
    <div class="container">
      <!-- Header Section -->
      <header class="header">
        <h1>Vue 3 Component Library</h1>
        <p class="subtitle">Demonstrating Module 2 Concepts: Lifecycle, Composition API, Slots, Props, and Provide/Inject</p>
        <Button
          variant="secondary"
          size="md"
          @click="toggleTheme"
        >
          Switch to {{ themeMode === 'light' ? 'Dark' : 'Light' }} Mode
        </Button>
      </header>

      <!-- Section 1: Theme Provider & useTheme (Lesson 2.6) -->
      <section class="section">
        <h2>1. Theme Provider & Provide/Inject Pattern (Lesson 2.6)</h2>
        <Card variant="elevated">
          <template #header>
            <div class="flex">
              <span>📌 Dependency Injection</span>
            </div>
          </template>
          <p>
            The <code>ThemeProvider</code> component uses <strong>Provide/Inject</strong> (Lesson 2.6) to share
            theme context without prop drilling. All child components can access theme through
            <code>useTheme()</code> composable.
          </p>
          <p class="text-sm text-muted">
            Current theme mode: <strong>{{ themeMode }}</strong>
          </p>
          <div class="demo-box">
            <Button variant="primary" size="md">
              Access Theme via Injection
            </Button>
          </div>
        </Card>
      </section>

      <!-- Section 2: Button Component (Lesson 2.5 - Props & v-bind="$attrs") -->
      <section class="section">
        <h2>2. Button Component - Advanced Props (Lesson 2.5)</h2>
        <p>Demonstrates prop defaults, variants, sizes, and fallthrough attributes.</p>
        <Card variant="default">
          <template #header>Button Variants</template>
          <div class="demo-grid">
            <div>
              <p class="text-sm mb-4"><strong>Primary</strong></p>
              <div class="flex flex-col">
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" size="md">Medium</Button>
                <Button variant="primary" size="lg">Large</Button>
              </div>
            </div>

            <div>
              <p class="text-sm mb-4"><strong>Secondary</strong></p>
              <div class="flex flex-col">
                <Button variant="secondary" size="sm">Small</Button>
                <Button variant="secondary" size="md">Medium</Button>
                <Button variant="secondary" size="lg">Large</Button>
              </div>
            </div>

            <div>
              <p class="text-sm mb-4"><strong>Danger</strong></p>
              <div class="flex flex-col">
                <Button variant="danger" size="sm">Small</Button>
                <Button variant="danger" size="md">Medium</Button>
                <Button variant="danger" size="lg">Large</Button>
              </div>
            </div>

            <div>
              <p class="text-sm mb-4"><strong>Ghost</strong></p>
              <div class="flex flex-col">
                <Button variant="ghost" size="sm">Small</Button>
                <Button variant="ghost" size="md">Medium</Button>
                <Button variant="ghost" size="lg">Large</Button>
              </div>
            </div>
          </div>
          <p class="mt-6 text-sm text-muted">
            ⚠️ Lesson 2.5: Button uses <code>v-bind="$attrs"</code> to accept and pass through all native attributes
            (aria-label, data-*, onclick, etc.)
          </p>
        </Card>
      </section>

      <!-- Section 3: Card Component (Lesson 2.4 - Named Slots) -->
      <section class="section">
        <h2>3. Card Component - Named Slots (Lesson 2.4)</h2>
        <p>Demonstrates flexible layout using named slots (header, default, footer).</p>
        <div class="demo-grid">
          <Card variant="elevated">
            <template #header>
              <span>📦 Elevated Card</span>
            </template>
            <p>This card demonstrates the elevated variant with header and footer slots.</p>
            <template #footer>
              <Button variant="primary" size="sm">Action</Button>
            </template>
          </Card>

          <Card variant="outlined">
            <template #header>
              <span>🎯 Outlined Card</span>
            </template>
            <p>This card uses the outlined variant for a minimal look.</p>
            <template #footer>
              <div class="flex">
                <Button variant="ghost" size="sm">Cancel</Button>
                <Button variant="primary" size="sm">Confirm</Button>
              </div>
            </template>
          </Card>
        </div>
        <p class="mt-6 text-sm text-muted">
          💡 Lesson 2.4: Named slots allow flexible component composition. Slot content can be header, body
          (default slot), or footer.
        </p>
      </section>

      <!-- Section 4: Input Component (Lesson 2.2 & 2.5 - Reactivity & Props) -->
      <section class="section">
        <h2>4. Input Component - Reactivity & Props (Lesson 2.2 & 2.5)</h2>
        <Card variant="default">
          <template #header>Form Demo</template>
          <div class="flex flex-col">
            <Input
              v-model="form.name"
              label="Full Name"
              placeholder="John Doe"
              required
            />
            <Input
              v-model="form.email"
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              :error="form.emailError"
              required
            />
            <Input
              v-model="form.password"
              label="Password"
              type="password"
              required
            />
            <div class="mt-6">
              <Button variant="primary" @click="validateForm">
                Submit Form
              </Button>
              <p v-if="form.submitted" class="mt-4 text-sm text-muted">
                ✓ Form submitted with values logged to console
              </p>
            </div>
          </div>
        </Card>
        <p class="mt-6 text-sm text-muted">
          💡 Lesson 2.2: Uses reactive <code>ref()</code> for form state. Updates trigger component reactivity
          automatically.
        </p>
      </section>

      <!-- Section 5: Lifecycle & Cleanup (Lesson 2.1) -->
      <section class="section">
        <h2>5. Lifecycle Hooks & Cleanup (Lesson 2.1)</h2>
        <Card variant="elevated">
          <template #header>
            <div class="flex">
              <span>⏰ Clock Component</span>
              <span v-if="clockActive" class="clock-indicator">●</span>
            </div>
          </template>
          <p class="text-lg" style="font-weight: 600">
            {{ currentTime }}
          </p>
          <p class="text-sm text-muted mt-4">
            This component demonstrates lifecycle hooks:
          </p>
          <ul style="margin-left: var(--spacing-6); margin-top: var(--spacing-4)">
            <li><code>onMounted</code>: Sets up interval (starts clock)</li>
            <li><code>onUnmounted</code>: Clears interval (cleanup)</li>
          </ul>
          <p class="mt-4 text-sm text-muted">
            ⚠️ Lesson 2.1: Always clean up side effects (timers, listeners) in
            <code>onUnmounted</code> to prevent memory leaks!
          </p>
        </Card>
      </section>

      <!-- Section 6: Composables Demo (Lesson 2.3) -->
      <section class="section">
        <h2>6. Reusable Composables (Lesson 2.3)</h2>
        <div class="demo-grid">
          <!-- useToggle Demo -->
          <Card variant="default">
            <template #header>useToggle Composable</template>
            <p class="mb-4">Toggle state: <strong>{{ menuOpen.value ? 'Open' : 'Closed' }}</strong></p>
            <Button variant="primary" size="md" @click="menuOpen.toggle">
              {{ menuOpen.value ? 'Close Menu' : 'Open Menu' }}
            </Button>
          </Card>

          <!-- useLocalStorage Demo -->
          <Card variant="default">
            <template #header>useLocalStorage Composable</template>
            <div class="flex flex-col">
              <Input
                v-model="storedText"
                label="Persistent Value (saved to localStorage)"
                placeholder="Type something..."
              />
              <p class="mt-4 text-sm text-muted">
                💾 Reload the page - your text will persist!
              </p>
            </div>
          </Card>
        </div>
        <p class="mt-6 text-sm text-muted">
          💡 Lesson 2.3: Composables extract reusable logic. <code>useToggle</code> manages boolean state;
          <code>useLocalStorage</code> persists data across sessions.
        </p>
      </section>

      <!-- Section 7: Composition API Features (Lesson 2.2) -->
      <section class="section">
        <h2>7. Composition API - &lt;script setup&gt; (Lesson 2.2)</h2>
        <Card variant="default">
          <template #header>Computed Properties & Reactivity</template>
          <div class="flex flex-col">
            <p>
              Counter: <strong>{{ counter }}</strong>
            </p>
            <div class="flex mt-4">
              <Button variant="secondary" size="sm" @click="counter--">
                Decrease
              </Button>
              <Button variant="primary" size="sm" @click="counter++">
                Increase
              </Button>
              <Button variant="ghost" size="sm" @click="counter = 0">
                Reset
              </Button>
            </div>
            <p class="mt-4 text-sm">
              Double: <strong>{{ counterDouble }}</strong>
            </p>
            <p class="mt-4 text-sm">
              Status: <strong :style="{ color: counterStatus === 'positive' ? 'var(--color-success)' : 'var(--color-error)' }">
                {{ counterStatus }}
              </strong>
            </p>
          </div>
        </Card>
        <p class="mt-6 text-sm text-muted">
          💡 Lesson 2.2: <code>&lt;script setup&gt;</code> syntax is the modern way to use Composition API. Variables
          and functions are automatically exposed to template.
        </p>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <p class="text-center text-sm text-muted">
          Module 2 Capstone Project • Demonstrates all 6 lessons with practical components
        </p>
      </footer>
    </div>
  </ThemeProvider>
</template>

<script setup lang="ts">
  /**
   * App.vue - Module 2 Capstone Demo Application
   *
   * This application demonstrates all 6 Module 2 concepts:
   * 1. Lifecycle Hooks & Cleanup (Lesson 2.1) - Clock component with cleanup
   * 2. Composition API & <script setup> (Lesson 2.2) - Reactive state management
   * 3. Reusable Composables (Lesson 2.3) - useToggle, useLocalStorage
   * 4. Slots & Component Composition (Lesson 2.4) - Card with named slots
   * 5. Advanced Props (Lesson 2.5) - Button with variants and v-bind="$attrs"
   * 6. Provide/Inject Pattern (Lesson 2.6) - ThemeProvider shares context
   */

  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import type { ThemeMode } from './types'
  import { useTheme } from './composables/useTheme'
  import { useToggle } from './composables/useToggle'
  import { useLocalStorage } from './composables/useLocalStorage'

  // Import components
  import ThemeProvider from './components/ThemeProvider.vue'
  import Button from './components/Button.vue'
  import Card from './components/Card.vue'
  import Input from './components/Input.vue'

  // ========================================
  // Section 1: Theme Provider (Lesson 2.6)
  // ========================================
  const { mode: themeMode, toggleTheme } = useTheme()

  // ========================================
  // Section 4: Reactive Form State (Lesson 2.2)
  // ========================================
  const form = ref({
    name: '',
    email: '',
    password: '',
    submitted: false,
    emailError: '',
  })

  const validateForm = () => {
    form.value.emailError = ''
    if (!form.value.email.includes('@')) {
      form.value.emailError = 'Please enter a valid email'
      return
    }
    console.log('Form submitted:', {
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
    })
    form.value.submitted = true
    setTimeout(() => {
      form.value.submitted = false
    }, 2000)
  }

  // ========================================
  // Section 5: Lifecycle Hooks (Lesson 2.1)
  // ========================================
  const currentTime = ref('00:00:00')
  const clockActive = ref(true)
  let clockInterval: number

  const updateClock = () => {
    const now = new Date()
    currentTime.value = now.toLocaleTimeString()
  }

  // Lesson 2.1: Setup side effect on mount
  onMounted(() => {
    updateClock()
    clockInterval = window.setInterval(updateClock, 1000)
  })

  // Lesson 2.1: Cleanup on unmount (prevent memory leak!)
  onUnmounted(() => {
    if (clockInterval) {
      clearInterval(clockInterval)
      clockActive.value = false
    }
  })

  // ========================================
  // Section 6: Composables (Lesson 2.3)
  // ========================================
  const menuOpen = useToggle(false)
  const [storedText] = useLocalStorage('demo-text', 'Hello from localStorage!')

  // ========================================
  // Section 7: Composition API (Lesson 2.2)
  // ========================================
  const counter = ref(0)

  // Lesson 2.2: Computed properties for derived state
  const counterDouble = computed(() => counter.value * 2)
  const counterStatus = computed(() => (counter.value > 0 ? 'positive' : counter.value < 0 ? 'negative' : 'zero'))
</script>

<style scoped>
  .header {
    text-align: center;
    margin-bottom: var(--spacing-12);
    padding: var(--spacing-12) 0;
    border-bottom: 2px solid var(--color-border);
  }

  .subtitle {
    color: var(--color-textSecondary);
    margin-bottom: var(--spacing-6);
    font-size: var(--font-size-lg);
  }

  .demo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--spacing-6);
    margin-top: var(--spacing-6);
  }

  .demo-box {
    background-color: var(--color-background);
    border: 2px dashed var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--spacing-6);
    margin-top: var(--spacing-4);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-4);
  }

  .clock-indicator {
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: var(--color-success);
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
    margin-left: var(--spacing-2);
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .footer {
    margin-top: var(--spacing-16);
    padding-top: var(--spacing-8);
    border-top: 2px solid var(--color-border);
  }
</style>
