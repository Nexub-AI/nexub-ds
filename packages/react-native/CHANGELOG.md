# @nexub/react-native

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
