import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'switch',
    title: 'Switch',
    description: 'Toggle control for binary on/off settings. Built on Radix UI Switch.',
    category: 'Form Controls',
    package: '@nexub/react',
    status: 'stable',
  },
  props: [
    { name: 'checked', type: 'boolean', required: false, description: 'Controlled checked state.' },
    { name: 'defaultChecked', type: 'boolean', default: 'false', required: false, description: 'Uncontrolled initial state.' },
    { name: 'onCheckedChange', type: '(checked: boolean) => void', required: false, description: 'Callback when checked state changes.' },
    { name: 'disabled', type: 'boolean', default: 'false', required: false, description: 'Disables interaction.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", required: false, description: 'Switch size.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
  <Switch id="airplane" />
  <Label htmlFor="airplane">Airplane mode</Label>
</div>`,
    },
    {
      title: 'Sizes',
      code: `<div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
  <Switch size="sm" />
  <Switch size="md" />
  <Switch size="lg" />
</div>`,
    },
  ],
};

export default entry;
