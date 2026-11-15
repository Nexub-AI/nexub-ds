import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'form',
    title: 'Form',
    description: 'Validates on submit with the browser’s own checks plus yours, shows each message on its FormField and focuses the first invalid field.',
    category: 'Form & Input',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '6.1.0',
    related: ['form-field', 'fieldset'],
  },
  props: [
    { name: 'onSubmit', type: '(data: FormData, event) => void | Promise', required: false, description: 'Runs only when every field is valid. Return a promise to mark the form busy (`aria-busy`, `useForm().submitting`) until it settles.' },
    { name: 'validate', type: '(data: FormData) => Record<string, string | false | null | undefined>', required: false, description: 'Checks the browser can’t do (cross-field rules, a zod schema, a server answer). Keys are field names; empty values mean valid.' },
    { name: 'onInvalidSubmit', type: '(errors: FormErrorItem[]) => void', required: false, description: 'Errors in field order after a failed submit, ready for ErrorSummary.' },
    { name: 'useForm()', type: '{ errors, submitting } | null', required: false, description: 'Reads the closest Form’s state, for a submit button or a custom field.' },
  ],
  examples: [{ title: 'Native validation plus a custom rule' }],
  a11y: {
    keyboard: [{ key: 'Enter', description: 'Submits from any text field; the first invalid field takes focus.' }],
    notes: [
      'Messages come from the browser’s constraint validation (`required`, `type="email"`, `pattern`, `min`…), so they are already in the reader’s language.',
      'FormField.Root with the same `name` picks the message up: the control gets `aria-invalid` and `aria-describedby`, and FormField.Error shows the text.',
      'A field’s error clears as soon as it is edited; the rest stay until the next submit.',
      'For long forms, render ErrorSummary (@nexub/patterns) from `onInvalidSubmit`.',
    ],
  },
};

export default entry;
