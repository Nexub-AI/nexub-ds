---
"@nexub/patterns": minor
"@nexub/icons": minor
---

**New pattern `AppLauncher`** (the "waffle" app switcher), replacing the copies hand-built in each app.

- `<AppLauncher apps={[{ id, name, href, icon?, current? }]} onNavigate? surface? label? />`: an `IconButton` ("Nexub apps") opens a 320px `Popover` (aligned to the end) with a 3-column grid of app tiles (40px rounded icon and name).
- Missing or broken icons fall back to an `Avatar` with initials. The current app is subtly highlighted and marked `aria-current="page"`.
- Keyboard: opens with focus on the current app; arrow keys move through the grid, Home/End jump to the ends. `onNavigate(app)` takes over plain clicks for client-side routing; modified clicks still open the link.
- `surface="glass"` supported. Renders nothing for an empty list.
- `@nexub/icons`: new `Apps` icon (3×3 dots).
