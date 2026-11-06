import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'multi-select',
    title: 'Multi Select',
    description: 'Pick several options as chips, with search, "+N more" and an optional create option.',
    category: 'Form Controls',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '5.2.0',
    related: ['autocomplete', 'chip', 'select'],
  },
  props: [
    { name: 'options', type: '{ value: string; label: string }[]', required: true, description: 'The options to pick from.' },
    { name: 'value / defaultValue', type: 'string[]', required: false, description: 'Selected values, controlled or not.' },
    { name: 'onValueChange', type: '(value: string[]) => void', required: false, description: 'Called with the new selection.' },
    { name: 'maxVisibleChips', type: 'number', default: '3', required: false, description: 'Chips shown before the rest collapse into "+N more".' },
    { name: 'onInputChange', type: '(text: string) => void', required: false, description: 'Called as the user types. When set, options are shown as given, so you can fetch them.' },
    { name: 'onCreate', type: '(text: string) => void', required: false, description: 'Adds a "Create “text”" option when the text matches no option.' },
    { name: 'loading', type: 'boolean', required: false, description: 'Skeleton rows instead of options; "Loading" is announced.' },
    { name: 'aria-label / aria-labelledby', type: 'string', required: false, description: 'Name the field: there is no visible label inside it.' },
  ],
  examples: [{ title: 'Labels with create' }],
  a11y: {
    keyboard: [
      { key: 'Type', description: 'Filters the options and opens the list.' },
      { key: 'ArrowDown / ArrowUp', description: 'Moves through the options.' },
      { key: 'Enter', description: 'Toggles the highlighted option.' },
      { key: 'Backspace', description: 'In an empty field, removes the last chip.' },
      { key: 'Escape', description: 'Closes the list.' },
    ],
    screenReader: ['Options carry `aria-checked`; each chip has a "Remove <label>" button.'],
  },
};

export default entry;
