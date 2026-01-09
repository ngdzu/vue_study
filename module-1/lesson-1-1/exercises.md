# Exercises, Validation, and Grading — Lesson 1.1

## Exercise A: Weather Dashboard Stub
Goal: practice component structure, `v-model`, simple loading state, and HMR confidence.

**Requirements**
- Input for city name bound with `v-model`.
- Submit button triggers a fake fetch (use `setTimeout` ~1s).
- Show a loading indicator while waiting.
- After loading, render two cards: "Current" and "Forecast" with stub text.
- Layout should be responsive: stack on narrow screens, two columns on wide screens.

**Validation (manual)**
- Typing updates the bound state immediately.
- Clicking submit shows loading for about a second, then the cards render.
- HMR edits do not reset input value or loading state (when possible).
- No console errors.

## Exercise B: Theme Toggle Component
Goal: extract logic into its own component and handle persistence + emits.

**Requirements**
- Component: `ThemeToggle.vue`
  - Prop: `initialTheme` ("light" | "dark").
  - Emits: `update:theme` with the next value.
  - Renders an accessible control (button/switch) showing current theme.
- Parent (`App.vue`):
  - Owns the `theme` state and passes `initialTheme`.
  - Persists `theme` to `localStorage` on change.
  - Applies a class to `document.body` to reflect the current theme.

**Validation (manual)**
- Toggling updates the UI text and the body class immediately.
- Reload keeps the chosen theme (localStorage).
- Emits payload is correct (`"light"` or `"dark"`).
- HMR edits preserve theme state.

---

## Grading Rubric (self-check)
- App runs with `npm run dev` and no errors: 20%
- HMR proven (state preserved on edits): 20%
- Exercise A meets all validation points: 20%
- Exercise B meets all validation points: 20%
- Code clarity: small components, clear naming, minimal duplication: 20%

A score of 80%+ means you are ready to move to Lesson 1.2.

---

## Optional Automated Checks (if you want to script)
- Write a small unit test to ensure the theme toggle emits the correct next value.
- Use Cypress to confirm the theme persists after `cy.reload()`.
- Add a simple ESLint run to enforce basic hygiene: `npx eslint src --ext .ts,.vue`.
