import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'number-input',
    title: 'NumberInput',
    description: 'A numeric input with increment and decrement controls, supporting min/max clamping and step.',
    category: 'Form & Input',
    package: '@nexub/react',
    status: 'stable',
  },
  props: [
    { name: 'value', type: 'number', required: false, description: 'Controlled value of the input.' },
    { name: 'min', type: 'number', required: false, description: 'Minimum allowed value.' },
    { name: 'max', type: 'number', required: false, description: 'Maximum allowed value.' },
    { name: 'step', type: 'number', default: '1', required: false, description: 'Amount to increment or decrement on each step.' },
    { name: 'disabled', type: 'boolean', required: false, description: 'Disables the input and its controls.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", required: false, description: 'Controls font size and padding.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<NumberInput defaultValue={0} />`,
    },
    {
      title: 'With range',
      code: `<NumberInput defaultValue={5} min={0} max={10} />`,
    },
  ],
};

export default entry;
