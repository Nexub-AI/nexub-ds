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
    { name: 'visible', type: 'boolean', required: false, description: 'Shows the password as text. Controlled when set; pair with onVisibleChange.' },
    { name: 'defaultVisible', type: 'boolean', required: false, description: 'Initial visibility when uncontrolled. Defaults to false.' },
    { name: 'onVisibleChange', type: '(visible: boolean) => void', required: false, description: 'Called when the reveal toggle is pressed.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'Invalid',
    },
  ],
};

export default entry;
