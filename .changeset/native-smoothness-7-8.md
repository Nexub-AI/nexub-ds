---
'@nexub/react-native': minor
---

7.8: native smoothness.

- `BottomSheet`: the drag feeds Reanimated shared values and carries the release velocity into the snap or close spring; a quick downward flick closes it. Closing is a spring whose completion unmounts the sheet (no timers). A fling now snaps toward the detent it was heading for.
- `Toast` enters and leaves on the nx springs and can be swiped away sideways (velocity-aware).
- Ported from web 7.4–7.6: `Button` spinner delay (150ms show / 400ms minimum), `Skeleton animation="shimmer"` and **new** `SkeletonText`, `Avatar status`, `Progress segments`, `TextField clearable` / `showCount` / `loading`, `Switch loading`, `Badge count` + `max`, `EmptyState size`.
- Drags still read touches on the JS thread (PanResponder) because `react-native-gesture-handler` isn't a dependency; the animation itself runs on the UI thread.
