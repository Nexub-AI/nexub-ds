import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'fieldset',
    title: 'Fieldset',
    description: 'Groups related fields under a legend; disabling it disables everything inside.',
    category: 'Form & Input',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '6.1.0',
    related: ['form', 'form-field'],
  },
  props: [
    { name: 'legend', type: 'ReactNode', required: true, description: 'The group’s name, read before each field inside it.' },
    { name: 'description', type: 'ReactNode', required: false, description: 'Hint under the legend, linked with `aria-describedby`.' },
    { name: 'disabled', type: 'boolean', required: false, description: 'Disables every control inside, natively.' },
  ],
  examples: [{ title: 'Grouped fields' }],
  a11y: { notes: ['Renders a native `<fieldset>` and `<legend>`; screen readers announce the legend on entering the group.'] },
};

export default entry;
