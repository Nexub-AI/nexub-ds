import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'eyebrow-chip',
    title: 'Eyebrow Chip',
    description: 'A compact eyebrow label, typically used above headings.',
    category: 'Labels & Badges',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'size', type: "'sm' | 'md'", required: false, description: 'Controls chip size.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<EyebrowChip>New release</EyebrowChip>`,
    },
    {
      title: 'Usage',
      code: `<div>
  <EyebrowChip>Now available</EyebrowChip>
  <h2 style={{ marginTop: '8px', fontSize: '1.5rem', fontWeight: 700 }}>Version 2.0</h2>
</div>`,
    },
  ],
};

export default entry;
