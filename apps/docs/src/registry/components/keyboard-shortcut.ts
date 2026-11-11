import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'keyboard-shortcut',
    title: 'Keyboard Shortcut',
    description: 'A key combination as `Kbd` keys joined by plus signs, read as one label.',
    category: 'Inline Primitives',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
    related: ['kbd', 'command-palette'],
  },
  props: [
    { name: 'keys', type: 'string[]', description: "The keys in order, e.g. `['⌘', 'K']`. Read as \"⌘+K\" (`aria-label`); pass your own `aria-label` for a spoken form like \"Command K\"." },
  ],
  examples: [{ title: 'Default' }, { title: 'In a menu' }],
};

export default entry;
