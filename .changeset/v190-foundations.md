---
'@nexub/tokens': minor
'@nexub/themes': minor
'@nexub/react': minor
'@nexub/patterns': minor
---

1.9.0 — foundations (ENHANCEMENTS_PLAN.md release tracker).

- **Brand theming from a seed colour.** `ThemeProvider seed="#e4572e"` (and `seedTarget="tertiary"` for a product brand) regenerates the accent roles at runtime with the same HCT tone table as the built-in themes, so contrast pairs stay AA in light, dark and every contrast level. The colour maths loads lazily, only when `seed` is set, and is applied through the CSSOM (strict-CSP safe). For SSR, `createSeedTheme()` / `createSeedThemeCss()` from the new `@nexub/tokens/seed` entry give the same values as data or CSS.
- **Tailwind v4.** `@import "@nexub/tokens/tailwind.css"` after `@import "tailwindcss"` gives v4 apps the same utilities as the v3 preset (colour roles, shapes, elevation, type roles, spring timings, spacing), generated from the same token data and tested against Tailwind 4.3. The v3 preset is unchanged.
