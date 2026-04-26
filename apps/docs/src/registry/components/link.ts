import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'link',
    title: 'Link',
    description: 'Styled anchor link with variant and external support.',
    category: 'Inline Primitives',
    package: '@nexub/react',
    status: 'stable',
  },
  props: [
    { name: 'variant', type: "'default' | 'muted' | 'underline'", required: false, description: 'Visual style of the link.' },
    { name: 'external', type: 'boolean', required: false, description: 'Opens the link in a new tab with appropriate rel attributes.' },
    { name: 'href', type: 'string', required: false, description: 'The URL the link points to.' },
    { name: 'asChild', type: 'boolean', required: false, description: 'Merges props onto the immediate child element (Radix Slot).' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<Link href="#">View documentation</Link>`,
    },
    {
      title: 'Variants',
      code: `<div style={{ display: 'flex', gap: '16px' }}>
  <Link href="#" variant="default">Default</Link>
  <Link href="#" variant="muted">Muted</Link>
  <Link href="#" variant="underline">Underline</Link>
</div>`,
    },
    {
      title: 'External',
      code: `<Link href="#" external>Open in new tab</Link>`,
    },
  ],
};

export default entry;
