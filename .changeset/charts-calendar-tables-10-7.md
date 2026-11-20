---
'@nexub/react': minor
'@nexub/patterns': minor
'@nexub/themes': minor
'@nexub/core': minor
---

10.7 Charts, calendar and tables.

- **Interactive charts** (opt-in; default charts stay server-rendered): `interactive` on BarChart, LineChart (and `area`), DonutChart, Heatmap, Funnel and Sparkline adds a crosshair that snaps to the nearest point, a tooltip that stays inside the plot, tap on touch, and keyboard navigation (arrows, Home, End, Escape) with the focused point announced. `onPointClick` reports the point. `legend="toggle"` on BarChart and LineChart turns the legend into show/hide buttons (`hiddenSeries`, `defaultHiddenSeries`, `onHiddenSeriesChange`).
- **EventCalendar**: `day` view with an hour grid and a now line, and `agenda` view as a list grouped by day. `views` picks what the switcher offers (default unchanged); `now` makes it deterministic.
- **Table**: `stickyHeader` with `maxHeight`, `density`, `striped` on `Table.Root`.
- **DataTable**: a footer row from each column's `footer` (sums follow the filtered rows), and per-column filters (`meta.filter: 'text' | 'select' | 'number-range'`, `columnFilters`, `defaultColumnFilters`, `onColumnFiltersChange`, `manualFiltering`). The filter popover loads only when used.
- **`Truncate`**: clips text to one or more lines and shows a tooltip only when the text is really cut.
- **New (#306)**: `DescriptionList` (label and value rows on `<dl>`, inline or stacked, 1 to 3 columns, emphasis for totals), `ComparisonBar` (two values on one split bar with a text alternative) and the `StatusSteps` pattern (a read-only progress list with done, current, upcoming and problem steps).
