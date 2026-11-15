import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'flag',
    title: 'Flag',
    description: 'A country flag from its ISO code, drawn with the system emoji font.',
    category: 'Labels & Badges',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
    related: ['country-badge'],
  },
  props: [
    { name: 'code', type: 'string', description: 'ISO 3166-1 alpha-2 country code, e.g. `JP`. Also the accessible name unless you pass `aria-label`.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", description: 'Font size of the flag.' },
    { name: 'aria-label', type: 'string', required: false, description: 'A readable name, e.g. "Japan". Defaults to the code.' },
  ],
  examples: [{ title: 'Default' }],
  a11y: {
    roles: ['img'],
    notes: ['Windows has no flag emoji and shows the two letters instead. Pair the flag with the country name where it matters.'],
  },
};

export default entry;
