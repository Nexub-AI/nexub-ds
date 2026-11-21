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
    { name: 'size', type: "'sm' | 'md' | 'lg' | 'title' | 'headline'", default: "'md'", required: false, description: '11.5. Type role of the text and the input: body small, medium, large, title large or headline small. With `as` and no `size`, the text takes the wrapper’s type.' },
    { name: 'as', type: 'ElementType', required: false, description: '11.5. Wraps the text, and the input while editing, in this element: a heading (`"h2"`) or a component such as `Sheet.Title` or `Dialog.Title`, so the heading and the dialog’s name stay in place.' },
    { name: 'maxLength', type: 'number', required: false, description: '11.5. Caps the input and shows a "12/40" counter, announced near the limit.' },
  ],
  examples: [{ title: 'Rename' }, { title: 'Editable page title', description: 'A headline inside an `h2`, capped at 40 characters.' }],
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
