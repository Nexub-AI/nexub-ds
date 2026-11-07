import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'inline-edit',
    title: 'Inline Edit',
    description: 'Text that becomes an input on click, for renaming things in place.',
    category: 'Form & Input',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '6.1.0',
    related: ['input', 'form'],
  },
  props: [
    { name: 'value', type: 'string', required: true, description: 'The saved text.' },
    { name: 'onSave', type: '(value: string) => void | Promise', required: true, description: 'Called on Enter or blur when the text changed. A promise keeps the field open and busy; a rejection keeps it open and invalid.' },
    { name: 'label', type: 'string', required: true, description: 'Names the input, and the button reads "Edit ‹label›, ‹value›".' },
    { name: 'placeholder', type: 'string', required: false, description: 'Shown when the value is empty.' },
    { name: 'disabled', type: 'boolean', required: false, description: 'Shows the text without editing.' },
  ],
  examples: [{ title: 'Rename' }],
  a11y: {
    keyboard: [
      { key: 'Enter / Space', description: 'On the text: starts editing.' },
      { key: 'Enter', description: 'In the input: saves.' },
      { key: 'Escape', description: 'Reverts and returns focus to the text.' },
    ],
    notes: ['Moving focus away saves too. Validate in `onSave` and reject to keep the field open.'],
  },
};

export default entry;
