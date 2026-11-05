---
"@nexub/tokens": minor
---

Theme builder.

- **nexub.design/foundations/theme-builder**: pick one brand colour and see the accent family live on real components in light and dark, at standard, medium and high contrast. Every text pair is checked against WCAG 2.2 (4.5:1), including the accent on the actual surface. Export the theme as CSS, React (`<ThemeProvider seed>`), React Native (`<NexubNativeProvider seed>`) or W3C design tokens (DTCG JSON).
- **`createSeedStylesheet(seed, { target, selector })`** in `@nexub/tokens/seed`: the whole seeded theme as one stylesheet, with all three `data-contrast` levels and `prefers-contrast: more`, layered like the built-in roles so the contrast switch works with your brand.
- **`createSeedTokens(seed, options)`**: the seeded roles as DTCG JSON, one document per scheme, for Figma Variables, Tokens Studio or Style Dictionary.
- **`contrastRatio(a, b)`**: the WCAG 2.x contrast ratio of two hex colours.
