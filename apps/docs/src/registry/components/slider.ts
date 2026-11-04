import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'slider',
    title: 'Slider',
    description: 'Range slider built on Radix UI Slider.',
    category: 'Interactive',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'value', type: 'number[]', required: false, description: 'The controlled value of the slider.' },
    { name: 'defaultValue', type: 'number[]', required: false, description: 'The initial value when uncontrolled.' },
    { name: 'min', type: 'number', required: false, description: 'The minimum value of the slider.' },
    { name: 'max', type: 'number', required: false, description: 'The maximum value of the slider.' },
    { name: 'step', type: 'number', required: false, description: 'The step increment between values.' },
    { name: 'disabled', type: 'boolean', required: false, description: 'Disables slider interaction when true.' },
    { name: 'onValueChange', type: '(value: number[]) => void', required: false, description: 'Callback fired when the value changes.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'Range',
    },
  ],
};

export default entry;
