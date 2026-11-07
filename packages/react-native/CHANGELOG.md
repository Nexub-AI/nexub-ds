# @nexub/react-native

## 5.7.0

### Minor Changes

- 18bbb2e: React Native parity for the 5.x data components.

  - **`DataList`** (React Native): the mobile form of DataTable. One row per record with its key fields (no sideways grid), a Sort sheet (one sort plus direction), and a selection mode with a count and `bulkActions`. Built on FlatList.
  - **`MultiSelect`** (React Native): a field that opens a sheet of checkbox rows, with search above 8 options. The field summarises the picks ("Bug, Design, +3 more").
  - **`FileList`** (React Native): files picked for upload with size, progress, errors, and remove or cancel. Bring your own picker (for example, expo-document-picker).
  - **`FilterSheet`** (React Native): the web FilterBuilder in a sheet. It edits one flat AND/OR list and keeps nested web groups untouched.
  - **Shared filter model**: `FilterGroup`, `FilterRule`, `FilterField`, `filterOperators`, `countFilters`, `emptyFilter`, `newFilterRule` and `isFilterGroup` now live in `@nexub/core`. Both `@nexub/react` and `@nexub/react-native` re-export them, so saved queries move between platforms. No API change for web.
  - New messages: `sortBy`, `sortDirection`, `ascending`, `descending`.
  - Docs: web DataTable, MultiSelect, FilterBuilder and OTP Input pages now show their mobile twins with live previews.

### Patch Changes

- Updated dependencies [18bbb2e]
  - @nexub/core@5.7.0
  - @nexub/tokens@5.7.0
  - @nexub/icons@5.7.0

## 5.6.0

### Patch Changes

- Updated dependencies [b71b56f]
  - @nexub/icons@5.6.0
  - @nexub/core@5.6.0
  - @nexub/tokens@5.6.0

## 5.5.0

### Patch Changes

- Updated dependencies [04ff65b]
  - @nexub/core@5.5.0
  - @nexub/tokens@5.5.0
  - @nexub/icons@5.5.0

## 5.4.0

### Patch Changes

- Updated dependencies [253949f]
  - @nexub/core@5.4.0
  - @nexub/tokens@5.4.0
  - @nexub/icons@5.4.0

## 5.3.0

### Patch Changes

- Updated dependencies [8988b87]
  - @nexub/core@5.3.0
  - @nexub/tokens@5.3.0
  - @nexub/icons@5.3.0

## 5.2.0

### Patch Changes

- Updated dependencies [5f2ef4d]
  - @nexub/core@5.2.0
  - @nexub/tokens@5.2.0
  - @nexub/icons@5.2.0

## 5.1.0

### Patch Changes

- Updated dependencies [60fed18]
  - @nexub/core@5.1.0
  - @nexub/tokens@5.1.0
  - @nexub/icons@5.1.0

## 5.0.1

### Patch Changes

- @nexub/tokens@5.0.1
- @nexub/icons@5.0.1
- @nexub/core@5.0.1

## 5.0.0

### Patch Changes

- @nexub/tokens@5.0.0
- @nexub/icons@5.0.0
- @nexub/core@5.0.0

## 4.9.0

### Patch Changes

- @nexub/tokens@4.9.0
- @nexub/icons@4.9.0
- @nexub/core@4.9.0

## 4.8.0

### Patch Changes

- @nexub/tokens@4.8.0
- @nexub/icons@4.8.0
- @nexub/core@4.8.0

## 4.7.0

### Patch Changes

- @nexub/tokens@4.7.0
- @nexub/icons@4.7.0
- @nexub/core@4.7.0

## 4.6.0

### Patch Changes

- @nexub/tokens@4.6.0
- @nexub/icons@4.6.0
- @nexub/core@4.6.0

## 4.5.0

### Patch Changes

- @nexub/tokens@4.5.0
- @nexub/icons@4.5.0
- @nexub/core@4.5.0

## 4.4.0

### Patch Changes

- @nexub/tokens@4.4.0
- @nexub/icons@4.4.0
- @nexub/core@4.4.0

## 4.3.0

### Patch Changes

- @nexub/tokens@4.3.0
- @nexub/icons@4.3.0
- @nexub/core@4.3.0

## 4.2.0

### Patch Changes

- @nexub/tokens@4.2.0
- @nexub/icons@4.2.0
- @nexub/core@4.2.0

## 4.1.0

### Patch Changes

- @nexub/tokens@4.1.0
- @nexub/icons@4.1.0
- @nexub/core@4.1.0

## 4.0.0

### Minor Changes

