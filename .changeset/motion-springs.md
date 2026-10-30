---
"@nexub/react": minor
"@nexub/react-native": minor
"@nexub/themes": minor
---

**Motion on the spring tokens, web and native:**

- `Fade`, `Slide`, `Scale` and `Collapse` ride the spring tokens: opacity on `effects`, movement on `spatial`, and a quicker exit that never overshoots. `duration` maps to fast / default / slow springs. Passing `easing` keeps the old duration + easing tokens, so existing code can opt out. Under reduced motion they keep the fade and drop travel and scale.
- `Drawer` / `Sheet` slide on the springs instead of vaul's fixed 0.5 s curve. Exit is quicker, and the panel fades instead of sliding under reduced motion.
- New `ListTransition`: keyed items grow in, and removed items collapse and fade out in place. It works as `<ListTransition as="ul" itemAs="li">`.
- New `SkeletonSwap`: crossfades from a skeleton to the loaded content and sets `aria-busy` while loading.
- New `usePrefersReducedMotion()` hook.
- `@nexub/themes/base`: `nx-stagger` (children rise in 40 ms apart), plus the `nx-list-item` and `nx-swap` keyframes the components use.
- `@nexub/react-native`: `nxEnter`, `nxExit`, `nxLayout` (Reanimated layout animations) and `nxSpring` (a `withSpring` config), built from the same spring tokens. All of them follow the OS Reduce Motion setting.
- Native animations:
  - Toast and Banner animate in and out.
  - `ListSection` rows grow in and fade out while the other rows glide into place.
  - `SwipeableRow` slides out toward the start edge when removed.
  - `Chip` glides to its new width and its check pops in.
  - The `SegmentedControl` pill slides between segments.
  - `Amount` has an opt-in `animate` prop.
  - Skeleton pulses at the web rhythm.
