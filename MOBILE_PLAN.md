# Mobile (React Native): research and plan (2026-10-29)

Status: **direction approved 2026-10-29.** The hybrid approach (native chrome, Nexub content) and recommendations D1–D9 are accepted, with Payub as the pilot (§10). The execution plan (§12) is **awaiting approval**. Nothing is built yet. Roadmap row to add: R9 in [REVIEW_WORK_ITEMS.md](REVIEW_WORK_ITEMS.md).

This builds on the Calm Depth research for Google, Apple and Wise ([DESIGN_REFRESH_PLAN.md](DESIGN_REFRESH_PLAN.md) §2–3) and carries it to phones.

**Goal:** Nexub product teams build native React Native apps (Expo or bare) with the same design language, tokens, brands and quality bar as the web, and the apps feel native on iOS and Android.

Tags, as in earlier plans:
- **[V]** read in a primary source this week.
- **[U]** secondary source or inferred. Check it before encoding it as a token.

---

## 1. Where we are today (what carries over, what doesn't)

| Layer | Today | Reusable on mobile? |
|---|---|---|
| `@nexub/tokens` | DTCG JSON → Style Dictionary 5 → CSS vars, Tailwind v3/v4, a TS const, flat JSON. Colours are hex, sizes px. Roles come from **one role → tone table** (`src/roles.js`, HCT via material-color-utilities). Springs are stored as M3 `[dampingRatio, stiffness]`. Runtime seed theming (`/seed`). | **Yes. This is the main asset.** We need a new native output; the token sources stay as they are. Two things need converting: elevation uses CSS `light-dark()`, and letter-spacing is in `em`. |
| `@nexub/themes` | CSS files: light/dark/glass and the 4 product brands. | No. Product brands become a theme input on native (the same tertiary remap). |
| `@nexub/react` | 90+ components on Radix + CVA + Tailwind classes, DOM-only. | **Components, no.** Kept as they are: prop names and variants (`variant="filled|tonal|outlined|text|glass"`, `tone`, `size`), `NexubMessages` i18n strings, `money.ts`, `useControllableState`. |
| `@nexub/patterns` | 17 web patterns (AuthCard, SettingsLayout, ActivityFeed, Conversation…). | The ideas carry over; the code doesn't. Each gets a mobile counterpart. |
| `@nexub/icons` | Wrappers around lucide-react with size tokens. | **Yes.** `lucide-react-native` keeps the same icon names [V]. |
| `@nexub/brand` | SVG mark and app tiles; PNGs built with sharp. | **Yes.** It also needs app-icon sets for iOS 26 and Android adaptive/themed icons, plus splash screens. |
| `@nexub/mcp` + skill + `llms.txt` | Tell AI tools about the web components. | **Yes.** They should also cover the native components, which is a big multiplier for teams generating screens. |
| Quality gates | Vitest, axe sweep, Playwright visual (every story × theme), size budgets, SSR test. | The ideas carry over; the tools change: Jest + RNTL, Maestro screenshots, Metro bundle budgets. |

Bottom line:
- The token pipeline and the role/tone/spring maths are platform-neutral already. That is roughly 40% of a design system, and it is done.
- Every component has to be rebuilt for native.
- That matches what the industry does (§2.3).

---

## 2. Research findings

### 2.1 Platform state, October 2026

**React Native**
- **RN 0.88** (2026-10-19) on React 19.3 [V]. The New Architecture is unconditional and Hermes V1 is the default (since 0.84) [V].
- New-arch style props we can use [V]:
  - `boxShadow`: outset needs Android 9+.
  - `backgroundImage` linear/radial gradients.
  - `outline*`, logical radii and borders, `mixBlendMode`.
  - `filter` blur: Android 12+ only. On iOS only brightness/opacity work.
- **Variable fonts work from 0.88** via `fontVariationSettings` [V]. Before 0.88, static weight files are needed.
- **No Display-P3 colours** [U]. Ship sRGB hex, which is what we already have.

**Expo**
- **Expo SDK 58** (2026-10-15) ships RN 0.88 [V].
- **Expo Router native tabs are stable** (`expo-router/native-tabs`) [V]. On iOS 26 they give the system Liquid Glass tab bar (search role, minimize-on-scroll, bottom accessory); on Android, Material tabs with at most 5 [V]. They can be themed but not fully customised.
- **`expo-glass-effect`** `GlassView` [V]:
  - `regular`/`clear`, tint, interactive, `GlassContainer` for morphing.
  - **iOS 26+ only.** Everywhere else it falls back to a plain `View`, so we provide our own fallback.
- **`@expo/ui` is stable** (SDK 56) [V]: SwiftUI and Jetpack Compose components, and `useMaterialColors` for Android dynamic colour.
- **Haptics:** on Android use `performAndroidHapticsAsync(AndroidHaptics.Confirm|Reject|Toggle_On|Segment_Tick…)`, not the vibrator-based impact API [V].

**Animation and gestures**
- **Reanimated 4.7** [U] with Worklets 0.13.
- In `withSpring`, `damping` is an **absolute coefficient**, not a ratio; `dampingRatio` only applies in duration mode [V].
  - So our M3 springs convert as `damping = 2·ζ·√(stiffness·mass)`.
  - Example: spatial-default `[0.9, 700]` → `{ stiffness: 700, damping: 47.6, mass: 1 }`.
