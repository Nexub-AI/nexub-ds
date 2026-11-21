import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'currency-select',
    title: 'Currency Select',
    description: 'A searchable ISO 4217 currency picker built from Intl: code, name and symbol. Also sits next to a MoneyInput.',
    category: 'Form Controls',
    package: '@nexub/react',
    status: 'alpha',
    addedIn: '11.2.0',
    related: ['combobox-field', 'money-input', 'amount'],
  },
  usage: {
    whenToUse: ['Picking the currency of a price, an invoice or an account.', 'Letting people change the currency next to an amount (`MoneyInput currencySlot`).'],
    whenNotToUse: ['Two or three fixed currencies: use SegmentedControl or Select.', 'Showing an amount: use Amount.'],
  },
  props: [
    { name: 'value / defaultValue', type: 'string | null', description: 'The ISO 4217 code, e.g. `"USD"`.' },
    { name: 'onValueChange', type: '(code: string | null) => void', description: 'Called with the picked code.' },
    { name: 'currencies', type: 'string[]', description: 'Only these codes, in this order. Default: every code the browser knows (`Intl.supportedValuesOf`).' },
    { name: 'priority / priorityLabel / restLabel', type: 'string[] / string / string', description: 'Codes listed first; with `priorityLabel`, under that heading and the rest under `restLabel`.' },
    { name: 'locale', type: 'string', description: 'BCP 47 locale for names and symbols. Defaults to the user\'s.' },
    { name: 'name', type: 'string', description: 'A hidden input posts the code with a plain form.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height of the field.' },
    { name: 'sheet', type: "boolean | 'auto'", default: "'auto'", description: 'The list as a bottom sheet below 768px.' },
  ],
  examples: [{ title: 'Default' }, { title: 'Labelled field', description: '`CurrencyField` adds `label`, `description` and `error`, as ComboboxField.' }, { title: 'Next to an amount', description: 'MoneyInput `currencySlot` puts the picker before the amount.' }],
  a11y: {
    keyboard: [
      { key: 'Enter / Space / Arrow Down', description: 'Opens the list with focus in the search box.' },
      { key: 'Type', description: 'Finds by code, name or symbol.' },
      { key: 'Enter', description: 'Picks the highlighted currency.' },
    ],
    notes: ['Built on ComboboxField: the trigger is a `combobox` named by the label.', '`currencyOptions(locale)` returns the same list for your own ComboboxField.'],
  },
};

export default entry;
