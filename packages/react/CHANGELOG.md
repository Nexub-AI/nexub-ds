# @nexub/react

## 1.5.1

### Patch Changes

- 5aaeb38: `TextGradient`: render the brand gradient. The class compiled to `background-color`, so the gradient was dropped and the clipped text was invisible.
  - @nexub/icons@1.5.1

## 1.5.0

### Minor Changes

- ffb9dec: New components (design refresh Phase 5).
  - **`SplitButton`**: a primary action plus a chevron menu of related actions, as one connected control. Takes the Button variants, sizes and tones; `menu` holds `DropdownMenu.Item`s; `menuLabel` names the toggle.
  - **`ButtonGroup attached`** now renders as a connected group: capsule outer ends, 6px inner corners and 2px seams. Each segment keeps its own state layer and focus ring.
  - **`Toolbar.Root floating`**: a glass-capsule floating toolbar, with `placement="bottom"` to pin it to the bottom centre. Toolbar is also restyled onto the refresh (capsule state-layer items, secondary-container toggles).
  - **`NavigationRail`** (`Root`, `Item`): navigation for medium widths, with icons over labels and an active pill; `asChild` accepts router links.
  - **`Amount`**: money via `Intl.NumberFormat`, with tabular numerals, the currency's minor unit and a true minus sign. `size="display"` is a hero figure with a quieter symbol and minor units; `tone="auto"` colours gains and losses.
  - **`MoneyInput`**: an amount field with the currency symbol leading. It parses the locale's separators as you type (`onValueChange(number | null)`, rounded to the minor unit) and groups the value on blur.
  - **`ListDetail`** (patterns): the list-detail layout using a container query. At 720px+ of its own width the panes sit side by side; narrower, one pane shows at a time, with `showDetail` / `onBack`.

### Patch Changes

- @nexub/icons@1.5.0

## 1.4.0

### Minor Changes

- 6b51c55: Calm Depth core controls (design refresh Phase 2). Props and variant names are unchanged; the look moves onto the Phase 1 foundations.
  - **Button / IconButton**: capsule shape, the control-size ladder (md is now 40px; `data-density="compact"` shrinks it), role colours, and a state layer plus press spring instead of hover colour swaps. New variant names `filled`, `tonal`, `outlined`, `text`; `primary`, `secondary`, `subtle`, `outline` and `ghost` remain as aliases. Explicit disabled styling replaces 50% opacity.
  - **Input / Textarea / Select / Combobox**: 12px field shape, 16px text from md up, and a 2px primary border on focus instead of a halo ring. `invalid` uses the error role.
  - **Checkbox / Radio / Switch**: 2px outline borders (≥3:1), primary when on. Switch has new proportions and the thumb slides on a spring.
  - **Badge / Chip / Toggle**: role pairs (container / on-container), WCAG AA by construction.
  - **SegmentedControl / Tabs**: one indicator that slides to the selected item on a spring. Tabs now use a primary underline.
  - **Slider**: thin track, solid primary knob, and a state-layer halo.
  - Focus is the single global ring for every control. `cn` now understands the token scales (`text-label-lg`, `rounded-shape-*`, `h-control-*`, `shadow-elevation-*`).

- 8ee088d: Calm Depth surfaces & overlays (design refresh Phase 4). Props are unchanged.
  - **New role `--color-surface-elevated`** for floating layers: white in light, lighter than the page in dark. `--color-bg-raised` and `--color-surface-raised` now alias it; before, they were darker than the page in dark mode.
  - **Overlays** (Dialog, AlertDialog, CommandPalette, Drawer): 24px shape, the elevated surface, elevation 3, a 40% scrim, and spring enter/exit. AlertDialog's Action and Cancel are now real `Button` styles (destructive / outlined).
  - **Floating surfaces** (Popover, HoverCard, DropdownMenu, ContextMenu, Menubar, Select, NavigationMenu): 16px shape, elevation 2, and menu items with a concentric 10px radius, an on-surface state layer and explicit disabled text.
  - **Tooltip**: inverse surface on its own z-tier (`--z-tooltip`), so it no longer sits on the popover tier, and it now flips correctly in dark mode.
  - **Toast / Toaster**: an inverse-surface snackbar with an `inverse-primary` action.
  - **Card**: the elevated surface plus a soft alpha hairline. Shadows only for `surface` and `interactive`; `interactive` uses the state layer and a spring lift.
  - **Navigation**: TopNav and NavigationMenu items are capsules with state layers. The Sidebar is a tonal panel without a divider, and its active item is a secondary-container pill instead of a solid brand fill.
  - **AppHeader**: a glass header's account menu offers the glass intensity dial (Clear / Balanced / Tinted / Solid).