- 82df5ba: 4.0: removes what 3.9 deprecated, and nothing else.

  - **Removed: the Tailwind 3 preset** (`@nexub/tokens/tailwind`) and its `tailwindcss-animate` dependency. Use Tailwind 4 with `@import "@nexub/tokens/tailwind.css"`; the utilities keep their names. The `tailwindcss` peer is now `^4.0.0`. `nexub-migrate --rules tailwind-3-preset` still finds any leftover import.
  - **Removed: Expo SDK 57 support.** `@nexub/react-native` now needs Expo SDK 58 or later (`expo-glass-effect`, `expo-haptics` and `expo-screen-capture` peers `>=58.0.0`).
  - No component API changed. If you were clear of the 3.9 warnings, 4.0 is a version bump. See Migrating to 4.0 in the docs.

### Patch Changes

- Updated dependencies [82df5ba]
  - @nexub/tokens@4.0.0
  - @nexub/icons@4.0.0
  - @nexub/core@4.0.0

## 3.9.0

### Minor Changes

- 474744c: 4.0 release candidate.

  - **The API is frozen until 4.0.** 3.9 adds no features: only the deprecations below and fixes. 4.0 removes exactly these, and changes no component API.
  - **Deprecated: the Tailwind 3 preset** (`@nexub/tokens/tailwind`). It now logs a one-time warning when it loads, and its type is marked `@deprecated`. Move to Tailwind 4 with `@import "@nexub/tokens/tailwind.css"`; the utilities keep their names.
  - **Deprecated: Expo SDK 57** for `@nexub/react-native`. 4.0 requires Expo SDK 58 or later.
  - **`nexub-migrate` rule `tailwind-3-preset`** finds every use of the Tailwind 3 preset (report only): `npx -p @nexub/tokens nexub-migrate . --rules tailwind-3-preset`.
  - **New guide: Migrating to 4.0**, with the removals, the codemod and the Tailwind 4 and Expo SDK 58 steps.

### Patch Changes

- Updated dependencies [474744c]
  - @nexub/tokens@3.9.0
  - @nexub/icons@3.9.0
  - @nexub/core@3.9.0

## 3.8.0

### Patch Changes

- @nexub/tokens@3.8.0
- @nexub/icons@3.8.0
- @nexub/core@3.8.0

## 3.7.0

### Patch Changes

- Updated dependencies [b1bf182]
  - @nexub/tokens@3.7.0
  - @nexub/icons@3.7.0
  - @nexub/core@3.7.0

## 3.6.0

### Patch Changes

- Updated dependencies [11c151d]
  - @nexub/tokens@3.6.0
  - @nexub/icons@3.6.0
  - @nexub/core@3.6.0

## 3.5.0

### Patch Changes

- Updated dependencies [147da58]
  - @nexub/tokens@3.5.0
  - @nexub/icons@3.5.0
  - @nexub/core@3.5.0

## 3.4.0

### Patch Changes

- @nexub/tokens@3.4.0
- @nexub/icons@3.4.0
- @nexub/core@3.4.0

## 3.3.0

### Patch Changes

- Updated dependencies [6a0521b]
  - @nexub/tokens@3.3.0
  - @nexub/icons@3.3.0
  - @nexub/core@3.3.0

## 3.2.0

### Patch Changes

- @nexub/tokens@3.2.0
- @nexub/icons@3.2.0
- @nexub/core@3.2.0

## 3.1.0

### Minor Changes

- 9bf12bc: Marketing mode and server components.

  - **Server components.** `@nexub/react` is now compiled one file per module, each with its own `'use client'` or none, so presentational components (Heading, Text, Container, Section, Stack, Badge, EyebrowChip, Logo, Float, Marquee) render as React Server Components and interactive ones stay client components. Every component can be imported on its own (`@nexub/react/Button`), and `cn` from `@nexub/react/cn`. In Next.js, import per component or set `optimizePackageImports`: a page with Hero, StatBand and CTABand went from 181 kB to 19.4 kB of page JavaScript. `SplitButton` is a client component. Nothing changes for client-only apps.
  - **New package `@nexub/marketing`**: Hero, SectionHeader, LogoStrip, StatBand and StatBandItem, TestimonialGrid and TestimonialCard, ProductGrid and ProductCard, HowItWorks, FeatureSplit, CTABand, FAQ, PricingTable, MarketingNav (mega-menu, country switcher, mobile sheet) and MarketingFooter (tools marquee). Server components except the nav, pricing and FAQ.
  - **`@nexub/themes/marketing`**: the nexub.com look, only under `data-mode="marketing"`, so apps that don't set it see no change. Heavier headings, the hero backdrop, accent line, motion (rise, reveal, float, drift, ping, marquee, bar fill) on the spring tokens, and nothing moves under reduced motion.
  - **`@nexub/themes/core`**: `base` without the fonts and the page backdrop, for apps that bring their own (Next.js `next/font` sets `--font-family-sans` and `--font-family-display`). `base` is unchanged. `@nexub/themes/fonts` is exported too.
  - **Tokens**: a `marketing` group (hero button gradient on primary tones 45 → 40, glow, eyebrow gradient, 24px showcase card radius and shadows, floating-card shadow, accent line, lifts), the `display-xl` type role (64/68, 800) and `container-marketing` (1280px).
  - **Components**: `Button variant="hero"`, `Card variant="showcase"` with `accent`, `EyebrowChip variant="gradient"` and `live`, `Container size="marketing"`, `NumberTicker countOnView`, and the new `Reveal`, `Float` and `Marquee`. Each looks like its plain variant outside marketing mode.
  - **Patterns**: `PlanCard` takes `ctaHref` to make its button a link.
  - **React Native**: the `display-xl` role maps to `largeTitle`.

