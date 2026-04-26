import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'status-pill',
    title: 'StatusPill',
    description: 'A pill indicator for status values like active, pending, error.',
    category: 'Labels & Badges',
    package: '@nexub/react',
    status: 'stable',
  },
  props: [
    { name: 'label', type: 'string', required: true, description: 'Text displayed inside the pill.' },
    { name: 'tone', type: "'neutral' | 'info' | 'success' | 'warning' | 'danger'", default: "'neutral'", required: false, description: 'Semantic colour tone of the pill.' },
    { name: 'dot', type: 'boolean', default: 'false', required: false, description: 'Renders a small status dot before the label. Pulses automatically for success and info tones.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<div style={{ display: 'flex', gap: '8px' }}>
  <StatusPill tone="success" label="Active" />
  <StatusPill tone="warning" label="Pending" />
  <StatusPill tone="danger" label="Error" />
  <StatusPill tone="neutral" label="Draft" />
  <StatusPill tone="info" label="Syncing" />
</div>`,
    },
    {
      title: 'With dot',
      code: `<div style={{ display: 'flex', gap: '8px' }}>
  <StatusPill tone="success" dot label="Live" />
  <StatusPill tone="info" dot label="Syncing" />
  <StatusPill tone="warning" dot label="Degraded" />
</div>`,
    },
  ],
};

export default entry;
