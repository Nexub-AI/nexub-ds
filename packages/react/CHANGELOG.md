# @nexub/react

## 1.2.0

### Minor Changes

- d296fe3: **Branding: the official Nexub mark in `Logo`.**
  - `NexubMark` (`@nexub/icons`) now draws the official Nexub mark (the purple-blue ribbon), taken from the master SVG without redrawing. It replaces the placeholder "B". New `variant` prop: `"mono"` (default, `currentColor`, as before) or `"color"`. Each instance gets its own gradient ids, so several marks on one page don't clash.
  - `Logo` gets `mark="color" | "mono"` (default `"color"`) and `product?: string`. With `product`, it renders the mark, "nexub", a subtle separator and the product name in muted text at the wordmark's size, e.g. `<Logo product="Command Hub" />`. The accessible name becomes "Nexub Command Hub".
  - `Logo` `variant="icon"` is the new name for the mark-only variant. `variant="mark"` still works. `Logo` now has `role="img"`, so its name is announced.
  - The mark is sized by height at its real 78:56 ratio (it used to sit in a square box).
  - `@nexub/tokens`: 47 new brand tokens, `--color-brand-mark-1` … `--color-brand-mark-47` (Tailwind `brand-mark-*`), holding the mark's gradient colours. `Logo` and `NexubMark` contain no hex values.

- d296fe3: **CSP: `@nexub/react` no longer injects a `<style>` tag on load.** The Drawer library (vaul) added one as soon as `@nexub/react` was imported, even with no Drawer on the page, which strict Content-Security-Policy pages block. vaul is now bundled into `@nexub/react` with that call removed, and its styles ship in `@nexub/themes/base` instead. Apps that import `@nexub/themes/base` (all of them) need no change, and a strict CSP no longer needs a hash for that style. The build fails if vaul's styles and `base.css` drift apart. `vaul` moves from dependencies to devDependencies.
- d296fe3: **Sheet / Drawer fixes.**
  - Left and right panels no longer scroll horizontally. vaul's over-drag strip (a `::after` 200% wide, past the panel edge) made the panel scrollable sideways once it scrolled at all. Side panels now clip x, which also lets long content scroll vertically with no extra classes. Apps can drop their `overflow-x-hidden` workaround.
  - `Sheet.Overlay` / `Drawer.Overlay` now has default styling (full-screen scrim). It used to render unstyled.
  - New `--color-overlay` token in `@nexub/themes/base` (`rgb(0 0 0 / 0.5)`). `Dialog`, `AlertDialog` and `CommandPalette` overlays use it instead of a hard-coded `bg-black/50`, with no visual change.

- d296fe3: **Tabs: inactive panels stay hidden whatever display class they get.** A `Tabs.Content` with `className="flex"` (or `grid`, `md:flex`, …) used to show while inactive, because the class beat the `hidden` attribute. Inactive panels now get `display: none !important`. Apps can drop their `data-[state=inactive]:hidden` workaround.

### Patch Changes

- Updated dependencies [d296fe3]
- Updated dependencies [d296fe3]
- Updated dependencies [d296fe3]
  - @nexub/icons@1.2.0

## 1.1.0

### Minor Changes

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

- 7d8ed02: Lighter packages and cleaner dependencies.
  - `@nexub/icons`: add `Camera` and `Layers`. Drop the unused `@radix-ui/react-slot` dependency.
  - **Breaking:** `@nexub/tokens`: remove the empty `./css/light` and `./css/dark` stub exports; use `@nexub/themes/light` and `/dark`. Stop shipping source maps that pointed at unpublished `src/`.
  - **Breaking:** `@nexub/react`: `@nexub/tokens` moves from a dependency to a peer dependency (install it alongside). It was only used for CSS variables and the Tailwind preset, never imported from JS.

- aa2eaa9: - `DatePicker` and `DateRangePicker` accept `id` and `aria-label`, so the field can be labelled (the selected value is appended to the accessible name). Previously the trigger's name was only the value or placeholder.
  - `FormField.Root` forwards its ref. `Autocomplete` and `Toaster` get a `displayName`.
  - Removed unused imports in `Dialog`, `Drawer` and `Heading`.
  - **Deprecated** (still exported, removed in 1.0): `StatusPill` and `Tag` (use `Badge`), `Banner` and `Callout` (use `Alert`). Editors show a strike-through; the docs mark them deprecated.
  - `Banner` now uses `role="status"` instead of `role="banner"`, which is the page-header landmark.
  - **Input borders meet WCAG 1.4.11:** new `--color-border-input` token (light `#848e9f`, ≥ 3:1 on every light surface; dark `#64748b`, ≥ 3:1). It's used for the boundaries of Input, Textarea, Select, DatePicker, DateRangePicker, Checkbox, Radio and the FileUpload drop zone, which are visibly darker. `--color-border-default` (cards, dividers, popovers) is unchanged.

### Patch Changes

- Updated dependencies [50236f4]
- Updated dependencies [0a71d8d]
- Updated dependencies [7d8ed02]
  - @nexub/icons@1.1.0

## 1.0.0

### Minor Changes

- 099ed36: Add the Liquid Glass material layer.
  - `@nexub/themes/glass` — a translucent material, orthogonal to light/dark, with a backdrop blur, hairline border, specular highlight, and a solid fallback under `prefers-reduced-transparency` / `prefers-contrast`.
  - `surface="glass"` on Card, Dialog, Popover, Drawer, and TopNav opts a surface into the material (defaults to `solid`, so existing usage is unchanged).
  - Fix: the `tone` prop now actually paints on Button, HelperText, and Label (previously a no-op).

### Patch Changes

- @nexub/tokens@1.0.0
- @nexub/icons@1.0.0

## 0.0.2

### Patch Changes

- Focus ring & navigation performance fixes

  **@nexub/react**
  - **Input** — replace `border-transparent` focus trick with `border-color` shift + `color-mix()`-based semi-transparent ring halo; eliminates double-ring artifact on all field components
  - **Textarea** — same semi-transparent ring pattern; invalid state ring now also uses `color-mix()` for consistent look
  - **Select** — same ring fix on Trigger; invalid state colour updated to match
  - **NumberInput** — inner `<input>` now strips all focus indicators (`border-0 shadow-none ring-0 focus:ring-0 focus-visible:ring-0`) so the wrapper's `focus-within` ring is the only visible outline
  - **Heading** — move tone colour from dynamic Tailwind class (`` `text-[var(--color-text-${tone})]` ``) to inline `style` prop; fixes Turbopack CSS parse error caused by template literals being emitted literally into generated CSS

- 94f96f7: Performance & stability fixes
  - **Toast SSR guard** — store is now client-only on `globalThis`; server-side module evaluations receive a fresh local object so toast state never leaks across concurrent SSR requests
  - **Collapse RAF cleanup** — `requestAnimationFrame` IDs are now stored and cancelled in the `useEffect` cleanup, preventing state updates on unmounted components (memory leak)
  - **FileUpload context memo** — context value is wrapped in `useMemo` so consumers only re-render when a tracked value actually changes, not on every parent render
  - **useMergedRefs stable callback** — replaced the spread-array dependency (new reference every call, defeating `useCallback`) with a `useRef` of refs pattern; the returned function is now truly stable
  - **Motion willChange hints** — `Fade`, `Slide`, and `Scale` now set `willChange: 'opacity'` / `willChange: 'opacity, transform'` so browsers promote these elements to their own compositor layer, eliminating repaint jank on lower-end devices
  - **@types/react devDep** — aligned to `^19.0.0` to match the root pnpm override
