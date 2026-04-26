import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'callout',
    title: 'Callout',
    description: 'Highlighted content block for tips, warnings, or notes.',
    category: 'Feedback',
    package: '@nexub/react',
    status: 'stable',
  },
  props: [
    { name: 'tone', type: "'neutral' | 'info' | 'success' | 'warning' | 'danger'", required: false, description: 'Semantic colour tone of the callout.' },
    { name: 'title', type: 'string', required: false, description: 'Bold title rendered at the top of the callout.' },
    { name: 'icon', type: 'ReactNode', required: false, description: 'Custom icon rendered beside the title.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<Callout tone="warning" title="Before you continue">Deleting this record is permanent and cannot be undone.</Callout>`,
    },
    {
      title: 'Info',
      code: `<Callout tone="info">Use token names instead of raw hex values for consistent theming.</Callout>`,
    },
  ],
};

export default entry;
