---
"@nexub/react": minor
"@nexub/patterns": minor
---

New components (design refresh Phase 5).

- **`SplitButton`**: a primary action plus a chevron menu of related actions, as one connected control. Takes the Button variants, sizes and tones; `menu` holds `DropdownMenu.Item`s; `menuLabel` names the toggle.
- **`ButtonGroup attached`** now renders as a connected group: capsule outer ends, 6px inner corners and 2px seams. Each segment keeps its own state layer and focus ring.
- **`Toolbar.Root floating`**: a glass-capsule floating toolbar, with `placement="bottom"` to pin it to the bottom centre. Toolbar is also restyled onto the refresh (capsule state-layer items, secondary-container toggles).
- **`NavigationRail`** (`Root`, `Item`): navigation for medium widths, with icons over labels and an active pill; `asChild` accepts router links.
- **`Amount`**: money via `Intl.NumberFormat`, with tabular numerals, the currency's minor unit and a true minus sign. `size="display"` is a hero figure with a quieter symbol and minor units; `tone="auto"` colours gains and losses.
- **`MoneyInput`**: an amount field with the currency symbol leading. It parses the locale's separators as you type (`onValueChange(number | null)`, rounded to the minor unit) and groups the value on blur.
- **`ListDetail`** (patterns): the list-detail layout using a container query. At 720px+ of its own width the panes sit side by side; narrower, one pane shows at a time, with `showDetail` / `onBack`.
