import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'label',
    title: 'Label',
    description: 'An accessible form label that optionally shows a required asterisk and links to an input via htmlFor.',
    category: 'Form & Input',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'htmlFor', type: 'string', required: false, description: 'Associates the label with a form control by its id.' },
    { name: 'required', type: 'boolean', required: false, description: 'Renders a required indicator (asterisk) after the label text.' },
    { name: 'disabled', type: 'boolean', required: false, description: 'Applies disabled styling to the label.' },
    { name: 'size', type: "'sm' | 'md'", default: "'md'", required: false, description: 'Controls label font size.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'Required',
    },
    {
      title: 'With input',
    },
  ],
};

export default entry;
