---
'@nexub/react': minor
'@nexub/core': minor
'@nexub/patterns': minor
---

11.3 Dashboards tell the truth. Closes the platform gaps #11, #16, #23, #25, #26 and #32 (ROADMAP_11.x.md), and opens the RFCs for `@nexub/elements` (#712, gap #36) and `@nexub/diagram` (#713, gap #34). Additive and opt-in; no default changes.

- **Charts** (#11): a `null` or missing value is drawn as a gap (no bar, a break in the line) and listed as "—", not as 0. Semantic tones `good`, `warning`, `danger` and `neutral` beside the 1–8 palette on any series, slice or sparkline. BarChart `orientation="horizontal"` for ranked lists with long names, `colorOf` for a colour per bar, and `variant="waterfall"` with `totalKey` (rises in `good`, falls in `danger`, totals from zero). `integerTicks` keeps the gridlines on whole numbers. One formatter per series (`series[].valueFormat`) for a multi-currency chart. The product accent still stays out of charts.
- **Show as table** (#25): `tableView` on BarChart, LineChart, DonutChart, Funnel and Heatmap: a visible "Show as table" disclosure with the same data (a native `<details>`, so it works in server components with no JS).
- **UsageTile** and **UsageBar** (#16, #26, new): used of a limit, a bar that turns to the warning tone near the limit (`warnAt`, default 80%) and danger at it, with a text hint ("84% used", "Limit reached") and `role="meter"`; unlimited plans show "Unlimited". `usageLevel()` is exported. **StatCard**: `size="sm"`, a `note` slot, `tone="bad-when-high"`, `change` with `changeFormat` (percent or absolute), and `changeLabel`.
- **StageCounter** (#23, new): a row of toggle cards with a count and a failed count each, that filters a list (`aria-pressed`, single or `multiple`).
- **Small options** (#32): DonutChart `maxSlices` groups the rest into "Other", `legendValues` shows value and share, a slice's `href` links its legend row, `size` (folds in the useful parts of #673). Funnel several `series` and `show="conversion" | "drop-off" | "both"`. Heatmap missing cells and a `legend`. Gauge `tone` and `caption`. FilterBar `search={false}`. CheckList item `status: 'done' | 'pending'`.
- **Native parity:** the charts, tiles and StageCounter have no `@nexub/react-native` twin; native dashboards keep `KpiTile` and `ProgressBar`.
- **The platform can delete** these admin-ui stopgaps: `UsageMetric`, `Metric`, the hand-built stage filter rows, the charts' `?? 0` null workarounds, and the table fallbacks under charts.
