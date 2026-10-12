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
    related: ['callout', 'banner', 'alert'],
  },
  props: [
    { name: 'variant', type: "'flat' | 'surface' | 'interactive'", default: "'flat'", required: false, description: 'Visual style of the card surface.' },
    { name: 'tone', type: "ToneValue", default: 'undefined', required: false, description: 'Applies a semantic left-border accent.' },
    { name: 'asChild', type: 'boolean', default: 'false', required: false, description: 'Merges props onto the immediate child element.' },
    { name: 'surface', type: "'solid' | 'glass'", default: "'solid'", required: false, description: 'Liquid-glass material treatment — see Foundations → Materials.' },
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
  playground: {
    controls: [
      { kind: 'select', name: 'variant', options: ['flat', 'surface', 'interactive'], default: 'surface' },
      { kind: 'text', name: 'title', default: 'Card title', placeholder: 'Title', omitFromCode: true },
      { kind: 'text', name: 'body', default: 'Cards group related content on a raised surface.', placeholder: 'Body', omitFromCode: true },
    ],
  },
  a11y: {
    roles: ['region (when used as a landmark)'],
    keyboard: [
      { key: 'Tab', description: 'Focuses interactive children. Card itself is not focusable unless `variant="interactive"` wraps a `<Link>` or `<button>`.' },
    ],
    focus: [
      'Use `<Card asChild>` with a `<Link>` or `<button>` inside to make the whole surface clickable while preserving correct focus semantics.',
    ],
    screenReader: [
      'Group related content with a heading inside the Card so AT users can navigate by heading level.',
    ],
  },
};

export default entry;
