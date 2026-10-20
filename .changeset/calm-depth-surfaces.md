---
"@nexub/tokens": minor
"@nexub/themes": minor
"@nexub/react": minor
"@nexub/patterns": minor
---

Calm Depth surfaces & overlays (design refresh Phase 4). Props are unchanged.

- **New role `--color-surface-elevated`** for floating layers: white in light, lighter than the page in dark. `--color-bg-raised` and `--color-surface-raised` now alias it; before, they were darker than the page in dark mode.
- **Overlays** (Dialog, AlertDialog, CommandPalette, Drawer): 24px shape, the elevated surface, elevation 3, a 40% scrim, and spring enter/exit. AlertDialog's Action and Cancel are now real `Button` styles (destructive / outlined).
- **Floating surfaces** (Popover, HoverCard, DropdownMenu, ContextMenu, Menubar, Select, NavigationMenu): 16px shape, elevation 2, and menu items with a concentric 10px radius, an on-surface state layer and explicit disabled text.
- **Tooltip**: inverse surface on its own z-tier (`--z-tooltip`), so it no longer sits on the popover tier, and it now flips correctly in dark mode.
- **Toast / Toaster**: an inverse-surface snackbar with an `inverse-primary` action.
- **Card**: the elevated surface plus a soft alpha hairline. Shadows only for `surface` and `interactive`; `interactive` uses the state layer and a spring lift.
- **Navigation**: TopNav and NavigationMenu items are capsules with state layers. The Sidebar is a tonal panel without a divider, and its active item is a secondary-container pill instead of a solid brand fill.
- **AppHeader**: a glass header's account menu offers the glass intensity dial (Clear / Balanced / Tinted / Solid).