- `reduceMotion: ReduceMotion.System` exists [V].
- **Gesture Handler 3** (hook API, New Arch only) is out, but Expo still pins 2.32 [U]. That is a migration risk for anything built on GH2.

**Sheets**
- Native `formSheet` with detents in react-native-screens 4.26; Android allows at most 3 detents [U].
- **TrueSheet v3**: native, Fabric [U].
- **@gorhom/bottom-sheet v5** is still on Reanimated 3 / GH2, with unclear maintenance [U]. **Risky to build on.**

**Lists and keyboard**
- FlashList v2 and Legend List 2 are both active [U].
- `react-native-keyboard-controller` (KeyboardStickyView, KeyboardToolbar) is listed in the Expo SDK 58 docs [V].

**Android**
- **Edge-to-edge is mandatory at targetSdk 36** [V].
- **Predictive back is on by default for API 36**; `onBackPressed` is no longer dispatched [V].

**Accessibility APIs in RN core** [V]
- Both platforms: reduce motion, screen reader.
- iOS: reduce transparency, bold text, grayscale, **darker system colours** (Increase Contrast).
- Android: high text contrast.
- **Gap:** contrast settings fire no change event, so we have to re-read them when the app returns to the foreground.
- Font scaling: `allowFontScaling`, `maxFontSizeMultiplier`, and iOS `dynamicTypeRamp`.

### 2.2 Mobile guidance (deltas from our web research)

| Topic | Apple (iOS 26/27) [V] | Material 3 Expressive [V] | What we do |
|---|---|---|---|
| Touch target | 44×44 pt (28 minimum) | 48×48 dp | **48 visual height for primary controls; at least 44 hit area always** (via `hitSlop` when the visual is smaller). WCAG 2.5.8's 24 px is the legal floor, not ours. |
| Body text | Body 17/22 | Body-lg 16/24 | See decision D6. |
| Text scaling | Must reach 200%; AX5 Body = 53 pt | sp scaling | Every text role scales. Caps only on display/headline roles. Layouts reflow at AX sizes. |
| Bottom nav | Floating Liquid Glass tab bar; keep tabs few; search tab at trailing end; minimize on scroll | Nav bar with 3–5 items; flexible bar 64 dp | Use **native tabs** (system chrome); we supply the theme. |
| Top bar | Large title collapses on scroll; scroll-edge effect replaces dividers; one prominent action | "App bar"; medium/large *flexible*; search app bar | `Header` with large-title collapse and a scroll-edge fade (our web principle: remove dividers). |
| Sheets | Medium/large detents, grabber, one at a time, Cancel leading / Done trailing | Modal and standard sheets, 32×4 handle, 28 dp corners | `BottomSheet` with detents; `shape-overlay` (24) top corners. |
| Choices | Action sheet: destructive item at top, Cancel at bottom. Context menu on long-press. | FAB menu, 2–6 items | `ActionSheet`, `ContextMenu`. **No FAB on iOS** (decision D7). |
| Haptics | Selection = value change; impact = physical snap; notification = outcome. Optional, never alone. | Platform constants | Semantic **haptic tokens** (§4.4). |
| Glass | Controls layer only; regular/clear; adapts to Reduce Transparency, Increase Contrast and the iOS 27 slider | None (tonal surfaces) | iOS 26+ uses native glass. Android and older iOS use a tonal solid. Our intensity dial still applies. |
| Back | Swipe-back | Predictive back (API 36) | Native stack only; no custom back gestures. |
| Feedback | — | Snackbar 4 s / 10 s, one action, one at a time | `Toast` above the tab bar and safe area. |

**Wise mobile.** Wise's public docs have gone (they 404). Their sitemap still names the mobile components [V], and they match our list:
- List Item with variants: switch, checkbox, radio, navigation, button.
- Money Input / Expressive Money Input.
- Bottom Sheet, Summary, Section Header, Snackbar, Nudge.
- Critical Banner, Segmented Control, Screen Loader.
- Success, Progress and Error screens.

Wise's Android app is Jetpack Compose, not RN [U]. We borrow their inventory and clarity rules, not their code.

**Fintech security UX** (Payub especially):
- OTP autofill: `textContentType="oneTimeCode"` + `autoComplete="sms-otp"` [V].
- Biometric copy names the method ("Sign in with Face ID") [V].
- Android `FLAG_SECURE` blocks screenshots and the app-switcher thumbnail [V].
- iOS has no screenshot block. Cover the UI when the app goes inactive [U].
- Masked balances need an eye toggle whose label changes, and must re-mask in the background [U].

### 2.3 How others build RN design systems

- **Coinbase CDS** is the best open-source reference [V]. It has separate `cds-web` and `cds-mobile` packages plus a shared `cds-common` (tokens, types, utils), and mobile uses **plain `StyleSheet`**, not a styling engine. Native peers are pinned. Visual regression is Maestro + Percy.
- **Microsoft Fluent UI RN**: a separate repo from web, per-platform themes, a shared token pipeline [V].
- **Nobody we found ships universal web+native components through react-native-web** for a serious system [V for CDS and Fluent]. The shared layer is tokens + types + props contracts.

