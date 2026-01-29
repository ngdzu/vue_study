# Quiz Answers — Lesson 2.1 (Component Lifecycle & Hooks)

1) **What are the four main phases of a Vue component's lifecycle?**

   **Answer**: 
   1. Creation/Setup
   2. Mounting
   3. Updating
   4. Unmounting

---

2) **When does the `<script setup>` code execute in relation to the component lifecycle?**

   **Answer**: The `<script setup>` code executes during the **setup phase**, before the component is mounted to the DOM. This is the earliest phase where reactive state is initialized.

---

3) **Why is it unsafe to access DOM elements or template refs during the setup phase?**

   **Answer**: Because the component hasn't been mounted to the DOM yet, so template refs are `null` and DOM elements don't exist. You must wait until `onMounted` to access them.

   ```ts
   // ❌ WRONG
   const divRef = ref<HTMLDivElement | null>(null)
   console.log(divRef.value) // null!

   // ✅ CORRECT
   onMounted(() => {
     console.log(divRef.value) // Now it exists
   })
   ```

---

4) **What is the primary use case for the `onMounted` hook?**

   **Answer**: 
   - Data fetching from APIs
   - Accessing DOM elements or template refs
   - Setting up event listeners
   - Initializing third-party libraries
   - Any operation that requires the component to be in the DOM

---

5) **What's the difference between `onBeforeUnmount` and `onUnmounted`?**

   **Answer**: 
   - **`onBeforeUnmount`**: Runs **before** the component is removed from the DOM. The component is still accessible.
   - **`onUnmounted`**: Runs **after** the component has been removed from the DOM. Component is fully destroyed.

   Most cleanup logic goes in `onUnmounted`, but use `onBeforeUnmount` if you need to access the DOM one last time.

---

6) **Why must you clean up event listeners in the `onUnmounted` hook?**

   **Answer**: If you don't remove event listeners, they continue to exist in memory even after the component is destroyed, causing **memory leaks**. The listener holds references to the component's scope, preventing garbage collection.

---

7) **What happens if you forget to call `clearInterval()` in `onUnmounted`?**

   **Answer**: The interval continues running indefinitely, causing:
   - Memory leaks (component can't be garbage collected)
   - Unexpected behavior (trying to update state on unmounted component)
   - Performance degradation (unnecessary background tasks)
   - Potential crashes if the callback accesses destroyed resources

---

8) **Write code to set up and clean up a window resize event listener.**

   **Answer**:
   ```ts
   <script setup lang="ts">
   import { ref, onMounted, onUnmounted } from 'vue'

   const windowWidth = ref(window.innerWidth)

   const handleResize = () => {
     windowWidth.value = window.innerWidth
   }

   onMounted(() => {
     window.addEventListener('resize', handleResize)
   })

   onUnmounted(() => {
     window.removeEventListener('resize', handleResize)
   })
   </script>
   ```

---

9) **What is an `AbortController` and why is it important for fetch requests?**

   **Answer**: `AbortController` is a Web API that allows you to cancel asynchronous operations like fetch requests. It's critical for preventing **race conditions** where a component unmounts before a fetch completes, which could cause attempts to update state on a destroyed component.

---

10) **How do you cancel an ongoing fetch request when a component unmounts?**

    **Answer**:
    ```ts
    <script setup lang="ts">
    import { ref, onMounted, onUnmounted } from 'vue'

    const controller = ref<AbortController | null>(null)
    const data = ref(null)

    onMounted(async () => {
      controller.value = new AbortController()

      try {
        const response = await fetch('/api/data', {
          signal: controller.value.signal
        })
        data.value = await response.json()
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error(err)
        }
      }
    })

    onUnmounted(() => {
      controller.value?.abort()
    })
    </script>
    ```

---

11) **What's the risk of not cancelling fetch requests on unmount?**

    **Answer**: 
    - **Race conditions**: Response arrives after component is destroyed
    - **Memory leaks**: Request callbacks hold references to destroyed component
    - **State update errors**: Trying to update reactive state on unmounted component
    - **Wasted resources**: Unnecessary network traffic and processing

---

12) **When is it safe to access a template ref?**

    **Answer**: **C) In `onMounted`**

    Template refs are `null` during setup and `onBeforeMount`. They're only available in `onMounted` and later lifecycle hooks.

---

