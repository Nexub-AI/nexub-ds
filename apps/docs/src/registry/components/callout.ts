import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'callout',
    title: 'Callout',
    description: 'Deprecated — use Alert. Highlighted content block for tips, warnings, or notes.',
    category: 'Feedback',
    package: '@nexub/react',
    status: 'deprecated',
    deprecation: { replacement: 'alert', removeIn: '3.0', migration: '`<Alert>` covers tone and icon.' },
    addedIn: '0.0.1',
  },
  props: [
    { name: 'tone', type: "'neutral' | 'info' | 'success' | 'warning' | 'danger'", required: false, description: 'Semantic colour tone of the callout.' },
    { name: 'title', type: 'string', required: false, description: 'Bold title rendered at the top of the callout.' },
    { name: 'icon', type: 'ReactNode', required: false, description: 'Custom icon rendered beside the title.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'Info',
    },
  ],
};

export default entry;
