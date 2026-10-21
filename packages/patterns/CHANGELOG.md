# @nexub/patterns

## 1.5.1

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

## 1.4.0

### Minor Changes

- 15c47b5: **New pattern `AppHeader`**: the one top header every Nexub app shares. It is presentational; the app passes data and callbacks in.
  - Left to right: a `menu` slot (below `md`), the logo (`homeHref`, `onNavigate`), a centred search field (an icon below `md`) that opens a `CommandPalette`, the organization (`orgs`, `currentOrgId`, `onOrgChange`), a theme switch (`useTheme`, `showThemeSwitch`), the `AppLauncher` (`apps`) and an account menu (`user`, `accountHref`, `privacyHref`, `termsHref`, `onSignOut`, `accountMenuItems`).
  - Search takes static `searchItems` or an async `onSearch(query)` (debounced, with loading, empty and error states). Opens with ⌘K / Ctrl+K anywhere and "/" outside text fields.
  - Fixed to the top at the new `--app-header-height` variable (64px, in `@nexub/themes/base`) and followed by a spacer of that height, so pages, `AppShell.Body` and `SettingsLayout` start below it with no padding of their own.
  - `surface="glass"`; strict-CSP safe (class scroll lock, non-modal menus); fits at 375px, where the org switcher collapses to an icon.

  **`SettingsLayout`**: new `header` prop, `header={(menu) => <AppHeader menu={menu} … />}`, which replaces its top bar and hands the phone section-menu button to the AppHeader's menu slot. Its top bar and sticky sidebar now use `--app-header-height`.

- 8ee088d: Calm Depth surfaces & overlays (design refresh Phase 4). Props are unchanged.
  - **New role `--color-surface-elevated`** for floating layers: white in light, lighter than the page in dark. `--color-bg-raised` and `--color-surface-raised` now alias it; before, they were darker than the page in dark mode.
  - **Overlays** (Dialog, AlertDialog, CommandPalette, Drawer): 24px shape, the elevated surface, elevation 3, a 40% scrim, and spring enter/exit. AlertDialog's Action and Cancel are now real `Button` styles (destructive / outlined).
  - **Floating surfaces** (Popover, HoverCard, DropdownMenu, ContextMenu, Menubar, Select, NavigationMenu): 16px shape, elevation 2, and menu items with a concentric 10px radius, an on-surface state layer and explicit disabled text.
  - **Tooltip**: inverse surface on its own z-tier (`--z-tooltip`), so it no longer sits on the popover tier, and it now flips correctly in dark mode.
  - **Toast / Toaster**: an inverse-surface snackbar with an `inverse-primary` action.
  - **Card**: the elevated surface plus a soft alpha hairline. Shadows only for `surface` and `interactive`; `interactive` uses the state layer and a spring lift.
  - **Navigation**: TopNav and NavigationMenu items are capsules with state layers. The Sidebar is a tonal panel without a divider, and its active item is a secondary-container pill instead of a solid brand fill.
  - **AppHeader**: a glass header's account menu offers the glass intensity dial (Clear / Balanced / Tinted / Solid).

- 14d2e1a: Glass 2.0 (design refresh Phase 3).
  - **Recipe**: the fill is the surface role at the dial's opacity (`color-mix`), so dark glass needs no separate values. `backdrop-filter` is `blur + saturate`, and the edge is a hairline with a top specular highlight and a bottom rim. Same `surface="glass"` API.
  - **Thickness** scales with size: buttons are thin (8px blur, elevation 1), bars and popovers regular (16px, elevation 2), dialogs and drawers thick (28px, elevation 3). Set `data-glass-thickness` to override.
  - **Intensity dial**: `ThemeProvider` gains `glass` / `setGlass` (`'clear' | 'balanced' | 'tinted' | 'off'`), persisted under `nexub-glass` and applied pre-paint by `ThemeScript`. It sets `data-glass` on `<html>`, and any ancestor can set it too.
  - **Variants**: `data-glass-tint="primary"` for the single emphasised action, and `data-glass-variant="clear"` over imagery only.
  - **Scroll edge**: `TopNav.Root` / `AppHeader` accept `scrollEdge="soft" | "hard"`. Soft dissolves content under the bar instead of showing a divider.
  - **Button `variant="glass"`** (thin glass).
  - **Fallbacks are solid** under `prefers-reduced-transparency`, `prefers-contrast: more` (plus a 2px outline), `forced-colors`, `data-glass="off"`, and in browsers without `backdrop-filter`.

## 1.3.0

### Minor Changes