13) **What's wrong with this code?**
    ```ts
    onUpdated(() => {
      count.value++
    })
    ```

    **Answer**: This creates an **infinite update loop**. Modifying reactive state (`count.value++`) inside `onUpdated` triggers another re-render, which calls `onUpdated` again, repeating infinitely.

    **Fix**: Use a watcher with proper conditions instead:
    ```ts
    watch(count, (newVal) => {
      if (newVal < 10) {
        // Conditional update is OK
      }
    })
    ```

---

14) **How many times does `onMounted` run in a component's lifetime?**

    **Answer**: **Exactly once**. `onMounted` runs only when the component is first added to the DOM. It doesn't run again unless the component is completely destroyed and recreated.

---

15) **Which lifecycle hooks run during server-side rendering (SSR)?**

    **Answer**: Only the **setup phase** runs on the server. These hooks do **NOT** run during SSR:
    - `onMounted`
    - `onUpdated`
    - `onBeforeUnmount`
    - `onUnmounted`

    For SSR-specific data fetching, use `onServerPrefetch`.

---

16) **Write code to create a timer that increments a counter every second and cleans up properly.**

    **Answer**:
    ```ts
    <script setup lang="ts">
    import { ref, onMounted, onUnmounted } from 'vue'

    const seconds = ref(0)
    const intervalId = ref<number | null>(null)

    onMounted(() => {
      intervalId.value = window.setInterval(() => {
        seconds.value++
      }, 1000)
    })

    onUnmounted(() => {
      if (intervalId.value !== null) {
        clearInterval(intervalId.value)
      }
    })
    </script>

    <template>
      <div>Timer: {{ seconds }}s</div>
    </template>
    ```

---

17) **What's the purpose of the `onBeforeUpdate` hook?**

    **Answer**: `onBeforeUpdate` runs **before** the component re-renders, while the old DOM is still present. Use cases:
    - Capture DOM state before changes (e.g., scroll position)
    - Save current values for comparison
    - Prepare for DOM changes

    It's rarely needed in most applications.

---

18) **How do you access the current component instance in Composition API?**

    **Answer**:
    ```ts
    import { getCurrentInstance } from 'vue'

    const instance = getCurrentInstance()
    console.log(instance)
    ```

    > ⚠️ **CRITICAL**: `getCurrentInstance()` only works inside `setup()` or lifecycle hooks, and is primarily for advanced use cases or library development.

---

19) **What happens to reactive watchers when a component unmounts?**

    **Answer**: Vue **automatically stops all watchers** when a component unmounts. You don't need to manually clean them up. However, if you create watchers outside of a component lifecycle (e.g., in a global scope), you must manually stop them:

    ```ts
    const stop = watch(source, callback)
    
    // Later...
    stop() // Manual cleanup
    ```

---

20) **What's the recommended way to integrate a third-party library (e.g., Chart.js) with Vue lifecycle hooks?**

    **Answer**:
    ```ts
    <script setup lang="ts">
    import { ref, onMounted, onUnmounted } from 'vue'
    import Chart from 'chart.js/auto'

    const canvasRef = ref<HTMLCanvasElement | null>(null)
    const chartInstance = ref<Chart | null>(null)

    onMounted(() => {
      if (canvasRef.value) {
        chartInstance.value = new Chart(canvasRef.value, {
          type: 'bar',
          data: {
            labels: ['Jan', 'Feb', 'Mar'],
            datasets: [{
              label: 'Sales',
              data: [12, 19, 3]
            }]
          }
        })
      }
    })

    onUnmounted(() => {
      chartInstance.value?.destroy()
    })
    </script>

    <template>
      <canvas ref="canvasRef"></canvas>
    </template>
    ```

    **Key steps**:
    1. Create template ref for DOM element
    2. Initialize library in `onMounted`
    3. Store library instance
    4. Destroy/cleanup in `onUnmounted`

---

## Scoring Guide

Each question is worth 5 points.

**Total**: 100 points  
**Passing**: 80/100 (16+ correct answers)

## Key Takeaways

✅ Always clean up in `onUnmounted` (timers, listeners, requests)  
✅ Use `AbortController` for fetch requests  
✅ Template refs only available in `onMounted` and later  
✅ Never modify reactive state in `onUpdated`  
✅ `onMounted` runs exactly once  
✅ Most lifecycle hooks don't run during SSR
