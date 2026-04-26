import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'accordion',
    title: 'Accordion',
    description: 'Vertically stacked list of collapsible sections.',
    category: 'Disclosure',
    package: '@nexub/react',
    status: 'stable',
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
      code: `<Accordion.Root type="single" collapsible defaultValue="item-1">
  <Accordion.Item value="item-1">
    <Accordion.Trigger>What is Nexub DS?</Accordion.Trigger>
    <Accordion.Content>
      Nexub DS is a design system providing accessible, themeable React components
      built on Radix UI primitives.
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
    <Accordion.Content>
      Yes. All components follow WAI-ARIA patterns and are keyboard-navigable
      out of the box.
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-3">
    <Accordion.Trigger>Can I customise the styles?</Accordion.Trigger>
    <Accordion.Content>
      Absolutely. Components expose design tokens via CSS custom properties,
      and every element accepts a className prop.
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>`,
    },
    {
      title: 'Multiple',
      code: `<Accordion.Root type="multiple" defaultValue={['item-1', 'item-2']}>
  <Accordion.Item value="item-1">
    <Accordion.Trigger>First section</Accordion.Trigger>
    <Accordion.Content>
      This section is open by default. Multiple items can be expanded
      simultaneously when type is set to "multiple".
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Trigger>Second section</Accordion.Trigger>
    <Accordion.Content>
      Also open by default. Click any trigger to collapse individual sections
      independently.
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-3">
    <Accordion.Trigger>Third section</Accordion.Trigger>
    <Accordion.Content>
      Closed by default. Expanding this does not close the others.
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>`,
    },
  ],
};

export default entry;
