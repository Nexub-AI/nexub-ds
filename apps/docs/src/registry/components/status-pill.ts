import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'status-pill',
    title: 'Status Pill',
    description: 'Deprecated — use Badge. A pill indicator for status values like active, pending, error.',
    category: 'Labels & Badges',
    package: '@nexub/react',
    status: 'deprecated',
    deprecation: { replacement: 'badge', removeIn: '3.0', migration: '`<Badge variant="soft" leadingIcon={dot}>` covers it.' },
    addedIn: '0.0.1',
  },
  props: [
    { name: 'label', type: 'string', required: true, description: 'Text displayed inside the pill.' },
    { name: 'tone', type: "'neutral' | 'info' | 'success' | 'warning' | 'danger'", default: "'neutral'", required: false, description: 'Semantic colour tone of the pill.' },
    { name: 'dot', type: 'boolean', default: 'false', required: false, description: 'Renders a small status dot before the label. Pulses automatically for success and info tones.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'With dot',
    },
  ],
};

export default entry;
