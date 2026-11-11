import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'logo',
    title: 'Logo',
    description: 'The Nexub mark and wordmark, with an optional product name.',
    category: 'Inline Primitives',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
    related: ['top-nav', 'sidebar'],
  },
  props: [
    { name: 'variant', type: "'full' | 'icon' | 'mark'", description: '`full` = mark and wordmark; `icon` = the mark only. `mark` is the old name for `icon`.' },
    { name: 'product', type: 'string', description: 'Product name after the wordmark, e.g. "Command Hub". Truncates in a narrow container. Ignored for `icon`.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", description: 'Height: 24, 32 or 40 px.' },
    { name: 'tone', type: "'default' | 'inverse'", description: '`inverse` is always white, for dark backgrounds or imagery in either theme.' },
    { name: 'mark', type: "'color' | 'mono'", description: '`color` = the official mark in brand colours; `mono` = `currentColor`.' },
  ],
  examples: [{ title: 'Variants' }, { title: 'With a product name' }],
  a11y: {
    roles: ['img'],
    screenReader: ['Read as "Nexub", or "Nexub Command Hub" with `product`.'],
  },
};

export default entry;
