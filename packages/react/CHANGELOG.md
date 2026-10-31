# @nexub/react

## 2.4.0

### Minor Changes

- 89acedb: Release hardening (2.4.0). No API changes.

  - Each `@nexub/react-native` preview example is now checked on a real iOS simulator and Android emulator against committed screenshot baselines, so an unintended visual change fails CI the way web visual regression already does. The docs show the same screenshots under "On device" on native component pages.
  - Deprecated components (Banner, Callout, Tag, StatusPill) now have a removal target: 3.0. See GOVERNANCE.md for the status lifecycle (alpha → beta → stable → deprecated) and the deprecation policy.

### Patch Changes

- da054ef: Governance and component status. New `GOVERNANCE.md`: RFCs (when they are required and a template), who decides, the `alpha → beta → stable → deprecated` lifecycle with promotion criteria, and the deprecation policy (deprecate in a minor, remove only in the next major). The `@deprecated` JSDoc on `Banner`, `Callout`, `Tag` and `StatusPill` now says their removal is planned in 3.0 (it said 1.0); no behaviour change. The docs show a status badge on every component page, including Alpha on the React Native pages, and a "Deprecated — removal planned in 3.0" notice with the replacement on deprecated ones; the AI references in `@nexub/mcp` carry the same removal note.
  - @nexub/icons@2.4.0
  - @nexub/core@2.4.0

## 2.3.1

### Patch Changes

- c67c72a: Published with npm trusted publishing (OIDC) from the `Nexub-AI/nexub-ds` release workflow, so every version now carries npm provenance: you can check on npmjs.com that it was built from this repository's source. No code changes.
- Updated dependencies [c67c72a]
  - @nexub/icons@2.3.1
  - @nexub/core@2.3.1

## 2.3.0

### Minor Changes

- 5771f93: `Sidebar.Footer` now sticks to the bottom of the sidebar (sidebar surface, top border) while the items scroll. `SettingsLayout` takes a new `navFooter` prop, pinned to the bottom of the section sidebar and the phone section menu, e.g. `navFooter="v1.2.0 · Updated 21 Oct 2026"`.

### Patch Changes

- 23d164c: Tailwind CSS 4 support. Consumers on Tailwind 3 are unaffected: keep using the `@nexub/tokens/tailwind` preset.

  - `@nexub/tokens`: the optional `tailwindcss` peer now accepts `^3.0.0 || ^4.0.0`. The v4 theme (`@import "@nexub/tokens/tailwind.css"`) now renders like the v3 preset in two places where it did not:
    - `max-w-sm` … `max-w-2xl` are Tailwind's own scale again (24rem … 42rem). Before, they picked up the Nexub `--container-*` layout tokens of the same name and rendered much wider. `max-w-container-*` still map to the tokens.
    - `text-xs` … `text-4xl` keep v3's line-height lengths (`text-sm` = 1.25rem) instead of v4's unitless ratios, so components nested in `text-sm` (a badge in a table cell, for example) keep their height.
  - `@nexub/themes`: `base.css` gives buttons the pointer cursor that Tailwind 3's preflight set and Tailwind 4's no longer does. It has zero specificity, so `cursor-*` utilities still win.
  - `@nexub/react`: `Pagination` page buttons set `tabular-nums` themselves. The nav already asked for tabular figures, but on Tailwind 3 the buttons never inherited them; on Tailwind 4 they did. Both now show tabular figures.
  - The docs site and Storybook are now built with Tailwind 4. Getting Started documents both setups, including importing the theme CSS into the `base` layer on v4.
  - @nexub/icons@2.3.0
  - @nexub/core@2.3.0

## 2.2.0

### Minor Changes

