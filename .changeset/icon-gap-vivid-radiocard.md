---
'@nexub/react': minor
'@nexub/themes': minor
---

Two fixes.

- **Icon and label spacing.** `SegmentedControl.Item`, `Tabs.Trigger` and `TopNav.Item` now put a 6px gap (`gap-1.5`) between an icon and its label, so apps no longer need `className="gap-1.5"`. Button, Badge, Chip, Toggle and FilterChip already had a gap.
- **Vivid no longer paints RadioCard and CheckboxCard with its gradient.** The gradient rule for checked selection controls now skips the cards (`data-selectable-card`). A selected card shows a primary edge and a 6% primary tint, with readable text in Vivid, Glass and the default theme, light and dark.
