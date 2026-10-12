---
"@nexub/themes": minor
"@nexub/tokens": minor
---

Plus Jakarta Sans is now the Nexub DS typeface.

- `@nexub/tokens`: `--font-family-sans` (and the Tailwind `font-sans` utility) is now `'Plus Jakarta Sans Variable', 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif`. The Devanagari and Tamil stacks fall back to it. Previously the stack named Geist, which was never loaded, so apps rendered the system font.
- `@nexub/themes/base` self-hosts the font via `@fontsource-variable/plus-jakarta-sans` (OFL-1.1). It provides variable weights 200–800, normal and italic, and `font-display: swap`. Subsets load on demand by `unicode-range`. Any app importing `@nexub/themes/base` gets the font with no extra setup and no third-party font request.
- `base.css` makes `button`, `input`, `select` and `textarea` inherit the font, so form controls match even without Tailwind's preflight.
