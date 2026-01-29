# Quiz — Lesson 2.6 (Provide/Inject Pattern)

Answer these questions after completing the lesson and exercises.

1) What problem does provide/inject solve?

2) What is "prop drilling" and why is it a problem?

3) Write code to provide a reactive `count` variable.

4) Write code to inject the `count` variable in a child component.

5) What does `InjectionKey` do and why should you use it?

6) What happens if you try to `inject()` a value that hasn't been provided?

7) How do you provide a default value when injecting?

8) Why should you use `Symbol()` for injection keys instead of strings?

9) What is the purpose of the `readonly()` function with provide/inject?

10) Write code to create a type-safe injection key for a theme context.

11) When should you use provide/inject vs. passing props?

12) When should you use Pinia instead of provide/inject?

13) How do you test a component that uses `inject()`?

14) What's the recommended pattern for wrapping `inject()` in a composable?

15) Can you provide different values with the same key in nested components?

16) What happens to provided reactive data when it changes?

17) Write a complete provider component for a theme system.

18) How do you prevent child components from mutating provided state?

19) What's wrong with this code?
    ```ts
    const theme = inject('theme')
    theme.value = 'dark' // Modify provided data
    ```

20) List three real-world use cases for provide/inject.
