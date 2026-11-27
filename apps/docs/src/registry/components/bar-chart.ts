import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'bar-chart',
    title: 'Bar Chart',
    description: 'Compare values across categories, grouped or stacked. Server-rendered SVG on the chart palette.',
    category: 'Data Display',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '3.2.0',
    related: ['line-chart', 'donut-chart', 'sparkline'],
  },
  props: [
    { name: 'title', type: 'string', required: true, description: 'Accessible name of the chart and caption of its data table.' },
    { name: 'data', type: 'T[]', required: true, description: 'One row per category, in order.' },
    { name: 'index', type: 'keyof T', required: true, description: 'Key of the category label in each row (the x axis).' },
    { name: 'series', type: 'ChartSeries[]', required: true, description: '`{ key, label?, color? }` per series. `color` is 1–8 from the categorical chart palette; defaults to the series position.' },
    { name: 'valueFormat', type: '(value: number) => string', required: false, description: 'Formats axis labels, hover text and the data table.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", required: false, description: 'Plot height: 8, 12 or 16rem.' },
    { name: 'legend', type: 'boolean', required: false, description: 'Show the legend. Defaults to on for more than one series.' },
    { name: 'stacked', type: 'boolean', default: 'false', required: false, description: 'One bar per category with the series stacked.' },
    { name: 'series[].color', type: "1–8 | 'good' | 'warning' | 'danger' | 'neutral'", description: '11.3: a palette colour or a semantic tone.' },
    { name: 'series[].valueFormat', type: '(value: number) => string', description: '11.3: formats this series in the tooltip and table (one currency per series).' },
    { name: 'integerTicks', type: 'boolean', description: '11.3: gridlines on whole numbers only (counts). Also 11.3: a `null` or missing value is drawn as a gap (no bar, a break in the line) and listed as "—", not counted as 0.' },
    { name: 'tableView', type: 'boolean | string', description: '11.3: a visible "Show as table" disclosure with the same data. Works without JS.' },
    { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: '11.3: categories down the side for long names and ranked lists.' },
    { name: 'variant / totalKey', type: "'default' | 'waterfall' / keyof T", description: '11.3: a waterfall of the first series from a running total; `totalKey` marks rows drawn from zero.' },
    { name: 'colorOf', type: '(row, series, index) => colour | tone | undefined', description: '11.3: a colour per bar (e.g. over budget in danger).' },
    { name: 'annotations', type: 'ChartAnnotation[]', description: "12.3: labelled notes on the plot. `{ at, label }` marks one category with a dashed guide (add `series` to dot that series' value); `{ at, to, label }` shades a range. Notes on categories not in `data` are skipped. These three props apply to vertical bars." },
    { name: 'referenceLines', type: 'ChartReferenceLine[]', description: "12.3: labelled straight lines. `{ value: 5000, label: 'Target' }` is horizontal and widens the axis to stay in view; `{ value: 'Mar', axis: 'category', label }` is vertical. `tone` (`good`, `warning`, `danger`, default `neutral`) colours the line only; labels stay neutral text." },
    { name: 'change', type: 'ChartChange', description: "12.3: a callout above the plot, e.g. \"Up 12% (+$1,200) since March\": `{ from, to?, series?, invert?, locale?, label?, text? }`. The amount uses the series' `valueFormat`, then the chart's; the percentage uses `Intl` in `locale`. Rises are success, falls error (`invert` for costs and churn), no change is neutral. `text` replaces the sentence (translation)." },
  ],
  examples: [
    { title: 'Grouped' },
    { title: 'Stacked' },
    { title: 'Interactive', description: 'A crosshair and tooltip, keyboard point navigation, a toggle legend and `onPointClick`.' },
    { title: 'Waterfall', description: 'Rises in the good tone, falls in danger, totals from zero.' },
    { title: 'Horizontal and per-bar tones' },
    { title: 'Change and reference lines', description: 'A fall shown as good with `invert`, an average line and a vertical marker (12.3).' },
  ],
  a11y: {
    screenReader: [
      'The chart is a `figure` named by `title`. The drawing is hidden from assistive tech; a visually hidden table carries every value.',
      'Colour is never the only cue: the legend and table name each series. Past six series, label directly or group the rest as "Other".',
      '12.3: the change callout is visible text and describes the figure (`aria-describedby`). Annotations and reference lines are drawn and also listed in a visually hidden "Chart notes" list that describes the figure too.',
      '12.3: the product accent stays out of charts, notes included: guides and labels use the outline and on-surface tokens, and only the change callout and a reference line `tone` take success or error, where the colour means good or bad.',
    ],
  },
};

export default entry;
