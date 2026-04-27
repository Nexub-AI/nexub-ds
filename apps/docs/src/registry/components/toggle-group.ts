import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'toggle-group',
    title: 'Toggle Group',
    description: 'Group of toggle buttons where one or many can be active.',
    category: 'Interactive',
    package: '@nexub/react',
    status: 'stable',
  },
  props: [
    { name: 'type', type: "'single' | 'multiple'", required: true, description: "Controls whether one or multiple items can be active at a time." },
    { name: 'value', type: 'string | string[]', required: false, description: 'The controlled active value(s).' },
    { name: 'variant', type: "'default' | 'outline'", required: false, description: 'Visual style applied to all toggle items in the group.' },
  ],
  examples: [
    {
      title: 'Single',
      code: `<ToggleGroup.Root type="single" defaultValue="left">
  <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
  <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
  <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
</ToggleGroup.Root>`,
    },
    {
      title: 'Multiple',
      code: `<ToggleGroup.Root type="multiple" defaultValue={["bold", "italic"]}>
  <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
  <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
  <ToggleGroup.Item value="underline">Underline</ToggleGroup.Item>
</ToggleGroup.Root>`,
    },
  ],
};

export default entry;
