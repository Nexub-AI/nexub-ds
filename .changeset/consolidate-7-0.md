---
"@nexub/react": minor
"@nexub/patterns": minor
"@nexub/tokens": minor
---

7.0: consolidate.

- **Breaking:** `StepIndicator` is removed from @nexub/patterns. Use `<Stepper orientation="vertical" current={…}>` from @nexub/react (`currentStep` becomes `current`; `steps` works as is).
- **Breaking:** Autocomplete's `mode` prop and its inline layout are removed. The popover (the default since 6.0) is the only layout; for an always-open list, use the Combobox parts.
- **`nexub-migrate`**: `removed-in-7` now reports any Autocomplete `mode`; `keep-5-defaults` no longer pins `mode="inline"`.
- See Getting Started → Migrating to 7.0.