### Patch Changes

- Updated dependencies [9bf12bc]
  - @nexub/tokens@3.1.0
  - @nexub/icons@3.1.0
  - @nexub/core@3.1.0

## 3.0.0

### Patch Changes

- Updated dependencies [1ea35c1]
- Updated dependencies [1ea35c1]
  - @nexub/tokens@3.0.0
  - @nexub/icons@3.0.0
  - @nexub/core@3.0.0

## 2.9.0

### Patch Changes

- Updated dependencies [872350c]
  - @nexub/tokens@2.9.0
  - @nexub/icons@2.9.0
  - @nexub/core@2.9.0

## 2.8.0

### Patch Changes

- Updated dependencies [1ad3138]
  - @nexub/icons@2.8.0
  - @nexub/tokens@2.8.0
  - @nexub/core@2.8.0

## 2.7.0

### Patch Changes

- Updated dependencies [3ca7a3f]
  - @nexub/tokens@2.7.0
  - @nexub/icons@2.7.0
  - @nexub/core@2.7.0

## 2.6.0

### Patch Changes

- Updated dependencies [ba4b800]
  - @nexub/tokens@2.6.0
  - @nexub/icons@2.6.0
  - @nexub/core@2.6.0

## 2.5.0

### Minor Changes

- 9a97fb4: Native marks and `SkeletonSwap` for React Native.

  - `@nexub/icons/native` now has the Nexub marks under the same names as on web: `NexubMark` (`variant="color"` draws the brand gradient), `LeapMark`, `BookubMark`, `PayubMark`, `FounderubMark`, `ACRA`, `IRAS`, `MCA` and `GST`. They take the usual `size`, `color` and `label` props.
  - `@nexub/react-native` adds `SkeletonSwap`, the twin of the web component: it crossfades from a skeleton to the loaded content in place on the motion springs, marks itself busy for screen readers while loading, and follows Reduce Motion. Content that is ready on first render shows without a fade.

### Patch Changes

- Updated dependencies [3363ede]
- Updated dependencies [9a97fb4]
  - @nexub/core@2.5.0
  - @nexub/icons@2.5.0
  - @nexub/tokens@2.5.0

## 2.4.0

### Minor Changes

- 89acedb: Release hardening (2.4.0). No API changes.

  - Each `@nexub/react-native` preview example is now checked on a real iOS simulator and Android emulator against committed screenshot baselines, so an unintended visual change fails CI the way web visual regression already does. The docs show the same screenshots under "On device" on native component pages.
  - Deprecated components (Banner, Callout, Tag, StatusPill) now have a removal target: 3.0. See GOVERNANCE.md for the status lifecycle (alpha → beta → stable → deprecated) and the deprecation policy.

### Patch Changes

- @nexub/tokens@2.4.0
- @nexub/icons@2.4.0
- @nexub/core@2.4.0

## 2.3.1

### Patch Changes

- c67c72a: Published with npm trusted publishing (OIDC) from the `Nexub-AI/nexub-ds` release workflow, so every version now carries npm provenance: you can check on npmjs.com that it was built from this repository's source. No code changes.
- Updated dependencies [c67c72a]
  - @nexub/tokens@2.3.1
  - @nexub/icons@2.3.1
  - @nexub/core@2.3.1

## 2.3.0

### Patch Changes

- Updated dependencies [23d164c]
  - @nexub/tokens@2.3.0
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

