import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'form-field',
    title: 'Form Field',
    description: 'Wraps Label, Input, HelperText and FormError into a single accessible group.',
    category: 'Form & Input',
    package: '@nexub/react',
    status: 'stable',
  },
  props: [
    { name: 'name', type: 'string', required: true, description: 'Name attribute forwarded to the underlying input.' },
    { name: 'id', type: 'string', required: false, description: 'Explicit id for the input; defaults to the name value.' },
    { name: 'error', type: 'string', required: false, description: 'Validation error message shown below the input.' },
    { name: 'required', type: 'boolean', required: false, description: 'Marks the field as required and renders a required indicator on the label.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '280px' }}>
  <Label htmlFor="field-name" required>Full name</Label>
  <Input id="field-name" placeholder="Jane Smith" />
  <HelperText>Enter your legal name.</HelperText>
</div>`,
    },
  ],
};

export default entry;
