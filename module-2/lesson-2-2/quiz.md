# Quiz — Lesson 2.2 (Composition API Fundamentals)

Answer these questions after completing the lesson and exercises.

1) What is the main purpose of the Composition API in Vue 3?

2) What are the key advantages of Composition API over Options API?

3) What is the `setup()` function and when does it execute in the component lifecycle?

4) What parameters does the `setup()` function receive?

5) Why is `this` not available inside the `setup()` function?

6) What is `<script setup>` and how does it differ from using the `setup()` function?

7) Write code to convert this Options API component to `<script setup>`:
   ```ts
   export default {
     data() {
       return { count: 0 }
     },
     methods: {
       increment() {
         this.count++
       }
     }
   }
   ```

8) What is a composable in Vue 3? What naming convention should composables follow?

9) Why are composables better than mixins for code reuse?

10) Write a simple `useCounter` composable that returns count and increment function.

11) How do you define props in `<script setup>`? Show both runtime and TypeScript declaration.

12) How do you emit events in `<script setup>`?

13) What is `defineExpose()` used for and why is it needed in `<script setup>`?

14) How do lifecycle hooks differ between Options API and Composition API? Give examples.

15) Which Options API lifecycle hooks are replaced by `setup()` itself?

16) What is the equivalent of these Options API hooks in Composition API?
    - `mounted`
    - `beforeUnmount`
    - `updated`

17) Can you use multiple `onMounted` hooks in the same component? What happens?

18) What is wrong with this code and how would you fix it?
    ```ts
    <script setup lang="ts">
    import { ref, onMounted } from 'vue'
    
    const data = ref(null)
    
    async function loadData() {
      await fetch('/api/data')
      onMounted(() => {
        console.log('Mounted')
      })
    }
    </script>
    ```

19) How do `provide` and `inject` work in Composition API? Show an example.

20) When should you use Composition API vs Options API? List scenarios for each.

21) What is the return value of the `setup()` function used for?

22) Can you use both Options API and Composition API in the same component? If yes, how?

23) How do you access props inside `setup()` with proper reactivity?

24) What is `toRefs()` and when would you use it with props?

25) Write a `useMouse()` composable that tracks mouse position with proper cleanup.

26) How do you make a composable that accepts reactive parameters and responds to their changes?

27) What are the best practices for returning values from composables?

28) Can composables use other composables? Show an example.

29) How do you properly type a composable with TypeScript generics?

30) What is the difference between using `ref()` in Options API vs Composition API for template refs?
