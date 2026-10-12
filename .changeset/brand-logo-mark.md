---
"@nexub/tokens": minor
"@nexub/icons": minor
"@nexub/react": minor
---

**Branding: the official Nexub mark in `Logo`.**

- `NexubMark` (`@nexub/icons`) now draws the official Nexub mark (the purple-blue ribbon), taken from the master SVG without redrawing. It replaces the placeholder "B". New `variant` prop: `"mono"` (default, `currentColor`, as before) or `"color"`. Each instance gets its own gradient ids, so several marks on one page don't clash.
- `Logo` gets `mark="color" | "mono"` (default `"color"`) and `product?: string`. With `product`, it renders the mark, "nexub", a subtle separator and the product name in muted text at the wordmark's size, e.g. `<Logo product="Command Hub" />`. The accessible name becomes "Nexub Command Hub".
- `Logo` `variant="icon"` is the new name for the mark-only variant. `variant="mark"` still works. `Logo` now has `role="img"`, so its name is announced.
- The mark is sized by height at its real 78:56 ratio (it used to sit in a square box).
- `@nexub/tokens`: 47 new brand tokens, `--color-brand-mark-1` … `--color-brand-mark-47` (Tailwind `brand-mark-*`), holding the mark's gradient colours. `Logo` and `NexubMark` contain no hex values.
