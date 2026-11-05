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
    { name: 'tone', type: 'ToneValue', default: "'neutral'", required: false, description: 'Text colour.' },
    { name: 'variant', type: "'soft' | 'gradient'", default: "'soft'", required: false, description: '`gradient`: the marketing-mode chip; looks like `soft` outside `data-mode="marketing"`.' },
    { name: 'live', type: 'boolean', default: 'false', required: false, description: 'A decorative "live" dot before the label; it pings in marketing mode and stays still under reduced motion.' },
    { name: 'leadingIcon', type: 'React.ReactNode', required: false, description: 'Icon before the label.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'Usage',
    },
    {
      title: 'Gradient and live (marketing mode)',
      description: 'Inside `data-mode="marketing"`.',
    },
  ],
};

export default entry;
