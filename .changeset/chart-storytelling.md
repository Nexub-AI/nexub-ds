---
'@nexub/react': minor
'@nexub/core': minor
---

**Charts that tell a story** (12.3) on `LineChart` and vertical `BarChart`. All three props are optional; without them a chart renders exactly as before.

- `annotations`: a labelled point (`{ at: 'Feb', label: 'Launch' }`, add `series` to dot that value) or a shaded range (`{ at: 'Apr', to: 'May', label: 'Promo' }`).
- `change`: a callout above the plot such as "Up 12% (+$1,200) since March", comparing two points. The amount goes through the series' `valueFormat` (then the chart's), the percentage through `Intl` in `change.locale`. Rises are shown in the success colour and falls in the error colour (`invert` for costs and churn); `text` replaces the sentence for translation.
- `referenceLines`: a labelled horizontal line at a value (target, average), which widens the axis to stay in view, or a vertical line at a category (`axis: 'category'`). `tone` colours the line only.
- Every note is also text: the callout and a visually hidden "Chart notes" list describe the figure (`aria-describedby`). Labels read correctly in RTL and use theme tokens in light and dark. The product accent still stays out of charts.
- `@nexub/core`: new English messages `chartChange`, `chartNotes`, `chartAnnotation` and `chartReferenceLine`.

**Parity gap:** `@nexub/react-native` has no chart components yet (the native Chart twin is planned for 12.5), so `annotations`, `change` and `referenceLines` are web-only for now.
