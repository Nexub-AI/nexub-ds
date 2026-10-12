---
"@nexub/react": minor
"@nexub/themes": minor
---

**Sheet / Drawer fixes.**

- Left and right panels no longer scroll horizontally. vaul's over-drag strip (a `::after` 200% wide, past the panel edge) made the panel scrollable sideways once it scrolled at all. Side panels now clip x, which also lets long content scroll vertically with no extra classes. Apps can drop their `overflow-x-hidden` workaround.
- `Sheet.Overlay` / `Drawer.Overlay` now has default styling (full-screen scrim). It used to render unstyled.
- New `--color-overlay` token in `@nexub/themes/base` (`rgb(0 0 0 / 0.5)`). `Dialog`, `AlertDialog` and `CommandPalette` overlays use it instead of a hard-coded `bg-black/50`, with no visual change.
