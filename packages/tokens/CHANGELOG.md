# @nexub/tokens

## 1.5.1

## 1.5.0

## 1.4.0

### Minor Changes

- 275c4a0: Calm Depth foundations (design refresh Phase 1).
  - **Color roles**: generated tonal palettes (`--color-palette-<name>-<tone>`) and M3-style roles (`--color-primary`, `--color-on-primary`, `--color-*-container`, `--color-surface-container-{lowest…highest}`, `--color-on-surface(-variant|-muted)`, `--color-outline(-variant)`, `--color-inverse-*`, brand `--color-tertiary*`) in the new `@nexub/tokens/css/roles`, imported by `@nexub/themes/base`. Roles use `light-dark()`, so dark mode follows `color-scheme` at any depth; `data-contrast="high"` (or `prefers-contrast: more`) selects high-contrast tones. Every pair is WCAG 2.2 AA by construction and by test.
  - **Legacy names keep working**: `--color-bg-*`, `--color-text-*`, `--color-border-*`, `--color-semantic-*`, `--color-fill-*` now alias the roles. Visible changes: brand-tinted neutrals, a deeper primary (`#0059c7`), and a focus ring and muted text that now meet contrast.
  - **Typography**: Inter (variable, optical sizes) is the UI face (`--font-family-sans`); Plus Jakarta Sans moves to `--font-family-display` and headings. New role scale `--type-{display,headline,title,body,label}-{lg,md,sm}-*` (Tailwind `text-display-lg` …).
  - **Shape / elevation / state**: `--shape-{control,field,container,overlay,tooltip,min}`, `--elevation-{0..3}`, `--state-{hover,focus,pressed,dragged,disabled-*}`, plus `.nx-state-layer` and `.nx-press` utilities.
  - **Motion**: spring easings `--motion-spring-{spatial,effects,expressive}-{fast,default,slow}-{easing,duration}` (CSS `linear()`); Accordion/Collapsible height animation now works.
  - **Density**: `data-density="compact"` shifts `--size-control-*` one step down (Tailwind `h-control-md`).
  - Focus ring is one 3px outline (offset 2px) that follows the element's shape.

  Requires `light-dark()` (Baseline 2024: Chrome 123, Safari 17.5, Firefox 120).

- 8ee088d: Calm Depth surfaces & overlays (design refresh Phase 4). Props are unchanged.
  - **New role `--color-surface-elevated`** for floating layers: white in light, lighter than the page in dark. `--color-bg-raised` and `--color-surface-raised` now alias it; before, they were darker than the page in dark mode.
  - **Overlays** (Dialog, AlertDialog, CommandPalette, Drawer): 24px shape, the elevated surface, elevation 3, a 40% scrim, and spring enter/exit. AlertDialog's Action and Cancel are now real `Button` styles (destructive / outlined).
  - **Floating surfaces** (Popover, HoverCard, DropdownMenu, ContextMenu, Menubar, Select, NavigationMenu): 16px shape, elevation 2, and menu items with a concentric 10px radius, an on-surface state layer and explicit disabled text.
  - **Tooltip**: inverse surface on its own z-tier (`--z-tooltip`), so it no longer sits on the popover tier, and it now flips correctly in dark mode.
  - **Toast / Toaster**: an inverse-surface snackbar with an `inverse-primary` action.
  - **Card**: the elevated surface plus a soft alpha hairline. Shadows only for `surface` and `interactive`; `interactive` uses the state layer and a spring lift.
  - **Navigation**: TopNav and NavigationMenu items are capsules with state layers. The Sidebar is a tonal panel without a divider, and its active item is a secondary-container pill instead of a solid brand fill.
  - **AppHeader**: a glass header's account menu offers the glass intensity dial (Clear / Balanced / Tinted / Solid).

## 1.3.0

## 1.2.0

### Minor Changes

- d296fe3: **Branding: the official Nexub mark in `Logo`.**
  - `NexubMark` (`@nexub/icons`) now draws the official Nexub mark (the purple-blue ribbon), taken from the master SVG without redrawing. It replaces the placeholder "B". New `variant` prop: `"mono"` (default, `currentColor`, as before) or `"color"`. Each instance gets its own gradient ids, so several marks on one page don't clash.
  - `Logo` gets `mark="color" | "mono"` (default `"color"`) and `product?: string`. With `product`, it renders the mark, "nexub", a subtle separator and the product name in muted text at the wordmark's size, e.g. `<Logo product="Command Hub" />`. The accessible name becomes "Nexub Command Hub".
  - `Logo` `variant="icon"` is the new name for the mark-only variant. `variant="mark"` still works. `Logo` now has `role="img"`, so its name is announced.
  - The mark is sized by height at its real 78:56 ratio (it used to sit in a square box).
  - `@nexub/tokens`: 47 new brand tokens, `--color-brand-mark-1` … `--color-brand-mark-47` (Tailwind `brand-mark-*`), holding the mark's gradient colours. `Logo` and `NexubMark` contain no hex values.

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

- 7d8ed02: Lighter packages and cleaner dependencies.
  - `@nexub/icons`: add `Camera` and `Layers`. Drop the unused `@radix-ui/react-slot` dependency.
  - **Breaking:** `@nexub/tokens`: remove the empty `./css/light` and `./css/dark` stub exports; use `@nexub/themes/light` and `/dark`. Stop shipping source maps that pointed at unpublished `src/`.
  - **Breaking:** `@nexub/react`: `@nexub/tokens` moves from a dependency to a peer dependency (install it alongside). It was only used for CSS variables and the Tailwind preset, never imported from JS.

### Patch Changes

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

## 1.0.0
