# Quiz: VeeValidate Essentials

Select the best answer for each question.

1) What is the primary purpose of VeeValidate?
A. Styling form inputs
B. Managing form state and validating fields
C. Handling form submission to servers
D. Creating HTML forms

2) Which libraries can be used with VeeValidate for schema validation?
A. Only Yup
B. Only Zod
C. Yup or Zod (or both)
D. Neither; VeeValidate has built-in validation rules

3) What does `useForm()` provide?
A. A single field's value and errors
B. Form submission handler, error tracking, and validation
C. HTML form template
D. CSS styling for forms

4) What does `useField('fieldName')` return?
A. Validation schema for a field
B. Field value, errors, and metadata
C. HTML input element
D. Server response for the field

5) How do you display an error message for a field?
A. `{{ errors.fieldName }}`
B. `{{ values.fieldName }}`
C. `{{ touched.fieldName }}`
D. `{{ schema.fieldName }}`

6) What function validates all form fields before submission?
A. `validateForm()`
B. `checkForm()`
C. `handleSubmit(callback)`
D. `submitForm()`

7) Which composable is used to manually set an error on a field?
A. `useField()`
B. `setFieldError()`
C. `validateField()`
D. `setError()`

8) How do you validate a field asynchronously (e.g., check email uniqueness)?
A. Use `async: true` option in schema
B. Call `await validateField()` in component
C. Define a `.test()` method in schema with async function
D. Use a separate API validation service

9) What is the `touched` metadata used for?
A. Detect if user has interacted with field
B. Track if value changed
C. Check async validation status
D. Store validation error

10) In a multi-step form, how do you validate only current step fields?
A. Call `validateForm()` on submit
B. Use `validateField()` for each field in current step
C. Automatically validate all fields
D. No validation needed until final submit

11) How do you integrate VeeValidate with Pinia?
A. VeeValidate automatically syncs with Pinia
B. Store form state in Pinia store and use useForm in component
C. Pass Pinia store to useForm()
D. VeeValidate and Pinia are incompatible

12) What does `isSubmitting` indicate?
A. Form has been submitted once
B. User is actively typing
C. Form submission is in progress
D. All fields are valid

13) What is `defineRule()` used for?
A. Define global validation rules that can be reused across schemas
B. Create a single validation rule for one form
C. Check if a field is defined
D. Remove validation from a field

14) Which is the correct syntax to use a global rule defined with `defineRule()`?
A. `yup.string().defineRule('ruleName')`
B. `yup.string().test('ruleName')`
C. `yup.string().validate('ruleName')`
D. `yup.string().use('ruleName')`

15) How do you pass parameters to a `defineRule()`?
A. `defineRule('maxLength', (value, params) => { })`
B. `test('maxLength', [maxValue])`
C. Both A and B
D. Parameters are not supported in defineRule

16) What is a best practice when using client-side validation with VeeValidate?
A. It's sufficient alone, no server validation needed
B. Always pair it with server-side validation for security
C. Use it only for complex forms
D. It cannot validate async data
