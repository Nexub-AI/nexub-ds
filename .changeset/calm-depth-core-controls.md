---
"@nexub/react": minor
---

Calm Depth core controls (design refresh Phase 2). Props and variant names are unchanged; the look moves onto the Phase 1 foundations.

- **Button / IconButton**: capsule shape, the control-size ladder (md is now 40px; `data-density="compact"` shrinks it), role colours, and a state layer plus press spring instead of hover colour swaps. New variant names `filled`, `tonal`, `outlined`, `text`; `primary`, `secondary`, `subtle`, `outline` and `ghost` remain as aliases. Explicit disabled styling replaces 50% opacity.
- **Input / Textarea / Select / Combobox**: 12px field shape, 16px text from md up, and a 2px primary border on focus instead of a halo ring. `invalid` uses the error role.
- **Checkbox / Radio / Switch**: 2px outline borders (≥3:1), primary when on. Switch has new proportions and the thumb slides on a spring.
- **Badge / Chip / Toggle**: role pairs (container / on-container), WCAG AA by construction.
- **SegmentedControl / Tabs**: one indicator that slides to the selected item on a spring. Tabs now use a primary underline.
- **Slider**: thin track, solid primary knob, and a state-layer halo.
- Focus is the single global ring for every control. `cn` now understands the token scales (`text-label-lg`, `rounded-shape-*`, `h-control-*`, `shadow-elevation-*`).
