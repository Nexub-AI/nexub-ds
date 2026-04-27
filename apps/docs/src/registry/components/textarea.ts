import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'textarea',
    title: 'Textarea',
    description: 'A multi-line text input with configurable resize behaviour, size, and validation states.',
    category: 'Form & Input',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'placeholder', type: 'string', required: false, description: 'Placeholder text shown when the field is empty.' },
    { name: 'disabled', type: 'boolean', required: false, description: 'Disables the textarea.' },
    { name: 'invalid', type: 'boolean', required: false, description: 'Applies error styling to indicate a validation failure.' },
    { name: 'rows', type: 'number', required: false, description: 'Initial visible row count.' },
    { name: 'resize', type: "'none' | 'vertical' | 'horizontal' | 'both'", default: "'vertical'", required: false, description: 'Controls resize handle visibility.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", required: false, description: 'Controls font size and padding.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<Textarea placeholder="Enter your message…" />`,
    },
    {
      title: 'Sizes',
      code: `<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
  <Textarea size="sm" placeholder="Small textarea" />
  <Textarea size="md" placeholder="Medium textarea" />
  <Textarea size="lg" placeholder="Large textarea" />
</div>`,
    },
    {
      title: 'Invalid',
      code: `<Textarea invalid placeholder="This field has an error" />`,
    },
  ],
};

export default entry;
