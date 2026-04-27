import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'radio-group',
    title: 'Radio Group',
    description: 'Group of mutually exclusive radio inputs.',
    category: 'Form Controls',
    package: '@nexub/react',
    status: 'stable',
  },
  props: [
    { name: 'RadioGroup.Root', type: 'compound', required: false, description: 'Root provider that manages selection state.' },
    { name: 'RadioGroup.Item', type: 'compound', required: false, description: 'Individual radio option within the group.' },
    { name: 'value', type: 'string', required: false, description: 'The controlled selected value.' },
    { name: 'defaultValue', type: 'string', required: false, description: 'The initial selected value when uncontrolled.' },
    { name: 'onValueChange', type: '(value: string) => void', required: false, description: 'Callback fired when the selection changes.' },
    { name: 'disabled', type: 'boolean', required: false, description: 'Disables all items in the group.' },
    { name: 'orientation', type: "'horizontal' | 'vertical'", required: false, description: 'Layout orientation of the radio items.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<RadioGroup.Root defaultValue="option-2">
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <RadioGroup.Item value="option-1" id="r1" />
      <Label htmlFor="r1">Option one</Label>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <RadioGroup.Item value="option-2" id="r2" />
      <Label htmlFor="r2">Option two</Label>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <RadioGroup.Item value="option-3" id="r3" />
      <Label htmlFor="r3">Option three</Label>
    </div>
  </div>
</RadioGroup.Root>`,
    },
    {
      title: 'Horizontal',
      code: `<RadioGroup.Root defaultValue="monthly" orientation="horizontal">
  <div style={{ display: 'flex', gap: '16px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <RadioGroup.Item value="monthly" id="monthly" />
      <Label htmlFor="monthly">Monthly</Label>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <RadioGroup.Item value="annual" id="annual" />
      <Label htmlFor="annual">Annual</Label>
    </div>
  </div>
</RadioGroup.Root>`,
    },
  ],
};

export default entry;
