import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'otp-input',
    title: 'OTP Input',
    description: 'One box per digit for verification codes, with paste and one-time-code autofill.',
    category: 'Form Controls',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '5.6.0',
    related: ['input', 'password-input'],
  },
  props: [
    { name: 'length', type: 'number', default: '6', required: false, description: 'Number of boxes.' },
    { name: 'value / defaultValue / onValueChange', type: 'string', required: false, description: 'The code so far, without gaps.' },
    { name: 'onComplete', type: '(code: string) => void', required: false, description: 'Called when every box is filled; submit or verify here.' },
    { name: 'mode', type: "'numeric' | 'alphanumeric'", default: "'numeric'", required: false, description: 'Numeric shows the number keypad on phones.' },
    { name: 'invalid / disabled', type: 'boolean', required: false, description: 'Error styling (pair with a FormError) and the disabled state.' },
    { name: 'name', type: 'string', required: false, description: 'Submits the code with a form.' },
    { name: 'aria-label', type: 'string', default: "'Verification code'", required: false, description: 'Group name; each box reads "Digit N of M".' },
  ],
  examples: [{ title: 'Verification code' }],
  a11y: {
    keyboard: [
      { key: 'Type', description: 'Fills the box and moves to the next.' },
      { key: 'Backspace', description: 'Clears the box, or the previous one when empty.' },
      { key: 'ArrowLeft / ArrowRight', description: 'Moves between boxes.' },
    ],
    notes: ['The first box has `autocomplete="one-time-code"`, so the code from an SMS fills every box.'],
  },
};

export default entry;
