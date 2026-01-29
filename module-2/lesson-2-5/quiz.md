# Quiz — Lesson 2.5 (Component Props Advanced)

1) What happens when you destructure props directly without `toRefs`?

2) Write code to correctly destructure props while preserving reactivity.

3) What is a fallthrough attribute?

4) What is the purpose of `inheritAttrs: false`?

5) How do you manually apply fallthrough attributes to an element?

6) Write a component that forwards all attributes to an `<input>` instead of the root `<div>`.

7) What is `$attrs`? How do you access it in script setup?

8) What's the difference between props and fallthrough attributes?

9) How does Vue merge class and style attributes?

10) What happens to event listeners passed to a component?

11) Write code to create computed fullName from firstName and lastName props.

12) What is `withDefaults` used for in TypeScript components?

13) Why should wrapper components use `inheritAttrs: false`?

14) How do you provide default values for props in TypeScript?

15) What is a transparent wrapper component?

16) Can you have multiple default values for the same prop?

17) What accessibility considerations are important for input wrappers?

18) How do you handle multi-root components with fallthrough attributes?

19) What's wrong with this code?
    ```ts
    const { name } = defineProps<{ name: string }>()
    watch(name, () => console.log('Changed'))
    ```

20) How do you validate prop values at runtime?
