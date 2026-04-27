import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'card',
    title: 'Card',
    description: 'Surface container for grouping related content. Supports flat, surface, and interactive variants.',
    category: 'Layout',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'variant', type: "'flat' | 'surface' | 'interactive'", default: "'flat'", required: false, description: 'Visual style of the card surface.' },
    { name: 'tone', type: "ToneValue", default: 'undefined', required: false, description: 'Applies a semantic left-border accent.' },
    { name: 'asChild', type: 'boolean', default: 'false', required: false, description: 'Merges props onto the immediate child element.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<Card>
  <Heading as="h3" size="sm">Card title</Heading>
  <Text size="body-sm" tone="muted">Card description goes here.</Text>
</Card>`,
    },
    {
      title: 'Variants',
      code: `<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
  <Card variant="flat"><Text size="body-sm">Flat</Text></Card>
  <Card variant="surface"><Text size="body-sm">Surface (elevated)</Text></Card>
  <Card variant="interactive"><Text size="body-sm">Interactive (hover)</Text></Card>
</div>`,
    },
  ],
};

export default entry;