- 8226753: **Motion on the spring tokens, web and native:**

  - `Fade`, `Slide`, `Scale` and `Collapse` ride the spring tokens: opacity on `effects`, movement on `spatial`, and a quicker exit that never overshoots. `duration` maps to fast / default / slow springs. Passing `easing` keeps the old duration + easing tokens, so existing code can opt out. Under reduced motion they keep the fade and drop travel and scale.
  - `Drawer` / `Sheet` slide on the springs instead of vaul's fixed 0.5 s curve. Exit is quicker, and the panel fades instead of sliding under reduced motion.
  - New `ListTransition`: keyed items grow in, and removed items collapse and fade out in place. It works as `<ListTransition as="ul" itemAs="li">`.
  - New `SkeletonSwap`: crossfades from a skeleton to the loaded content and sets `aria-busy` while loading.
  - New `usePrefersReducedMotion()` hook.
  - `@nexub/themes/base`: `nx-stagger` (children rise in 40 ms apart), plus the `nx-list-item` and `nx-swap` keyframes the components use.
  - `@nexub/react-native`: `nxEnter`, `nxExit`, `nxLayout` (Reanimated layout animations) and `nxSpring` (a `withSpring` config), built from the same spring tokens. All of them follow the OS Reduce Motion setting.
  - Native animations:
    - Toast and Banner animate in and out.
    - `ListSection` rows grow in and fade out while the other rows glide into place.
    - `SwipeableRow` slides out toward the start edge when removed.
    - `Chip` glides to its new width and its check pops in.
    - The `SegmentedControl` pill slides between segments.
    - `Amount` has an opt-in `animate` prop.
    - Skeleton pulses at the web rhythm.

### Patch Changes

- @nexub/icons@2.2.0
- @nexub/core@2.2.0

## 2.1.0

### Minor Changes

- 736b9a5: **React Native support, foundations** (MOBILE_PLAN.md, phase M1):

  - New `@nexub/core`: the strings, locale direction, money formatting and shared prop types (`ToneValue`, `GlassMode`, …), now shared by web and native. `@nexub/react` re-exports everything it moved, so the web API is unchanged.
  - `@nexub/tokens/native`: tokens for React Native. Dimensions as dp numbers, colour roles resolved to hex per contrast level × scheme (plus product remaps), elevation as per-scheme `boxShadow`, and springs as Reanimated configs. A test keeps them equal to the CSS.
  - `@nexub/tokens/seed`: `createSeedRoles(seed)` returns the seeded family as `{ light, dark }` hex, for native.
  - `@nexub/icons/native`: the same icon names as `@nexub/icons`, on `lucide-react-native` (an optional peer).
  - New `@nexub/react-native` (alpha):
    - `NexubNativeProvider`: scheme, contrast (follows iOS Increase Contrast / Android high-contrast text), product, seed, glass dial (off under Reduce Transparency), Reduce Motion, haptics, locale, RTL and strings.
    - Primitives: `Text`/`Heading` (role type, Dynamic Type ramps), `Pressable` (state layer + 0.97 press spring + semantic haptics), `Surface` (tonal tiers, elevation, native Liquid Glass on iOS 26+ with a solid fallback), `Box`/`Stack`/`Inline`, `Icon` and `ScreenContainer`.
    - `nexubFonts` for `useFonts` (Inter, Plus Jakarta Sans, Geist Mono; OFL).

### Patch Changes

- Updated dependencies [c5cd6c5]
- Updated dependencies [736b9a5]
- Updated dependencies [080d2a4]
  - @nexub/core@2.1.0
  - @nexub/icons@2.1.0

## 2.0.0

### Patch Changes

- @nexub/icons@2.0.0

## 1.9.0

### Minor Changes

- 842ab9c: 1.9.0 — foundations (ENHANCEMENTS_PLAN.md release tracker).

  - **Brand theming from a seed colour.** `ThemeProvider seed="#e4572e"` (and `seedTarget="tertiary"` for a product brand) regenerates the accent roles at runtime with the same HCT tone table as the built-in themes, so contrast pairs stay AA in light, dark and every contrast level. The colour maths loads lazily, only when `seed` is set, and is applied through the CSSOM (strict-CSP safe). For SSR, `createSeedTheme()` / `createSeedThemeCss()` from the new `@nexub/tokens/seed` entry give the same values as data or CSS.
  - **Tailwind v4.** `@import "@nexub/tokens/tailwind.css"` after `@import "tailwindcss"` gives v4 apps the same utilities as the v3 preset (colour roles, shapes, elevation, type roles, spring timings, spacing), generated from the same token data and tested against Tailwind 4.3. The v3 preset is unchanged.

### Patch Changes