### 2.4 Styling engine for a *published library*

| Option | Consumer setup needed | Verdict |
|---|---|---|
| **StyleSheet + theme context** | None | **Recommended.** Works in Expo, bare RN and Expo Go. A theme switch re-renders through context, which is rare and acceptable. CDS does this. |
| Unistyles 3.7 | Babel plugin, our package added to `autoProcessPaths`, New Arch | Fast (no re-renders), but it imposes build config on every app. Possible opt-in later. |
| NativeWind 4 / v5 RC | Babel + Metro + Tailwind config + CSS import | v5 is still an RC. Apps may use it for *their* screens; we can ship a preset later. |
| Uniwind (Tailwind v4) | Metro config; Pro is commercial | Licence terms for libraries are unclear. No. |
| Tamagui | Provider + config, optional compiler | Heavy lock-in. No. |
| Restyle | None | Maintenance-only since March 2025. No. |

---

## 3. Approach

**One sentence:** a separate native component package that shares tokens, contracts and logic with web, is styled with plain StyleSheet, uses platform-native chrome (tabs, stack, sheets, glass) where the OS does it best, and uses Nexub-drawn components for everything inside the screen.

Principles. These are the Calm Depth principles plus three for mobile:

1. **Native chrome, Nexub content.**
   - Navigation chrome stays system-native: tab bar, stack header and back, sheets, glass, pickers. We theme it; we don't redraw it.
   - Everything users read and touch inside a screen is ours: lists, cards, buttons, inputs, money.
   - This is why the apps will feel right on both platforms.
2. **One language, platform-adaptive behaviour.**
   - These stay the same everywhere: colour roles, shape, type roles, iconography, spacing.
   - These follow the platform: haptic mapping, sheet behaviour, glass vs tonal, back behaviour, date/time pickers, ActionSheet vs Material menu.
3. **Zero consumer config.**
   - `npx expo install @nexub/react-native` + `<NexubNativeProvider>` should be enough.
   - No Babel or Metro plugins. Native dependencies are peer dependencies, optional where only one component uses them.

Kept from web: no ripple (state layer + 0.97 press-scale spring), capsule + concentric shapes, one accent per screen, springs with no overshoot by default, honest numbers (tabular figures).

### 3.1 Package layout (new and changed)

```
packages/
  tokens/          + dist/native/  → "@nexub/tokens/native" (new export)
  core/            NEW @nexub/core: messages, money, number/date formatting,
                   shared prop types (Tone, Variant, Size), useControllableState.
                   Pure TS, no DOM, no RN. @nexub/react re-exports it (no web break).
  icons/           + "@nexub/icons/native" export (lucide-react-native, same names/sizes)
  react-native/    NEW @nexub/react-native: components; "/patterns" subpath for screens
  brand/           + mobile/ app icon sets (iOS 26 layered, Android adaptive + monochrome), splash
  mcp/             + native component docs
apps/
  mobile/          NEW Expo Router showcase: catalogue + example app + Maestro flows
```

