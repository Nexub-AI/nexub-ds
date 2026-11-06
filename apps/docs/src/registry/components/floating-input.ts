import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'floating-input',
    title: 'Floating Input',
    description: 'A text field whose label sits inside and floats up on focus or input. CSS only.',
    category: 'Forms',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '4.4.0',
    related: ['input', 'form-field'],
  },
  props: [
    { name: 'label', type: 'string', required: true, description: 'Always visible: inside the empty field, above the value otherwise.' },
    { name: '...input', type: 'InputHTMLAttributes', required: false, description: 'Any input attribute except `placeholder`. Set `aria-invalid` for errors.' },
  ],
  examples: [{ title: 'Sign-in form' }],
  a11y: {
    screenReader: ['A real `<label>` tied to the input, so the name never disappears.'],
  },
};

export default entry;
