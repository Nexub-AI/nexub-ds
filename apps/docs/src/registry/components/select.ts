import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'select',
    title: 'Select',
    description: 'Accessible dropdown select built on Radix UI. Supports groups and search.',
    category: 'Form Controls',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'value', type: 'string', required: false, description: 'Controlled selected value.' },
    { name: 'onValueChange', type: '(value: string) => void', required: false, description: 'Callback when value changes.' },
    { name: 'placeholder', type: 'string', required: false, description: 'Placeholder when no value selected.' },
    { name: 'disabled', type: 'boolean', default: 'false', required: false, description: 'Disables the select.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<Select.Root>
  <Select.Trigger placeholder="Pick a fruit" />
  <Select.Content>
    <Select.Item value="apple">Apple</Select.Item>
    <Select.Item value="banana">Banana</Select.Item>
    <Select.Item value="cherry">Cherry</Select.Item>
  </Select.Content>
</Select.Root>`,
    },
  ],
};

export default entry;
