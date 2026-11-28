---
'@nexub/tokens': minor
---

**Codemods for the top app workarounds** (12.7): `nexub-migrate --codemod <ids>` (or `all`), opt-in, a dry run with a diff by default (`--dry`), `--write` to apply. Each rewrites only the unambiguous case and reports the rest.

- `text-weight`: `<Text className="font-medium …">` → `<Text weight="medium">` (`font-normal` → `regular`).
- `text-truncate`: `<Text className="truncate">` → `<Text truncate>`.
- `button-full-width`: `<Button className="w-full">` → `<Button fullWidth>`.
- `admin-ui-wrappers`: `CheckboxField` and `SwitchField` from your wrapper package (`--wrapper-package`, default `@nexub/admin-ui`) → `@nexub/react` (`hint` → `description`, `onChange` → `onCheckedChange`), `Metric` → `StatCard` from `@nexub/patterns` (`invert` → `tone="bad-when-high"`). `ComboboxField` and `askText` (→ `usePrompt()`) are reported, not rewritten.
- Dynamic classNames (`cn(…)`, `${…}`), spreads, a prop already set and props with no 1:1 match are reported with the reason. No default rule changes.
