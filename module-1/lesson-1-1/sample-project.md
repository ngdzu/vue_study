# Sample Project — HMR Counter + Theme Toggle

Purpose: demonstrate the scaffold is healthy (HMR, state, styling) and establish patterns for later lessons.

## Requirements
- Keep the starter counter functionality.
- Add a light/dark theme toggle that persists using `localStorage`.
- Apply the theme as a class on `<body>` (e.g., `theme-light`, `theme-dark`).
- Display the active theme in the UI.
- Ensure HMR preserves counter and theme state while editing.

## Suggested File Layout
- `src/main.ts`: create app; import a global stylesheet if you add one.
- `src/App.vue`: root layout, counter, theme toggle.
- `src/components/ThemeToggle.vue`: reusable toggle component (emits `update:theme`).
- `src/styles.css` (optional): shared theme styles.

## Implementation Steps
1) **State**: in `App.vue`, create `const theme = ref("light")` and `const count = ref(0)`.
2) **Persistence**: on mount, read `localStorage.getItem("theme")`; if found, set `theme` and apply body class.
3) **Toggle**: build `ThemeToggle.vue` with a button or switch; emit `update:theme` with the next value.
4) **Wiring**: consume the component in `App.vue` with `v-model:theme` or `@update:theme`.
5) **Body Class**: watch `theme` and set `document.body.className = themeClass` (or add/remove classes).
6) **UI**: show `Active theme: ...` and the counter button.
7) **Styles**: define background/text colors for each theme (global or scoped with body class selectors).

## Acceptance Criteria
- Toggling theme updates the body class immediately.
- Reloading the page preserves the last theme from `localStorage`.
- Editing text/styles during `npm run dev` keeps both theme and counter state (HMR).
- No console errors in browser or terminal.

## Stretch Goals (optional)
- Add a system-theme default: initialize from `matchMedia('(prefers-color-scheme: dark)')` if no stored value.
- Animate theme transitions with CSS.
- Add keyboard accessibility: Space/Enter toggles the switch; focus outline visible.
- Extract body-class logic into a small composable (e.g., `useTheme`).

## Self-Check
- Can you explain where state lives (component vs `localStorage`)?
- Can you describe how HMR differs from a full page reload?
- Are styles minimal and readable? (avoid global overrides that might conflict later)
