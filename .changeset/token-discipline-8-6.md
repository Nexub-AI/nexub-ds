---
'@nexub/react': minor
---

8.6: token discipline. No new components, props or variants, and no visual change at the default 16px root. With a larger root font size, Textarea min heights and the toast and table touch targets now scale with it, like the rest of the tokens.

- Web: a `raw-px` design-lint rule for @nexub/react and @nexub/patterns. Arbitrary px values (`min-h-[44px]`) fail CI; hairlines (`1px`) and px fallbacks inside `var(--token, 64px)` are fine. 15 were moved onto tokens of the same size (`min-h-11`, `min-h-14`, `outline-3`, `w-0-5`, `rounded-shape-min`, …). The 37 with no token yet (18px controls, 10px badge text, concentric inner radii, 400px panels) are on a shrink-only list.
- React Native: the same lint for raw numeric styles. 38 spacing values now read `tokens.spacing[…]`; the rest are on a shrink-only list.
