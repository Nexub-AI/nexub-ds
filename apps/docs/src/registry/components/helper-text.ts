import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'helper-text',
    title: 'Helper Text',
    description: 'Small supporting text placed beneath a form field to provide hints or validation feedback.',
    category: 'Form & Input',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'tone', type: "'neutral' | 'info' | 'success' | 'warning' | 'danger'", default: "'neutral'", required: false, description: 'Semantic colour tone of the helper text.' },
    { name: 'disabled', type: 'boolean', required: false, description: 'Applies muted disabled styling.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<HelperText>We will never share your email with anyone else.</HelperText>`,
    },
    {
      title: 'Tones',
      code: `<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
  <HelperText tone="info">Your password must be at least 8 characters.</HelperText>
  <HelperText tone="success">Username is available.</HelperText>
  <HelperText tone="warning">This action may affect other records.</HelperText>
  <HelperText tone="danger">This field is required.</HelperText>
</div>`,
    },
  ],
};

export default entry;
