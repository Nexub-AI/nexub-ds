import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'checkbox-field',
    title: 'Checkbox Field',
    description: 'A Checkbox with its label, description, aside and error; CheckboxGroupField puts several under one question.',
    category: 'Form Controls',
    package: '@nexub/react',
    status: 'alpha',
    addedIn: '11.1.0',
    related: ['checkbox', 'switch-field', 'checkbox-card', 'fieldset'],
  },
  props: [
    { name: 'label', type: 'ReactNode', required: true, description: 'Names the box; clicking it toggles.' },
    { name: 'description / error', type: 'ReactNode', description: 'Help under the label and the error under the row.' },
    { name: 'aside', type: 'ReactNode', description: 'At the row end: a price, a count.' },
    { name: 'checked', type: "boolean | 'indeterminate'", description: 'As Checkbox; `indeterminate` for a parent of a partly picked list.' },
    { name: 'CheckboxGroupField options', type: '{ value, label, description?, disabled? }[]', description: 'The choices, with `value` / `onValueChange` (string[]), `orientation`, `required`, `name` and one `error` for the group.' },
  ],
  examples: [{ title: 'Field' }, { title: 'Group' }],
  a11y: { notes: ['CheckboxGroupField is a `fieldset` named by its legend; its error describes the group and marks every box invalid.'] },
};

export default entry;
