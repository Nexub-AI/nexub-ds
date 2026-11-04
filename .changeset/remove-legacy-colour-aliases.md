---
"@nexub/themes": minor
---

**Breaking:** the legacy colour aliases are removed from `base.css` and `light.css`: the 57 names `nexub-migrate`'s `legacy-tokens` rule rewrites (`--color-text-primary`, `--color-bg-default`, `--color-success-500`, `--color-semantic-*` …) and the 9 color-mix border aliases (`--color-success-border`, `--color-semantic-success-border` …). Use the Calm Depth roles; `npx nexub-migrate src --write` moves code over. `--color-ring-default`, `--color-ring-offset` and `--color-accent-500` stay, because brand themes override them. `@nexub/themes/light` stays importable.

**Breaking:** `html` now has `font-size: 100%` instead of `16px`, so the rem tokens follow the user's browser font size. Nothing moves at the browser default.
