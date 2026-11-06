---
"@nexub/react": minor
---

Charts 2.0.

- **`Gauge`**: progress toward a target on a 270° arc, with the value in the centre.
- **`Heatmap`**: intensity over a grid (activity by weekday and week, load by hour) in seven steps of the sequential chart palette.
- **`Funnel`**: drop-off through ordered steps, with conversion from the first step in the data table.
- **`KpiTile`**: a headline number with its change versus last period (green or red, `invert` for metrics where down is good) and a sparkline.
- **Crosshair**: hovering a category in `BarChart` and `LineChart` now draws a vertical guide through it alongside the tooltip.
- All are server components with no style attributes, palette colours, and a hidden table or caption for screen readers.
