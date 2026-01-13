# Exercises — SSR & Hydration

## A. Server Prefetch + Hydration
- Add a Pinia store (`useProductStore`) with `async load(id)`
- Use `onServerPrefetch()` (or call `load()` in server entry) to fetch a product for the current route
- Inject `pinia.state.value` into HTML and restore on client
- Validation: Hydrated page shows product immediately without client re-fetch

## B. SSR-Safe Component
- Create a component that reads window size but avoids DOM access in SSR
- Pattern: compute on client in `onMounted()` and guard with `typeof window !== 'undefined'`
- Validation: No SSR errors; window size appears only after hydration

## C. Router History Modes
- Implement `createServerRouter()` (memory history) and `createClientRouter()` (web history)
- Validation: Server renders correct route; client navigates without full reload

## D. Error Handling & Fallbacks
- Add try/catch around prefetch; render fallback HTML if API fails
- Validation: Server responds with meaningful fallback; client hydrates and can retry

## E. State Isolation
- Ensure a fresh app + Pinia per request (no shared singletons)
- Validation: Two concurrent requests do not leak state (manually inspect logs/state)

---

## Grading Rubric
- Prefetch & hydration: 40%
- SSR-safe code (no DOM access server-side): 20%
- Router history correctness: 20%
- Error handling & fallbacks: 10%
- State isolation across requests: 10%
