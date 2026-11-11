---
'@nexub/react': minor
---

8.4: API truth. No new components, props or variants.

- Deprecated: Button's legacy variant aliases `primary`, `secondary`, `outline` and `ghost` (same styles as `filled`, `tonal`, `outlined` and `text`). They still work, warn once in development, and are removed in 9.0. The default variant is now spelled `filled` (same look). `npx nexub-migrate --rules button-aliases --write` renames them; the new `ButtonLegacyVariant` type marks them `@deprecated`.
- Docs: web prop tables (react, patterns, marketing) are generated from the TypeScript types, the same way the React Native tables are, and CI fails when they drift. This corrected 50+ wrong rows: props that don't exist (Box `padding`, Chip `variant`, TextGradient `from`/`to`/`direction`, …), renamed ones (Drawer `side` → `direction`, PlanCard `ctaLabel`/`onCta` → `cta`/`onSelect`, UserCard `avatar` → `avatarSrc`), wrong defaults, and 200+ props that weren't documented.
- Docs: every TSX/TS code sample typechecks against the packages in CI.
- Fixes from removing every `react-hooks/exhaustive-deps` suppression (each with a regression test): the CommandPalette no longer calls a controlled input's `onValueChange('')` on mount, and its page breadcrumb follows a title change; a re-render no longer restarts `ListTransition`'s exit fallback; DataTable row reordering reads the latest rows on every move; unmounting a Sortable mid-drag removes its key listener. React Native: BottomSheet's drag-dismiss and ActionSheet's pick call the current `onOpenChange` (not one from an earlier render); a controlled MoneyInput no longer overwrites typing when the amount is unchanged; Slider, SwipeableRow and toasts keep one gesture responder across re-renders.
