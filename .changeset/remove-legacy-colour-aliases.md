---
"@nexub/themes": minor
"@nexub/tokens": minor
---

**Breaking:** the legacy colour names are removed. These are the 57 names `nexub-migrate`'s `legacy-tokens` rule rewrites (`--color-text-primary`, `--color-bg-default`, `--color-success-500`, `--color-semantic-*` …) and the 9 color-mix border aliases (`--color-success-border`, `--color-semantic-success-border` …).
- `@nexub/themes` drops their aliases from `base.css` and `light.css`.
- `@nexub/tokens` drops the old static values behind 35 of them: the `color.bg`, `color.border` and `color.semantic` groups, and `color.text` and `color.surface` apart from `text.disabled` and `surface.warm`. They disappear from the CSS variables, the Tailwind preset and `tailwind.css` utilities (`bg-bg-default`, `text-text-primary` …), the JS tokens and `tokens.json`. Without the themes' aliases they would have fallen back to light-only hex values, so removing them is the safer break.
- Use the Calm Depth roles; `npx nexub-migrate src --write` moves CSS and class strings over.
- `--color-ring-default`, `--color-ring-offset` and `--color-accent-500` stay, because brand themes override them.
- `@nexub/themes/light` stays importable.
- `@nexub/tokens/native` is unchanged, since it only ever carried roles.

**Breaking:** `html` now has `font-size: 100%` instead of `16px`, so the rem tokens follow the user's browser font size. Nothing moves at the browser default.
