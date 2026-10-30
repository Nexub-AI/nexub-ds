# @nexub/icons

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

- 080d2a4: **React Native mobile-only components** (MOBILE_PLAN.md, phase M3), alpha:

  - **Overlays:** `BottomSheet` (detents incl. 'content', drag to resize or dismiss, grabber that cycles detents and is screen-reader operable, keyboard-aware), `ActionSheet` (the system sheet on iOS, a sheet on Android), `ContextMenu` (long-press, with the same items as accessibility actions), `Select` (a field that opens a sheet of choices).
  - **Gestures and lists:** `SwipeableRow` (swipe actions are also accessibility actions; the row is one element), themed `RefreshControl`, `Carousel` + `PageIndicator`.
  - **Payub inputs:** `OTPInput` (one field, so SMS autofill works: iOS oneTimeCode / Android sms-otp), `NumericKeypad`, `ExpressiveMoneyInput`, `DateTimeField` (platform pickers; optional peer `@react-native-community/datetimepicker`).
  - **Flow and privacy:** `StickyFooter` (primary action above the keyboard), `SensitiveValue` (masked, read as "hidden", re-masks in the background), `PrivacyShield` (covers the app-switcher snapshot; `preventCapture` with optional peer `expo-screen-capture`), `OfflineBanner`, `Coachmark`, `FAB` (Android only by default).
  - **Navigation, native chrome in Nexub colours:** `nexubStackOptions`, `nexubNavigationTheme`, `nexubTabsOptions`, `useNexubNavigation()`.
  - `@nexub/core`: mobile strings (resize, cancel, show/hide, hidden, keypad delete, code digit, offline, page, more actions).
  - `@nexub/icons`: `Delete` (backspace) icon.
  - `@nexub/react-native` exposes a `source` export condition for monorepo development; published installs use the built files.

## 2.0.0

## 1.9.0

## 1.8.0

## 1.7.0

## 1.6.0

## 1.5.1

## 1.5.0

## 1.4.0

### Minor Changes

- c0fe350: Fix the colour `<NexubMark>` (and `<Logo>`, `AppHeader`, `SettingsLayout`) rendering black on server-rendered pages with a strict Content-Security-Policy. Its gradient stops now use `nxm-*` classes from `@nexub/themes/base` instead of inline `style` attributes, so make sure `base.css` is imported.

## 1.3.0

## 1.2.0

### Minor Changes

- d296fe3: **New pattern `AppLauncher`** (the "waffle" app switcher), replacing the copies hand-built in each app.
  - `<AppLauncher apps={[{ id, name, href, icon?, current? }]} onNavigate? surface? label? />`: an `IconButton` ("Nexub apps") opens a 320px `Popover` (aligned to the end) with a 3-column grid of app tiles (40px rounded icon and name).
  - Missing or broken icons fall back to an `Avatar` with initials. The current app is subtly highlighted and marked `aria-current="page"`.
  - Keyboard: opens with focus on the current app; arrow keys move through the grid, Home/End jump to the ends. `onNavigate(app)` takes over plain clicks for client-side routing; modified clicks still open the link.
  - `surface="glass"` supported. Renders nothing for an empty list.
  - `@nexub/icons`: new `Apps` icon (3×3 dots).

- d296fe3: **Branding: the official Nexub mark in `Logo`.**
  - `NexubMark` (`@nexub/icons`) now draws the official Nexub mark (the purple-blue ribbon), taken from the master SVG without redrawing. It replaces the placeholder "B". New `variant` prop: `"mono"` (default, `currentColor`, as before) or `"color"`. Each instance gets its own gradient ids, so several marks on one page don't clash.
  - `Logo` gets `mark="color" | "mono"` (default `"color"`) and `product?: string`. With `product`, it renders the mark, "nexub", a subtle separator and the product name in muted text at the wordmark's size, e.g. `<Logo product="Command Hub" />`. The accessible name becomes "Nexub Command Hub".
  - `Logo` `variant="icon"` is the new name for the mark-only variant. `variant="mark"` still works. `Logo` now has `role="img"`, so its name is announced.
  - The mark is sized by height at its real 78:56 ratio (it used to sit in a square box).
  - `@nexub/tokens`: 47 new brand tokens, `--color-brand-mark-1` … `--color-brand-mark-47` (Tailwind `brand-mark-*`), holding the mark's gradient colours. `Logo` and `NexubMark` contain no hex values.

- d296fe3: **New icons `Pin`, `Send` and `Crown`**, so apps no longer need Bookmark, ArrowUp and Star as stand-ins.

## 1.1.0

### Minor Changes

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
