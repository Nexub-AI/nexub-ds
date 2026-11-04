import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'accordion',
    title: 'Accordion',
    description: 'Vertically stacked list of collapsible sections.',
    category: 'Disclosure',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'Accordion.Root type', type: "'single' | 'multiple'", default: "'single'", required: false, description: 'Whether one or multiple items can be open at the same time.' },
    { name: 'Accordion.Root collapsible', type: 'boolean', default: 'false', required: false, description: 'When type is "single", allows the open item to be collapsed by clicking it again.' },
    { name: 'Accordion.Root defaultValue', type: 'string | string[]', required: false, description: 'The item(s) open by default (uncontrolled).' },
    { name: 'Accordion.Root value', type: 'string | string[]', required: false, description: 'Controlled open item(s).' },
    { name: 'Accordion.Root onValueChange', type: '(value: string | string[]) => void', required: false, description: 'Callback fired when the open state changes.' },
    { name: 'Accordion.Root disabled', type: 'boolean', default: 'false', required: false, description: 'Disables all items in the accordion.' },
    { name: 'Accordion.Item value', type: 'string', required: true, description: 'Unique identifier for the item.' },
    { name: 'Accordion.Item disabled', type: 'boolean', default: 'false', required: false, description: 'Disables this specific item.' },
    { name: 'Accordion.Trigger asChild', type: 'boolean', default: 'false', required: false, description: 'Merges props onto the immediate child element.' },
    { name: 'Accordion.Content forceMount', type: 'boolean', default: 'false', required: false, description: 'Keeps content in the DOM even when collapsed.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'Multiple',
    },
  ],
};

export default entry;
