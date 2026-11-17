---
'@nexub/react': minor
'@nexub/patterns': minor
'@nexub/themes': minor
'@nexub/core': minor
'@nexub/react-native': minor
---

10.5 Every state: loading, empty and error look designed everywhere, and state changes move.

- **One prop shape** (`loading`, `emptyState`, `errorState`; error wins, then loading, then empty) on BarChart, LineChart, DonutChart, Gauge, Heatmap, Funnel, Sparkline, KpiTile, ChartZoom, EventCalendar, TreeView, Kanban, `Table.Body`, and `errorState` on DataTable and DataTableVirtual. Patterns too: ActivityFeed, InfoList, NotificationCenter, SettingsPage, DashboardPage, ListDetail, TransactionDetailPage, ActivityPage; `loading` on StatCard and UserCard. Exported as `DataStateProps`.
- **Behaviour change**: a chart, tree or board with no data now says "Nothing here yet" instead of drawing an empty plot. Pass `emptyState` to change it.
- **`SkeletonPreset`**: card, tableRow, listRow, chart, form.
- **`Illustration`**: seven spot drawings (noData, noResults, noAccess, serverError, offline, notFound, maintenance) coloured by the theme and the product accent. `EmptyStatePreset illustrated` uses them; the preset gains `notFound` and `maintenance`.
- **`StatusPage`** pattern for 404, 500, maintenance, offline and no access, with three new templates.
- **Motion**: a sliding indicator on ToggleGroup (single), NavigationRail and Pagination; Stepper progress, Chip and FilterChip colours, the Avatar status dot and TreeView expand now animate; Drawer exits at the same speed as Dialog. `ErrorState` takes `retryLabel`.
- **Docs layout shift**: ResizablePanels, Combobox, FilterBuilder and Slider render their final layout on the server.
- **React Native**: Accordion, Progress, Checkbox, Radio, PageIndicator, TextField and Dialog animate on the shared springs. `ScreenContainer keyboardAvoiding` (default on) keeps inputs above the keyboard on iOS and Android; BottomSheet does the same on Android. Sizes read the theme tokens (lint exceptions 109 → 10).
