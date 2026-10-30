---
'@nexub/tokens': minor
'@nexub/themes': patch
'@nexub/react': patch
---

Tailwind CSS 4 support. Consumers on Tailwind 3 are unaffected: keep using the `@nexub/tokens/tailwind` preset.

- `@nexub/tokens`: the optional `tailwindcss` peer now accepts `^3.0.0 || ^4.0.0`. The v4 theme (`@import "@nexub/tokens/tailwind.css"`) now renders like the v3 preset in two places where it did not:
  - `max-w-sm` … `max-w-2xl` are Tailwind's own scale again (24rem … 42rem). Before, they picked up the Nexub `--container-*` layout tokens of the same name and rendered much wider. `max-w-container-*` still map to the tokens.
  - `text-xs` … `text-4xl` keep v3's line-height lengths (`text-sm` = 1.25rem) instead of v4's unitless ratios, so components nested in `text-sm` (a badge in a table cell, for example) keep their height.
- `@nexub/themes`: `base.css` gives buttons the pointer cursor that Tailwind 3's preflight set and Tailwind 4's no longer does. It has zero specificity, so `cursor-*` utilities still win.
- `@nexub/react`: `Pagination` page buttons set `tabular-nums` themselves. The nav already asked for tabular figures, but on Tailwind 3 the buttons never inherited them; on Tailwind 4 they did. Both now show tabular figures.
- The docs site and Storybook are now built with Tailwind 4. Getting Started documents both setups, including importing the theme CSS into the `base` layer on v4.
