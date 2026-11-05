---
"@nexub/tokens": minor
---

**Breaking:** spacing, radius, shape, control heights, type sizes and line heights in `@nexub/tokens/css` are in rem by default, using the values of the 2.6 opt-in layer. At a 16px root they match the old px values. Remove any px `font-size` on `html` (such as `62.5%` tricks), or everything shrinks with it. `@nexub/tokens/css/rem` stays importable but is now empty. The JS tokens and `@nexub/tokens/native` keep px and points.

`nexub-migrate` no longer rewrites `--color-ring-default`, `--color-ring-offset` or `--color-accent-500`, because brand themes override them; 2.9 changed them to `--color-primary`. Its alias table is now frozen, since `@nexub/themes` no longer declares the aliases.
