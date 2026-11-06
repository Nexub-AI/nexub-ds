---
"@nexub/tokens": minor
"@nexub/react-native": minor
---

4.0: removes what 3.9 deprecated, and nothing else.

- **Removed: the Tailwind 3 preset** (`@nexub/tokens/tailwind`) and its `tailwindcss-animate` dependency. Use Tailwind 4 with `@import "@nexub/tokens/tailwind.css"`; the utilities keep their names. The `tailwindcss` peer is now `^4.0.0`. `nexub-migrate --rules tailwind-3-preset` still finds any leftover import.
- **Removed: Expo SDK 57 support.** `@nexub/react-native` now needs Expo SDK 58 or later (`expo-glass-effect`, `expo-haptics` and `expo-screen-capture` peers `>=58.0.0`).
- No component API changed. If you were clear of the 3.9 warnings, 4.0 is a version bump. See Migrating to 4.0 in the docs.
