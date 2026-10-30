# @nexub/react-native

React Native components and screen patterns for Nexub Design System. They use the same tokens, brands and prop names as `@nexub/react` on the web.

**Native chrome, Nexub content.** The system draws the tab bar, stack header, back gesture, action sheets, pickers and iOS 26 Liquid Glass; Nexub themes them. Everything inside a screen (lists, cards, buttons, inputs, money) is drawn by Nexub, so it looks the same on iOS, Android and the web.

Status: **alpha**. Built for Expo SDK 57+ / React Native 0.86+ (New Architecture). Works in Expo apps and bare React Native apps.

## Install

```bash
npx expo install @nexub/react-native react-native-reanimated react-native-worklets react-native-svg react-native-safe-area-context expo-font
```

Optional peers. Add only what you use; without them the feature is a no-op or the component tells you what to install:

| Package | Used by |
|---|---|
| `expo-haptics` | Semantic haptics on every control |
| `expo-glass-effect` | Native Liquid Glass (`Surface material="glass"`) on iOS 26+ |
| `expo-screen-capture` | `PrivacyShield preventCapture` |
| `@react-native-community/datetimepicker` | `DateTimeField` |

`@nexub/tokens`, `@nexub/core`, `@nexub/icons` and the fonts (Inter, Plus Jakarta Sans, Geist Mono; OFL) come with the package.

## Set up

```tsx
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { NexubNativeProvider, ToastProvider, nexubFonts, useNexubNavigation } from '@nexub/react-native';

function Screens() {
  const nav = useNexubNavigation(); // native stack in Nexub colours and type
  return <Stack screenOptions={nav.stack} />;
}

export default function RootLayout() {
  const [ready] = useFonts(nexubFonts);
  if (!ready) return null;
  return (
    <NexubNativeProvider product="payub">
      <ToastProvider>
        <Screens />
      </ToastProvider>
    </NexubNativeProvider>
  );
}
```

`NexubNativeProvider` props:

| Prop | Default | |
|---|---|---|
| `scheme` | `'system'` | `'light'`, `'dark'` or follow the OS |
| `contrast` | `'system'` | follows iOS Increase Contrast / Android high-contrast text (re-read on foreground) |
| `product` | none | `'leap' \| 'bookub' \| 'payub' \| 'founderub'`: remaps the tertiary family |
| `seed`, `seedTarget` | none | white-label colour: regenerates the primary (or tertiary) family with contrast-safe tones |
| `glass` | `'balanced'` | the user's glass dial; forced `'off'` under Reduce Transparency |
| `haptics` | `true` | the user's haptics setting |
| `fonts` | `'nexub'` | `'system'` to use the platform font |
| `locale`, `dir`, `messages` | `'en'` | Intl locale, RTL (derived from the locale) and translated strings, same as web `NexubProvider` |

Hooks: `useTheme()`, `useRoles()`, `useHaptics()`, `useNexubMessages()`, `useNexubNavigation()`.

## Components

Names and props match `@nexub/react` where a web twin exists.

- **Primitives:** `Text`, `Heading`, `Pressable` (state layer, 0.97 press spring, haptic), `Surface` (tonal tiers, elevation, glass), `Box`, `Stack`, `Inline`, `Icon`, `ScreenContainer`.
- **Actions:** `Button`, `IconButton`, `ButtonGroup`, `Link`.
- **Data:** `Amount`, `Badge`, `Avatar`, `AvatarGroup`, `Divider`.
- **Inputs:** `TextField`, `PasswordInput`, `SearchField`, `MoneyInput`, `Stepper`, `Checkbox`, `RadioGroup` / `Radio`, `Switch` (the platform switch), `SegmentedControl`, `Slider`, `Chip`, `FilterChip`, `Select`, `DateTimeField`, `OTPInput`, `NumericKeypad`, `ExpressiveMoneyInput`.
- **Containers:** `Card`, `ListItem` (navigation, switch, checkbox, radio, button and value rows), `ListSection`, `Accordion`.
- **Overlays:** `BottomSheet` (detents), `ActionSheet` (system sheet on iOS), `ContextMenu`, `Dialog`.
- **Feedback:** `Banner`, `ToastProvider` / `useToast`, `Progress`, `LoadingIndicator`, `Skeleton`, `EmptyState`, `ErrorState`, `OfflineBanner`, `Coachmark`.
- **Mobile:** `SwipeableRow`, `RefreshControl`, `Carousel`, `PageIndicator`, `StickyFooter`, `SensitiveValue`, `PrivacyShield`, `FAB` (Android only by default).
- **Navigation helpers:** `nexubStackOptions`, `nexubNavigationTheme`, `nexubTabsOptions`.

