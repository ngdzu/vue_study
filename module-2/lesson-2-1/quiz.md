# Quiz — Lesson 2.1 (Component Lifecycle & Hooks)

Answer these questions after completing the lesson and exercises.

1) What are the four main phases of a Vue component's lifecycle?

2) When does the `<script setup>` code execute in relation to the component lifecycle?

3) Why is it unsafe to access DOM elements or template refs during the setup phase?

4) What is the primary use case for the `onMounted` hook?

5) What's the difference between `onBeforeUnmount` and `onUnmounted`?

6) Why must you clean up event listeners in the `onUnmounted` hook?

7) What happens if you forget to call `clearInterval()` in `onUnmounted`?

8) Write code to set up and clean up a window resize event listener.

9) What is an `AbortController` and why is it important for fetch requests?

10) How do you cancel an ongoing fetch request when a component unmounts?

11) What's the risk of not cancelling fetch requests on unmount?

12) When is it safe to access a template ref?
    - A) During `<script setup>`
    - B) In `onBeforeMount`
    - C) In `onMounted`
    - D) Never

13) What's wrong with this code?
    ```ts
    onUpdated(() => {
      count.value++
    })
    ```

14) How many times does `onMounted` run in a component's lifetime?

15) Which lifecycle hooks run during server-side rendering (SSR)?

16) Write code to create a timer that increments a counter every second and cleans up properly.

17) What's the purpose of the `onBeforeUpdate` hook?

18) How do you access the current component instance in Composition API?

19) What happens to reactive watchers when a component unmounts?

20) What's the recommended way to integrate a third-party library (e.g., Chart.js) with Vue lifecycle hooks?
