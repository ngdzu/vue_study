# Quiz — Lesson 2.4 (Slots & Template Slots)

1) What is a slot in Vue?

2) What's the difference between a default slot and a named slot?

3) Write a component with a default slot that has fallback content "No content provided".

4) How do you pass content to a named slot called "header"?

5) What is a scoped slot?

6) Write a List component that provides `item` and `index` through a scoped slot.

7) How do you access slot props in the parent component?

8) What is the purpose of the `useSlots()` function?

9) How do you check if a slot has content before rendering its container?

10) What's wrong with this code?
    ```ts
    <div class="header">
      <slot name="header"></slot>
    </div>
    ```

11) Write the shorthand syntax for `v-slot:footer`.

12) Can you have multiple default slots in a component?

13) What is a renderless component?

14) How do scoped slots differ from props?

15) Write code to create a Card with header, body, and footer slots.

16) What are dynamic slot names and when would you use them?

17) How do you provide a fallback for a named slot?

18) What is the `$slots` API used for?

19) Write a scoped slot that passes a `close` function to the parent.

20) What's the difference between these two?
    ```ts
    <template #default="slotProps">
    <template #default="{ item, index }">
    ```

21) How do you create a table component with customizable column rendering?

22) What accessibility considerations are important for slot-based components?

23) Can you pass reactive data through scoped slots?

24) How do you handle empty states in a List component using slots?

25) What's the benefit of using slots over props for complex content?
