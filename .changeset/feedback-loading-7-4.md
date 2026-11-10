---
'@nexub/react': minor
'@nexub/core': minor
'@nexub/themes': minor
---

7.4: feedback and loading.

- `Button`: the loading spinner waits 150ms before showing and then stays at least 400ms (no flicker); `successLabel` no longer changes the button's width; `type="submit"` inside a pending React 19 `<form action>` shows loading on its own (`useFormStatus`).
- **New** `useAsyncAction(fn)` → `{ run, pending, error, reset }`: latest call wins, errors are captured, nothing updates after unmount.
- `toast.promise(promise, { loading, success, error })` and `toast.update(id, partial)`; a `loading` tone; tone icons (`icon={false}` hides them); `showProgress` countdown bar that pauses with the timer; a quick flick dismisses even under the distance threshold.
- `Skeleton animation="shimmer"` and **new** `SkeletonText` (`lines`), one line-height per line so the swap to real text doesn't shift.
- `DataTable`: `loading` (skeleton rows, `aria-busy`) and `emptyState`.
- `Avatar`: images fade in once loaded (server-rendered and cached images show at once); `status` (`online` / `away` / `busy` / `offline`) with the label in the accessible name.
- `Progress`: `variant="circular"` and `segments` for step-style progress.
