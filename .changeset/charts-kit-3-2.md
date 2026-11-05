---
"@nexub/react": minor
---

Charts kit.

- **`BarChart`** (grouped or `stacked`), **`LineChart`** (optional `area`), **`DonutChart`** (with a `center` slot), **`Sparkline`** and **`ChartLegend`**. Charts take `data` rows, an `index` key for the categories and a `series` list (`{ key, label?, color? }`), and colour each series from the categorical `--color-chart-1…8` palette, so they follow light, dark, high contrast and every product brand.
- **Server components with no dependencies.** The charts are plain SVG with no hooks, so they render in React Server Components and ship no JavaScript (3.5 kB gzip for the whole kit). Geometry is SVG attributes only, so the server HTML is valid under a strict CSP.
- **Accessible by default.** Each chart is a `figure` named by `title`, with a visually hidden data table holding every value. The legend and table name each series, so colour is never the only cue. Axis labels mirror in RTL.
- Import from `@nexub/react` or per component from `@nexub/react/Chart`. Values are 0 or more; hover text is the native SVG title.
