---
'@nexub/react': minor
'@nexub/patterns': minor
'@nexub/themes': minor
'@nexub/tokens': minor
'@nexub/core': minor
---

10.3 Lively app surfaces: Vivid reaches the app, and every product gets one accent.

- **Vivid in apps** (`@nexub/themes/vivid`, nothing changes under `calm`): page titles are heavier, the active Sidebar item and NavigationRail pill are tinted with the accent and the Sidebar gains a marker that slides between items, stat cards lift on hover, bars fade toward the baseline, and Table, DataTable and list rows share one hover tint.
- **Category colours**: eight generated colours (`--color-category-*`, one per chart series, 4.5:1 in light and dark) plus `accent`. New `category` prop on `Badge`, `Avatar` (`"auto"` picks a stable colour from the name) and `StatCard`.
- **New**: `IconChip` (an icon on a tinted tile), `SuccessCheck` (a small success animation), `WelcomeBanner` (pattern).
- **PageHeader** `wash`: a padded panel that carries a soft wash of the accent under Vivid.
- **StatCard** `category`, `trend` and `trendLabel`: a coloured icon chip and a small trend line.
- **DashboardPage** is the reference screen: new `banner` and `chart` slots, stats take `category` and `trend`. Changed: the first quick action is now the filled main action, and transaction avatars take a colour from the name.
- **Button**: `variant="tonal"` with a `tone` is now a soft, coloured button (the role's container pair). Changed: it used to render the same solid fill as `filled`.
- **Product accent**: `ThemeProvider` accepts every app key in the product map (was four). `AppHeader` and `Sidebar.Root` take `accent`, and `AppLauncher` apps take `accent`. Under `data-product` or `data-division` the new `--color-spot*` values carry the app's accent to the icon chip, the active navigation item, the header wash and the welcome banner. `@nexub/react` re-exports `PRODUCT_KEYS`, `DIVISIONS`, `CATEGORY_COLORS` and `accentAttrs`.
- **Deprecated**: `@nexub/themes/leap`, `/bookub`, `/payub` and `/founderub`. Import `@nexub/themes/products` instead; the four files are removed in 11.0.
