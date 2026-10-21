---
'@nexub/react': minor
---

Dependency refresh (Radix UI, date-fns, React 19.3 floor). With `@radix-ui/react-toggle-group` 1.2, `ToggleGroup` and `SegmentedControl` expose better ARIA roles: a single-select root is now `role="radiogroup"` with `role="radio"` / `aria-checked` items (was `group` / `aria-pressed`), and a multi-select root is `role="toolbar"`. Update any tests or selectors that query `role="group"` on these components.
