---
'@nexub/react': minor
'@nexub/tokens': minor
'@nexub/themes': minor
---

7.3: Motion 2, one motion source.

- `@nexub/tokens/tailwind.css` sets `--default-transition-duration` / `--default-transition-timing-function` to the effects spring, so a bare `transition` / `transition-colors` uses the spring tokens instead of Tailwind's 150ms ease. The last raw `duration-*` / `ease-*` classes are gone, and a `raw-motion` design-lint rule keeps them out.
- The legacy `--duration-*` / `--ease-*` tokens (`tokens/motion.json`) and the Motion `easing` prop are deprecated, removed in 8.0.
- `Collapse` animates grid rows (`0fr` → `1fr`) instead of measuring `scrollHeight` in JS; content that grows while open just grows. Same props.
- `NavigationMenu`'s viewport resizes between items on the spatial spring instead of snapping.
- `Tabs`: `orientation="vertical"` is styled (indicator on the inline-end edge), and the incoming panel crossfades (`@starting-style`).
- `startViewTransition` flushes React state inside the transition (`flushSync`), so the snapshot is never stale, and returns a promise that resolves when the transition finishes.
- Thick glass overlays fade in without scaling.