- @nexub/icons@1.9.0

## 1.8.0

### Minor Changes

- 2e931b7: 1.8.0 — adoption (ENHANCEMENTS_PLAN.md release tracker).

  - **`npx nexub-migrate`** (ships in `@nexub/tokens`): moves app code onto current conventions — legacy colour names → roles, physical → logical (RTL) classes; reports tailwindcss-animate classes and dead `[var(--x)]/NN` opacity modifiers. Dry run by default, `--write` to apply, `--check` for CI.
  - **Upgrading guide** and an **example dashboard** in the docs, built only from public APIs.
  - **DataTable**: `DataTableColumn<T>` type export, column alignment (`meta.align`), `caption`/`captionHidden`, `aria-label` on the table itself, translatable pager; sort buttons no longer submit forms; translatable empty state (default text is now "No results found."). Note: the `ColumnMeta` augmentation adds an `align` field to TanStack's column meta.
  - **Table.Root** is keyboard-scrollable (named region) when it overflows. **Kbd** keeps shortcut order in RTL. **NumberTicker** no longer reverses digits in RTL.
  - **StatCard** `sentiment` (colour independent of the arrow); **PageHeader** `level`; **SplitButton** `status="loading"` disables the menu toggle.
  - **AppHeader** `position` (`fixed` default, `sticky`, `static`) and translatable strings via NexubProvider.

### Patch Changes

- @nexub/icons@1.8.0

## 1.7.0

### Minor Changes

- 839c92c: 1.7.0 — hardening (ENHANCEMENTS_PLAN.md release tracker).

  - **Date pickers follow the reader.** `DatePicker` / `DateRangePicker` take a date-fns `locale` (or `NexubProvider dateLocale`) for month and weekday names, week start and the trigger format, follow `dir` (arrows and range bands flip in RTL), and their calendar labels are translatable messages.
  - **FileUpload** is a native `<label>` around the file input: one control with the visible text as its name (no nested buttons), keyboard and click open the picker natively, and file sizes format with `Intl` in the active locale.
  - **Accessibility fixes found by automated checks over every story:** a nameless `Avatar` is decorative (`aria-hidden`) instead of an unnamed image; `ScrollArea` viewports are keyboard-scrollable; `ActivityFeed` is a plain list (its `feed` role broke list semantics); the `NotificationItem` unread dot has an image role.
  - `Toast.Root` follows the finger when swiped, and toasts swipe toward the inline end in RTL.
  - Releases publish with npm trusted publishing only — no long-lived npm token.

### Patch Changes

- @nexub/icons@1.7.0

## 1.6.0

### Minor Changes

- f34aaa2: Dependency refresh (Radix UI, date-fns, React 19.3 floor). With `@radix-ui/react-toggle-group` 1.2, `ToggleGroup` and `SegmentedControl` expose better ARIA roles: a single-select root is now `role="radiogroup"` with `role="radio"` / `aria-checked` items (was `group` / `aria-pressed`), and a multi-select root is `role="toolbar"`. Update any tests or selectors that query `role="group"` on these components.
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

- c867e37: Wave 4 — AI surface kit (ENHANCEMENTS_PLAN.md).

  - `PromptInput`: an auto-growing composer with attachment and action slots; Enter sends, Shift+Enter adds a line, IME-safe; Send becomes Stop while streaming (Escape stops too); solid or glass.
  - `ThinkingIndicator`: a softly morphing shape with a shimmering label; `role="status"`; static under reduced motion.
  - `StreamingText`: new text fades in as it arrives with a caret while streaming; `aria-busy` instead of a chatty live region.
  - `MessageBubble` + `MessageActions`: user / assistant / system messages as labelled articles; copy (with a drawn check), thumbs up/down, regenerate; actions appear on hover or focus on pointer devices and stay visible on touch.
  - `Citation`, `SourceChip`, `SourceList`: numbered source markers with a hover-card preview, and a source row; only http/https links are rendered (`safeUrl`).
  - Patterns `Conversation`: a stick-to-bottom message list with a "Jump to latest" button and a composer slot.
  - 18 new translatable messages in `NexubProvider` for the AI surfaces.

### Patch Changes

- @nexub/icons@1.6.0

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
