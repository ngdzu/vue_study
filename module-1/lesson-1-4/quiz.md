# Quiz — Lesson 1.4 (Methods, Computed, & Watchers)

Answer these questions after completing the lesson and exercises.

1) What is the main difference between a method and a computed property?

2) When called multiple times in a template, how many times does a method execute vs a computed property?

3) What happens if you call a method with the same arguments twice in the same render?

4) Can computed properties accept parameters? If not, what's the alternative?

5) Write a writable computed property that converts temperature between Celsius and Fahrenheit.

6) What's wrong with this code?
   ```vue
   <template>
     <p>{{ calculateTotal() }}</p>
     <p>Total: {{ calculateTotal() }}</p>
     <p>Tax: {{ calculateTotal() * 0.1 }}</p>
   </template>
   ```

7) What is dependency tracking in computed properties?

8) What's the difference between `watch()` and `watchEffect()`?

9) When would you use `immediate: true` in a watcher?

10) What's the purpose of the `deep: true` option in watch()?

11) Write code to watch a specific nested property without using `deep: true`.

12) What does the cleanup function in `watchEffect()` do?

13) Explain debouncing and write code to debounce a search input watcher.

14) What are the three flush timing options for watchers and when would you use each?

15) What's wrong with this code?
    ```ts
    const total = computed(() => {
      fetch('/api/total').then(r => r.json())
      return items.value.reduce((sum, i) => sum + i, 0)
    })
    ```

16) Should you use a watcher or computed property to derive state from other state?

17) How do you stop a watcher from executing?

18) What's the anti-pattern in this code?
    ```ts
    const items = ref([1, 2, 3])
    const total = ref(0)
    
    watch(items, () => {
      total.value = items.value.reduce((sum, i) => sum + i, 0)
    }, { deep: true })
    ```

19) When should you use a method instead of a computed property?

20) What is the return value of `watch()` and `watchEffect()`?

21) Write code to format currency using a method vs computed property. Which is better for displaying the same value multiple times?

22) What's the difference between these two?
    ```ts
    // Option A
    watch(user, callback)
    
    // Option B
    watch(user, callback, { deep: true })
    ```

23) How do you watch multiple reactive sources at once?

24) What happens when a computed property's dependencies don't change?

25) When would you use `flush: 'post'` in a watcher?

26) What's the performance difference between calling a method 10 times in the template vs a computed property?

27) Can you modify reactive state inside a computed property getter?

28) What's the best pattern for handling async operations when reactive data changes?

29) Write code to track how many times a user changes a search query using a watcher.

30) What's the difference between `watchEffect()` and a computed property?
