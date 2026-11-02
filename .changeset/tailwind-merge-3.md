---
'@nexub/react': minor
---

`cn()` now uses tailwind-merge 3. Class merging is unchanged: every `cn()` call made across the test suite (421 distinct inputs) gives the same result as on tailwind-merge 2. A bare `outline` still counts as the outline style, as Tailwind 3 reads it, so focus rings keep working in Tailwind 3 apps.
