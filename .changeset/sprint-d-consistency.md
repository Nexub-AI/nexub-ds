---
"@nexub/react": minor
---

- `DatePicker` and `DateRangePicker` accept `id` and `aria-label`, so the field can be labelled (the selected value is appended to the accessible name). Previously the trigger's name was only the value or placeholder.
- `FormField.Root` forwards its ref. `Autocomplete` and `Toaster` get a `displayName`.
- Removed unused imports in `Dialog`, `Drawer` and `Heading`.
- **Deprecated** (still exported, removed in 1.0): `StatusPill` and `Tag` (use `Badge`), `Banner` and `Callout` (use `Alert`). Editors show a strike-through; the docs mark them deprecated.
- `Banner` now uses `role="status"` instead of `role="banner"`, which is the page-header landmark.
- **Input borders meet WCAG 1.4.11:** new `--color-border-input` token (light `#848e9f`, ≥ 3:1 on every light surface; dark `#64748b`, ≥ 3:1). It's used for the boundaries of Input, Textarea, Select, DatePicker, DateRangePicker, Checkbox, Radio and the FileUpload drop zone, which are visibly darker. `--color-border-default` (cards, dividers, popovers) is unchanged.
