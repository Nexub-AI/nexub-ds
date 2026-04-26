import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'toggle',
    title: 'Toggle',
    description: 'Pressable toggle button built on Radix UI Toggle.',
    category: 'Interactive',
    package: '@nexub/react',
    status: 'stable',
  },
  props: [
    { name: 'pressed', type: 'boolean', required: false, description: 'The controlled pressed state.' },
    { name: 'defaultPressed', type: 'boolean', required: false, description: 'The initial pressed state when uncontrolled.' },
    { name: 'variant', type: "'default' | 'outline'", required: false, description: 'Visual style of the toggle button.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", required: false, description: 'Size of the toggle button.' },
    { name: 'disabled', type: 'boolean', required: false, description: 'Disables the toggle when true.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<Toggle>Bold</Toggle>`,
    },
    {
      title: 'Outline variants',
      code: `<div style={{ display: 'flex', gap: '8px' }}>
  <Toggle variant="outline">Unpressed</Toggle>
  <Toggle variant="outline" defaultPressed>Pressed</Toggle>
</div>`,
    },
  ],
};

export default entry;
