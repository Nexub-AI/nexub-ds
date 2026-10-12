---
"@nexub/tokens": minor
"@nexub/themes": minor
"@nexub/icons": minor
"@nexub/react": minor
"@nexub/patterns": minor
---

ESM-only packages, working tree-shaking, and RSC-safe builds.

- **Breaking:** `@nexub/react`, `@nexub/patterns` and `@nexub/icons` ship ESM only (CJS builds removed). `@nexub/tokens` exports gain a `default` condition, so `require('@nexub/tokens/tailwind')` now works on Node ≥20.19.
- `@nexub/react` and `@nexub/patterns` are built per component and every output file starts with `'use client'`, so they import cleanly from Next.js Server Components. A single-component import drops from ~130 KB gz to ~6–9 KB gz.
- `@nexub/icons`: unused icons are now tree-shaken (one icon ≈1 KB gz, was ≈10 KB).
- The Tailwind preset now registers `tailwindcss-animate`, so component enter/exit animations actually render. `tailwindcss` is an optional peer of `@nexub/tokens`.
- `@nexub/themes`: dark mode is no longer forced when `data-theme` is absent; with no attribute the OS preference decides.
- **Breaking:** `ThemeProvider` drops the `attribute` prop (`class` mode never matched the theme CSS). `system` mode now removes `data-theme` instead of setting it, and the provider no longer causes hydration mismatches. `useMediaQuery` starts `false` on first render.
