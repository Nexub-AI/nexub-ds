import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'icon-button',
    title: 'Icon Button',
    description: 'A square button designed to hold a single icon, with an accessible label.',
    category: 'Actions',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'variant', type: "'ghost' | 'solid' | 'outline' | 'subtle'", default: "'ghost'", required: false, description: 'Visual style of the icon button.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", required: false, description: 'Controls button dimensions.' },
    { name: 'disabled', type: 'boolean', required: false, description: 'Disables the button.' },
    { name: 'loading', type: 'boolean', required: false, description: 'Shows a spinner and disables interaction.' },
    { name: 'asChild', type: 'boolean', required: false, description: 'Merges props onto the immediate child element (Radix Slot).' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<IconButton variant="ghost" aria-label="Settings">
  <div style={{ width: 16, height: 16, background: 'currentColor', borderRadius: 2 }} />
</IconButton>`,
    },
    {
      title: 'Variants',
      code: `<div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
  <IconButton variant="ghost" aria-label="Ghost action">
    <div style={{ width: 16, height: 16, background: 'currentColor', borderRadius: 2 }} />
  </IconButton>
  <IconButton variant="solid" aria-label="Solid action">
    <div style={{ width: 16, height: 16, background: 'currentColor', borderRadius: 2 }} />
  </IconButton>
  <IconButton variant="outline" aria-label="Outline action">
    <div style={{ width: 16, height: 16, background: 'currentColor', borderRadius: 2 }} />
  </IconButton>
  <IconButton variant="subtle" aria-label="Subtle action">
    <div style={{ width: 16, height: 16, background: 'currentColor', borderRadius: 2 }} />
  </IconButton>
</div>`,
    },
  ],
};

export default entry;