- 934f9a1: **Page templates, paired web and mobile.** `@nexub/patterns` adds full-page web twins of the native screens in `@nexub/react-native/patterns`, with the same data shapes (`Transaction`, `Quote`, `ReviewRow`, `ChatMessage`, `Plan`, `QuickAction`, `Insight`) so one data layer feeds both:

  - `DashboardPage` ↔ new native `HomeScreen`: balance with quick actions, key figures, recent activity and insights (Payub-style home; native adds pull-to-refresh).
  - `ActivityPage` ↔ `ActivityList`: grouped by day; Refresh and Load more stand in for pull-to-refresh and paging, `rowActions` for swipe actions.
  - `TransactionDetailPage` ↔ `TransactionDetail`, `SettingsPage` ↔ `SettingsScreen`, `SignInPage` ↔ `SignInScreen` (passkey autofill), `CheckoutPage` ↔ `AmountStep` + `ReviewStep` + `ResultScreen`, `ChatPage` ↔ `ChatScreen`, `PaywallPage` ↔ `PaywallScreen`.
  - Each renders a `<main>` landmark by default (`as="div"` inside an app shell), takes `messages` overrides on top of `NexubProvider` messages, and works from 360 px to desktop. `PageFrame` is the shared frame.

### Patch Changes

- @nexub/tokens@2.2.0
- @nexub/icons@2.2.0
- @nexub/core@2.2.0

## 2.1.0

### Minor Changes

- c5cd6c5: **React Native core components** (MOBILE_PLAN.md, phase M2), alpha:

  - **Actions:** `Button` (filled/tonal/outlined/text/glass, `tone`, xs–xl, `loading`, icons), `IconButton`, `ButtonGroup`, `Link`.
  - **Data:** `Amount` (Intl, tabular, `tone="auto"`, hero `display`), `Badge` (solid/soft/outline, `dot`; covers web's deprecated Tag/StatusPill), `Avatar`, `AvatarGroup`, `Divider`.
  - **Inputs:** `TextField` (label, helper, error in one), `PasswordInput`, `SearchField`, `MoneyInput` (locale parsing), `Stepper`, `Checkbox`, `RadioGroup`/`Radio`, `Switch` (the platform switch in Nexub colours), `SegmentedControl`, `Slider`, `Chip`/`FilterChip`.
  - **Containers:** `Card`, `ListItem` (navigation/switch/checkbox/radio/button/value rows; one target, one screen-reader element), `ListSection` (inset-grouped), `Accordion`.
  - **Feedback:** `Banner`, `ToastProvider`/`useToast` (one at a time, announced; 10 s when it has an action), `Dialog`, `Progress` (linear/circular), `LoadingIndicator`, `Skeleton`, `EmptyState`, `ErrorState`.
  - Every control reaches a 44pt touch target and uses the shared state layer, press spring and semantic haptics.
  - `@nexub/core` money helpers work on Hermes for iOS, which lacks `resolvedOptions`/`formatToParts`: the same values are derived from `format()`.

- 1983f67: **React Native: docs, AI tooling and app icons** (MOBILE_PLAN.md, phase M5):

  - `@nexub/react-native` README is the reference: install, provider, every component and screen pattern, and the rules they follow.
  - Claude skill and `llms.txt` / `llms-full.txt` include the React Native reference. `@nexub/mcp` adds a `get_react_native` tool.
  - Docs: a Getting started → React Native page, with a web-to-native component map.
  - `@nexub/brand`: mobile app icons for the hub and every product. `assets/mobile/<product>-ios.png` is a 1024 px full-bleed square; the Android adaptive icon ships as `-android-foreground/background/monochrome.png` layers, including a monochrome layer for Android 13+ themed icons.

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

- c0f9add: **React Native screen patterns** (MOBILE_PLAN.md, phase M4), alpha, in `@nexub/react-native/patterns`. Each is a data-plus-callbacks template built only from the public components, so it works with any router:

  - **Auth:** `AuthScreen`, `SignInScreen` (platform autofill, optional "Sign in with Face ID"), `VerifyCodeScreen` (OTP with resend countdown), `LockScreen` (biometric unlock + passcode fallback).
  - **Money (Payub first):** `FlowStep` (progress + sticky action), `AmountStep` (keypad amount with live fee, rate and arrival; blocks over-balance), `ReviewStep`, `ActivityList` (grouped by day, pull-to-refresh, paging, swipe actions), `TransactionDetail`, `ResultScreen` (success/error/offline/maintenance/update).
  - **App:** `OnboardingScreen`, `PermissionPrimer`, `SettingsScreen` + `ProfileHeader`, `AppearanceSection` (theme, glass dial, haptics), `NotificationsInbox`, `SearchScreen`, `ChatScreen` (AI assistant, composer above the keyboard), `PaywallScreen`, `AppSwitcherSheet` (Nexub apps).

### Patch Changes

- Updated dependencies [c5cd6c5]
- Updated dependencies [736b9a5]
- Updated dependencies [080d2a4]
  - @nexub/core@2.1.0
  - @nexub/tokens@2.1.0
  - @nexub/icons@2.1.0
