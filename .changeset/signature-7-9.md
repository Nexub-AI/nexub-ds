---
'@nexub/tokens': minor
'@nexub/themes': minor
'@nexub/react': minor
'@nexub/react-native': minor
---

7.9: the Signature look (opt-in) and the 8.0 release candidate.

- **New** `data-style="signature"` on `<html>` (or any subtree): the same contrast-guaranteed role engine with Nexub's own face. Neutral grey surfaces with a faint warm outline instead of lavender tints, 10px controls and fields with 16px cards, a primary seeded from the Nexub brand indigo, neutral-tinted tonal containers instead of pastels, tighter display tracking, tabular numerals in tables, and crisper hairline elevation. Chips, toggles, segmented controls and pill tabs stay full pills (`--shape-pill`). Every role pair is tested for WCAG AA in both styles.
- Under Signature, `Switch` is a full-thumb switch; radio dots and checkbox ticks animate in on the springs.
- React Native: `<NexubNativeProvider style="signature">`.
- 8.0 RC: every 7.x deprecation is frozen with its removal version; `nexub-migrate --rules changes-in-8` reports what 8.0 changes in your code; **new** docs page "Migrating to 8.0". In 8.0 Signature becomes the default (`data-style="classic"` keeps today's look), `scrollLock="class"` and strict `safeHref` become the defaults, and the legacy motion tokens and `easing` prop are removed.
