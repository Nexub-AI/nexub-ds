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
  },
  props: [
    { name: 'label', type: 'string', required: true, description: 'Metric name label.' },
    { name: 'value', type: 'React.ReactNode', required: true, description: 'Primary metric value.' },
    { name: 'delta', type: 'string', required: false, description: 'Change value (e.g. "+12.5%").' },
    { name: 'deltaType', type: "'increase' | 'decrease' | 'neutral'", required: false, description: 'Semantic direction of the delta.' },
    { name: 'icon', type: 'React.ReactNode', required: false, description: 'Icon displayed in the card header.' },
    { name: 'description', type: 'string', required: false, description: 'Additional context below the value.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<StatCard
  label="Total Revenue"
  value="$48,295"
  delta="+12.5%"
  deltaType="increase"
  description="vs last month"
/>`,
    },
    {
      title: 'With icon',
      code: `<StatCard
  label="Active Users"
  value="2,841"
  delta="-3.2%"
  deltaType="decrease"
  icon={<Users size={20} />}
/>`,
    },
  ],
};

export default entry;
