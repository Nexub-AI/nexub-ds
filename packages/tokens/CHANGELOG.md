# @nexub/tokens

## 2.0.0

## 1.9.0

### Minor Changes

- 842ab9c: 1.9.0 — foundations (ENHANCEMENTS_PLAN.md release tracker).

  - **Brand theming from a seed colour.** `ThemeProvider seed="#e4572e"` (and `seedTarget="tertiary"` for a product brand) regenerates the accent roles at runtime with the same HCT tone table as the built-in themes, so contrast pairs stay AA in light, dark and every contrast level. The colour maths loads lazily, only when `seed` is set, and is applied through the CSSOM (strict-CSP safe). For SSR, `createSeedTheme()` / `createSeedThemeCss()` from the new `@nexub/tokens/seed` entry give the same values as data or CSS.
  - **Tailwind v4.** `@import "@nexub/tokens/tailwind.css"` after `@import "tailwindcss"` gives v4 apps the same utilities as the v3 preset (colour roles, shapes, elevation, type roles, spring timings, spacing), generated from the same token data and tested against Tailwind 4.3. The v3 preset is unchanged.

## 1.8.0

### Minor Changes

- 2e931b7: 1.8.0 — adoption (ENHANCEMENTS_PLAN.md release tracker).

  - **`npx nexub-migrate`** (ships in `@nexub/tokens`): moves app code onto current conventions — legacy colour names → roles, physical → logical (RTL) classes; reports tailwindcss-animate classes and dead `[var(--x)]/NN` opacity modifiers. Dry run by default, `--write` to apply, `--check` for CI.
  - **Upgrading guide** and an **example dashboard** in the docs, built only from public APIs.
  - **DataTable**: `DataTableColumn<T>` type export, column alignment (`meta.align`), `caption`/`captionHidden`, `aria-label` on the table itself, translatable pager; sort buttons no longer submit forms; translatable empty state (default text is now "No results found."). Note: the `ColumnMeta` augmentation adds an `align` field to TanStack's column meta.
  - **Table.Root** is keyboard-scrollable (named region) when it overflows. **Kbd** keeps shortcut order in RTL. **NumberTicker** no longer reverses digits in RTL.
  - **StatCard** `sentiment` (colour independent of the arrow); **PageHeader** `level`; **SplitButton** `status="loading"` disables the menu toggle.
  - **AppHeader** `position` (`fixed` default, `sticky`, `static`) and translatable strings via NexubProvider.

## 1.7.0

### Minor Changes

- 839c92c: 1.7.0 — hardening (ENHANCEMENTS_PLAN.md release tracker).

  - **Date pickers follow the reader.** `DatePicker` / `DateRangePicker` take a date-fns `locale` (or `NexubProvider dateLocale`) for month and weekday names, week start and the trigger format, follow `dir` (arrows and range bands flip in RTL), and their calendar labels are translatable messages.
  - **FileUpload** is a native `<label>` around the file input: one control with the visible text as its name (no nested buttons), keyboard and click open the picker natively, and file sizes format with `Intl` in the active locale.
  - **Accessibility fixes found by automated checks over every story:** a nameless `Avatar` is decorative (`aria-hidden`) instead of an unnamed image; `ScrollArea` viewports are keyboard-scrollable; `ActivityFeed` is a plain list (its `feed` role broke list semantics); the `NotificationItem` unread dot has an image role.
  - `Toast.Root` follows the finger when swiped, and toasts swipe toward the inline end in RTL.
  - Releases publish with npm trusted publishing only — no long-lived npm token.

## 1.6.0

### Minor Changes

