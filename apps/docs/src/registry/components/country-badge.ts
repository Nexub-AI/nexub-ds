import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'country-badge',
    title: 'Country Badge',
    description: 'A pill with a country flag and its name or code.',
    category: 'Labels & Badges',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
    related: ['flag', 'badge'],
  },
  props: [
    { name: 'code', type: 'string', description: 'ISO 3166-1 alpha-2 country code, e.g. `SG`.' },
    { name: 'label', type: 'string', description: 'Text after the flag. Defaults to `code`.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", description: 'Size of the pill and flag.' },
  ],
  examples: [{ title: 'Default' }, { title: 'Sizes' }],
};

export default entry;
