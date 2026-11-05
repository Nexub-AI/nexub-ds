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
    related: ['media-card', 'radio-card', 'alert'],
  },
  props: [
    { name: 'variant', type: "'flat' | 'surface' | 'interactive' | 'showcase'", default: "'flat'", required: false, description: '`interactive` lifts 2px on hover (spatial spring, elevation 1 → 2), sinks to 0.99 on press and adds a state layer. Use it for cards that are links or buttons. `showcase` is the marketing-mode card (24px corners, soft shadow, hover lift); a flat card outside `data-mode="marketing"`.' },
    { name: 'accent', type: "'leap' | 'bookub' | 'payub' | 'founderub'", required: false, description: 'With `variant="showcase"`: a product-coloured top edge and tint in marketing mode. Sets `data-product` on the card. Only for product-specific content.' },
    { name: 'effect', type: "'none' | 'sheen'", default: "'none'", required: false, description: 'Opt-in. `sheen` is a soft light that follows the pointer, with a brighter rim near the edge. Off for touch, reduced motion and reduced transparency.' },
    { name: 'tone', type: "ToneValue", default: 'undefined', required: false, description: 'Applies a semantic left-border accent.' },
    { name: 'asChild', type: 'boolean', default: 'false', required: false, description: 'Merges props onto the immediate child element.' },
    { name: 'surface', type: "'solid' | 'glass'", default: "'solid'", required: false, description: 'Liquid-glass material treatment — see Foundations → Materials.' },
    { name: 'CardLink', type: 'AnchorHTMLAttributes & { asChild?: boolean }', required: false, description: 'Put it around the card title to make the whole card one link. Its ::after covers the card and the card shows the focus ring. Give other controls inside the card `relative z-[1]`. Use `asChild` for a router link.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'Variants',
    },
    {
      title: 'Card link',
      description: 'The whole card is one link named by its title. The button sits above the link with `relative z-[1]`.',
    },
    {
      title: 'Sheen',
      description: 'Move the pointer over the card.',
    },
    {
      title: 'Showcase (marketing mode)',
      description: 'Product accents on showcase cards, inside `data-mode="marketing"`.',
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
