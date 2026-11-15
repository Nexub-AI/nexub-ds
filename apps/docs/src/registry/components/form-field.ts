import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'form-field',
    title: 'Form Field',
    description: 'Wraps Label, Input, HelperText and FormError into a single accessible group.',
    category: 'Form & Input',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'name', type: 'string', required: true, description: 'Name attribute forwarded to the underlying input.' },
    { name: 'id', type: 'string', required: false, description: 'Explicit id for the input; defaults to the name value.' },
    { name: 'required', type: 'boolean', required: false, description: 'Marks the field as required and renders a required indicator on the label.' },
  ],
  examples: [
    {
      title: 'Default',
    },
  ],
};

export default entry;
