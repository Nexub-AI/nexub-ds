# @nexub/react

## 0.0.2

### Patch Changes

- Focus ring & navigation performance fixes

  **@nexub/react**
  - **Input** — replace `border-transparent` focus trick with `border-color` shift + `color-mix()`-based semi-transparent ring halo; eliminates double-ring artifact on all field components
  - **Textarea** — same semi-transparent ring pattern; invalid state ring now also uses `color-mix()` for consistent look
  - **Select** — same ring fix on Trigger; invalid state colour updated to match
  - **NumberInput** — inner `<input>` now strips all focus indicators (`border-0 shadow-none ring-0 focus:ring-0 focus-visible:ring-0`) so the wrapper's `focus-within` ring is the only visible outline
  - **Heading** — move tone colour from dynamic Tailwind class (`` `text-[var(--color-text-${tone})]` ``) to inline `style` prop; fixes Turbopack CSS parse error caused by template literals being emitted literally into generated CSS

- 94f96f7: Performance & stability fixes
  - **Toast SSR guard** — store is now client-only on `globalThis`; server-side module evaluations receive a fresh local object so toast state never leaks across concurrent SSR requests
  - **Collapse RAF cleanup** — `requestAnimationFrame` IDs are now stored and cancelled in the `useEffect` cleanup, preventing state updates on unmounted components (memory leak)
  - **FileUpload context memo** — context value is wrapped in `useMemo` so consumers only re-render when a tracked value actually changes, not on every parent render
  - **useMergedRefs stable callback** — replaced the spread-array dependency (new reference every call, defeating `useCallback`) with a `useRef` of refs pattern; the returned function is now truly stable
  - **Motion willChange hints** — `Fade`, `Slide`, and `Scale` now set `willChange: 'opacity'` / `willChange: 'opacity, transform'` so browsers promote these elements to their own compositor layer, eliminating repaint jank on lower-end devices
  - **@types/react devDep** — aligned to `^19.0.0` to match the root pnpm override
