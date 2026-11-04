import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'radio-group',
    title: 'Radio Group',
    description: 'Group of mutually exclusive radio inputs.',
    category: 'Form Controls',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
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
    },
    {
      title: 'Horizontal',
    },
  ],
};

export default entry;
