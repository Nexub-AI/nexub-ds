---
'@nexub/react': minor
---

API consistency. A shared `Size` type (`'sm' | 'md' | 'lg'`) is exported and used by Flag, Label, SegmentedControl, NumberInput, CountryBadge and Logo; Amount and Dialog extend it. `PasswordInput` gains `visible`, `defaultVisible` and `onVisibleChange` so the reveal toggle can be controlled. `SearchInput` now uses `useControllableState`, with no change in behaviour.
