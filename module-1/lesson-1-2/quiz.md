# Quiz — Lesson 1.2 (Reactive Data & Data Binding)

Answer these questions after completing the lesson and exercises.

1) What is the main difference between `ref()` and `reactive()` in Vue 3?

2) Do you need to use `.value` when accessing a `ref` in the template? Why or why not?

3) What happens if you destructure a `reactive()` object like this: `const { count } = reactive({ count: 0 })`?

4) When should you use `computed()` instead of a method?

5) What is the key difference between `watch()` and `watchEffect()`?

6) Write code to watch a specific property of a reactive object (e.g., `state.user.name`).

7) What do the following `v-model` modifiers do?
   - `.lazy`
   - `.number`
   - `.trim`

8) How does Vue's reactivity system track dependencies in computed properties?

9) What is the purpose of the `deep: true` option in `watch()`?

10) Why is debouncing important when watching user input for API calls?

11) What's wrong with this code?
    ```ts
    let user = reactive({ name: 'Alice' })
    user = { name: 'Bob' } // Later in code
    ```

12) How would you create a writable computed property?

13) What does `toRefs()` do and when would you use it?

14) Compare performance: `computed()` vs calling a method in the template multiple times.

15) What is the return type of `ref(0)` in TypeScript?

16) How do you clean up side effects in `watchEffect()`?

17) What's the difference between `flush: 'pre'`, `flush: 'post'`, and `flush: 'sync'` in watch options?

18) When watching an array or object with `ref()`, do you need `deep: true`?

19) How does `v-model` work under the hood on an `<input>` element?

20) What is the recommended way to type a `ref` that can be `null` initially?

21) What is the main difference between `toRef()` and `computed()` with get/set? When would you use each?

22) Given `const state = ref({ count: 0 })`, which is correct?
    - A) `state.count.value`
    - B) `state.value.count`
    - C) `state.value`

23) When accessing a property from `reactive({ count: 0 })` vs `ref({ count: 0 })`, what's the syntax difference?

24) Is this correct? `const countRef = computed(() => state.count.value)` when `state = reactive({ count: 0 })`? Why or why not?

25) What does `toRef()` do compared to destructuring? Show an example where `toRef()` preserves reactivity but destructuring breaks it.

26) What is the main difference between `v-if` and `v-show` in how they handle DOM elements?

27) Which directive (`v-if` or `v-show`) has a higher initial render cost and why?

28) When should you use `v-show` instead of `v-if`?

29) What does "lazy" mean in the context of `v-if`? Is `v-if` still reactive to data changes?

30) Given this code, what happens in the DOM when `isVisible` changes from `false` to `true`?
    ```vue
    <div v-if="isVisible">Content A</div>
    <div v-show="isVisible">Content B</div>
    ```
