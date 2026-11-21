import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'stat-card',
    title: 'StatCard',
    description: 'Metric display card showing a KPI value, label, optional delta, and icon.',
    category: 'Data',
    package: '@nexub/patterns',
    status: 'stable',
    addedIn: '0.0.1',
    updatedIn: '11.3.0',
  },
  props: [
    { name: 'label', type: 'string', required: true, description: 'Metric name label.' },
    { name: 'value', type: 'React.ReactNode', required: true, description: 'Primary metric value.' },
    { name: 'delta', type: 'string', required: false, description: 'Change value (e.g. "+12.5%").' },
    { name: 'deltaType', type: "'increase' | 'decrease' | 'neutral'", required: false, description: 'Semantic direction of the delta.' },
    { name: 'sentiment', type: "'positive' | 'negative' | 'neutral'", required: false, description: 'Colour of the delta, independent of the arrow. Defaults from `deltaType`; use it when a decrease is good news (e.g. churn down).' },
    { name: 'icon', type: 'React.ReactNode', required: false, description: 'Icon displayed in the card header.' },
    { name: 'category', type: "'accent' | 'blue' | 'amber' | 'emerald' | 'pink' | 'violet' | 'cyan' | 'red' | 'lime'", required: false, description: 'Puts the icon on a tinted chip of this colour and colours the trend line to match.' },
    { name: 'trend', type: 'number[]', required: false, description: 'Recent values, drawn as a small trend line beside the delta.' },
    { name: 'trendLabel', type: 'string', required: false, description: 'Accessible summary of the trend. Without it the line is decorative.' },
    { name: 'description', type: 'string', required: false, description: 'Additional context below the value.' },
    { name: 'animate', type: 'boolean', default: 'false', required: false, description: 'Roll the digits when a number or string `value` changes (NumberTicker), announced politely. The first render never animates.' },
    { name: 'size', type: "'md' | 'sm'", default: "'md'", required: false, description: 'Since 11.3. `sm` is the compact tile: less padding and a smaller value.' },
    { name: 'note', type: 'ReactNode', required: false, description: 'Since 11.3. An extra line inside the tile, under the change.' },
    { name: 'tone', type: "'default' | 'bad-when-high'", default: "'default'", required: false, description: 'Since 11.3. `bad-when-high` inverts the derived colour, so an increase shows the danger tone (costs, churn, errors). `sentiment` still wins.' },
    { name: 'change', type: 'number', required: false, description: 'Since 11.3. The change as a number: sets the arrow from its sign and the text from `changeFormat`. Ignored when `delta` is set.' },
    { name: 'changeFormat', type: "'percent' | 'absolute' | ((change: number) => string)", default: "'percent'", required: false, description: 'Since 11.3. `percent` takes a fraction (0.125 → +12.5%); `absolute` signs the number (−12).' },
    { name: 'changeLabel', type: 'ReactNode', required: false, description: 'Since 11.3. Text after the change, e.g. "vs last month".' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'With icon',
    },
    {
      title: 'Animated',
    },
    {
      title: 'Category and trend',
    },
    {
      title: 'Compact, absolute change and bad-when-high',
    },
  ],
};

export default entry;
