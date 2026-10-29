---
"@nexub/react-native": minor
---

**React Native screen patterns** (MOBILE_PLAN.md, phase M4), alpha, in `@nexub/react-native/patterns`. Each is a data-plus-callbacks template built only from the public components, so it works with any router:

- **Auth:** `AuthScreen`, `SignInScreen` (platform autofill, optional "Sign in with Face ID"), `VerifyCodeScreen` (OTP with resend countdown), `LockScreen` (biometric unlock + passcode fallback).
- **Money (Payub first):** `FlowStep` (progress + sticky action), `AmountStep` (keypad amount with live fee, rate and arrival; blocks over-balance), `ReviewStep`, `ActivityList` (grouped by day, pull-to-refresh, paging, swipe actions), `TransactionDetail`, `ResultScreen` (success/error/offline/maintenance/update).
- **App:** `OnboardingScreen`, `PermissionPrimer`, `SettingsScreen` + `ProfileHeader`, `AppearanceSection` (theme, glass dial, haptics), `NotificationsInbox`, `SearchScreen`, `ChatScreen` (AI assistant, composer above the keyboard), `PaywallScreen`, `AppSwitcherSheet` (Nexub apps).
