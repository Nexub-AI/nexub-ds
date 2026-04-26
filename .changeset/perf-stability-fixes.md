---
"@nexub/react": patch
---

Performance & stability fixes

- **Toast SSR guard** — store is now client-only on `globalThis`; server-side module evaluations receive a fresh local object so toast state never leaks across concurrent SSR requests
- **Collapse RAF cleanup** — `requestAnimationFrame` IDs are now stored and cancelled in the `useEffect` cleanup, preventing state updates on unmounted components (memory leak)
- **FileUpload context memo** — context value is wrapped in `useMemo` so consumers only re-render when a tracked value actually changes, not on every parent render
- **useMergedRefs stable callback** — replaced the spread-array dependency (new reference every call, defeating `useCallback`) with a `useRef` of refs pattern; the returned function is now truly stable
- **Motion willChange hints** — `Fade`, `Slide`, and `Scale` now set `willChange: 'opacity'` / `willChange: 'opacity, transform'` so browsers promote these elements to their own compositor layer, eliminating repaint jank on lower-end devices
- **@types/react devDep** — aligned to `^19.0.0` to match the root pnpm override
