import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'heading',
    title: 'Heading',
    description: 'Semantic heading component with size, weight, and tone control.',
    category: 'Typography',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'level', type: '1 | 2 | 3 | 4 | 5 | 6', default: '2', required: false, description: 'The semantic HTML heading level rendered.' },
    { name: 'size', type: "'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'", required: false, description: 'Visual size of the heading, independent of the semantic level.' },
    { name: 'tone', type: "'default' | 'muted' | 'info' | 'success' | 'warning' | 'danger'", required: false, description: 'Color tone applied to the heading text.' },
    { name: 'weight', type: "'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold'", required: false, description: 'Font weight of the heading.' },
    { name: 'asChild', type: 'boolean', required: false, description: 'Merges props onto the immediate child element (Radix Slot).' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<Heading>The quick brown fox</Heading>`,
    },
    {
      title: 'Scale',
      code: `<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
  <Heading size="h1">Heading H1</Heading>
  <Heading size="h2">Heading H2</Heading>
  <Heading size="h3">Heading H3</Heading>
  <Heading size="h4">Heading H4</Heading>
  <Heading size="h5">Heading H5</Heading>
</div>`,
    },
    {
      title: 'Tones',
      code: `<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
  <Heading tone="info">Info heading</Heading>
  <Heading tone="success">Success heading</Heading>
  <Heading tone="warning">Warning heading</Heading>
  <Heading tone="danger">Danger heading</Heading>
</div>`,
    },
  ],
};

export default entry;
