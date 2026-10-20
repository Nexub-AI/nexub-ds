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
    updatedIn: '1.6.0',
    related: ['media-card', 'radio-card', 'callout'],
  },
  props: [
    { name: 'variant', type: "'flat' | 'surface' | 'interactive'", default: "'flat'", required: false, description: '`interactive` lifts 2px on hover (spatial spring, elevation 1 → 2), sinks to 0.99 on press and adds a state layer. Use it for cards that are links or buttons.' },
    { name: 'effect', type: "'none' | 'sheen'", default: "'none'", required: false, description: 'Opt-in. `sheen` is a soft light that follows the pointer, with a brighter rim near the edge. Off for touch, reduced motion and reduced transparency.' },
    { name: 'tone', type: "ToneValue", default: 'undefined', required: false, description: 'Applies a semantic left-border accent.' },
    { name: 'asChild', type: 'boolean', default: 'false', required: false, description: 'Merges props onto the immediate child element.' },
    { name: 'surface', type: "'solid' | 'glass'", default: "'solid'", required: false, description: 'Liquid-glass material treatment — see Foundations → Materials.' },
    { name: 'CardLink', type: 'AnchorHTMLAttributes & { asChild?: boolean }', required: false, description: 'Put it around the card title to make the whole card one link. Its ::after covers the card and the card shows the focus ring. Give other controls inside the card `relative z-[1]`. Use `asChild` for a router link.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<Card>
  <Heading level={3} size="h5">Card title</Heading>
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
    {
      title: 'Card link',
      description: 'The whole card is one link named by its title. The button sits above the link with `relative z-[1]`.',
      code: `<Card variant="interactive" className="p-4">
  <Heading level={3} size="h5">
    <CardLink href="/projects/atlas">Atlas</CardLink>
  </Heading>
  <Text size="body-sm" tone="muted">Updated 2 hours ago</Text>
  <Button size="sm" variant="text" className="relative z-[1]" onClick={star}>
    Star
  </Button>
</Card>`,
    },
    {
      title: 'Sheen',
      description: 'Move the pointer over the card.',
      code: `<Card variant="surface" effect="sheen" className="p-6">
  <Heading level={3} size="h5">Pro</Heading>
  <Text size="body-sm" tone="muted">Everything in Team, plus audit logs.</Text>
</Card>`,
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
      { key: 'Tab', description: 'Focuses interactive children. The card itself is never focusable; with a CardLink, the link is.' },
    ],
    focus: [
      'With a CardLink inside, the focus ring is drawn on the card, not around the title.',
      'Prefer CardLink over wrapping the whole card in `<a>`: the link’s accessible name stays the title instead of every word on the card.',
    ],
    screenReader: [
      'Group related content with a heading inside the Card so AT users can navigate by heading level.',
    ],
  },
};

export default entry;
