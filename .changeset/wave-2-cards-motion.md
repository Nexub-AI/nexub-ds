---
'@nexub/tokens': minor
'@nexub/themes': minor
'@nexub/react': minor
'@nexub/patterns': minor
---

Wave 2 — cards, effects and motion (ENHANCEMENTS_PLAN.md).

- **Cards.** `Card variant="interactive"` lifts 2px on a spring with elevation 1 → 2 and sinks on press (`nx-lift`; hover only where a real pointer hovers). Opt-in `effect="sheen"`: a soft light and rim follow the pointer (off for touch, reduced motion and reduced transparency). New `CardLink` makes the whole card one link with the focus ring on the card. New `usePointerSheen` hook.
- **New components.** `RadioCardGroup`/`RadioCard` and `CheckboxCard` (selectable cards with a springing check badge), `MediaCard` (image with a glass caption and optional stretched link), `NumberTicker` (rolling digits; `Amount animate`, `StatCard animate`), and `BentoGrid`/`BentoTile` in patterns (container-query tiles).
- **Toasts stack.** `Toaster` shows the newest toast with older ones peeking behind it and fans them out on hover or focus (timers pause meanwhile). New props `expand` and `visibleToasts`. Closed toasts are now removed from the store.
- **Motion.** Checkbox checks draw in; `nx-reveal` crossfades content in; `AppHeader condense` shrinks the bar on scroll with a CSS scroll timeline; opt-in page transitions via `@nexub/themes/view-transitions` and `startViewTransition()`. Tooltips and hover cards share hover-intent delays. Under reduced motion, overlays now keep a short crossfade instead of popping in.
- **Tokens.** New `--color-scrim` role.