One native package rather than two (unlike web's react/patterns split), because:
- there are fewer packages to version;
- Metro handles subpath exports fine [V, RN 0.79+];
- patterns are thin compositions.

---

## 4. Foundations (Phase M1)

### 4.1 Tokens: `@nexub/tokens/native`

These are generated by the existing `scripts/build.mjs`: new formats, same sources.

- **Numbers, not strings.** Spacing, size, radius and shape become unitless dp (`spacing[4] = 16`).
- **Roles become per-mode objects** from the same `ROLES` table:
  ```ts
  roles.light.primary
  roles.dark.primary
  roles.highLight.primary
  roles.highDark.primary
  ```
  Product brands become tertiary-remap objects per product, and seed theming reuses `@nexub/tokens/seed` (pure JS already, so no work).
- **Typography** becomes objects: `{ fontFamily, fontSize, lineHeight, letterSpacing (em → dp per size), fontWeight }`.
  - Families map to registered font names.
  - Each role also gets a `dynamicTypeRamp` (iOS) and a `maxFontSizeMultiplier` cap.
- **Elevation**: each level's CSS `light-dark()` is split into `{ light, dark }` `boxShadow` strings. RN's `boxShadow` takes the CSS syntax; outset shadows need Android 9+.
- **Motion**:
  - Springs as Reanimated configs (`{ stiffness, damping: 2ζ√k, mass: 1 }`).
  - Durations as numbers.
  - Easing as `[x1, y1, x2, y2]` for `Easing.bezier`.
- **State-layer opacities, shape and z** pass through unchanged.
- A test checks the conversion: native role values must equal the CSS `light-dark()` pairs. This reuses the contrast test idea.

Out of scope for now: Swift/Compose token outputs (R3). Add them only if a fully native app appears.

### 4.2 Fonts

- Inter and Plus Jakarta Sans as TTFs, plus Geist Mono.
- If minimum RN ≥ 0.88, ship the variable fonts with `fontVariationSettings`. Otherwise ship static weights 400/500/600/700/800 (decision D3).
- Fonts load through `expo-font` (Expo) or `react-native-asset` (bare). We document both.
- Devanagari and Tamil come from Noto, opt-in.

### 4.3 `NexubNativeProvider` (mirrors ThemeProvider + NexubProvider)

| Input | Source | Effect |
|---|---|---|
| `scheme` | `useColorScheme()` or prop | light/dark roles |
| `contrast` | prop, or iOS `isDarkerSystemColorsEnabled` / Android `isHighTextContrastEnabled`, **re-read on AppState active** (no events) | standard/medium/high roles |
| `product` | prop | tertiary remap (leap/bookub/payub/founderub) |
| `seed` | hex, or `'system'` = Android 12+ dynamic colour via `@expo/ui` `useMaterialColors` → our `createSeedTheme` | white-label / Material You |
| `glass` | `'off' \| 'balanced' \| 'clear'`, persisted by the app (we take a storage adapter, no AsyncStorage dependency); forced `off` by Reduce Transparency | glass surfaces |
| `reducedMotion` | `isReduceMotionEnabled` + Reanimated `ReduceMotion.System` | springs → short fades |
| `locale`, `dir`, `messages` | same API as web `NexubProvider` (via `@nexub/core`) | strings, RTL (layout uses logical `start/end` props) |
| `haptics` | on/off (user setting) | gates every haptic |

Hooks: `useTheme()`, `useRoles()`, `useHaptics()`, `useNexubMessages()`.

### 4.4 Primitives

- **`Pressable`**. The base for every control. Built on RN `Pressable` + Reanimated:
  - state layer (on-colour at 8/10/12%);
  - 0.97 press-scale spring (spatial-fast);
  - hit-slop up to 44;
  - `accessibilityRole` / state;
  - an optional haptic token.
- **Haptic tokens:**

  | Token | iOS | Android |
  |---|---|---|
  | `selection` | selection | `Segment_Tick` |
  | `toggleOn` / `toggleOff` | impact light | `Toggle_On` / `Toggle_Off` |
  | `confirm` | notification success | `Confirm` |
  | `reject` | notification error | `Reject` |
  | `warning` | notification warning | `Reject` |
  | `snap` | impact medium | `Gesture_End` |

  Apple's rule applies: never on plain taps, never the only feedback. Implemented with `expo-haptics` (optional peer; no-op without it).
- **`Text`**: role typography, tabular figures, Dynamic Type behaviour.
- **`Heading`**: the same, with `accessibilityRole="header"`.
- **`Box` / `Stack` / `Inline`**: spacing tokens, logical padding.
- **`Surface`**: tonal tiers (surface → container-highest), elevation 0–3, `material="glass"`.
  - iOS 26+: `GlassView`.
  - Elsewhere: `surface-elevated` + hairline.
  - Always solid when glass is `off` or Reduce Transparency is on.
- **`Icon`**: from `@nexub/icons/native`, with size tokens.
- **`ScreenContainer`**: safe area + edge-to-edge insets + keyboard handling + optional scroll-edge effect. Every pattern sits on it.

---

## 5. Component inventory

Names and props follow web where a web twin exists, so the MCP, the docs and people's habits carry over.

Legend:
- **Twin**: same name and props as `@nexub/react`.
- **Native**: mobile-only.
- **Wrap**: themed wrapper over a platform or community component.

### Phase M2: core components (about 30, parity subset)

| Group | Components |
|---|---|
| Actions | Button (filled/tonal/outlined/text/glass; tone; xs–xl) **Twin** · IconButton **Twin** · ButtonGroup (connected) **Twin** · Link **Twin** |
| Text and data | Text · Heading · Amount (tabular, currency via `@nexub/core`) **Twin** · Badge · Tag · StatusPill · Avatar / AvatarGroup · Divider · Kbd (skip; no keyboards on phones) |
| Inputs | TextField (Input/Textarea/FormField/HelperText/FormError folded into one field with label, helper and error) · PasswordInput · SearchField · MoneyInput **Twin** · NumberInput / Stepper · Checkbox · Radio / RadioGroup · Switch · SegmentedControl · Slider · Chip / FilterChip |
| Containers | Card (tonal, elevation, pressable) · ListItem / Cell (leading, title, subtitle, trailing; variants: navigation, switch, checkbox, radio, button, value; Wise's model) **Native** · ListSection (grouped, header/footer; iOS inset-grouped look) **Native** · Accordion |
| Feedback | Banner / Callout · Toast (snackbar: one at a time, above tab bar, 4 s / 10 s, announces) · Dialog (alert: 1–2 actions, native-feeling) · Progress (linear + circular) · LoadingIndicator · Skeleton · EmptyState / ErrorState **Twin** |

### Phase M3: mobile-native components

| Component | Built on | Notes |
|---|---|---|
| **BottomSheet** | Decision D4 (native formSheet / TrueSheet vs our own on Reanimated + Gesture Handler) | Detents, grabber (tap cycles, VoiceOver-operable), one at a time, keyboard-aware, glass on iOS 26 |
| **ActionSheet** | BottomSheet on Android; native `ActionSheetIOS` on iOS **Wrap** | Destructive item at top, Cancel at bottom |
| **ContextMenu** | Long-press → native menu (`@expo/ui` or zeego) **Wrap** | Always paired with a visible fallback |
| **Header** | Native stack header options + our large-title / scroll-edge for custom screens | One prominent action; titles under 15 characters |
| **Tabs theme** | `nexubNativeTabs()` / `nexubNavigationTheme()` helpers for Expo Router NativeTabs and React Navigation | We don't draw a tab bar |
| **SwipeableRow** | Gesture Handler + Reanimated | Every action is also an accessibility action and a visible fallback |
| **RefreshControl** | Themed RN `RefreshControl` **Wrap** | |
| **OTPInput / PinInput** | Single hidden TextInput + boxes | `oneTimeCode`, `sms-otp`, paste, secure mode |
| **NumericKeypad + ExpressiveMoneyInput** | Ours | Wise-style amount entry; locale decimal separator; haptic `selection` |
| **Select / Picker** | Opens a sheet list (iOS wheel optional) | Replaces web Select/Combobox |
| **DateTimePicker** | Native pickers (`@expo/ui` / community) **Wrap** | Locale + RTL |
| **Carousel + PageIndicator** | Horizontal FlatList / pager | Onboarding, cards |
| **StickyFooter / BottomCTA** | `KeyboardStickyView` (keyboard-controller) | The primary button in every flow |
| **SensitiveValue** | Ours | Mask/reveal with changing a11y label; re-masks on background |
| **PrivacyShield** | AppState + `FLAG_SECURE` (expo-screen-capture) | Covers the app-switcher snapshot |
| **OfflineBanner** | NetInfo (optional peer) | |
| **Coachmark / Tooltip** | Ours | Onboarding hints only |
| **FAB** | Android only (decision D7) | |

### Phase M4: mobile patterns (`@nexub/react-native/patterns`)

These are screen templates, each a composition of the parts above plus `ScreenContainer`. Web counterparts in brackets.

1. **Auth**: sign-in, sign-up, OTP verify, biometric unlock prompt, passkey-first copy [AuthCard].
2. **Onboarding**: carousel, permission primer (notifications, camera, location) before the OS prompt.
3. **Settings**: grouped ListSections with switch/navigation rows, plus account, appearance (theme, glass dial, haptics), language [SettingsLayout, SettingsSection].
4. **Activity**: transaction list grouped by date, with swipe actions, pull-to-refresh and pagination; transaction detail with a Summary block [ActivityFeed, InfoList].
5. **Money flow**: amount → recipient → review (Summary) → confirm (biometric) → success screen. A multi-step flow with progress and StickyFooter [StepIndicator, PlanCard].
6. **Search**: search header, recent searches, results, empty state.
7. **Profile / account** [UserCard].
8. **Notifications inbox** [NotificationItem].
9. **Chat / AI assistant**: composer above the keyboard, streaming text, thinking indicator, message bubbles [Conversation, PromptInput, StreamingText, ThinkingIndicator, MessageBubble].
10. **System screens**: success, error, offline, maintenance, force-update.
11. **Paywall / plans** [PlanCard].
12. **App switcher**: Nexub apps launcher as a sheet [AppLauncher].

Not doing on mobile: DataTable, CommandPalette, Menubar, NavigationMenu, HoverCard, Sidebar, Kbd/KeyboardShortcut, Breadcrumb, Pagination (replaced by infinite lists). Tablet layouts (NavigationRail, ListDetail split) come later.

---

## 6. Quality gates (same bar as web)

| Gate | Tool | When |
|---|---|---|
| Unit + behaviour + a11y props | Jest + **RNTL 14** (async API) [V] | Every PR (Linux runner) |
| Token parity | `node --test`: native roles equal CSS roles; spring conversion | Every PR |
| Visual regression | **Maestro `assertScreenshot`** [V] driving `apps/mobile` story screens × light/dark/payub × iOS + Android | Every PR touching `react-native/`, on GitHub-hosted macOS (free for public repos) and Linux emulator runners; full sweep before a release |
| Accessibility | RNTL checks (role, label, 44 min hit area) + Maestro flows at AX5 text size and with Reduce Motion | Every PR / release |
| Bundle budget | Metro bundle per entry, added to `size-budgets.json` | Every PR |
| Performance | Release-candidate pass: list scroll FPS with Flashlight [V active, old release] on Android; JS-thread-free animations | Each release |
| Docs images | Maestro screenshots reused as docs images (one run, two uses) | Release |

Not using: `eslint-plugin-react-native-a11y` (stale since Nov 2024) [V], Chromatic RN (early access only) [V], Detox (Maestro covers it with less setup).

---

## 7. Docs, AI and adoption

- **Docs site**: a "Mobile" section.
  - Each native component page shows its Maestro screenshots (iOS/Android, light/dark), props, and the web twin side by side.
  - It also links to the `apps/mobile` showcase (QR to a dev build).
- **Storybook RN 10** on device inside `apps/mobile` (`STORYBOOK_ENABLED`) [V]. The same stories feed Maestro.
- **MCP + skill + `llms.txt`**: index the native components and patterns, plus a "mobile rules" reference (touch targets, native chrome, haptics, sheets). This lets Claude or Cursor generate correct RN screens.
- **Getting started**: guides for an Expo template and for bare RN; a peer-dependency table per component.
- **Support window**: the current and previous Expo SDK (about 3 SDKs a year), and the matching RN versions. Native peer ranges follow Expo's `bundledNativeModules`.

---

## 8. Security and supply chain

- **Native peers are attack surface.** Every new native dependency needs a security review (maintenance, downloads, native permissions) before it's added; that review goes in the PR. Keep them optional.
- No telemetry, network calls or storage inside the library. Persistence (glass dial, haptics) goes through an adapter the app passes in.
- Secure inputs by default: PasswordInput/OTP set `secureTextEntry`, autofill hints, `autoCorrect={false}`, and no clipboard logging.
- The PrivacyShield and SensitiveValue patterns are documented for Payub-class apps.
- Same release hardening as web: `pnpm audit` gate and npm provenance. The npm token expiry (~2026-11-11) still applies to the new packages.

---

## 9. Plan and releases

Rolling-minor policy (PUBLISHING.md): all packages ship together. New native components carry **status `alpha` → `beta` → `stable`** (R5 governance), so we can ship early without promising stability.

| Phase | Scope | Release | Size |
|---|---|---|---|
| **M0: Spike + decisions** | `apps/mobile` Expo Router skeleton in the monorepo (pnpm + Metro, SDK 58). Prove: tokens/native → Button + ListItem + BottomSheet (D4 bake-off) + GlassView fallback + spring conversion + fonts + Maestro screenshot on both platforms in CI. **Exit: answers to D1–D8, written into this doc.** | none | S (about 1 week) |
| **M1: Foundations** | `@nexub/tokens/native`, `@nexub/core` (extracted; web re-exports), `@nexub/icons/native`, fonts, NexubNativeProvider, Pressable/haptics, Text/Heading/Box/Stack/Surface/Icon/ScreenContainer. Test infrastructure (Jest/RNTL, Maestro, budgets). | **2.1.0**, alpha | M |
| **M2: Core components** | About 30 components (§5), stories, Maestro baselines, docs pages | **2.2.0**, alpha → beta | L |
| **M3: Mobile-native** | Sheets, menus, header/tabs theme, swipe, OTP, keypad/money, pickers, sticky CTA, security components | **2.3.0**, alpha | L |
| **M4: Patterns** | 12 screen patterns + `apps/mobile` example app using real flows | **2.4.0**, alpha | M–L |
| **M5: Docs, AI, adoption** | Mobile docs section, MCP/skill/llms.txt, brand app icons + splash, getting-started guides, perf pass. **First pilot app adopts it.** | **2.5.0**, M1–M2 → stable | M |

Order rationale:
- M1 unblocks everything and is mostly generation from existing sources.
- M2 before M3, because sheets and patterns are built from M2 parts.
- A pilot app in M4/M5 tells us what to stabilise.

Each phase follows the existing flow: feature PR → development → staging → production → version PR → npm → back-merge, with CI watched at each step.

---

## 10. Decisions (approved 2026-10-29: every recommendation below; D5 = Payub)

| # | Question | Decision |
|---|---|---|
| **D1** | Package shape: one `@nexub/react-native` (+ `/patterns` subpath), or two packages mirroring web? | **One package.** |
| **D2** | Extract `@nexub/core` (messages, money, shared prop types, hooks) used by both web and native? | **Yes.** It's small, and web re-exports it so nothing breaks. The alternative is copy-pasting and drifting. |
| **D3** | Minimum platform: Expo SDK 58 / RN 0.88 only (variable fonts, simplest), or SDK 57 / RN 0.86 too (static fonts)? | **SDK 57+ (RN 0.86+) with static font weights.** Most apps lag one SDK. Revisit at SDK 59. |
| **D4** | BottomSheet engine: native formSheet / TrueSheet, or our own on Reanimated + Gesture Handler? (gorhom is stale) | **Decide in the M0 bake-off.** Lean native (TrueSheet) for feel and Liquid Glass, with our own as the fallback if it fails on a11y or keyboard. |
| **D5** | Which product app is the first pilot (Payub, Bookub, Leap, Founderub)? This decides the order of the M4 patterns. | **Payub.** It exercises the most: money, OTP, biometrics, privacy. |
| **D6** | Body text size on mobile: keep our 16 (consistent with web and Android) or use 17 on iOS (Apple Body)? | **Keep 16 on both.** Map Dynamic Type through `dynamicTypeRamp` so iOS scaling still follows Apple's curve. |
| **D7** | FAB: Android only, both platforms, or not at all? | **Android only, opt-in.** It reads as Material, like the ripple we rejected on web. |
| **D8** | Visual regression on every PR (macOS runners, slower), or nightly + before each release? | **Per PR for `react-native/` changes**, since the repo is public and runners are free. Drop to nightly if it gets slow. |
| D9 | Do we need fully native (Swift/Compose) token outputs now (R3)? | **No.** Only when a fully native app exists. |

---

## 11. Risks

| Risk | Mitigation |
|---|---|
| Native dependency churn (Gesture Handler 2→3, Reanimated 4.x, sheet libraries) | Few native peers, optional; support window = 2 Expo SDKs; an M0 bake-off before committing. |
| Expo SDK cadence (about 3 a year) and Hermes V1 regressions | Pin CI to the supported SDKs; test the matrix in the showcase app. |
| iOS 26/27 glass looks different from our web glass | Accept it: native glass follows the OS, including the iOS 27 slider. Our dial only chooses off/regular/clear. Never rely on translucency for contrast. |
| Scope creep: about 60 components + 12 patterns | Ship by phase with alpha status; a pilot app drives priorities; skip web-only components. |
| No web preview of native components in docs | Screenshots from Maestro + the showcase app. Don't build react-native-web previews. |
| Contrast settings fire no events | Re-read them on AppState `active`; documented ceiling. |

---

## 12. Execution plan (awaiting approval)

**Approved 2026-10-29, with one change: no release per phase.** Phases M0–M5 merge one by one into `development` once CI is green, and everything ships together as **one release (2.1.0)** after the last phase. The per-phase release numbers below are now only phase markers.

There are **6 phases: M0 (spike) plus M1–M5**. Each phase has its PRs and an exit check. Every PR goes feature → `development` → `staging` → `production` → Version PR → npm → back-merge, and each merge waits for green CI.

Durations are working estimates for one focused stream. Total: **about 13–16 weeks**.

### Before we start (blockers outside the code)

| # | Item | Why |
|---|---|---|
| B1 | **Renew `NPM_TOKEN` before ~2026-11-11**, or set up trusted publishing | 2.1.0 publishes two **new** packages (`@nexub/core`, `@nexub/react-native`). An expired token fails the first publish, as happened in 1.7.0. Trusted publishing can only be set per package *after* its first publish. |
| B2 | Confirm the `@nexub` npm scope allows new packages under the current token | Same reason. |
| B3 | A test iPhone and Android phone (any recent) for manual checks at release | Simulators miss haptics, real glass and biometrics. |
| B4 | Optional: an Expo account (EAS) for dev builds of the showcase app via QR | Without it, the showcase still runs from local builds; docs use screenshots. |

### M0: spike and proof (about 1 week, no release)

**Branch:** `spike/mobile-m0`. Only `apps/mobile` (private, never published) merges to `development`; everything else is thrown away or rewritten in M1.

1. `apps/mobile`: Expo SDK 58 + Expo Router app in the pnpm workspace. Prove that Metro works with pnpm installs and turbo tasks. Run on SDK 57 too (D3).
2. Throwaway token conversion script: roles, type, springs (`2ζ√k`), elevation `light-dark()` split. Check the colours match the web.
3. Prototype `Pressable` (state layer, 0.97 spring, haptic), `Button` and `ListItem` on real devices.
4. **BottomSheet bake-off (D4):** TrueSheet vs native `formSheet` vs our own on Reanimated + Gesture Handler. Score each on:
   - detents;
   - keyboard;
   - VoiceOver/TalkBack;
   - iOS 26 glass;
   - Android predictive back;
   - Expo Go / dev build;
   - maintenance.
5. `GlassView` with the Android / iOS<26 fallback and Reduce Transparency; static fonts on both platforms.
6. CI proof:
   - a Jest + RNTL job;
   - Maestro `assertScreenshot` on a GitHub-hosted macOS runner (iOS simulator) and on a Linux runner (Android emulator). Measure minutes per run (D8).
7. Re-check every [U] item in §2 that M1–M3 depend on.

**Exit:** a findings note appended here, a D4 winner, measured CI time, and a go for M1.

### M1: foundations → **2.1.0** (about 2 weeks)

| PR | Content | Touches |
|---|---|---|
| 1.1 | **`@nexub/core`**: move `NexubMessages`/defaults, `money.ts`, `directionOf`, shared types (`ToneValue`, variants, sizes) and `useControllableState`. `@nexub/react` re-exports them, so the web API is unchanged (its tests and size budgets prove it). | `packages/core` (new), `packages/react` |
| 1.2 | **`@nexub/tokens/native`**: SD formats for numbers, per-mode roles + product remaps, type objects (em→dp, ramp, caps), elevation pairs, Reanimated springs. Parity tests against the CSS output. | `packages/tokens/scripts`, `package.json` exports |
| 1.3 | **`@nexub/icons/native`**: lucide-react-native wrappers with the same names and sizes; `react-native-svg` as a peer. | `packages/icons` |
| 1.4 | **`@nexub/react-native` scaffold**: builder-bob build, `react-native` export condition, optional peers. Includes `NexubNativeProvider`, hooks, haptic tokens, `Pressable`, `Text`, `Heading`, `Box`/`Stack`/`Inline`, `Surface` (tonal/elevation/glass), `Icon`, `ScreenContainer`, and font assets with loading docs. | `packages/react-native` (new) |
| 1.5 | **Quality and release wiring**: Jest/RNTL setup, Maestro CI job, Metro bundle budgets in `size-budgets.json`, changesets/release workflow covering the new packages, `ci:local` updated. Components ship as `alpha`. | `.github/workflows`, `scripts`, root config |

**Exit:** 2.1.0 on npm with all 9 packages. The showcase renders the primitives in light/dark/high contrast/payub on both platforms, with Maestro baselines committed.

### M2: core components → **2.2.0** (about 3–4 weeks)

About 30 components from §5 in 4 PRs, each with stories in the showcase, RNTL tests (role, label, 44 hit area), Maestro baselines and a docs page stub:

| PR | Group |
|---|---|
| 2.1 | Actions + text/data: Button, IconButton, ButtonGroup, Link, Amount, Badge, Tag, StatusPill, Avatar/AvatarGroup, Divider |
| 2.2 | Inputs: TextField, PasswordInput, SearchField, MoneyInput, NumberInput/Stepper, Checkbox, Radio/RadioGroup, Switch, SegmentedControl, Slider, Chip/FilterChip |
| 2.3 | Containers: Card, **ListItem** (all variants), **ListSection**, Accordion |
| 2.4 | Feedback: Banner/Callout, Toast, Dialog, Progress, LoadingIndicator, Skeleton, EmptyState/ErrorState |

**Exit:** 2.2.0. The M1 primitives move to `beta`.

### M3: mobile-native components → **2.3.0** (about 3–4 weeks)

| PR | Group |
|---|---|
| 3.1 | Navigation and overlays: BottomSheet (D4 engine), ActionSheet, ContextMenu, Header (large title, scroll-edge), `nexubNativeTabs()` / `nexubNavigationTheme()` |
| 3.2 | Payub inputs: OTPInput/PinInput, NumericKeypad + ExpressiveMoneyInput, Select/Picker (sheet), DateTimePicker, StickyFooter/BottomCTA |
| 3.3 | Interaction and security: SwipeableRow (with a11y actions), RefreshControl, Carousel + PageIndicator, SensitiveValue, PrivacyShield, OfflineBanner, Coachmark, FAB (Android only) |

**Exit:** 2.3.0. Each new native peer has its security review in the PR.

### M4: patterns → **2.4.0** (about 2–3 weeks, Payub order)

| PR | Patterns |
|---|---|
| 4.1 | **Payub core flows**: Auth (sign-in, OTP, biometric unlock), Money flow (amount → recipient → review → confirm → success), Activity (list + detail) |
| 4.2 | Settings (with appearance: theme, glass dial, haptics), Profile, Notifications inbox, System screens (success/error/offline/maintenance/force-update) |
| 4.3 | Onboarding + permission primer, Search, Chat/AI assistant, Paywall/plans, App switcher |

The showcase app becomes a clickable Payub-style demo built only from public APIs, like the web example dashboard. **Exit:** 2.4.0. Maestro flows cover the money flow end to end.

### M5: docs, AI and adoption → **2.5.0** (about 2 weeks)

| PR | Content |
|---|---|
| 5.1 | Docs site "Mobile" section: component pages with Maestro screenshots (iOS/Android × light/dark), the web twin, props, peer table; getting started for Expo and bare RN |
| 5.2 | MCP + skill + `llms.txt`: native components, patterns and a mobile rules reference |
| 5.3 | `@nexub/brand` mobile app icons (iOS 26 layered, Android adaptive + monochrome) and splash for each product |
| 5.4 | Performance pass (list FPS, startup, bundle), then promotion: M1–M2 → `stable`, M3–M4 → `beta` |

**Exit:** 2.5.0, and **the Payub app adopts it**. Its feedback drives what goes to `stable` next.

### Where we start

**M0, step 1: the `apps/mobile` skeleton in the monorepo**, on branch `spike/mobile-m0`.

It's the cheapest way to surface the real risks (Metro + pnpm, Maestro on CI, sheet engine) before we write any package code, and it doesn't touch any published package. B1 (npm token) can run in parallel. It only has to be done before 2.1.0 publishes.

---

## Sources

- RN: reactnative.dev/blog (0.84, 0.85, 0.86, 0.88), reactnative.dev/docs/{view-style-props, accessibilityinfo, text}
- Expo: expo.dev/changelog/{sdk-55..58}, docs.expo.dev/router/advanced/native-tabs, docs.expo.dev/versions/latest/sdk/{glass-effect, haptics, keyboard-controller}, expo.dev/blog/expo-ui-stable-sdk-56, docs.expo.dev/guides/monorepos
- Reanimated withSpring: docs.swmansion.com/react-native-reanimated/docs/animations/withSpring
- Styling: unistyl.es/v3/other/for-library-authors, github.com/nativewind/nativewind/releases, docs.uniwind.dev/pro-version
- References: github.com/coinbase/cds, Fluent UI React Native repo
- Testing: RNTL 14 releases, Storybook RN 10.7, Maestro 2.12 (`assertScreenshot`), chromatic.com/docs/react-native
- Style Dictionary DTCG resolver: github.com/style-dictionary/style-dictionary/issues/1590 (open)
- Apple HIG: tab-bars, toolbars, sheets, action-sheets, context-menus, typography, accessibility, playing-haptics, materials, managing-accounts
- Material: material-components-android docs, androidx Compose material3 tokens; developer.android.com (Android 16 behaviour changes, edge-to-edge, SMS Retriever, dynamic colour)
- W3C WCAG 2.2 SC 2.5.8; wise.design sitemap; iOS 27 slider via MacRumors / 9to5Mac (June 2026)
