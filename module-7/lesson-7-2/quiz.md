# Quiz: Component Testing

**Instructions**: Answer the following questions. Aim for 80%+ (at least 16 out of 20 correct).

---

## Question 1
What does `mount()` do in @vue/test-utils?
- A) Imports a component
- B) Renders a component in a testing environment
- C) Compiles a component
- D) Registers a component globally

**Answer**: B

---

## Question 2
What does the `mount()` function return?
- A) A Vue component instance
- B) A wrapper object used to interact with the component
- C) HTML string
- D) An error or success message

**Answer**: B

---

## Question 3
How do you pass props to a mounted component?
- A) As arguments to mount()
- B) Using `props: { key: value }` in the options object
- C) By calling `setProps()`
- D) Props cannot be tested

**Answer**: B

---

## Question 4
What method checks if a DOM element exists?
- A) `find().isVisible()`
- B) `find().exists()`
- C) `find().isMounted()`
- D) `find().isDefined()`

**Answer**: B

---

## Question 5
How do you simulate a button click in a test?
- A) `wrapper.find('button').click()`
- B) `await wrapper.find('button').trigger('click')`
- C) `wrapper.find('button').simulate('click')`
- D) `wrapper.click('button')`

**Answer**: B

---

## Question 6
What does `emit()` do in a component?
- A) Creates child components
- B) Sends data back to parent component
- C) Imports dependencies
- D) Exports component from file

**Answer**: B

---

## Question 7
How do you check if an event was emitted?
- A) `wrapper.emitted('eventName')`
- B) `wrapper.on('eventName')`
- C) `wrapper.events('eventName')`
- D) `wrapper.trigger('eventName')`

**Answer**: A

---

## Question 8
What does `wrapper.emitted('click')[0]` return?
- A) Number of times event was emitted
- B) The first event payload
- C) Whether the event was emitted
- D) The component that emitted the event

**Answer**: B

---

## Question 9
How do you set the value of an input field in a test?
- A) `wrapper.find('input').value = 'text'`
- B) `await wrapper.find('input').setValue('text')`
- C) `wrapper.find('input').set('text')`
- D) `wrapper.setInputValue('text')`

**Answer**: B

---

## Question 10
What are slots in Vue components?
- A) Methods in components
- B) Placeholders where parent can pass content
- C) Component props
- D) Event listeners

**Answer**: B

---

## Question 11
How do you pass slot content when mounting a component?
- A) `mount(Component, { slots: { default: 'content' } })`
- B) `mount(Component).setSlot('content')`
- C) `mount(Component, { slotContent: 'content' })`
- D) Slots cannot be tested

**Answer**: A

---

## Question 12
What does `wrapper.text()` return?
- A) HTML content of component
- B) Text content of component
- C) All attributes
- D) Component props

**Answer**: B

---

## Question 13
What does `wrapper.html()` return?
- A) JavaScript code
- B) CSS styles
- C) HTML markup of component
- D) Component file path

**Answer**: C

---

## Question 14
How do you get CSS classes applied to an element?
- A) `wrapper.find('.btn').classes()`
- B) `wrapper.find('.btn').getClasses()`
- C) `wrapper.find('.btn').className`
- D) `wrapper.classes('.btn')`

**Answer**: A

---

## Question 15
What does `wrapper.classes('active')` do?
- A) Adds the active class
- B) Checks if element has active class
- C) Gets all classes
- D) Removes the active class

**Answer**: B

---

## Question 16
How do you update a prop on a mounted component?
- A) `wrapper.props.propName = value`
- B) `await wrapper.setProps({ propName: value })`
- C) `wrapper.updateProp('propName', value)`
- D) Props cannot be updated

**Answer**: B

---

## Question 17
What does `findComponent()` do?
- A) Finds child component by name
- B) Finds all components
- C) Finds component in parent
- D) Same as find()

**Answer**: A

---

## Question 18
Why should you use `async/await` in component tests?
- A) To make tests faster
- B) To wait for Vue reactivity and DOM updates
- C) To skip tests
- D) It's optional

**Answer**: B

---

## Question 19
What is a named slot?
- A) A slot with a name attribute for specific content areas
- B) A slot named after the component
- C) A slot that must be named
- D) The default slot

**Answer**: A

---

## Question 20
What should you test in a component?
- A) Implementation details only
- B) User visible behavior, props, events, rendering
- C) Variable names
- D) Component file size

**Answer**: B