- d907d10: **Strict CSP: `Sheet` / `Drawer` can lock scroll without an injected `<style>`.**
  - New `scrollLock` prop on `Sheet.Root` / `Drawer.Root`: `"style"` (default, unchanged) or `"class"`. With `"class"`, page scroll is locked by the `nexub-scroll-lock` class from `@nexub/themes/base` on `<html>` (keeping the scrollbar's space, so nothing shifts) instead of Radix's injected `<style>` tag, which `style-src 'self'` blocks. The sheet stays modal: focus trap, hidden background for screen readers, Escape and outside-click still work.
  - `SettingsLayout`'s phone menu uses `scrollLock="class"`, so it opens under a strict CSP with no console error and the page behind is locked.
  - `@nexub/themes/base` also ships Radix's scrollbar-hiding rule for `ScrollArea` and `Select` viewports, so they look right when a strict CSP blocks Radix's `<style>` tag.
  - New docs page, Getting Started → Strict CSP: which components are CSP-safe and how to use the others.
- d907d10: **`Sidebar.Header` with a product logo and a status.** New `Sidebar.Header` takes the logo as children and an optional `status` (e.g. a "Live" `Badge`). They sit on one row when they fit; otherwise the status moves under the logo. When the sidebar is collapsed, the status is visually hidden but still announced.
  - `Logo` with `product` truncates the product name with an ellipsis when its container is too narrow, instead of overflowing.
  - `SettingsLayout`'s top bar lets a long product logo shrink and truncate next to the actions.

## 1.2.0

### Minor Changes

- d296fe3: **New pattern `AppLauncher`** (the "waffle" app switcher), replacing the copies hand-built in each app.
  - `<AppLauncher apps={[{ id, name, href, icon?, current? }]} onNavigate? surface? label? />`: an `IconButton` ("Nexub apps") opens a 320px `Popover` (aligned to the end) with a 3-column grid of app tiles (40px rounded icon and name).
  - Missing or broken icons fall back to an `Avatar` with initials. The current app is subtly highlighted and marked `aria-current="page"`.
  - Keyboard: opens with focus on the current app; arrow keys move through the grid, Home/End jump to the ends. `onNavigate(app)` takes over plain clicks for client-side routing; modified clicks still open the link.
  - `surface="glass"` supported. Renders nothing for an empty list.
  - `@nexub/icons`: new `Apps` icon (3×3 dots).

- d296fe3: **New pattern `SettingsLayout`** (the My Account layout) and **`SettingsRow`**.
  - Full-width frame: a `TopNav` with `logo` and `actions` slots, and a left `Sidebar` of sections built from `items: { id, label, icon, href }[]`, with `activeId` highlighted. It works with any router: `onSelect(item)` takes over plain clicks, and `href` still works for modified clicks.
  - Under 768px the sidebar becomes a menu button that opens a left `Sheet` with the same items. Choosing one closes it.
  - Content area (max width 3xl) with an optional page header (`title`, `description`). Children are sections: use `SettingsLayout.Section` (a `Card` with an optional title and description).
  - `SettingsRow` (also `SettingsLayout.Row`): label (and optional description) on the left, value in the middle, action on the right. It stacks on phones.

## 1.1.0

### Minor Changes

- 50236f4: ESM-only packages, working tree-shaking, and RSC-safe builds.
  - **Breaking:** `@nexub/react`, `@nexub/patterns` and `@nexub/icons` ship ESM only (CJS builds removed). `@nexub/tokens` exports gain a `default` condition, so `require('@nexub/tokens/tailwind')` now works on Node ≥20.19.
  - `@nexub/react` and `@nexub/patterns` are built per component and every output file starts with `'use client'`, so they import cleanly from Next.js Server Components. A single-component import drops from ~130 KB gz to ~6–9 KB gz.
  - `@nexub/icons`: unused icons are now tree-shaken (one icon ≈1 KB gz, was ≈10 KB).
  - The Tailwind preset now registers `tailwindcss-animate`, so component enter/exit animations actually render. `tailwindcss` is an optional peer of `@nexub/tokens`.
  - `@nexub/themes`: dark mode is no longer forced when `data-theme` is absent; with no attribute the OS preference decides.
  - **Breaking:** `ThemeProvider` drops the `attribute` prop (`class` mode never matched the theme CSS). `system` mode now removes `data-theme` instead of setting it, and the provider no longer causes hydration mismatches. `useMediaQuery` starts `false` on first render.

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

- 7d8ed02: Lighter packages and cleaner dependencies.
  - `@nexub/icons`: add `Camera` and `Layers`. Drop the unused `@radix-ui/react-slot` dependency.
  - **Breaking:** `@nexub/tokens`: remove the empty `./css/light` and `./css/dark` stub exports; use `@nexub/themes/light` and `/dark`. Stop shipping source maps that pointed at unpublished `src/`.
  - **Breaking:** `@nexub/react`: `@nexub/tokens` moves from a dependency to a peer dependency (install it alongside). It was only used for CSS variables and the Tailwind preset, never imported from JS.

## 1.0.0

### Patch Changes

- Updated dependencies [099ed36]
  - @nexub/react@1.0.0
  - @nexub/tokens@1.0.0
  - @nexub/icons@1.0.0
