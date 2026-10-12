# @nexub/themes

## 1.2.0

### Minor Changes

- d296fe3: **CSP: `@nexub/react` no longer injects a `<style>` tag on load.** The Drawer library (vaul) added one as soon as `@nexub/react` was imported, even with no Drawer on the page, which strict Content-Security-Policy pages block. vaul is now bundled into `@nexub/react` with that call removed, and its styles ship in `@nexub/themes/base` instead. Apps that import `@nexub/themes/base` (all of them) need no change, and a strict CSP no longer needs a hash for that style. The build fails if vaul's styles and `base.css` drift apart. `vaul` moves from dependencies to devDependencies.
- d296fe3: **Sheet / Drawer fixes.**
  - Left and right panels no longer scroll horizontally. vaul's over-drag strip (a `::after` 200% wide, past the panel edge) made the panel scrollable sideways once it scrolled at all. Side panels now clip x, which also lets long content scroll vertically with no extra classes. Apps can drop their `overflow-x-hidden` workaround.
  - `Sheet.Overlay` / `Drawer.Overlay` now has default styling (full-screen scrim). It used to render unstyled.
  - New `--color-overlay` token in `@nexub/themes/base` (`rgb(0 0 0 / 0.5)`). `Dialog`, `AlertDialog` and `CommandPalette` overlays use it instead of a hard-coded `bg-black/50`, with no visual change.

### Patch Changes

- Updated dependencies [d296fe3]
  - @nexub/tokens@1.2.0

## 1.1.0

### Minor Changes

- 8814123: Plus Jakarta Sans is now the Nexub DS typeface.
  - `@nexub/tokens`: `--font-family-sans` (and the Tailwind `font-sans` utility) is now `'Plus Jakarta Sans Variable', 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif`. The Devanagari and Tamil stacks fall back to it. Previously the stack named Geist, which was never loaded, so apps rendered the system font.
  - `@nexub/themes/base` self-hosts the font via `@fontsource-variable/plus-jakarta-sans` (OFL-1.1). It provides variable weights 200–800, normal and italic, and `font-display: swap`. Subsets load on demand by `unicode-range`. Any app importing `@nexub/themes/base` gets the font with no extra setup and no third-party font request.
  - `base.css` makes `button`, `input`, `select` and `textarea` inherit the font, so form controls match even without Tailwind's preflight.

- 50236f4: ESM-only packages, working tree-shaking, and RSC-safe builds.
  - **Breaking:** `@nexub/react`, `@nexub/patterns` and `@nexub/icons` ship ESM only (CJS builds removed). `@nexub/tokens` exports gain a `default` condition, so `require('@nexub/tokens/tailwind')` now works on Node ≥20.19.
  - `@nexub/react` and `@nexub/patterns` are built per component and every output file starts with `'use client'`, so they import cleanly from Next.js Server Components. A single-component import drops from ~130 KB gz to ~6–9 KB gz.
  - `@nexub/icons`: unused icons are now tree-shaken (one icon ≈1 KB gz, was ≈10 KB).
  - The Tailwind preset now registers `tailwindcss-animate`, so component enter/exit animations actually render. `tailwindcss` is an optional peer of `@nexub/tokens`.
  - `@nexub/themes`: dark mode is no longer forced when `data-theme` is absent; with no attribute the OS preference decides.
  - **Breaking:** `ThemeProvider` drops the `attribute` prop (`class` mode never matched the theme CSS). `system` mode now removes `data-theme` instead of setting it, and the provider no longer causes hydration mismatches. `useMediaQuery` starts `false` on first render.

- 0a71d8d: Accessibility and stability fixes.
  - **Contrast (WCAG AA):** new `--color-fill-*` tokens (fixed shades, white text ≥ 4.5:1 in light and dark). Button, IconButton, Badge (solid), Checkbox, Pagination, Sidebar, DatePicker, FilterChip, AlertDialog and StepIndicator use them. Primary is now brand-600, which is visibly a little deeper. `--color-text-{info,success,warning,danger}` now alias the `-strong` shades, placeholder text uses `text-muted`, and icon tones follow the text tones.
  - **Focus ring:** `--shadow-focus` follows `--color-ring-*`, so it's correct in dark mode and brand themes.
  - **Slider:** thumbs no longer remount (and lose focus) on every value change. New `thumbLabels` prop; `aria-label` now names the thumb.
  - **Rating:** radio-group keyboard support (one tab stop, arrows, Home/End).
  - **Motion:** exits always complete, even when `transitionend` never fires (e.g. `duration="instant"`). Bubbled child events are ignored.
  - **Toaster** renders `action`. The close button stays visible on touch devices.
  - **Autocomplete** shows the selected label (not the id), filters by label, and renders a real "Loading…".
  - **NumberInput:** steppers respect bounds when `disabled={false}`.
  - **TopNav:** the menu scrolls instead of disappearing below `md`; `<nav aria-label="Main">`; `Item` supports `asChild`.
  - **Breaking:** **Sidebar:** the root is now `<nav aria-label="Sidebar">` (was `<aside>`); `Item` supports `asChild`, keeps an accessible name and tooltip when collapsed.
  - **Link:** new-tab links always get `noopener noreferrer` (merged with the caller's `rel`); supports `asChild`.
  - `@nexub/tokens`: brand-primary-800 is now `#1e40af` (was a copy of 900).

### Patch Changes

- 7d8ed02: Lighter packages and cleaner dependencies.
  - `@nexub/icons`: add `Camera` and `Layers`. Drop the unused `@radix-ui/react-slot` dependency.
  - **Breaking:** `@nexub/tokens`: remove the empty `./css/light` and `./css/dark` stub exports; use `@nexub/themes/light` and `/dark`. Stop shipping source maps that pointed at unpublished `src/`.
  - **Breaking:** `@nexub/react`: `@nexub/tokens` moves from a dependency to a peer dependency (install it alongside). It was only used for CSS variables and the Tailwind preset, never imported from JS.

- Updated dependencies [8814123]
- Updated dependencies [50236f4]
- Updated dependencies [0a71d8d]
- Updated dependencies [7d8ed02]
  - @nexub/tokens@1.1.0

## 1.0.0

### Minor Changes

- 099ed36: Add the Liquid Glass material layer.
  - `@nexub/themes/glass` — a translucent material, orthogonal to light/dark, with a backdrop blur, hairline border, specular highlight, and a solid fallback under `prefers-reduced-transparency` / `prefers-contrast`.
  - `surface="glass"` on Card, Dialog, Popover, Drawer, and TopNav opts a surface into the material (defaults to `solid`, so existing usage is unchanged).
  - Fix: the `tone` prop now actually paints on Button, HelperText, and Label (previously a no-op).

### Patch Changes

- @nexub/tokens@1.0.0
