import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'badge',
    title: 'Badge',
    description: 'Small status indicator or label. Communicates state, category, or count.',
    category: 'Labels & Badges',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'variant', type: "'solid' | 'soft' | 'outline'", default: "'solid'", required: false, description: 'Visual fill style.' },
    { name: 'tone', type: "'success' | 'danger' | 'warning' | 'info' | 'neutral'", default: "'neutral'", required: false, description: 'Semantic color tone.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", required: false, description: 'Badge size.' },
    { name: 'leadingIcon', type: 'React.ReactNode', required: false, description: 'Icon or dot rendered before the label.' },
  ],
  examples: [
    {
      title: 'Tones',
      code: `<div style={{ display: 'flex', gap: '8px' }}>
  <Badge tone="success">Active</Badge>
  <Badge tone="danger">Error</Badge>
  <Badge tone="warning">Warning</Badge>
  <Badge tone="info">Info</Badge>
  <Badge tone="neutral">Draft</Badge>
</div>`,
    },
    {
      title: 'Variants',
      code: `<div style={{ display: 'flex', gap: '8px' }}>
  <Badge variant="solid" tone="success">Solid</Badge>
  <Badge variant="soft" tone="info">Soft</Badge>
  <Badge variant="outline" tone="warning">Outline</Badge>
</div>`,
    },
    {
      title: 'With leading dot',
      code: `<div style={{ display: 'flex', gap: '8px' }}>
  <Badge tone="success" leadingIcon={<span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />}>Online</Badge>
  <Badge tone="danger" leadingIcon={<span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />}>Offline</Badge>
</div>`,
    },
  ],
};

export default entry;
