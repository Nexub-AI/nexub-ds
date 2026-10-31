import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'tag',
    title: 'Tag',
    description: 'Deprecated — use Badge. Non-interactive label tag for categorisation.',
    category: 'Labels & Badges',
    package: '@nexub/react',
    status: 'deprecated',
    deprecation: { replacement: 'badge', removeIn: '3.0', migration: '`<Badge size="sm">` covers it.' },
    addedIn: '0.0.1',
  },
  props: [
    { name: 'variant', type: "'solid' | 'soft' | 'outline'", default: "'soft'", required: false, description: 'Visual style of the tag.' },
    { name: 'tone', type: "'neutral' | 'info' | 'success' | 'warning' | 'danger'", required: false, description: 'Semantic colour tone of the tag.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", required: false, description: 'Controls tag size.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<div style={{ display: 'flex', gap: '8px' }}>
  <Tag>Frontend</Tag>
  <Tag tone="info">Backend</Tag>
  <Tag tone="success">Deployed</Tag>
</div>`,
    },
  ],
};

export default entry;
