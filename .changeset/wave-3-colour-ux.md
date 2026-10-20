---
'@nexub/tokens': minor
'@nexub/themes': minor
'@nexub/react': minor
'@nexub/patterns': minor
---

Wave 3 — colour and UX (ENHANCEMENTS_PLAN.md).

- **Data-viz colour.** `--color-chart-1..8` are now generated, light/dark aware, ≥3:1 on surfaces and tested to stay distinguishable under protanopia, deuteranopia and tritanopia (CIEDE2000 ≥ 10 between neighbours). New sequential `--color-chart-seq-1..7` and diverging `--color-chart-div-1..7`; Tailwind `chart` colours follow.
- **Wide gamut.** On P3 displays the accent fills (primary, tertiary, semantic and brand accents) gain ~18% chroma via relative colour syntax; lightness — and so contrast — is unchanged.
- **Medium contrast.** `data-contrast="medium"` sits between standard and high, AA-tested everywhere.
- **Async buttons.** `Button status="loading" | "success" | "error"`: the width holds, focus stays (aria-disabled), success draws a check, error shakes once, and each change is announced. `SplitButton` keeps focus while loading.
- **Forms.** New `ErrorSummary` pattern + `useFormErrors()` hook (focus moves to the summary; links focus the field).
- **Undo over confirm.** `toast.undoable(title, { onUndo, onCommit })` commits exactly once when the toast closes without Undo.
- **i18n and RTL.** New `NexubProvider` (`locale`, `dir`, `messages`) with Radix direction support; every built-in English string is a translatable message, and Intl formatting follows the provider locale. Components use logical properties throughout, directional icons mirror, and the Switch thumb and toasts follow the reading direction.
- **Touch targets.** Button, IconButton, Checkbox, Radio and Switch get an invisible 44×44 hit area on touch screens.
- **Optics.** Tables, pagination and stat values use tabular figures.
