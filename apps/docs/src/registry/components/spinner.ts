import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'spinner',
    title: 'Spinner',
    description: 'Animated loading indicator. Inherits color from context.',
    category: 'Feedback',
    package: '@nexub/react',
    status: 'stable',
  },
  props: [
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", required: false, description: 'Diameter of the spinner.' },
    { name: 'label', type: 'string', default: "'Loading…'", required: false, description: 'Screen-reader accessible label.' },
  ],
  examples: [
    {
      title: 'Sizes',
      code: `<div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
  <Spinner size="xs" />
  <Spinner size="sm" />
  <Spinner size="md" />
  <Spinner size="lg" />
  <Spinner size="xl" />
</div>`,
    },
    {
      title: 'Inside button',
      code: `<Button loading>Saving…</Button>`,
    },
  ],
};

export default entry;
