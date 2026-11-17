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
    updatedIn: '10.3.0',
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
  ],
};

export default entry;
