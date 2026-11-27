import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'combobox-field',
    title: 'Combobox Field',
    description: 'A labelled, searchable single choice that looks like a Select. For lists longer than about ten options.',
    category: 'Form Controls',
    package: '@nexub/react',
    status: 'alpha',
    addedIn: '11.1.0',
    related: ['select', 'combobox', 'autocomplete', 'form-field'],
  },
  usage: {
    whenToUse: ['One choice from a long list: people, countries, companies, codes.', 'A list the server searches (`onSearch` with `loading`).'],
    whenNotToUse: ['Ten options or fewer: use Select.', 'Several choices: use MultiSelect.', 'Free text with suggestions: use Autocomplete.'],
  },
  props: [
    { name: 'label', type: 'ReactNode', required: true, description: 'The field label. `ComboboxPicker` is the same control without it (name it with `aria-label`).' },
    { name: 'options', type: 'ComboboxOption[]', required: true, description: '`{ value, label, description?, keywords?, disabled?, group? }`. `description` is a second line; `keywords` and `description` are searched too; `group` lists the option under a heading.' },
    { name: 'virtualizeAbove', type: 'number', default: '100', required: false, description: '12.1: with more options than this, only the rows in view render. Search (cmdk ranking), arrow keys, Home, End, Page Up/Down and screen readers (aria-setsize, aria-posinset) still cover the whole list.' },
    { name: 'value / defaultValue', type: 'string | null', description: 'The picked value, `null` for none.' },
    { name: 'onValueChange', type: '(value: string | null) => void', description: 'Called with the picked value, or `null` from the none option.' },
    { name: 'noneOption', type: 'string', description: 'A first option that clears the value, e.g. "No manager".' },
    { name: 'onSearch / loading', type: '(text: string) => void / boolean', description: 'Server search: the list is not filtered here while `onSearch` is set.' },
    { name: 'selectedOption', type: 'ComboboxOption', description: 'Labels the value when it is not in `options` (before an async search has run).' },
    { name: 'description / error', type: 'ReactNode', description: 'Help and the inline error under the field. `error` marks it invalid.' },
    { name: 'name', type: 'string', description: 'A hidden input posts the value with a plain form. Inside `Form`, also picks up the form error.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height of the field.' },
    { name: 'sheet', type: "boolean | 'auto'", default: "'auto'", description: 'The list as a bottom sheet below 768px.' },
  ],
  examples: [{ title: 'Default' }, { title: 'Groups and a none option' }, { title: 'Server search' }],
  a11y: {
    keyboard: [
      { key: 'Enter / Space / Arrow Down', description: 'Opens the list with focus in the search box.' },
      { key: 'Arrow Up / Arrow Down', description: 'Moves through the options.' },
      { key: 'Enter', description: 'Picks the highlighted option and closes.' },
      { key: 'Escape', description: 'Closes without changing the value.' },
    ],
    notes: ['The trigger is a `combobox` named by the label; the picked option is its text.', 'Description and error are linked with `aria-describedby`.'],
  },
};

export default entry;
