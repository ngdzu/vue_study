# Quiz Answers — Lesson 1.1

1) It creates a Vue application instance using `App` as the root component and mounts it to the DOM element with id `app` so Vue takes control of that node.
2) `index.html` contains the `div` with `id="app"` that Vue mounts into.
3) It serves native ES modules with on-demand compilation (no full bundle rebuild) and keeps a persistent dev server with HMR instead of re-bundling everything.
4) HMR swaps changed modules without a full page reload; proof: edit text/styles while running `npm run dev` and watch state (e.g., counter value) remain intact.
5) Under `src/assets/` for static assets and `src/styles.css` (or similar) for global styles; import them in `main.ts` if global.
6) `<script setup>` removes component boilerplate (no `export default`, no `setup()` wrapper) and lets you use Composition API bindings directly in the template.
7) `strict` catches type issues early, keeps examples type-safe, and prevents brittle patterns from creeping in as the project grows.
8) Volar provides Vue 3 language support and type-checking for templates and `<script setup>`; it replaces Vetur for Vue 3 + TS projects.
9) Start `npm run dev`, click the counter to change state, then edit displayed text; if the state remains after the edit, HMR is preserving component state.
10) (a) Large, monolithic components doing multiple jobs; (b) sprinkling global CSS without scoping, which causes later conflicts.
