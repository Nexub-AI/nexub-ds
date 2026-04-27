import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'password-input',
    title: 'Password Input',
    description: 'A password field with a built-in toggle to reveal or hide the entered value.',
    category: 'Form & Input',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'placeholder', type: 'string', required: false, description: 'Placeholder text shown when the field is empty.' },
    { name: 'invalid', type: 'boolean', required: false, description: 'Applies error styling to indicate a validation failure.' },
    { name: 'disabled', type: 'boolean', required: false, description: 'Disables the input.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", required: false, description: 'Controls font size and padding.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<PasswordInput placeholder="Enter password…" />`,
    },
    {
      title: 'Invalid',
      code: `<PasswordInput invalid placeholder="Password is too short" />`,
    },
  ],
};

export default entry;