- **Motion:** `nxEnter`, `nxExit`, `nxLayout` (Reanimated layout animations) and `nxSpring` (a `withSpring` config), built from the same spring tokens as the web. `<Animated.View entering={nxEnter('up')} exiting={nxExit('down')} layout={nxLayout()} />`. Toast, Banner, `ListSection` rows, `SwipeableRow`, `Chip`, the `SegmentedControl` pill and `Amount` (`animate`) already use them. In a `FlatList`, pass `nxLayout()` as `itemLayoutAnimation`.

Icons: `import { Search } from '@nexub/icons/native'`. These are the same names as `@nexub/icons`. Colour them with `<Icon icon={Search} color="primary" />`.

## Patterns

`import { SignInScreen, AmountStep, ActivityList } from '@nexub/react-native/patterns'`. Each pattern is a screen template that takes data and callbacks, so it works with any router.

- **Auth:** `AuthScreen`, `SignInScreen`, `VerifyCodeScreen`, `LockScreen`.
- **Money:** `FlowStep`, `AmountStep`, `ReviewStep`, `ActivityList`, `TransactionDetail`, `ResultScreen`.
- **App:** `OnboardingScreen`, `PermissionPrimer`, `SettingsScreen`, `ProfileHeader`, `AppearanceSection`, `NotificationsInbox`, `SearchScreen`, `ChatScreen`, `PaywallScreen`, `AppSwitcherSheet`.

## Rules the components follow

- **Touch targets:** every control reaches 44pt (`hitSlop` on smaller visuals). Primary actions use `size="lg"` (48).
- **Text scaling:** every role scales with the system text size. iOS follows Apple's Dynamic Type curve per role, and display and headline roles are capped so they don't push content off screen.
- **Screen readers:**
  - A list row is one element ("Amazon, −$42.50, today").
  - Swipe and long-press actions are also accessibility actions.
  - Masked values read as "hidden".
  - Toasts are announced.
- **Haptics are semantic** (`selection`, `toggleOn`/`toggleOff`, `confirm`, `reject`, `warning`, `snap`), never on plain taps, and never the only feedback.
- **Motion:** M3 springs. Enter rides the spatial spring; exit is quicker on the effects spring and never overshoots. Every preset follows the OS Reduce Motion setting.
- **Glass:** for the control layer only, never content. It is native Liquid Glass on iOS 26+, solid elsewhere and whenever the user turns transparency down.
- **Security:** `OTPInput` uses one field, so SMS autofill works. `PasswordInput` sets the platform autofill hints. `SensitiveValue` re-masks when the app backgrounds. `PrivacyShield` covers the app-switcher snapshot. The library makes no network calls and stores nothing.

## Testing your app

The library's own tests use Jest (jest-expo) and React Native Testing Library. In your Jest setup, stub `react-native-reanimated`'s APIs and use `react-native-safe-area-context/jest/mock`; `packages/react-native/jest.setup.js` in the repo shows the pattern.

## Links

- Docs: https://nexub-ds-docs.pages.dev/getting-started/react-native
- Plan and decisions: [MOBILE_PLAN.md](https://github.com/Nexub-AI/nexub-ds/blob/development/MOBILE_PLAN.md)
- Web components: `@nexub/react`
