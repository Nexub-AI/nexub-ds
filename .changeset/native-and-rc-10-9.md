---
'@nexub/react-native': minor
'@nexub/react': minor
'@nexub/core': minor
'@nexub/tokens': minor
---

10.9 Native, next level, and the 11.0 release candidate. 10.9.x is published under the npm tag `next`; `latest` stays on 10.8.x until 11.0.

- **Native look**: `NexubNativeProvider expression="vivid"`, `product` accepts every product in the generated map, and the theme exposes the product accent. Category colours on `Badge` and `Avatar`, new `IconChip`, `StatCard`, `NumberTicker`, a gradient main action and tone-aware tonal buttons. `dynamicColor` follows the Android 12+ system accent (opt-in). `useBreakpoint` and `useResponsive` for tablets and landscape.
- **Gestures on the UI thread**: BottomSheet, Toast, SwipeableRow and Slider read touches with react-native-gesture-handler worklets. **`react-native-gesture-handler` >= 3 is now a required peer**: wrap the app root in `GestureHandlerRootView`. Android back closes Coachmark; the demo app turns on predictive back.
- **New native twins** (#302): `Tabs`, `Table`, `Rating`, `Tooltip`, `StepIndicator` (alias of `StepProgress`), plus twins of `DescriptionList`, `ComparisonBar`, `PhoneInput`, `Countdown` and the `StatusSteps` pattern.
- **QR codes** (#305): `QRCode` on web and native (always dark on light, value shown as text) and native `QRScanner` (optional `expo-camera` peer, with permission states, torch and a manual-entry fallback). The encoder is `encodeQR` in `@nexub/core`.
- **Toward 11.0**: `npx nexub-migrate --rules changes-in-11` rewrites the four deprecated product theme imports and lists overlays that rely on the old `sheet` default. See "Migrating to 11.0" in the docs and RFC #662.
- Device baselines for the pattern screens are also captured in dark, high contrast, RTL and (iOS) large text. The mobile demo gains a small connected app under `/demo`.
