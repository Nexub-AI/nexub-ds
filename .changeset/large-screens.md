---
'@nexub/react-native': minor
'@nexub/core': minor
---

Larger screens (12.5): tablet and foldable layouts on React Native.

- `useWindowSizeClass()` returns the Material 3 window size class (`compact` < 600dp, `medium` < 840dp, `expanded`) and updates on rotation, split view and folding; `windowSizeClass(width)` and `EXPANDED_MIN` come with it.
- New `NavigationRail` (`NavigationRail.Root`, `NavigationRail.Item`): with the default `orientation="auto"` it is a rail at the start edge on medium and expanded windows and a bottom bar on compact ones. Items take `icon`, `label`, `active`, `badge` (a count or a dot, read after the label) and `badgeLabel`; the rail takes a `header`.
- New `AppShell`: lays out `navigation`, an optional `header` and the content for the window: a bottom bar under the content on compact windows, a rail beside it from `railFrom` (`'medium'` by default, or `'expanded'`).
- New `ListDetail` in `@nexub/react-native/patterns`, with the web props: both panes side by side from the medium size class, one pane at a time on compact windows with a back button and Android back calling `onBack`. `splitRatio` (0.2–0.8) sets the list's share of the width instead of `listWidth`.
- `@nexub/core` messages gain `back`, `listPane` and `detailPane` (English defaults) for ListDetail.

Foldables are handled through window size only: React Native and Expo expose no hinge or posture API without a new native module, so an unfolded foldable lays out like a tablet. Hinge-aware splits are left for later. Existing phone layouts don't change.
