import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'checkbox',
    title: 'Checkbox',
    description: 'Binary checkbox input built on Radix UI.',
    category: 'Form Controls',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'checked', type: 'boolean', required: false, description: 'The controlled checked state.' },
    { name: 'defaultChecked', type: 'boolean', required: false, description: 'The initial checked state when uncontrolled.' },
    { name: 'disabled', type: 'boolean', required: false, description: 'Disables the checkbox when true.' },
    { name: 'required', type: 'boolean', required: false, description: 'Marks the checkbox as required in a form.' },
    { name: 'onCheckedChange', type: '(checked: boolean) => void', required: false, description: 'Callback fired when the checked state changes.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<Checkbox defaultChecked />`,
    },
    {
      title: 'With label',
      code: `<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
  <Checkbox id="terms" />
  <Label htmlFor="terms">I agree to the terms</Label>
</div>`,
    },
    {
      title: 'States',
      code: `<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <Checkbox id="checked" defaultChecked />
    <Label htmlFor="checked">Checked</Label>
  </div>
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <Checkbox id="unchecked" />
    <Label htmlFor="unchecked">Unchecked</Label>
  </div>
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <Checkbox id="disabled" disabled />
    <Label htmlFor="disabled">Disabled</Label>
  </div>
</div>`,
    },
  ],
};

export default entry;
