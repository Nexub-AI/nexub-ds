import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'collapsible',
    title: 'Collapsible',
    description: 'Toggle visibility of content with smooth animation.',
    category: 'Disclosure',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'Collapsible.Root open', type: 'boolean', required: false, description: 'Controlled open state.' },
    { name: 'Collapsible.Root defaultOpen', type: 'boolean', default: 'false', required: false, description: 'Whether the collapsible is open by default (uncontrolled).' },
    { name: 'Collapsible.Root onOpenChange', type: '(open: boolean) => void', required: false, description: 'Callback fired when the open state changes.' },
    { name: 'Collapsible.Root disabled', type: 'boolean', default: 'false', required: false, description: 'Prevents the user from toggling the collapsible.' },
    { name: 'Collapsible.Trigger asChild', type: 'boolean', default: 'false', required: false, description: 'Merges props onto the immediate child element (Radix Slot).' },
    { name: 'Collapsible.Content forceMount', type: 'boolean', default: 'false', required: false, description: 'Keeps the content mounted in the DOM even when closed.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'Controlled',
    },
  ],
};

export default entry;
