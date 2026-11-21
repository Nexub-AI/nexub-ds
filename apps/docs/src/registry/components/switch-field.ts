import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'switch-field',
    title: 'Switch Field',
    description: 'A Switch with its label, description and error, the label clickable.',
    category: 'Form Controls',
    package: '@nexub/react',
    status: 'alpha',
    addedIn: '11.1.0',
    related: ['switch', 'checkbox-field', 'form-field'],
  },
  props: [
    { name: 'label', type: 'ReactNode', required: true, description: 'Names the switch; clicking it toggles.' },
    { name: 'description / error', type: 'ReactNode', description: 'Help under the label and the error under the row. `error` marks the switch invalid.' },
    { name: 'layout', type: "'end' | 'start'", default: "'end'", description: "`'end'`: label first, the switch at the row end (settings lists). `'start'`: the switch first, for tight rows." },
    { name: 'checked / onCheckedChange', type: 'boolean / (checked: boolean) => void', description: 'As Switch, with `size`, `loading`, `disabled` and `readOnly`.' },
  ],
  examples: [{ title: 'Settings row' }, { title: 'Compact, before the label' }],
  a11y: { notes: ['The label is a `<label for>` on the switch, so it names it and toggles it.', 'Description and error are linked with `aria-describedby`.'] },
};

export default entry;
