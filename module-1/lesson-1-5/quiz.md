# Quiz - Lesson 1.5: Component Basics & Props

Test your knowledge of Vue components and props. Answer all 30 questions.

**Passing Score**: 24/30 (80%)

---

## Questions

### 1. What is a Vue component?
a) A JavaScript function that returns HTML  
b) A reusable Vue instance with template, logic, and styles  
c) A CSS class for styling elements  
d) A plugin for adding features to Vue

### 2. Which syntax is recommended for Composition API components?
a) `<script>`  
b) `<script lang="ts">`  
c) `<script setup>`  
d) `<script setup lang="ts">`

### 3. What are props used for?
a) Styling components  
b) Passing data from parent to child  
c) Managing global state  
d) Handling user events

### 4. How do you declare props with TypeScript?
a) `const props = props<{ title: string }>()`  
b) `const props = defineProps<{ title: string }>()`  
c) `const props = createProps<{ title: string }>()`  
d) `const props = useProps<{ title: string }>()`

### 5. What does `withDefaults` do?
a) Sets default CSS styles  
b) Provides default values for TypeScript props  
c) Creates default components  
d) Validates prop types

### 6. Which is the correct way to mark a prop as required?
a) `title: { type: String, required: true }`  
b) `title: String!`  
c) `title!: string`  
d) `title: required(String)`

### 7. Why use a factory function for array/object defaults?
a) Better performance  
b) Avoid shared references between instances  
c) TypeScript requires it  
d) Easier to read

### 8. What happens when you mutate a prop directly?
a) Nothing, it's allowed  
b) Vue throws an error in development  
c) The parent component updates  
d) The component re-renders

### 9. Which naming convention is used for component files?
a) kebab-case (app-button.vue)  
b) snake_case (app_button.vue)  
c) PascalCase (AppButton.vue)  
d) camelCase (appButton.vue)

### 10. How do you pass a dynamic prop value?
a) `<Component prop="value" />`  
b) `<Component :prop="value" />`  
c) `<Component v-prop="value" />`  
d) `<Component @prop="value" />`

### 11. What is one-way data flow?
a) Data only flows from child to parent  
b) Data only flows from parent to child  
c) Data flows in both directions automatically  
d) Data never changes

### 12. How do you provide default values for object props?
a) `default: {}`  
b) `default: () => ({})`  
c) `default() { return {} }`  
d) Both b and c are correct

### 13. What does `scoped` in `<style scoped>` mean?
a) Styles apply globally  
b) Styles only apply to this component  
c) Styles are compiled to CSS modules  
d) Styles are optimized

### 14. Which prop type allows multiple possible types?
a) `type: [String, Number]`  
b) `type: String | Number`  
c) `type: Any`  
d) `type: Multiple`

### 15. How do you validate a prop value?
a) `validate: (val) => val > 0`  
b) `validator: (val) => val > 0`  
c) `check: (val) => val > 0`  
d) `test: (val) => val > 0`

### 16. What is the correct way to use boolean props in templates?
a) `<Component :is-active="true" />`  
b) `<Component is-active />`  
c) `<Component is-active="true" />`  
d) Both a and b are correct

### 17. What does `v-bind="object"` do?
a) Binds the object to a prop called "object"  
b) Passes all object properties as individual props  
c) Converts object to JSON  
d) Creates a reactive object

### 18. How do you destructure props while maintaining reactivity?
a) `const { title } = defineProps()`  
b) `const { title } = toRefs(props)`  
c) `const { title } = reactive(props)`  
d) Props can't be destructured

### 19. What is prop drilling?
a) Searching for props in DevTools  
b) Passing props through multiple component levels  
c) Validating props deeply  
d) Mutating nested prop properties

### 20. Which is the recommended solution to prop drilling?
a) Use more props  
b) Use global variables  
c) Use provide/inject or state management  
d) Avoid components

### 21. What naming prefix is recommended for boolean props?
a) get, set, has  
b) is, has, should  
c) can, will, must  
d) do, does, did

### 22. Can child components modify prop values?
a) Yes, directly  
b) Yes, but only arrays and objects  
c) No, props are read-only  
d) Only with v-model

### 23. What is the correct prop name format in JavaScript?
a) `user-name`  
b) `UserName`  
c) `userName`  
d) `user_name`

### 24. What is the correct prop name format in templates?
a) `user-name`  
b) `UserName`  
c) `userName`  
d) `user_name`

### 25. Which statement about component composition is true?
a) Components can't contain other components  
b) Components can contain child components  
c) Only the root component can have children  
d) Composition requires special syntax

### 26. What happens if a required prop is not provided?
a) Component doesn't render  
b) Vue shows a warning in development  
c) Vue throws an error  
d) Default value is used

### 27. How do you define an optional prop with TypeScript?
a) `title: string`  
b) `title?: string`  
c) `title: string | undefined`  
d) Both b and c are correct

### 28. What is the purpose of prop validation?
a) Improve performance  
b) Catch errors at runtime  
c) Enable TypeScript  
d) Style components

### 29. Which is a valid prop type in runtime declaration?
a) `String`  
b) `Number`  
c) `Boolean`  
d) All of the above

### 30. What does `defineProps` return?
a) Nothing  
b) A reactive object with prop values  
c) A function to update props  
d) A validation result

---

## Answer Key

See [quiz-answers.md](./quiz-answers.md) for detailed explanations.
