import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'form-error',
    title: 'Form Error',
    description: 'An error message with an alert icon, announced when it appears.',
    category: 'Form & Input',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
    related: ['form-field', 'helper-text'],
  },
  props: [
    { name: 'children', type: 'ReactNode', required: false, description: 'The message: say what went wrong and how to fix it.' },
    { name: 'id', type: 'string', required: false, description: 'Point the control at it with `aria-describedby` so the message is read with the field.' },
  ],
  examples: [{ title: 'Under a field' }],
  usage: {
    whenToUse: ['A validation message under a field you lay out yourself'],
    whenNotToUse: ['Inside `FormField.Root`: use `FormField.Error`, which wires the ids for you', 'Errors for a whole form: use the Error Summary pattern'],
  },
  a11y: {
    roles: ['alert'],
    screenReader: ['Has `role="alert"`, so it is announced when rendered. Render it only when there is an error.'],
  },
};

export default entry;
