import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'progress',
    title: 'Progress',
    description: 'Horizontal progress bar with optional tone and animation.',
    category: 'Loading States',
    package: '@nexub/react',
    status: 'stable',
  },
  props: [
    { name: 'value', type: 'number', required: false, description: 'Current progress value between 0 and max.' },
    { name: 'max', type: 'number', default: '100', required: false, description: 'Maximum value of the progress bar.' },
    { name: 'tone', type: "'neutral' | 'info' | 'success' | 'warning' | 'danger'", required: false, description: 'Semantic colour tone of the filled track.' },
    { name: 'animated', type: 'boolean', default: 'false', required: false, description: 'Adds a stripes-in-motion animation to the filled track.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<Progress value={65} />`,
    },
    {
      title: 'Tones',
      code: `<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
  <Progress value={80} tone="info" />
  <Progress value={60} tone="success" />
  <Progress value={45} tone="warning" />
  <Progress value={30} tone="danger" />
</div>`,
    },
    {
      title: 'Animated',
      code: `<Progress value={40} animated tone="info" />`,
    },
  ],
};

export default entry;
