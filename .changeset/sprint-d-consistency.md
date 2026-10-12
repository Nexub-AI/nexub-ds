---
"@nexub/react": minor
---

- `DatePicker` and `DateRangePicker` accept `id` and `aria-label`, so the field can be labelled (the selected value is appended to the accessible name). Previously the trigger's name was only the value or placeholder.
- `FormField.Root` forwards its ref. `Autocomplete` and `Toaster` get a `displayName`.
- Removed unused imports in `Dialog`, `Drawer` and `Heading`.
- **Deprecated** (still exported, removed in 1.0): `StatusPill` and `Tag` (use `Badge`), `Banner` and `Callout` (use `Alert`). Editors show a strike-through; the docs mark them deprecated.
- `Banner` now uses `role="status"` instead of `role="banner"`, which is the page-header landmark.
