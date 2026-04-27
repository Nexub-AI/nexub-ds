import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'kbd',
    title: 'Kbd',
    description: 'Keyboard key display — renders a styled <kbd> element.',
    category: 'Inline Primitives',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: '...props', type: 'React.HTMLAttributes<HTMLElement>', required: false, description: 'All standard kbd HTML attributes are forwarded.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
  <Kbd>⌘</Kbd>
  <Kbd>K</Kbd>
</div>`,
    },
    {
      title: 'Combinations',
      code: `<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
    <Kbd>⌘</Kbd>
    <Kbd>K</Kbd>
  </div>
  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
    <Kbd>Ctrl</Kbd>
    <Kbd>C</Kbd>
  </div>
  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
    <Kbd>⇧</Kbd>
    <Kbd>⌘</Kbd>
    <Kbd>P</Kbd>
  </div>
</div>`,
    },
  ],
};

export default entry;
