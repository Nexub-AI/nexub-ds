---
'@nexub/react-native': minor
---

**Templates on native** (12.5) in `@nexub/react-native/patterns`. Every new prop is optional; without them each screen renders as before.

- New `SignUpScreen` (alpha), the twin of the web `SignUpPage`: name, email, a password with a four-step strength meter that is also said in words, an optional phone number (`phone`, `defaultCountry`), the terms (`termsLabel`, plus native-only `termsAction`), `social` above an "or" divider and `onSignIn`. Fields are checked on blur and on submit, and a failed submit lists every problem in a danger Banner. The password field asks for a new password (`textContentType="newPassword"`, `autoComplete="new-password"`) so iCloud Keychain and Android Autofill can suggest one. Also exported: `SignUpValues`, `PasswordRule` and `defaultPasswordRules` (the same rules as web).
- New `StatusScreen` (alpha), the twin of the web `StatusPage`: `kind` (`notFound`, `serverError`, `maintenance`, `offline`, `noAccess`) with the localised `messages.emptyStates` words and Illustration, `code`, `title`, `description`, `illustration` (`null` hides it), `actions`, `onRetry` and `onHome` (native for `homeHref`). Server error and offline are announced. Buttons sit above the home indicator, as on ResultScreen.
- `VerifyCodeScreen`: the rest of the web `VerifyCodePage` props: `methods` + `onMethodChange` (other ways to verify), `onChangeDestination`, `expiresAt` + `now` (a Countdown of the code's lifetime), `loading` (read-only boxes), `logo`, `title`, `description`, `submitLabel` (adds a Continue button) and `messages`. `onResend` is now optional; without it a Continue button shows.
- `SignInScreen`: `description` and `messages`.
- New `AuthScreenMessages` and `defaultAuthScreenMessages`: the auth screens' strings, keyed as the web templates' `PageTemplateMessages` so one translation file can serve both.
- Left for later: the web-only `as` and `fullScreen` (a screen is always the whole screen). Settings and dashboard already had native twins (`SettingsScreen`, `HomeScreen`). The showcase app does not show `SignUpScreen` or `StatusScreen` yet, so their docs pages have code and props without a phone frame.