- 15c47b5: **`CommandPalette.Root`**: new props and a focus fix.
  - `scrollLock="class"` locks page scroll with the `nexub-scroll-lock` class instead of Radix's injected `<style>`, so the palette opens under `style-src 'self'`.
  - `shouldFilter={false}` for results that are already filtered (async search), and `label` for the dialog's accessible name (default "Command palette"; also silences Radix's missing-title warning).
  - Closing now returns focus to the element focused before it opened. Without a `Dialog.Trigger`, focus used to drop to `<body>`.
  - The dialog keeps a 1rem margin each side on phones.

- 14d2e1a: Glass 2.0 (design refresh Phase 3).
  - **Recipe**: the fill is the surface role at the dial's opacity (`color-mix`), so dark glass needs no separate values. `backdrop-filter` is `blur + saturate`, and the edge is a hairline with a top specular highlight and a bottom rim. Same `surface="glass"` API.
  - **Thickness** scales with size: buttons are thin (8px blur, elevation 1), bars and popovers regular (16px, elevation 2), dialogs and drawers thick (28px, elevation 3). Set `data-glass-thickness` to override.
  - **Intensity dial**: `ThemeProvider` gains `glass` / `setGlass` (`'clear' | 'balanced' | 'tinted' | 'off'`), persisted under `nexub-glass` and applied pre-paint by `ThemeScript`. It sets `data-glass` on `<html>`, and any ancestor can set it too.
  - **Variants**: `data-glass-tint="primary"` for the single emphasised action, and `data-glass-variant="clear"` over imagery only.
  - **Scroll edge**: `TopNav.Root` / `AppHeader` accept `scrollEdge="soft" | "hard"`. Soft dissolves content under the bar instead of showing a divider.
  - **Button `variant="glass"`** (thin glass).
  - **Fallbacks are solid** under `prefers-reduced-transparency`, `prefers-contrast: more` (plus a 2px outline), `forced-colors`, `data-glass="off"`, and in browsers without `backdrop-filter`.

### Patch Changes

- Updated dependencies [c0fe350]
  - @nexub/icons@1.4.0

## 1.3.0

### Minor Changes

- d907d10: **Strict CSP: `Sheet` / `Drawer` can lock scroll without an injected `<style>`.**
  - New `scrollLock` prop on `Sheet.Root` / `Drawer.Root`: `"style"` (default, unchanged) or `"class"`. With `"class"`, page scroll is locked by the `nexub-scroll-lock` class from `@nexub/themes/base` on `<html>` (keeping the scrollbar's space, so nothing shifts) instead of Radix's injected `<style>` tag, which `style-src 'self'` blocks. The sheet stays modal: focus trap, hidden background for screen readers, Escape and outside-click still work.
  - `SettingsLayout`'s phone menu uses `scrollLock="class"`, so it opens under a strict CSP with no console error and the page behind is locked.
  - `@nexub/themes/base` also ships Radix's scrollbar-hiding rule for `ScrollArea` and `Select` viewports, so they look right when a strict CSP blocks Radix's `<style>` tag.
  - New docs page, Getting Started → Strict CSP: which components are CSP-safe and how to use the others.
- d907d10: **`Sheet` / `Drawer` are fully typed without `vaul`.** The published types imported `vaul`, which isn't a dependency (it's bundled), so `Sheet.Root` and its props resolved to `any` in apps. They're now declared in `@nexub/react` itself (new `DrawerRootProps` export), so `onOpenChange={(open) => …}` infers `boolean` with no extra installs. Apps can drop their `(open: boolean)` annotations. The build now fails if a `.d.ts` file imports `vaul`.
- d907d10: **`Sidebar.Header` with a product logo and a status.** New `Sidebar.Header` takes the logo as children and an optional `status` (e.g. a "Live" `Badge`). They sit on one row when they fit; otherwise the status moves under the logo. When the sidebar is collapsed, the status is visually hidden but still announced.
  - `Logo` with `product` truncates the product name with an ellipsis when its container is too narrow, instead of overflowing.
  - `SettingsLayout`'s top bar lets a long product logo shrink and truncate next to the actions.
- fc5ca7d: Add `ThemeScript`: render it in `<head>` to apply the stored theme (and optionally the product brand) before first paint, so server-rendered apps no longer flash the wrong theme. Takes a `nonce` for pages with a strict Content-Security-Policy.

### Patch Changes

- @nexub/icons@1.3.0

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
