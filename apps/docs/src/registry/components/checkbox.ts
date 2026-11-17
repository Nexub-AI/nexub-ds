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
    },
    {
      title: 'With label',
    },
    {
      title: 'States',
    },
    {
      title: 'Sizes, invalid and read-only',
      description: 'size follows the shared sm / md / lg scale. invalid draws the error border and sets aria-invalid. readOnly stays focusable but cannot change.',
    },
  ],
};

export default entry;
