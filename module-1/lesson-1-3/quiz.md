# Quiz — Lesson 1.3 (Conditional Rendering & List Rendering)

Answer these questions after completing the lesson and exercises.

1) What is the main difference between `v-if` and `v-show`?

2) When would you prefer `v-show` over `v-if`? Give a specific example.

3) What happens to the DOM when an element with `v-if="false"` is rendered?

4) What's wrong with this code?
   ```vue
   <div v-if="showSection">
     <h2>Title</h2>
   </div>
   <p>Some text</p>
   <div v-else>
     <p>Alternative content</p>
   </div>
   ```

5) What is the purpose of the `<template>` tag in Vue?

6) Why is the `:key` attribute important in `v-for` lists?

7) What makes a good key value for list items? What makes a bad key?

8) What's the output of this code?
   ```vue
   <span v-for="n in 5">{{ n }}</span>
   ```

9) Write the correct syntax to iterate over an array with both item and index:
   ```vue
   const items = ['a', 'b', 'c']
   ```

10) What's wrong with using the array index as a key in a dynamic list?

11) Why should you never use `v-if` and `v-for` on the same element?

12) How would you correctly filter a list to show only active items? (Provide code)

13) What happens if you iterate over an object with `v-for`? What values do you get access to?

14) What is Vue's "in-place patch strategy" and when does it apply?

15) Write code to handle an empty list state with a user-friendly message.

16) What does this syntax do?
    ```vue
    <li v-for="{ id, name } in users" :key="id">
    ```

17) How do you combine `v-if` and `v-for` correctly when you need conditional items?

18) Which array methods trigger reactivity in Vue 3? (Name at least 5)

19) What is `v-memo` and when should you use it?

20) What are the three states you should typically handle when displaying data from an API?

21) Write code to show different UI based on loading, error, and success states.

22) Why does Vue need keys for efficient list reconciliation?

23) What's wrong with this key?
    ```vue
    <div v-for="user in users" :key="user.role">
    ```

24) How would you implement a "select all" checkbox for a todo list?

25) What does this computed property do?
    ```ts
    const sortedItems = computed(() => {
      return [...items.value].sort((a, b) => a.name.localeCompare(b.name))
    })
    ```

26) Why do we spread the array (`[...items.value]`) before sorting?

27) What happens if you mutate a reactive array directly?
    ```ts
    const items = ref([1, 2, 3])
    items.value[0] = 100  // Does this trigger reactivity?
    ```

28) What's the difference between these two approaches?
    ```vue
    <!-- Approach A -->
    <ul v-if="items.length > 0">
      <li v-for="item in items" :key="item.id">{{ item }}</li>
    </ul>
    
    <!-- Approach B -->
    <ul v-show="items.length > 0">
      <li v-for="item in items" :key="item.id">{{ item }}</li>
    </ul>
    ```

29) How do you iterate over a nested data structure (e.g., categories with items)?

30) When filtering a list with a search query, should you filter in the template or use a computed property? Why?
