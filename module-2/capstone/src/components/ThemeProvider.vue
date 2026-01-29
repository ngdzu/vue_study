<template>
  <div class="theme-provider">
    <slot />
  </div>
</template>

<script setup lang="ts">
  /**
   * ThemeProvider Component - Demonstrates Provide/Inject (Lesson 2.6)
   *
   * This root component provides theme context to all descendant components
   * using Vue's provide/inject pattern, avoiding prop drilling.
   *
   * Key Concepts:
   * - Provide/Inject for dependency injection (Lesson 2.6)
   * - Composable setup (Lesson 2.2 & 2.3)
   * - Side effects on mount (Lesson 2.1)
   */

  import { provideTheme } from '../composables/useTheme'

  // Provide theme to all descendant components (Lesson 2.6: Provide/Inject)
  provideTheme()
</script>

<style scoped>
  .theme-provider {
    width: 100%;
    height: 100%;
  }
</style>
