---
'@nexub/tokens': minor
'@nexub/themes': minor
'@nexub/react-native': minor
---

One typeface: Plus Jakarta Sans everywhere. Inter is no longer part of the design system.

- `--font-family-sans` is now Plus Jakarta Sans, the same as `--font-family-display` (both tokens stay). Interface text, controls and body copy change face; sizes, weights and line heights are unchanged. Plus Jakarta Sans runs a little wider than Inter, so check tight layouts.
- `@nexub/themes/base` (and `/fonts`) ships only the Plus Jakarta Sans files (latin, latin-ext, vietnamese; normal and italic). Other scripts fall back to the system font.
- React Native: `nexubFonts` loads Plus Jakarta Sans 400–800 and no Inter files (`Inter_*` keys are gone; `useFonts(nexubFonts)` needs no change).
- With `next/font`, load `Plus_Jakarta_Sans` for both `--font-family-sans` and `--font-family-display`.
- Body roles (`body-lg`, `body-md`, `body-sm`) have no letter-spacing now: the small negative tracking was tuned for Inter and made Plus Jakarta Sans too tight.
