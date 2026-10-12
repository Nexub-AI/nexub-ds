---
"@nexub/themes": minor
"@nexub/react": minor
"@nexub/icons": patch
"@nexub/tokens": patch
"@nexub/patterns": patch
---

Accessibility and stability fixes.

- **Contrast (WCAG AA):** new `--color-fill-*` tokens (fixed shades, white text ≥ 4.5:1 in light and dark). Button, IconButton, Badge (solid), Checkbox, Pagination, Sidebar, DatePicker, FilterChip, AlertDialog and StepIndicator use them. Primary is now brand-600, which is visibly a little deeper. `--color-text-{info,success,warning,danger}` now alias the `-strong` shades, placeholder text uses `text-muted`, and icon tones follow the text tones.
- **Focus ring:** `--shadow-focus` follows `--color-ring-*`, so it's correct in dark mode and brand themes.
- **Slider:** thumbs no longer remount (and lose focus) on every value change. New `thumbLabels` prop; `aria-label` now names the thumb.
- **Rating:** radio-group keyboard support (one tab stop, arrows, Home/End).
- **Motion:** exits always complete, even when `transitionend` never fires (e.g. `duration="instant"`). Bubbled child events are ignored.
- **Toaster** renders `action`. The close button stays visible on touch devices.
- **Autocomplete** shows the selected label (not the id), filters by label, and renders a real "Loading…".
- **NumberInput:** steppers respect bounds when `disabled={false}`.
- **TopNav:** the menu scrolls instead of disappearing below `md`; `<nav aria-label="Main">`; `Item` supports `asChild`.
- **Sidebar:** the root is now `<nav aria-label="Sidebar">` (was `<aside>`); `Item` supports `asChild`, keeps an accessible name and tooltip when collapsed.
- **Link:** new-tab links always get `noopener noreferrer` (merged with the caller's `rel`); supports `asChild`.
- `@nexub/tokens`: brand-primary-800 is now `#1e40af` (was a copy of 900).
