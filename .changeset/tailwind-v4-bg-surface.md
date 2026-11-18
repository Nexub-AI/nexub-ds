---
"@nexub/tokens": patch
---

Tailwind 4: `bg-surface`, `text-surface` and `border-surface` now work. The `surface` colour role was dropped from `@nexub/tokens/tailwind.css` because the `color.surface.*` token tree overwrote it, so those classes generated nothing.
