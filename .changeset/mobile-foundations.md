---
"@nexub/core": minor
"@nexub/react-native": minor
"@nexub/tokens": minor
"@nexub/icons": minor
"@nexub/react": minor
---

**React Native support, foundations** (MOBILE_PLAN.md, phase M1):

- New `@nexub/core`: the strings, locale direction, money formatting and shared prop types (`ToneValue`, `GlassMode`, …), now shared by web and native. `@nexub/react` re-exports everything it moved, so the web API is unchanged.
- `@nexub/tokens/native`: tokens for React Native. Dimensions as dp numbers, colour roles resolved to hex per contrast level × scheme (plus product remaps), elevation as per-scheme `boxShadow`, and springs as Reanimated configs. A test keeps them equal to the CSS.
- `@nexub/tokens/seed`: `createSeedRoles(seed)` returns the seeded family as `{ light, dark }` hex, for native.
- `@nexub/icons/native`: the same icon names as `@nexub/icons`, on `lucide-react-native` (an optional peer).
- New `@nexub/react-native` (alpha):
  - `NexubNativeProvider`: scheme, contrast (follows iOS Increase Contrast / Android high-contrast text), product, seed, glass dial (off under Reduce Transparency), Reduce Motion, haptics, locale, RTL and strings.
  - Primitives: `Text`/`Heading` (role type, Dynamic Type ramps), `Pressable` (state layer + 0.97 press spring + semantic haptics), `Surface` (tonal tiers, elevation, native Liquid Glass on iOS 26+ with a solid fallback), `Box`/`Stack`/`Inline`, `Icon` and `ScreenContainer`.
  - `nexubFonts` for `useFonts` (Inter, Plus Jakarta Sans, Geist Mono; OFL).