- d42a650: Wave 1 — secure and consistent (ENHANCEMENTS_PLAN.md).

  - **Strict CSP.** Layout and text components render scale values as classes, so server HTML carries no `style` attribute (blocked under `style-src` without `'unsafe-inline'`): `Stack`/`Flex`/`Grid` (`gap`, `align`, `justify`, `cols`, `rows`), `Text` `lineClamp` 1–6, `Heading`/`Label`/`HelperText` `tone`, `AspectRatio` common ratios, `Skeleton` defaults, `GradientDivider`, auto-growing `Textarea`. Off-scale values still fall back to inline style. `Progress` sets its fill through the CSSOM.
  - **Every component on Calm Depth.** The ~45 components the refresh hadn't reached now use colour roles, shape and elevation tokens, the global focus ring, colour-based disabled states and the state layer. Brand tones (`leap`, `bookub`, `payub`, `founderub`) now tint text in `Heading`, `Label`, `HelperText` and `EyebrowChip` instead of falling back.
  - **Brand accent roles.** `--color-leap`, `--color-on-leap`, `--color-leap-container`, `--color-on-leap-container` (and the same for `bookub`, `payub`, `founderub`), with light/dark and high-contrast values, plus Tailwind colours of the same names. New `--gradient-brand-vertical`.
  - **Spring enter/exit.** Overlays, menus, tooltips and toasts animate with `nx-motion` (themes/base.css): opacity on the effects spring, scale and travel on the spatial spring, quicker exits, and a crossfade-only fallback under reduced motion. Components no longer depend on `tailwindcss-animate` (the preset still registers it for your own classes).

- 28bced6: Wave 2 — cards, effects and motion (ENHANCEMENTS_PLAN.md).

  - **Cards.** `Card variant="interactive"` lifts 2px on a spring with elevation 1 → 2 and sinks on press (`nx-lift`; hover only where a real pointer hovers). Opt-in `effect="sheen"`: a soft light and rim follow the pointer (off for touch, reduced motion and reduced transparency). New `CardLink` makes the whole card one link with the focus ring on the card. New `usePointerSheen` hook.
  - **New components.** `RadioCardGroup`/`RadioCard` and `CheckboxCard` (selectable cards with a springing check badge), `MediaCard` (image with a glass caption and optional stretched link), `NumberTicker` (rolling digits; `Amount animate`, `StatCard animate`), and `BentoGrid`/`BentoTile` in patterns (container-query tiles).
  - **Toasts stack.** `Toaster` shows the newest toast with older ones peeking behind it and fans them out on hover or focus (timers pause meanwhile). New props `expand` and `visibleToasts`. Closed toasts are now removed from the store.
  - **Motion.** Checkbox checks draw in; `nx-reveal` crossfades content in; `AppHeader condense` shrinks the bar on scroll with a CSS scroll timeline; opt-in page transitions via `@nexub/themes/view-transitions` and `startViewTransition()`. Tooltips and hover cards share hover-intent delays. Under reduced motion, overlays now keep a short crossfade instead of popping in.
  - **Tokens.** New `--color-scrim` role.

- c57d385: Wave 3 — colour and UX (ENHANCEMENTS_PLAN.md).

  - **Data-viz colour.** `--color-chart-1..8` are now generated, light/dark aware, ≥3:1 on surfaces and tested to stay distinguishable under protanopia, deuteranopia and tritanopia (CIEDE2000 ≥ 10 between neighbours). New sequential `--color-chart-seq-1..7` and diverging `--color-chart-div-1..7`; Tailwind `chart` colours follow.
  - **Wide gamut.** On P3 displays the accent fills (primary, tertiary, semantic and brand accents) gain ~18% chroma via relative colour syntax; lightness — and so contrast — is unchanged.
  - **Medium contrast.** `data-contrast="medium"` sits between standard and high, AA-tested everywhere.
  - **Async buttons.** `Button status="loading" | "success" | "error"`: the width holds, focus stays (aria-disabled), success draws a check, error shakes once, and each change is announced. `SplitButton` keeps focus while loading.
  - **Forms.** New `ErrorSummary` pattern + `useFormErrors()` hook (focus moves to the summary; links focus the field).
  - **Undo over confirm.** `toast.undoable(title, { onUndo, onCommit })` commits exactly once when the toast closes without Undo.
  - **i18n and RTL.** New `NexubProvider` (`locale`, `dir`, `messages`) with Radix direction support; every built-in English string is a translatable message, and Intl formatting follows the provider locale. Components use logical properties throughout, directional icons mirror, and the Switch thumb and toasts follow the reading direction.
  - **Touch targets.** Button, IconButton, Checkbox, Radio and Switch get an invisible 44×44 hit area on touch screens.
  - **Optics.** Tables, pagination and stat values use tabular figures.

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
