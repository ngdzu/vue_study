# Quiz Answers: HTML Forms Fundamentals

1) B — `<label>` associates text with form field and improves screen reader accessibility.

2) B — `type="email"` validates email format automatically (user@domain.com).

3) B — `required` prevents form submission if field is empty; browser shows error.

4) C — `pattern="regex"` validates input against a regular expression.

5) A — GET submits in URL (visible, length-limited); POST submits in body (hidden, larger payloads).

6) B — `<fieldset>` groups related fields semantically; `disabled` attribute disables all contained fields.

7) B — FormData API collects form values and serializes them for submission via fetch/XMLHttpRequest.

8) B — Proper accessibility uses `<label for="id">` linked to `<input id="id">`.

9) B — `aria-invalid="true"` tells screen readers the field has an error.

10) A — `type="file"` allows users to select and upload files.

11) A — `readonly` field displays value and is submitted but cannot be edited.

12) A — `<optgroup label="...">` groups related options in a select dropdown.

13) B — `<datalist>` provides autocomplete suggestions for a text input (non-dropdown).

14) B — `novalidate` disables browser native validation (use only with custom validation).

15) D — HTML5 validates all: `required`, `type="email"`, `min`/`max` without JavaScript.

16) B — Progressive enhancement: form works without JS (native validation, POST submission); JS enhances with custom validation, AJAX, etc.

## Key Takeaways

- HTML forms are powerful without JavaScript—use native validation first
- Accessibility (labels, ARIA) is essential, not optional
- `<label>` with `for` attribute improves UX for all users
- FormData API simplifies form value collection
- Progressive enhancement makes apps resilient
- Browser validation is free; enhance with JS validation

## Implementation Checklist

- ✅ Use `<label>` for every form field
- ✅ Use semantic `<fieldset>` and `<legend>`
- ✅ Leverage native validation attributes (`required`, `pattern`, `min`, `max`)
- ✅ Use appropriate `type` attributes (`email`, `number`, `date`, etc.)
- ✅ Add ARIA attributes for screen readers
- ✅ Use `FormData` for data collection
- ✅ Support form submission without JavaScript
- ✅ Test keyboard navigation (Tab, Enter, Escape)
- ✅ Style validation states (`:valid`, `:invalid`, `:disabled`)
