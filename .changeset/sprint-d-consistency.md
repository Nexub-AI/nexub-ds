---
"@nexub/react": minor
---

- `DatePicker` and `DateRangePicker` accept `id` and `aria-label`, so the field can be labelled (the selected value is appended to the accessible name). Previously the trigger's name was only the value or placeholder.
- `FormField.Root` forwards its ref. `Autocomplete` and `Toaster` get a `displayName`.
- Removed unused imports in `Dialog`, `Drawer` and `Heading`.
