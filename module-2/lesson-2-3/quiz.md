# Quiz — Lesson 2.3 (Building Reusable Composables)

Answer these questions after completing the lesson and exercises.

1) What is a composable in Vue 3?

2) What naming convention should composables follow?

3) Why should composables return `readonly()` refs instead of regular refs?

4) What's the difference between a composable and a regular utility function?

5) Write a basic `useCounter` composable that returns count, increment, and decrement.

6) What are the three main state properties in a `useFetch` composable?

7) Why is it important to use `AbortController` in a fetch composable?

8) What happens if you forget to call `onUnmounted` cleanup in a composable?

9) How do you make a composable type-safe with TypeScript?

10) Write code to create a `useLocalStorage` composable that syncs to localStorage.

11) What is the purpose of the `immediate` option in a `useFetch` composable?

12) How do you implement caching in a composable?

13) What's the difference between debouncing and throttling?

14) Why should composables have a single responsibility?

15) How do you test a composable in isolation?

16) What is retry logic and why is it useful in API composables?

17) Write code to implement cross-tab synchronization in `useLocalStorage`.

18) What's wrong with this composable?
    ```ts
    export function useCounter() {
      const count = ref(0)
      return { count }
    }
    ```

19) How do you handle errors in a composable?

20) What is the purpose of the `watch` function with `{ deep: true }` option?

21) How do you prevent duplicate requests in a `useFetch` composable?

22) What are the benefits of extracting logic into composables vs keeping it in components?

23) Write code to implement a `useDebounce` composable.

24) How do you cancel an ongoing fetch request when a component unmounts?

25) What is the difference between `ref` and `readonly(ref)` in composable return values?

26) How would you implement auto-refetch at intervals in a `useFetch` composable?

27) What is the purpose of generics in TypeScript composables?

28) How do you share state between multiple instances of the same composable?

29) What's the correct way to cleanup event listeners in a composable?

30) Why is it important to mock `fetch` in composable tests?
